import { supabase } from "../config/supabase.js";
import { enqueueAudit } from "./auditQueue.js";

/**
 * Resolve an actor's display name from the users table.
 * The JWT only carries { id, role }, so we look up the name when needed.
 */
const resolveActor = async (actor = {}) => {
  if (actor.name) {
    return {
      id: actor.id || null,
      name: actor.name,
      role: actor.role || null,
    };
  }

  if (!actor.id) {
    return { id: null, name: "Unknown", role: actor.role || null };
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", actor.id)
    .maybeSingle();

  if (error || !data) {
    return { id: actor.id, name: "Unknown", role: actor.role || null };
  }

  return {
    id: data.id,
    name: data.name || "Unknown",
    role: data.role || actor.role || null,
  };
};

/* ============================================================
 * LEAN PAYLOAD BUILDERS
 * ------------------------------------------------------------
 * Keep metadata small and human-readable. Do NOT dump the
 * full record. Only include changed fields (with before/after
 * values) plus a short summary.
 * ============================================================ */

const TRACKED_FIELDS = [
  "status",
  "current_step",
  "currentStep",
  "partner_name",
  "partnerName",
  "country",
  "sector",
  "description",
  "funding_type",
  "fundingType",
  "duration",
  "expected_duration",
  "expectedDuration",
  "signing_date",
  "signingDate",
  "priority_level",
  "priorityLevel",
  "partnership_type",
  "partnershipType",
];

/**
 * Return a flat object containing only the tracked fields.
 */
const pickTracked = (row) => {
  if (!row || typeof row !== "object") return {};
  const out = {};
  for (const key of TRACKED_FIELDS) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      out[key] = row[key];
    }
  }
  return out;
};

/**
 * Compare two rows and return:
 *   { changed_fields: [...], before: {...}, after: {...} }
 * Only fields present in both and different from each other are kept.
 */
const buildChangeSet = (before, after) => {
  const b = pickTracked(before);
  const a = pickTracked(after);
  const beforeOut = {};
  const afterOut = {};
  const changed = [];

  const keys = new Set([...Object.keys(b), ...Object.keys(a)]);
  for (const key of keys) {
    const from = b[key];
    const to = a[key];
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changed.push(key);
      beforeOut[key] = from ?? null;
      afterOut[key] = to ?? null;
    }
  }

  return { changed_fields: changed, before: beforeOut, after: afterOut };
};

/* ===== Public builders for each action type ===== */

export const buildMouCreatedPayload = ({ mou, actor, context }) => ({
  action: "MOU_CREATED",
  actor,
  targetType: "mou",
  targetId: mou.id,
  message: `${actor.name || "A user"} created MoU with ${
    mou.partnerName || "(unnamed)"
  }`,
  context,
  metadata: {
    partnerName: mou.partnerName || null,
    country: mou.country || null,
    sector: mou.sector || null,
    status: mou.status || null,
  },
});

export const buildMouUpdatedPayload = ({ before, after, actor, context }) => {
  const { changed_fields, before: b, after: a } = buildChangeSet(before, after);
  return {
    action: "MOU_UPDATED",
    actor,
    targetType: "mou",
    targetId: after?.id || before?.id || null,
    message: `${actor.name || "An admin"} updated MoU with ${
      after?.partnerName || before?.partnerName || "(unnamed)"
    } (${changed_fields.length} field${
      changed_fields.length === 1 ? "" : "s"
    } changed)`,
    context,
    metadata: {
      changed_fields,
      before: b,
      after: a,
    },
  };
};

export const buildMouSignedPayload = ({ mou, actor, context }) => ({
  action: "MOU_SIGNED",
  actor,
  targetType: "mou",
  targetId: mou.id,
  message: `${actor.name || "An executive"} signed MoU with ${
    mou.partnerName || "(unnamed)"
  }`,
  context,
  metadata: {
    partnerName: mou.partnerName || null,
    status: "Active",
    current_step: 7,
    signing_date: mou.signing_date || new Date().toISOString(),
  },
});

export const buildMouDeletedPayload = ({ mouId, actor, context }) => ({
  action: "MOU_DELETED",
  actor,
  targetType: "mou",
  targetId: mouId,
  message: `${actor.name || "An admin"} deleted MoU ${mouId}`,
  context,
  metadata: null,
});

/* ============================================================
 * Main entry point: logAction
 * ============================================================ */

/**
 * Log an audit action. Returns the queued entry id immediately; the
 * actual write happens asynchronously through the queue with retry.
 */
export const logAction = async ({
  action,
  actor = {},
  targetType = null,
  targetId = null,
  metadata = null,
  message = null,
  context = null,
}) => {
  try {
    const resolved = await resolveActor(actor);

    const payload = {
      action,
      actor_id: resolved.id,
      actor_name: resolved.name,
      actor_role: resolved.role,
      target_type: targetType,
      target_id: targetId ? String(targetId) : null,
      metadata, // lean: { changed_fields, before, after } for updates
      message,
      request_id: context?.requestId || null,
      ip: context?.ip || null,
      user_agent: context?.userAgent || null,
    };

    const id = enqueueAudit(payload);
    return { queued: true, id };
  } catch (err) {
    console.error("💥 logAction crashed before queueing:", err);
    return { queued: false, error: err.message };
  }
};

/**
 * Convenience wrapper: build a request context from an Express req.
 */
export const contextFromReq = (req) => ({
  requestId: req.headers["x-request-id"] || null,
  ip:
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    null,
  userAgent: req.headers["user-agent"] || null,
});

/* Re-export payload builders under a single namespace for convenience */
export const PayloadBuilders = {
  mouCreated: buildMouCreatedPayload,
  mouUpdated: buildMouUpdatedPayload,
  mouSigned: buildMouSignedPayload,
  mouDeleted: buildMouDeletedPayload,
};

export default logAction;

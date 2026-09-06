import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";
import { getAuditQueueStats } from "../utils/auditQueue.js";

const router = express.Router();

/**
 * Convert "now-Xh" / ISO date strings to ISO 8601 timestamps.
 * Accepts:
 *   - "24h"  -> now - 24h
 *   - "7d"   -> now - 7d
 *   - "30d"  -> now - 30d
 *   - ISO date string
 *   - null/undefined -> null
 */
const parseDateParam = (raw) => {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const m = /^(\d+)([hd])$/i.exec(trimmed);
  if (m) {
    const n = parseInt(m[1], 10);
    const unit = m[2].toLowerCase();
    const ms = unit === "h" ? n * 60 * 60 * 1000 : n * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - ms).toISOString();
  }
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

// GET /api/audit/_stats — queue size (admin only)  MUST COME BEFORE /:id
router.get("/_stats", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: admin only" });
    }
    return res.json({ success: true, queue: getAuditQueueStats() });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
});

// GET /api/audit
// Query params:
//   limit   (default 50, max 500)
//   offset  (default 0)
//   action  (e.g. "MOU_CREATED")
//   actor   (user id or name)
//   target  (target id)
//   from    ("24h" | "7d" | "30d" | ISO date)
//   to      (ISO date)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: admin only" });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const action = req.query.action;
    const actor = req.query.actor;
    const target = req.query.target;
    const fromIso = parseDateParam(req.query.from);
    const toIso = parseDateParam(req.query.to);

    let query = supabase
      .from("audit_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (action && action !== "ALL") query = query.eq("action", action);
    if (actor) {
      query = query.or(
        `actor_id.eq.${actor},actor_name.ilike.%${actor}%`
      );
    }
    if (target) query = query.eq("target_id", String(target));
    if (fromIso) query = query.gte("created_at", fromIso);
    if (toIso) query = query.lte("created_at", toIso);

    const { data, error, count } = await query;

    if (error) {
      console.error("❌ Audit fetch error:", error);
      return res
        .status(500)
        .json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      entries: data || [],
      total: typeof count === "number" ? count : null,
      limit,
      offset,
      filters: { action, actor, target, from: fromIso, to: toIso },
    });
  } catch (err) {
    console.error("💥 Audit crash:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
});

// GET /api/audit/:id  — full entry including raw metadata
router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: admin only" });
    }

    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) {
      return res
        .status(500)
        .json({ success: false, message: error.message });
    }
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Audit entry not found" });
    }

    return res.json({ success: true, entry: data });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
});

export default router;

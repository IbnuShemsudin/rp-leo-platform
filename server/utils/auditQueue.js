import { supabase } from "../config/supabase.js";
import { randomUUID } from "node:crypto";

/**
 * In-memory audit queue with retry.
 *
 * Audit writes are best-effort and must NEVER block the main request flow.
 * Failed writes are queued and retried with exponential backoff. The queue
 * is per-process, so events written before a crash are lost; this is the
 * accepted trade-off for not coupling audit to the request lifecycle.
 *
 * Capacity: bounded. If the queue overflows the oldest pending entry is
 * dropped (and logged) so we don't leak memory.
 */

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500; // 0.5s, 1s, 2s, 4s, 8s
const MAX_QUEUE_SIZE = 1000;

const queue = new Map(); // id -> { payload, attempt, nextRunAt, lastError }

let started = false;
let draining = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Enqueue an audit payload for delivery.
 * @param {Object} payload
 * @returns {string} The id of the queued entry (also stored in DB row)
 */
export const enqueueAudit = (payload) => {
  const id = payload.id || randomUUID();
  const enriched = {
    ...payload,
    id,
    attempt: 1,
    nextRunAt: Date.now(),
    lastError: null,
  };

  if (queue.size >= MAX_QUEUE_SIZE) {
    const oldestKey = queue.keys().next().value;
    const dropped = queue.get(oldestKey);
    queue.delete(oldestKey);
    console.warn(
      `⚠️ Audit queue full. Dropped pending entry ${oldestKey} (action=${dropped?.action})`
    );
  }

  queue.set(id, enriched);

  // Kick the drainer
  setImmediate(() => drain());

  return id;
};

const computeBackoff = (attempt) => {
  const ms = BASE_DELAY_MS * Math.pow(2, Math.max(0, attempt - 1));
  // Add small jitter to spread retries from many entries
  return ms + Math.floor(Math.random() * 250);
};

const buildDbRow = (entry, status, lastError = null) => ({
  id: entry.id,
  action: entry.action,
  actor_id: entry.actor_id,
  actor_name: entry.actor_name,
  actor_role: entry.actor_role,
  target_type: entry.target_type,
  target_id: entry.target_id ? String(entry.target_id) : null,
  metadata: entry.metadata,
  message: entry.message,
  request_id: entry.request_id || null,
  ip: entry.ip || null,
  user_agent: entry.user_agent || null,
  status,
  attempt_count: entry.attempt,
  last_error: lastError,
});

const tryWrite = async (entry) => {
  const dbRow = buildDbRow(entry, "success", null);

  const { error } = await supabase
    .from("audit_log")
    .insert([dbRow])
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
};

const drain = async () => {
  if (draining) return;
  draining = true;

  try {
    while (queue.size > 0) {
      const now = Date.now();
      const ready = [];

      for (const [id, entry] of queue) {
        if (entry.nextRunAt <= now) {
          ready.push([id, entry]);
        }
      }

      if (ready.length === 0) {
        // Nothing ready yet, schedule another pass for the soonest entry
        const next = Math.min(
          ...Array.from(queue.values()).map((e) => e.nextRunAt)
        );
        const wait = Math.max(50, next - now);
        await sleep(wait);
        continue;
      }

      for (const [id, entry] of ready) {
        const result = await tryWrite(entry);

        if (result.ok) {
          queue.delete(id);
          continue;
        }

        entry.attempt += 1;
        entry.lastError = result.error;

        if (entry.attempt > MAX_ATTEMPTS) {
          console.error(
            `❌ Audit entry ${id} (action=${entry.action}) dropped after ${MAX_ATTEMPTS} attempts. Last error: ${entry.lastError}`
          );
          // Try to record a final "failed" status row so the operator knows
          try {
            await supabase
              .from("audit_log")
              .insert([buildDbRow(entry, "failed", entry.lastError)]);
          } catch (finalErr) {
            console.error(
              "💥 Could not record failed-audit row:",
              finalErr.message
            );
          }
          queue.delete(id);
          continue;
        }

        const delay = computeBackoff(entry.attempt);
        entry.nextRunAt = Date.now() + delay;
        console.warn(
          `⚠️ Audit ${id} attempt ${entry.attempt - 1} failed: ${
            entry.lastError
          }. Retrying in ${delay}ms`
        );
      }
    }
  } finally {
    draining = false;
  }
};

export const startAuditWorker = () => {
  if (started) return;
  started = true;
  console.log("🧾 Audit queue worker started");
  // Periodic tick in case the immediate trigger was missed
  setInterval(() => {
    if (queue.size > 0) drain();
  }, 5000).unref();
};

export const getAuditQueueStats = () => ({
  size: queue.size,
  max: MAX_QUEUE_SIZE,
  maxAttempts: MAX_ATTEMPTS,
});

export default { enqueueAudit, startAuditWorker, getAuditQueueStats };

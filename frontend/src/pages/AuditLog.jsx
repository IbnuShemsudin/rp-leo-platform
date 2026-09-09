import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import {
  Loader2,
  RefreshCw,
  ShieldCheck,
  Filter,
  Search,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Activity,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ACTION_OPTIONS = [
  "ALL",
  "MOU_CREATED",
  "MOU_UPDATED",
  "MOU_SIGNED",
  "MOU_DELETED",
];
/*VITE_API_URL=https://rp-leo-platform.onrender.com*/

const ACTION_COLORS = {
  MOU_CREATED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  MOU_UPDATED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  MOU_SIGNED: "text-[#DE984B] bg-[#DE984B]/10 border-[#DE984B]/20",
  MOU_DELETED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const DATE_PRESETS = [
  { id: "24h", label: "24h", ms: 24 * 60 * 60 * 1000 },
  { id: "7d", label: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
  { id: "30d", label: "30d", ms: 30 * 24 * 60 * 60 * 1000 },
  { id: "all", label: "All", ms: null },
];

const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const FieldRow = ({ label, value, mono }) => (
  <div className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-b-0">
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
      {label}
    </span>
    <span
      className={`text-xs text-slate-200 break-words ${
        mono ? "font-mono" : ""
      }`}
    >
      {value === null || value === undefined || value === ""
        ? "—"
        : String(value)}
    </span>
  </div>
);

const JsonView = ({ value, depth = 0 }) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-500 italic">null</span>;
  }
  if (typeof value === "string") {
    return <span className="text-emerald-300 break-words">"{value}"</span>;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return <span className="text-amber-300">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-500">[]</span>;
    return (
      <div className="border-l border-white/10 pl-3 ml-1">
        {value.map((v, i) => (
          <div key={i} className="py-0.5">
            <span className="text-gray-500 mr-1">{i}.</span>
            <JsonView value={v} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span className="text-gray-500">{"{}"}</span>;
    return (
      <div className="border-l border-white/10 pl-3 ml-1">
        {keys.map((k) => (
          <div key={k} className="py-0.5">
            <span className="text-cyan-300 mr-1">{k}:</span>
            <JsonView value={value[k]} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
};

const DetailsModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const metadata = entry.metadata || {};
  const hasBeforeAfter =
    metadata.before !== undefined || metadata.after !== undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/10 bg-[#0b0f15] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  ACTION_COLORS[entry.action] ||
                  "text-gray-400 bg-white/5 border-white/10"
                }`}
              >
                {entry.action}
              </span>
              {entry.status === "failed" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20 bg-rose-500/10 text-rose-400">
                  <AlertCircle size={10} /> Failed
                </span>
              )}
              {entry.status === "success" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={10} /> Success
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200">{entry.message || "—"}</p>
            <p className="text-[10px] font-mono text-gray-500">
              {formatDateTime(entry.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white shrink-0"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* CORE FIELDS */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-3">
              Event
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FieldRow label="Action" value={entry.action} />
              <FieldRow label="Status" value={entry.status} />
              <FieldRow label="Created" value={formatDateTime(entry.created_at)} />
              <FieldRow label="Attempts" value={entry.attempt_count} />
              <FieldRow label="Request ID" value={entry.request_id} mono />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-3">
              Actor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FieldRow label="ID" value={entry.actor_id} mono />
              <FieldRow label="Name" value={entry.actor_name} />
              <FieldRow label="Role" value={entry.actor_role} />
              <FieldRow label="IP" value={entry.ip} mono />
              <FieldRow label="User Agent" value={entry.user_agent} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-3">
              Target
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FieldRow label="Type" value={entry.target_type} />
              <FieldRow label="ID" value={entry.target_id} mono />
            </div>
          </section>

          {/* CHANGED FIELDS (MoU updates) */}
          {metadata.changed_fields && metadata.changed_fields.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-3">
                Changed Fields
              </h3>
              <div className="flex flex-wrap gap-2">
                {metadata.changed_fields.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border border-blue-500/20 bg-blue-500/10 text-blue-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* BEFORE / AFTER */}
          {hasBeforeAfter && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {metadata.before && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300 mb-3">
                    Before
                  </h3>
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 max-h-72 overflow-y-auto custom-scrollbar">
                    <JsonView value={metadata.before} />
                  </div>
                </div>
              )}
              {metadata.after && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-3">
                    After
                  </h3>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 max-h-72 overflow-y-auto custom-scrollbar">
                    <JsonView value={metadata.after} />
                  </div>
                </div>
              )}
            </section>
          )}

          {entry.last_error && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">
                Last Error
              </h3>
              <pre className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 text-xs text-rose-200 whitespace-pre-wrap break-words">
                {entry.last_error}
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AuditLog() {
  const { token, user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePreset, setActivePreset] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 50;

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    params.set("limit", String(pageSize));
    params.set("offset", String(page * pageSize));
    if (filter && filter !== "ALL") params.set("action", filter);
    if (searchTerm.trim()) params.set("actor", searchTerm.trim());
    if (activePreset !== "all" && !fromDate && !toDate) {
      params.set("from", activePreset);
    } else {
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", `${toDate}T23:59:59`);
    }
    return params.toString();
  }, [filter, searchTerm, activePreset, fromDate, toDate, page]);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/audit?${buildQuery()}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to load audit log");
      }
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(typeof data.total === "number" ? data.total : null);
    } catch (err) {
      console.error("AuditLog fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, buildQuery]);

  const openDetails = async (id) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API}/api/audit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to load entry");
      }
      const data = await res.json();
      setSelected(data.entry);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchLog();
  }, [fetchLog, user]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [filter, searchTerm, activePreset, fromDate, toDate]);

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070a] text-slate-300">
        <div className="text-center space-y-3">
          <ShieldCheck className="mx-auto text-rose-400" size={42} />
          <p className="text-sm uppercase tracking-widest font-bold">
            Access Denied — Admins Only
          </p>
        </div>
      </div>
    );
  }

  const totalPages =
    total !== null ? Math.max(1, Math.ceil(total / pageSize)) : null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-20 lg:pt-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse shadow-lg shadow-[#F59E0B]/50" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#F59E0B]/30 animate-ping" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F59E0B]">
              Admin Audit Trail
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">
            System <span className="text-[#00A8B5]">Activity</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-lg mb-8">
            Immutable record of administrative actions across the Regional
            Partnership platform. Click any row for full before/after details.
          </p>

          {/* TOOLBAR */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-slate-200"
              >
                {ACTION_OPTIONS.map((a) => (
                  <option key={a} value={a} className="bg-[#0a0c10]">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-md">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search actor, action, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-xs text-white placeholder:text-gray-500 w-full"
              />
            </div>

            <NotificationBell />

            <button
              onClick={fetchLog}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin text-[#00A8B5]" : "text-gray-400"}
              />
            </button>

            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              {entries.length}
              {total !== null ? ` of ${total}` : ""}
            </span>
          </div>

          {/* DATE FILTERS */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p.id);
                    setFromDate("");
                    setToDate("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${
                    activePreset === p.id
                      ? "bg-[#00A8B5] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Calendar size={14} className="text-gray-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setActivePreset("custom");
                }}
                className="bg-transparent outline-none text-xs text-slate-200 [color-scheme:dark]"
                title="From date"
              />
              <span className="text-gray-600 text-xs">→</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setActivePreset("custom");
                }}
                className="bg-transparent outline-none text-xs text-slate-200 [color-scheme:dark]"
                title="To date"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setActivePreset("all");
                }}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
              <p className="text-xs text-rose-400 font-bold">{error}</p>
            </div>
          )}

          {/* TABLE */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent backdrop-blur-xl">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[900px] text-xs">
                <thead className="bg-white/[0.03] text-gray-400 uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-4 py-4 text-left font-black">Time</th>
                    <th className="px-4 py-4 text-left font-black">Action</th>
                    <th className="px-4 py-4 text-left font-black">Actor</th>
                    <th className="px-4 py-4 text-left font-black">Target</th>
                    <th className="px-4 py-4 text-left font-black">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 text-[#00A8B5] animate-spin" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Loading audit trail...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : entries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <Activity size={28} />
                          <p className="text-xs font-bold uppercase tracking-widest">
                            No audit entries match
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    entries.map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => openDetails(e.id)}
                        className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400 font-mono text-[10px]">
                          {formatDateTime(e.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                ACTION_COLORS[e.action] ||
                                "text-gray-400 bg-white/5 border-white/10"
                              }`}
                            >
                              {e.action}
                            </span>
                            {e.status === "failed" && (
                              <span className="inline-flex items-center gap-1 w-fit text-[9px] text-rose-400">
                                <AlertCircle size={10} /> failed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-200">
                            {e.actor_name || "—"}
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                            {e.actor_role || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">
                          {e.target_type ? (
                            <span>
                              {e.target_type}:{" "}
                              <span className="text-slate-300">
                                {e.target_id?.slice(0, 8) || "—"}
                              </span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300 max-w-md">
                          <div className="truncate" title={e.message || ""}>
                            {e.message || "—"}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages !== null && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {detailLoading && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60">
          <Loader2 className="w-8 h-8 text-[#00A8B5] animate-spin" />
        </div>
      )}

      {selected && <DetailsModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import NewMoUModal from '../components/NewMoUModal';
import NotificationBell from '../components/NotificationBell';
import SigningManager from '../components/SigningManager';
import { getAllMous, getMouStats, updateMoU } from '../services/mouService';

import {
  Search,
  RefreshCw,
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Loader2,
  CheckCircle,
  Eye,
  Globe,
  Database,
  Menu,
  X,
  MessageSquare,
  Send,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Landmark,
  Zap,
  FileCheck,
  FileClock,
  Archive,
  Users,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   STATUS FILTER PILLS
========================================================= */
const STATUS_OPTIONS = [
  { label: 'All', value: 'all', color: 'bg-white/10 text-white border-white/20' },
  { label: 'Active', value: 'Active', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'Pending', value: 'Pending Validation', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Draft', value: 'Draft', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { label: 'Expired', value: 'Expired', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
];

/* =========================================================
   RELATIVE TIME
========================================================= */
const relativeTime = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

/* =========================================================
   MAIN DASHBOARD COMPONENT
========================================================= */
export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'executive';

  const [mous, setMous] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('updated_at');
  const [sortAsc, setSortAsc] = useState(false);

  // Message modal states
  const [messageModal, setMessageModal] = useState(false);
  const [selectedMou, setSelectedMou] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ---------- DATA FETCHING ---------- */
  const fetchMous = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllMous(token);
      setMous(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      setError('Failed to load dashboard data. Please try again.');
      setMous([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getMouStats(token);
      setStats(data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchMous();
    fetchStats();
  }, [fetchMous, fetchStats]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const id = setInterval(() => {
      fetchMous();
      fetchStats();
    }, 30000);
    return () => clearInterval(id);
  }, [fetchMous, fetchStats]);

  /* ---------- HELPERS ---------- */
  const isRemoteUrl = (v) => typeof v === 'string' && /^https?:\/\//i.test(v);

  const normalizeUploadPath = (path) => {
    if (!path) return '';
    if (isRemoteUrl(path)) return path;
    const trimmed = path.toString().trim();
    if (trimmed.startsWith('/uploads/')) return `${API}${trimmed}`;
    if (trimmed.startsWith('uploads/')) return `${API}/${trimmed}`;
    return `${API}/uploads/${trimmed.replace(/^\/+/, '')}`;
  };

  const getMouField = (mou, ...keys) => {
    for (const key of keys) {
      if (mou[key] != null && mou[key] !== '') return mou[key];
    }
    return null;
  };

  const handleViewFile = (mou) => {
    const fileName = getMouField(mou, 'fileUrl', 'file_url', 'initialDocumentUrl', 'initial_document_url', 'signedDocumentUrl', 'signed_document_url', 'uploadedFile', 'file', 'filePath', 'file_path');
    if (!fileName) { alert("No document found"); return; }
    const actualFileName = typeof fileName === 'object' ? fileName.url || fileName.path : fileName;
    window.open(normalizeUploadPath(actualFileName), "_blank");
  };

  const getMoUId = (mou) => mou.id || mou._id || mou.uuid;

  /* ---------- SORTING ---------- */
  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const sortIcon = (field) => sortField === field
    ? <ArrowUpDown size={10} className={sortAsc ? 'rotate-180' : ''} />
    : <ArrowUpDown size={10} className="opacity-30" />;

  /* ---------- FILTERING ---------- */
  const filteredMous = useMemo(() => {
    let list = mous;
    if (statusFilter !== 'all') {
      list = list.filter((m) => m.status === statusFilter);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((m) =>
        m.partnerName?.toLowerCase().includes(q) ||
        m.country?.toLowerCase().includes(q) ||
        m.sector?.toLowerCase().includes(q) ||
        m.contact_person?.toLowerCase().includes(q)
      );
    }
    // Sort
    list = [...list].sort((a, b) => {
      let va = a[sortField] ?? '';
      let vb = b[sortField] ?? '';
      if (sortField === 'current_step') { va = Number(va) || 0; vb = Number(vb) || 0; }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [mous, searchTerm, statusFilter, sortField, sortAsc]);

  /* ---------- KPI DATA ---------- */
  const kpis = useMemo(() => {
    if (!stats) return [];
    const total = stats.total || 0;
    const active = stats.byStatus?.Active || 0;
    const pending = stats.byStatus?.['Pending Validation'] || 0;
    const draft = stats.byStatus?.Draft || 0;
    const expired = stats.byStatus?.Expired || 0;
    return [
      { label: 'Total MoUs', value: total, icon: Database, color: 'text-white', accent: '#F59E0B' },
      { label: 'Partner Users', value: stats.partnerCount || 0, icon: Users, color: 'text-cyan-400', accent: '#00A8B5' },
      { label: 'Active', value: active, icon: Zap, color: 'text-emerald-400', accent: '#10b981' },
      { label: 'Pending Review', value: pending, icon: FileClock, color: 'text-blue-400', accent: '#3b82f6' },
      { label: 'Drafts', value: draft, icon: FileText, color: 'text-yellow-400', accent: '#F59E0B' },
      { label: 'Expired', value: expired, icon: Archive, color: 'text-rose-400', accent: '#f43f5e' },
    ];
  }, [stats]);

  /* ---------- MESSAGE MODAL ---------- */
  const openMessageModal = (mou) => { setSelectedMou(mou); setMessageModal(true); };

  const sendAdminMessage = async () => {
    if (!messageText.trim()) { alert("Please type a message"); return; }
    try {
      setSendingMessage(true);
      const mouId = getMoUId(selectedMou);
      await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ mouId, senderRole: user?.role, senderName: user?.name, message: messageText }),
      });
      await updateMoU(mouId, { status: "Active", currentStep: 2 }, token);
      setMessageText('');
      setMessageModal(false);
      fetchMous();
      fetchStats();
      navigate(`/messages/${mouId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100 overflow-hidden relative">

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#05070a] border-r border-white/5 transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-12 min-w-0 overflow-y-auto relative custom-scrollbar h-screen">

        {/* MOBILE HEADER */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#05070a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-30">
          <h2 className="text-[#F59E0B] font-black uppercase tracking-tighter text-sm">Command Center</h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* BACKGROUND GLOWS */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#00A8B5]/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#F59E0B]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* =================== HEADER =================== */}
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse shadow-lg shadow-[#F59E0B]/50" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#F59E0B]/30 animate-ping" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F59E0B]">
                  Executive Command Center
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Executive{" "}
                <span className="text-[#00A8B5] bg-gradient-to-r from-[#00A8B5] to-cyan-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-xs md:text-sm font-medium text-gray-400 max-w-lg">
                Regional Partnership Monitoring and Management System
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              {/* SEARCH */}
              <div className="relative flex-1 sm:w-64 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search partnerships..."
                  className="pl-12 pr-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl text-sm font-medium focus:ring-2 focus:ring-[#00A8B5]/50 outline-none transition-all w-full hover:border-white/20 focus:border-[#00A8B5]"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                {isAdmin && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00A8B5] to-cyan-600 text-white text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Plus size={16} /> New
                  </button>
                )}
                <button
                  onClick={() => { fetchMous(); fetchStats(); }}
                  disabled={loading}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </header>

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-400" />
                <p className="text-sm text-rose-400 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* =================== KPI CARDS =================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${kpi.accent}15` }}>
                      <Icon size={18} style={{ color: kpi.accent }} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white leading-none">{kpi.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          {/* =================== CHARTS ROW =================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* STATUS BREAKDOWN */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 size={16} className="text-[#00A8B5]" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Status Breakdown</h3>
              </div>
              {stats ? (
                <div className="space-y-3">
                  {Object.entries(stats.byStatus || {}).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                    const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                    const colorMap = {
                      Active: 'from-emerald-500 to-emerald-400',
                      'Pending Validation': 'from-blue-500 to-blue-400',
                      Draft: 'from-yellow-500 to-yellow-400',
                      Expired: 'from-rose-500 to-rose-400',
                    };
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-gray-300">{status}</span>
                          <span className="text-[10px] font-black text-gray-400">{count} <span className="text-gray-600">({pct}%)</span></span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${colorMap[status] || 'from-gray-500 to-gray-400'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-[#00A8B5] animate-spin" /></div>
              )}
            </div>
          </div>

          {/* =================== MONTHLY TREND =================== */}
          {stats && stats.monthlyTrend?.length > 0 && (
            <div className="glass-panel rounded-2xl border border-white/10 p-6 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp size={16} className="text-[#00A8B5]" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">MoU Creation Trend</h3>
                <span className="text-[9px] font-bold text-gray-500 ml-auto">Last 6 months</span>
              </div>
              <div className="flex items-end gap-3 h-32">
                {stats.monthlyTrend.map((m) => {
                  const maxCount = Math.max(...stats.monthlyTrend.map((x) => x.count), 1);
                  const h = Math.max((m.count / maxCount) * 100, 4);
                  return (
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400">{m.count}</span>
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00A8B5] to-cyan-400 transition-all duration-500" style={{ height: `${h}%`, minHeight: m.count > 0 ? '8px' : '2px' }} />
                      <span className="text-[9px] font-bold text-gray-500 uppercase">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================== COUNTRY + SECTOR ROW =================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* COUNTRY DISTRIBUTION */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Globe size={16} className="text-[#F59E0B]" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">By Country</h3>
              </div>
              {stats && stats.byCountry?.length > 0 ? (
                <div className="space-y-3">
                  {stats.byCountry.map((c) => {
                    const pct = stats.total ? Math.round((c.count / stats.total) * 100) : 0;
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-gray-300 truncate max-w-[120px]">{c.name}</span>
                          <span className="text-[10px] font-black text-gray-400">{c.count}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#00A8B5] to-cyan-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-500 text-xs">No country data</div>
              )}
            </div>

            {/* SECTOR DISTRIBUTION (SECOND COPY — MOVED HERE FROM CHARTS ROW) */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Landmark size={16} className="text-[#F59E0B]" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">By Sector</h3>
              </div>
              {stats && stats.bySector?.length > 0 ? (
                <div className="space-y-3">
                  {stats.bySector.map((s) => {
                    const pct = stats.total ? Math.round((s.count / stats.total) * 100) : 0;
                    return (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-gray-300 truncate max-w-[180px]">{s.name}</span>
                          <span className="text-[10px] font-black text-gray-400">{s.count}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#F59E0B] to-yellow-300 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-500 text-xs">No sector data</div>
              )}
            </div>
          </div>

          {/* =================== MoU TABLE =================== */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-8">

            {/* TABLE HEADER */}
            <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileCheck size={16} className="text-[#00A8B5]" />
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">Partnership Registry</h3>
                <span className="text-[10px] font-black text-gray-500 uppercase">{filteredMous.length} records</span>
              </div>
              {/* STATUS FILTER PILLS */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${statusFilter === opt.value ? opt.color : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto custom-scrollbar [scrolling-touch:auto]">
              <table className="w-full min-w-[900px] table-auto">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <Th label="Institution" field="partnerName" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} />
                    <Th label="Country" field="country" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} />
                    <Th label="Sector" field="sector" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} />
                    <Th label="Status" field="status" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} center />
                    <Th label="Phase" field="current_step" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} center />
                    <Th label="Updated" field="updated_at" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} sortIcon={sortIcon} />
                    <th className="px-4 sm:px-5 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 text-[#00A8B5] animate-spin" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Syncing...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMous.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <Database size={28} />
                          <p className="text-xs font-bold uppercase tracking-widest">No Records Found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMous.map((mou, index) => (
                      <tr key={getMoUId(mou) || index} className="hover:bg-white/[0.01] transition-colors group">
                        {/* INSTITUTION */}
                        <td className="px-4 sm:px-5 py-4">
                          <div className="flex items-center gap-3 max-w-[200px]">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#00A8B5] transition-colors shrink-0">
                              <Globe size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-black text-xs sm:text-sm truncate leading-tight">{mou.partnerName}</p>
                              <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest truncate">{mou.created_by_name || '—'}</p>
                            </div>
                          </div>
                        </td>
                        {/* COUNTRY */}
                        <td className="px-4 sm:px-5 py-4">
                          <span className="text-xs text-gray-300 font-medium">{mou.country || '—'}</span>
                        </td>
                        {/* SECTOR */}
                        <td className="px-4 sm:px-5 py-4">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{mou.sector || '—'}</span>
                        </td>
                        {/* STATUS */}
                        <td className="px-4 sm:px-5 py-4 text-center whitespace-nowrap">
                          <StatusBadge status={mou.status || "Draft"} />
                        </td>
                        {/* PHASE */}
                        <td className="px-4 sm:px-5 py-4 text-center">
                          <div className="flex flex-col items-center space-y-1 min-w-[70px]">
                            <div className="w-14 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#F59E0B] to-yellow-300" style={{ width: `${((mou.current_step || 1) / 10) * 100}%` }} />
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Ph {mou.current_step || 1}/10</span>
                          </div>
                        </td>
                        {/* UPDATED */}
                        <td className="px-4 sm:px-5 py-4">
                          <span className="text-[10px] text-gray-500 font-mono">{relativeTime(mou.updated_at || mou.updatedAt || mou.created_at)}</span>
                        </td>
                        {/* ACTIONS */}
                        <td className="px-4 sm:px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => handleViewFile(mou)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95" title="View Document">
                              <Eye size={13} />
                            </button>
                            <button onClick={() => navigate(`/messages/${getMoUId(mou)}`)} className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95" title="Messages">
                              <MessageSquare size={13} />
                            </button>
                            {mou.current_step === 6 && user?.role === 'executive' ? (
                              <SigningManager mouId={getMoUId(mou)} partnerName={mou.partnerName} onComplete={() => { fetchMous(); fetchStats(); }} />
                            ) : (
                              ['admin', 'executive'].includes(user?.role) &&
                              ['Draft', 'Pending Validation'].includes(mou.status) && (
                                <button
                                  onClick={() => openMessageModal(mou)}
                                  className="px-3 py-2 bg-[#00A8B5] text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                  <CheckCircle size={11} /> Approve
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* AUTO-REFRESH INDICATOR */}
          <div className="text-center pb-8">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
              Auto-refreshes every 30 seconds • Last updated {relativeTime(new Date().toISOString())}
            </p>
          </div>
        </div>
      </main>

      {/* =================== MESSAGE MODAL =================== */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0b0f15] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Approve Partnership</h2>
                <p className="text-sm text-gray-400 mt-2">Send response message to partner institution</p>
              </div>
              <button onClick={() => setMessageModal(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-black mb-2">Partner Institution</p>
                <h3 className="text-xl font-black text-white">{selectedMou?.partnerName}</h3>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-black block mb-4">Admin Response Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={7}
                  placeholder="Your partnership request has been reviewed and approved..."
                  className="w-full rounded-3xl bg-white/5 border border-white/10 text-white p-6 outline-none focus:border-[#00A8B5] resize-none"
                />
              </div>
              <button
                onClick={sendAdminMessage}
                disabled={sendingMessage}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#00A8B5] to-cyan-600 text-white font-black uppercase tracking-[0.3em] hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
              >
                {sendingMessage ? (<><Loader2 size={18} className="animate-spin" /> Sending...</>) : (<><Send size={18} /> Approve & Send Message</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      <NewMoUModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={() => { fetchMous(); fetchStats(); }} />
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

// TABLE HEADER
const Th = ({ label, field, onSort, sortIcon, center }) => (
  <th
    className={`px-4 sm:px-5 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest ${center ? 'text-center' : 'text-left'} cursor-pointer hover:text-white transition-colors select-none`}
    onClick={() => onSort(field)}
  >
    <span className="inline-flex items-center gap-1.5">
      {label}
      {sortIcon(field)}
    </span>
  </th>
);

// STATUS BADGE
const StatusBadge = ({ status }) => {
  const styles = {
    Active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '●' },
    Draft: { bg: 'bg-yellow-500/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', icon: '●' },
    'Pending Validation': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: '●' },
    Expired: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '●' },
    default: { bg: 'bg-white/5', text: 'text-gray-400', border: 'border-white/10', icon: '○' },
  };
  const style = styles[status] || styles.default;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${style.bg} ${style.text} ${style.border}`}>
      <span className="text-[8px]">{style.icon}</span>
      {status}
    </span>
  );
};

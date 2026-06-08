import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import METracker from '../components/METracker';
import NewMoUModal from '../components/NewMoUModal';
import SigningManager from '../components/SigningManager';
import { getAllMous, updateMoU } from '../services/mouService';

import {
  Search,
  RefreshCw,
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Globe,
  Database,
  Menu,
  X,
  MessageSquare,
  Send
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URLL";

export default function Dashboard() {
  const navigate = useNavigate();

  const { token, isExecutive, user } = useAuth();

  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // MESSAGE STATES
  const [messageModal, setMessageModal] = useState(false);
  const [selectedMou, setSelectedMou] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Added state for mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    fetchMous();
  }, [fetchMous]);

  const isRemoteUrl = (value) =>
    typeof value === 'string' && /^https?:\/\//i.test(value);

  const normalizeUploadPath = (path) => {
    if (!path) return '';

    if (isRemoteUrl(path)) return path;

    const trimmed = path.toString().trim();

    if (trimmed.startsWith('/uploads/')) {
      return `${API}${trimmed}`;
    }

    if (trimmed.startsWith('uploads/')) {
      return `${API}/${trimmed}`;
    }

    return `${API}/uploads/${trimmed.replace(/^\/+/, '')}`;
  };

  const getMouField = (mou, ...keys) => {
    for (const key of keys) {
      if (mou[key] != null && mou[key] !== '') {
        return mou[key];
      }
    }

    return null;
  };

  const handleViewFile = (mou) => {
    const fileName = getMouField(
      mou,
      'fileUrl',
      'file_url',
      'initialDocumentUrl',
      'initial_document_url',
      'signedDocumentUrl',
      'signed_document_url',
      'uploadedFile',
      'file',
      'filePath',
      'file_path'
    );

    if (!fileName) {
      alert("No document found");
      return;
    }

    const actualFileName =
      typeof fileName === 'object'
        ? fileName.url || fileName.path
        : fileName;

    const fileUrl = normalizeUploadPath(actualFileName);

    window.open(fileUrl, "_blank");
  };

  const getMoUId = (mou) => mou.id || mou._id || mou.uuid;

  // OPEN MESSAGE MODAL
  const openMessageModal = (mou) => {
    setSelectedMou(mou);
    setMessageModal(true);
  };

  // SEND MESSAGE TO PARTNER
  const sendAdminMessage = async () => {
    if (!messageText.trim()) {
      alert("Please type a message");
      return;
    }

    try {
      setSendingMessage(true);

      const mouId = getMoUId(selectedMou);

      // SAVE MESSAGE
      await fetch(`${API}/api/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },

        body: JSON.stringify({
          mouId,
          senderRole: user?.role,
          senderName: user?.name,
          message: messageText
        })
      });

      // UPDATE MOU STATUS
      await updateMoU(
        mouId,
        {
          status: "Active",
          currentStep: 2
        },
        token
      );

      setMessageText('');
      setMessageModal(false);

      fetchMous();

      // REDIRECT TO MESSAGE PAGE
      navigate(`/messages/${mouId}`);

    } catch (err) {
      console.error(err);

      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredMous = useMemo(() => {
    return mous.filter(
      (mou) =>
        mou.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mou.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mou.sector?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mous, searchTerm]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100 overflow-hidden relative">

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-12 overflow-y-auto relative custom-scrollbar h-screen">

        {/* MOBILE HEADER */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#05070a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-30">
          <h2 className="text-rp-gold font-black uppercase tracking-tighter text-sm">
            Command Center
          </h2>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-white"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* BACKGROUND */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-rp-blue/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10 animate-pulse" />

        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-rp-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* HEADER */}
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 md:mb-16 gap-8">

            <div className="space-y-3">

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-rp-gold animate-pulse shadow-lg shadow-rp-gold/50" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-rp-gold/30 animate-ping" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rp-gold">
                  Executive Command Center
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Executive{" "}
                <span className="text-rp-blue bg-gradient-to-r from-rp-blue to-blue-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>

              <p className="text-xs md:text-sm font-medium text-gray-400 max-w-lg">
                Regional Partnership Monitoring and Management System
              </p>

            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">

              {/* SEARCH */}
              <div className="relative flex-1 sm:w-64 md:w-80">

                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search partnerships..."
                  className="pl-12 pr-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl text-sm font-medium focus:ring-2 focus:ring-rp-blue/50 outline-none transition-all w-full hover:border-white/20 focus:border-rp-blue"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* TOTAL */}
              <div className="flex items-center gap-4">

                <div
                  onClick={fetchMous}
                  className="flex-1 sm:flex-none glass-panel px-6 py-3 rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 border border-white/10 flex items-center gap-3"
                >
                  <Database size={20} className="text-rp-gold" />

                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">
                      Total
                    </p>

                    <p className="text-xl text-rp-gold font-black leading-none mt-1">
                      {mous.length}
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchMous}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? 'animate-spin' : ''}
                  />
                </button>

              </div>
            </div>
          </header>

          {/* ERROR */}
          {error && (
            <div className="mb-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-400" />

                <p className="text-sm text-rose-400 font-bold">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">

              <div className="w-full">
                <METracker progress={78} />
              </div>

              {/* REGISTRY */}
              <div className="glass-panel rounded-[32px] md:rounded-[48px] border border-white/10 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent overflow-hidden shadow-2xl backdrop-blur-xl">

                <div className="p-6 md:p-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-rp-blue" />

                    <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight">
                      Partnership Registry
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">

                  <table className="w-full min-w-[700px]">

                    <thead>
                      <tr className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border-b border-white/5">

                        <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-left">
                          Institution
                        </th>

                        <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                          Status
                        </th>

                        <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                          Lifecycle
                        </th>

                        <th className="px-6 md:px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {loading ? (
                        <tr>
                          <td colSpan="4" className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-10 h-10 text-rp-blue animate-spin" />

                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Syncing...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredMous.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-50">
                              <Database size={32} />

                              <p className="text-sm font-bold uppercase tracking-widest">
                                No Records Found
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredMous.map((mou, index) => (

                          <tr
                            key={getMoUId(mou) || index}
                            className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group"
                          >

                            <td className="px-6 md:px-8 py-6">
                              <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-rp-blue transition-colors">
                                  <Globe size={18} />
                                </div>

                                <div>
                                  <p className="text-white font-black text-sm md:text-base leading-tight">
                                    {mou.partnerName}
                                  </p>

                                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                    {mou.country}
                                  </p>
                                </div>

                              </div>
                            </td>

                            <td className="px-6 md:px-8 py-6 text-center">
                              <StatusBadge status={mou.status || "Draft"} />
                            </td>

                            <td className="px-6 md:px-8 py-6">

                              <div className="flex flex-col items-center space-y-2">

                                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">

                                  <div
                                    className="h-full bg-gradient-to-r from-rp-gold to-yellow-400"
                                    style={{
                                      width: `${((mou.currentStep || 1) / 10) * 100}%`
                                    }}
                                  />

                                </div>

                                <span className="text-[10px] text-gray-400 font-bold uppercase">
                                  Ph {mou.currentStep || 1}/10
                                </span>

                              </div>
                            </td>

                            <td className="px-6 md:px-8 py-6 text-right">

                              <div className="flex items-center justify-end gap-3">

                                {/* VIEW FILE */}
                                <button
                                  onClick={() => handleViewFile(mou)}
                                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                >
                                  <Eye size={16} />
                                </button>

                                {/* MESSAGE BUTTON */}
                                <button
                                  onClick={() => navigate(`/messages/${getMoUId(mou)}`)}
                                  className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all"
                                >
                                  <MessageSquare size={16} />
                                </button>

                                {/* APPROVE */}
                                {mou.currentStep === 6 && isExecutive ? (
                                  <SigningManager
                                    mouId={getMoUId(mou)}
                                    partnerName={mou.partnerName}
                                    onComplete={fetchMous}
                                  />
                                ) : (
                                  ['admin', 'executive'].includes(user?.role) &&
                                  ['Draft', 'Pending Validation'].includes(mou.status) && (
                                    <button
                                      onClick={() => openMessageModal(mou)}
                                      disabled={approvingId === getMoUId(mou)}
                                      className="whitespace-nowrap px-4 py-3 bg-rp-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                      <CheckCircle size={14} />

                                      Approve
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
            </div>

            {/* RIGHT PANELS */}
            <div className="space-y-8">

              <div className="glass-panel p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-white/10 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent shadow-2xl">

                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp size={16} className="text-rp-gold" />

                  <h3 className="text-base font-black text-rp-gold uppercase tracking-tight">
                    Staff Command
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

                  <QuickButton
                    label="New Initiation"
                    icon={<Plus size={16} className="text-rp-blue" />}
                    onClick={() => setIsModalOpen(true)}
                  />

                  <QuickButton
                    label="Export Registry"
                    icon={<FileText size={16} className="text-emerald-400" />}
                  />

                  <QuickButton
                    label="Resource Log"
                    icon={<BarChart3 size={16} className="text-purple-400" />}
                  />

                </div>
              </div>

              <div className="glass-panel p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-white/10 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent shadow-2xl">

                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle size={16} className="text-rp-blue" />

                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    System Alerts
                  </h3>
                </div>

                <div className="space-y-4">

                  <StatusRow
                    label="Active"
                    value={mous.filter(m => m.status === "Active").length}
                    color="text-emerald-400"
                  />

                  <StatusRow
                    label="Pending"
                    value={mous.filter(m => m.status === "Pending Validation").length}
                    color="text-yellow-400"
                  />

                  <StatusRow
                    label="Drafts"
                    value={mous.filter(m => m.status === "Draft").length}
                    color="text-gray-400"
                  />

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* MESSAGE MODAL */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0b0f15] shadow-2xl overflow-hidden">

            <div className="p-8 border-b border-white/10 flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Approve Partnership
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Send response message to partner institution
                </p>
              </div>

              <button
                onClick={() => setMessageModal(false)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-8 space-y-6">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <p className="text-xs uppercase tracking-widest text-gray-500 font-black mb-2">
                  Partner Institution
                </p>

                <h3 className="text-xl font-black text-white">
                  {selectedMou?.partnerName}
                </h3>

              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-black block mb-4">
                  Admin Response Message
                </label>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={7}
                  placeholder="Your partnership request has been reviewed and approved..."
                  className="w-full rounded-3xl bg-white/5 border border-white/10 text-white p-6 outline-none focus:border-rp-blue resize-none"
                />
              </div>

              <button
                onClick={sendAdminMessage}
                disabled={sendingMessage}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-rp-blue to-blue-600 text-white font-black uppercase tracking-[0.3em] hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
              >
                {sendingMessage ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Approve & Send Message
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}

      <NewMoUModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchMous}
      />
    </div>
  );
}

// QUICK BUTTON
const QuickButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
  >
    <span className="text-xs text-white font-bold uppercase tracking-wider group-hover:text-rp-blue">
      {label}
    </span>

    <div className="p-1.5 rounded-lg bg-white/5">
      {icon}
    </div>
  </button>
);

// STATUS ROW
const StatusRow = ({ label, value, color = "text-rp-gold" }) => (
  <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
      {label}
    </span>

    <span className={`text-xl font-black ${color}`}>
      {value}
    </span>
  </div>
);

// STATUS BADGE
const StatusBadge = ({ status }) => {
  const styles = {
    Active: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      icon: '●'
    },

    Draft: {
      bg: 'bg-yellow-500/10',
      text: 'text-rp-gold',
      border: 'border-rp-gold/20',
      icon: '●'
    },

    'Pending Validation': {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      icon: '●'
    },

    Expired: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      icon: '●'
    },

    default: {
      bg: 'bg-white/5',
      text: 'text-gray-400',
      border: 'border-white/10',
      icon: '○'
    }
  };

  const style = styles[status] || styles.default;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="text-[8px]">
        {style.icon}
      </span>

      {status}
    </span>
  );
};
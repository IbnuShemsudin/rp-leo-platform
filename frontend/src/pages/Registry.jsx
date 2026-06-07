import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import FactSheet from '../components/FactSheet';
import NewMoUModal from '../components/NewMoUModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import {
  Search,
  Edit3,
  Eye,
  Trash2,
  FileDown,
  Database,
  Globe,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  CheckCircle,
  Plus,
  Filter,
  Download,
  RefreshCw,
  MapPin
} from 'lucide-react';

export default function Registry() {
  const { token, user } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const [selectedMou, setSelectedMou] = useState(null);
  const [viewingMou, setViewingMou] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRegistry = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/mou/all', {
        headers: { 'x-auth-token': token }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch registry: ${response.status}`);
      }

      const data = await response.json();
      setMous(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Registry Fetch Error:", err);
      setError('Failed to load registry data. Please try again.');
      setMous([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRegistry();
    }
  }, [token]);

  const getMoUId = (mou) => mou?.id || mou?._id || mou?.uuid;

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedMou) return;
    const mouId = getMoUId(selectedMou);
    if (!mouId) {
      alert('Unable to update this record: missing identifier.');
      setIsUpdating(false);
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`${API}/api/mou/update/${mouId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({
          status: selectedMou.status ?? 'Draft',
          currentStep: selectedMou.currentStep ?? 1
        }),
      });

      if (response.ok) {
        setSelectedMou(null);
        fetchRegistry(); 
      } else {
        const errorBody = await response.json().catch(() => ({}));
        console.error('Update failed:', response.status, errorBody);
        alert(errorBody.msg || errorBody.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating registry entry.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickApprove = async (mou) => {
    if (!mou) return;
    const mouId = getMoUId(mou);
    if (!mouId) {
      console.error('Unable to approve record: missing id', mou);
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`${API}/api/mou/update/${mouId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({
          status: 'Active',
          currentStep: 2 
        }),
      });

      if (response.ok) {
        setViewingMou(null);
        fetchRegistry(); 
      }
    } catch (err) {
      console.error("Approval error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("CRITICAL: Purge this record from the Sector Data Node?")) return;
    try {
      const response = await fetch(`${API}/api/mou/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        setViewingMou(null);
        fetchRegistry();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredMous = mous.filter(mou => 
    (mou.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mou.country || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100">

        {/* Sticky Sidebar */}
        <div className="sticky top-0 h-screen z-40">
          <Sidebar />
        </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative custom-scrollbar">
        {/* Enhanced Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-blue/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rp-gold/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/3 rounded-full blur-[200px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Enhanced Header */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 sm:mb-12 lg:mb-16 gap-6 lg:gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-rp-gold animate-pulse shadow-lg shadow-rp-gold/50" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-rp-gold/30 animate-ping" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rp-gold">Sector Data Node</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">
                Partnership <span className="text-rp-blue bg-gradient-to-r from-rp-blue to-blue-400 bg-clip-text text-transparent">Registry</span>
              </h1>
              <p className="text-sm font-medium text-gray-400 max-w-lg">
                Official asset database access for Memorandum of Understanding records and partnership management.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Filter by organization or country..."
                  className="pl-12 pr-6 py-3 sm:py-4 rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl text-sm font-medium focus:ring-2 focus:ring-rp-blue/50 outline-none transition-all w-full md:w-80 hover:border-white/20 focus:border-rp-blue"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={fetchRegistry}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50"
                  title="Refresh Registry"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>

                {['admin', 'executive'].includes(user?.role) && (
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="px-6 py-4 bg-gradient-to-r from-rp-blue to-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center gap-3 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-95"
                  >
                    <Plus size={18} />
                    New Partnership
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-400" />
                <p className="text-sm text-rose-400 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Registry Table */}
          <div className="glass-panel rounded-[48px] border border-white/10 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent overflow-hidden shadow-2xl backdrop-blur-xl">
            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-rp-blue animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-2 border-rp-blue/20 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-2">
                  <span className="text-lg font-black uppercase tracking-widest text-gray-400 animate-pulse">Syncing Registry</span>
                  <p className="text-xs text-gray-500 font-medium">Loading partnership records...</p>
                </div>
              </div>
            ) : filteredMous.length === 0 ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Database size={32} className="text-gray-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">No Records Found</h3>
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'No partnerships match your search criteria.' : 'No partnership records available.'}
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border-b border-white/5">
                    <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Partner Entity</th>
                    <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                    <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Sector</th>
                    <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">System Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMous.map((mou, index) => (
                    <tr key={mou.id || mou._id || index} className="hover:bg-gradient-to-r hover:from-rp-blue/5 hover:to-transparent transition-all duration-300 group animate-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-rp-blue transition-all duration-300 shadow-lg">
                              <Globe size={20} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rp-blue/20 border border-rp-blue/40 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-rp-blue animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-white text-lg tracking-tight group-hover:text-rp-blue transition-colors">{mou.partnerName}</div>
                            <div className="text-sm text-gray-400 font-medium flex items-center gap-2">
                              <MapPin size={14} />
                              {mou.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <StatusBadge status={mou.status} />
                      </td>
                      <td className="px-12 py-8">
                        <span className="text-sm text-gray-300 font-medium">{mou.sector || 'Not Specified'}</span>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setViewingMou(mou)}
                            className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {['admin', 'executive'].includes(user?.role) && (
                            <button
                              onClick={() => setSelectedMou(mou)}
                              className="p-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-rp-gold hover:bg-rp-gold/10 hover:border-rp-gold/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                              title="Edit Record"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* --- ENHANCED FACT SHEET VIEW MODAL --- */}
      {viewingMou && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#05070a]/95 via-[#0a0c10]/95 to-[#05070a]/95 backdrop-blur-xl z-50 overflow-y-auto p-4 md:p-12 custom-scrollbar animate-in fade-in duration-500">
          {/* Enhanced Ambient Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-blue/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rp-gold/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Enhanced Header Controls */}
            <div className="mb-12 flex justify-between items-center print:hidden">
              <button
                onClick={() => setViewingMou(null)}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-sm font-black uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={18} />
                Back to Registry
              </button>

              <div className="flex gap-4">
                {['admin', 'executive'].includes(user?.role) && viewingMou.status === 'Draft' && (
                  <button
                    onClick={() => handleQuickApprove(viewingMou)}
                    disabled={isUpdating}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rp-blue to-blue-600 text-white text-sm font-black uppercase tracking-widest hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    {isUpdating ? 'Approving...' : 'Approve Entry'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(getMoUId(viewingMou))}
                  className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-rose-500/25 transform hover:scale-105 active:scale-95"
                  title="Delete Record"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Enhanced Document Area */}
            <div id="print-area" className="animate-in slide-in-from-bottom-10 duration-700">
              <FactSheet mou={viewingMou} />
            </div>

            <div className="mt-16 text-center pb-20 print:hidden">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Database size={14} className="text-rp-gold" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Official Digital Record • Sector Data Node
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ENHANCED QUICK EDIT MODAL --- */}
      {selectedMou && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-500">
          <div className="glass-panel w-full max-w-lg rounded-[48px] p-12 border border-white/10 bg-gradient-to-br from-[#0a0c10] via-[#0f1115] to-[#0a0c10] shadow-3xl animate-in zoom-in duration-500 backdrop-blur-2xl">
            {/* Enhanced Header */}
            <div className="text-center mb-12">
              <div className="relative inline-flex p-6 rounded-full bg-gradient-to-br from-rp-blue/20 to-blue-600/20 text-rp-blue mb-6 shadow-lg shadow-rp-blue/20">
                <Edit3 size={28} />
                <div className="absolute inset-0 rounded-full bg-rp-blue/10 animate-ping" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                Modify <span className="text-rp-blue bg-gradient-to-r from-rp-blue to-blue-400 bg-clip-text text-transparent">Registry</span>
              </h3>
              <p className="text-sm font-medium text-gray-400 mt-3 max-w-sm mx-auto">{selectedMou.partnerName}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-10">
              {/* Status Selection */}
              <div className="space-y-4">
                <label className="text-sm font-black uppercase text-gray-400 tracking-widest">Operational Status</label>
                <select
                  className="w-full px-6 py-5 bg-gradient-to-r from-black/40 to-black/20 border border-white/10 rounded-2xl outline-none font-bold text-white focus:border-rp-blue focus:ring-2 focus:ring-rp-blue/20 transition-all duration-300 appearance-none cursor-pointer text-sm shadow-lg hover:border-white/20"
                  value={selectedMou.status ?? 'Draft'}
                  onChange={(e) => setSelectedMou({...selectedMou, status: e.target.value})}
                >
                  <option value="Draft" className="bg-[#0a0c10] text-white">Drafting Phase</option>
                  <option value="Active" className="bg-[#0a0c10] text-white">Operational / Active</option>
                  <option value="Expired" className="bg-[#0a0c10] text-white">Archived / Expired</option>
                </select>
              </div>

              {/* Lifecycle Stage */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase text-gray-400 tracking-widest">Lifecycle Stage</label>
                  <span className="text-sm font-black text-rp-blue italic bg-rp-blue/10 px-3 py-1 rounded-full">
                    Step {selectedMou.currentStep} / 10
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="w-full h-2 bg-gradient-to-r from-white/10 to-white/5 rounded-lg appearance-none cursor-pointer accent-rp-blue shadow-lg"
                    value={selectedMou.currentStep ?? 1}
                    onChange={(e) => setSelectedMou({...selectedMou, currentStep: parseInt(e.target.value, 10)})}
                  />
                  <div className="flex justify-between mt-2 px-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i + 1 <= selectedMou.currentStep ? 'bg-rp-blue' : 'bg-white/20'} transition-colors`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedMou(null)}
                  className="flex-1 py-5 bg-white/5 text-gray-400 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={isUpdating}
                  className="flex-1 py-5 bg-gradient-to-r from-rp-blue to-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-900/40 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Syncing...
                    </div>
                  ) : (
                    'Update Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New MoU Modal */}
      {showNewModal && (
        <NewMoUModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => {
            setShowNewModal(false);
            fetchRegistry();
          }}
        />
      )}
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const styles = {
    Active: {
      bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      shadow: 'shadow-emerald-500/20',
      icon: '🟢'
    },
    Draft: {
      bg: 'bg-gradient-to-r from-rp-gold/20 to-yellow-500/20',
      text: 'text-rp-gold',
      border: 'border-rp-gold/30',
      shadow: 'shadow-rp-gold/20',
      icon: '🟡'
    },
    Expired: {
      bg: 'bg-gradient-to-r from-rose-500/20 to-red-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      shadow: 'shadow-rose-500/20',
      icon: '🔴'
    },
    default: {
      bg: 'bg-white/5',
      text: 'text-gray-400',
      border: 'border-white/10',
      shadow: 'shadow-white/10',
      icon: '⚪'
    }
  };

  const style = styles[status] || styles.default;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase border tracking-widest ${style.bg} ${style.text} ${style.border} shadow-lg ${style.shadow} backdrop-blur-sm`}>
      <span className="text-sm">{style.icon}</span>
      {status}
    </span>
  );
};
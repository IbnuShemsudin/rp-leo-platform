import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import FactSheet from '../components/FactSheet'; // Import your new component

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
  CheckCircle
} from 'lucide-react';

export default function Registry() {
  const { token, user } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMou, setSelectedMou] = useState(null); 
  const [viewingMou, setViewingMou] = useState(null);   
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRegistry = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/mou/all', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => {
        setMous(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Registry Fetch Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRegistry();
  }, [token]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/mou/update/${selectedMou._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({
          status: selectedMou.status,
          currentStep: selectedMou.currentStep
        }),
      });

      if (response.ok) {
        setSelectedMou(null);
        fetchRegistry(); 
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickApprove = async (mou) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/mou/update/${mou._id}`, {
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
    if (!window.confirm("CRITICAL: Purge this record from the Sector Data Node?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/mou/${id}`, {
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
    mou.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mou.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#05070a] text-slate-100 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rp-blue/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-rp-blue" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rp-blue">Sector Data Node</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Partnership <span className="opacity-40">Registry</span></h1>
              <p className="text-[10px] font-bold text-rp-gold uppercase tracking-[0.3em]">Official Asset Database Access</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter by organization..." 
                  className="pl-12 pr-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-rp-blue/50 outline-none transition-all w-full md:w-80"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </header>

          <div className="glass-panel rounded-[40px] border border-white/10 bg-white/[0.01] overflow-hidden shadow-3xl">
            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-10 h-10 text-rp-blue animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">Syncing Registry...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Partner Entity</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest italic text-right">System Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMous.map((mou) => (
                    <tr key={mou._id} className="hover:bg-rp-blue/5 transition-all group">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-rp-blue transition-all">
                            <Globe size={18} />
                          </div>
                          <div>
                            <div className="font-black text-white text-sm tracking-tight">{mou.partnerName}</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">{mou.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <StatusBadge status={mou.status} />
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewingMou(mou)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white transition-all">
                            <Eye size={16} />
                          </button>
                          {['admin', 'executive'].includes(user?.role) && (
                            <button onClick={() => setSelectedMou(mou)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-rp-gold transition-all">
                              <Edit3 size={16} />
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

      {/* --- FACT SHEET VIEW MODAL --- */}
     {/* --- FACT SHEET VIEW MODAL --- */}
{viewingMou && (
  <div className="fixed inset-0 bg-[#05070a] z-50 overflow-y-auto p-4 md:p-12 custom-scrollbar animate-in fade-in duration-300">
    {/* Ambient Glow for the Modal Background to maintain the aesthetic */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rp-blue/10 blur-[120px] pointer-events-none" />
    
    <div className="max-w-5xl mx-auto relative z-10">
      {/* Header Controls - Hidden on Print */}
      <div className="mb-8 flex justify-between items-center print:hidden">
        <button 
          onClick={() => setViewingMou(null)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all shadow-2xl"
        >
          <ChevronLeft size={16} />
          Back to Registry
        </button>

        <div className="flex gap-4">
           {['admin', 'executive'].includes(user?.role) && viewingMou.status === 'Draft' && (
              <button 
                onClick={() => handleQuickApprove(viewingMou)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rp-blue text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
              >
                <CheckCircle size={16} />
                Approve Entry
              </button>
           )}
           <button 
            onClick={() => handleDelete(viewingMou._id)}
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* THE DOCUMENT AREA */}
      <div id="print-area" className="animate-in slide-in-from-bottom-10 duration-700">
         <FactSheet mou={viewingMou} />
      </div>

      <div className="mt-12 text-center pb-20 print:hidden">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em] opacity-50">
          Official Digital Record • Sector Data Node
        </p>
      </div>
    </div>
  </div>
)}

      {/* QUICK EDIT MODAL */}
      {selectedMou && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md rounded-[48px] p-10 border border-white/10 bg-[#0a0c10] shadow-3xl animate-in zoom-in duration-300">
            <div className="text-center mb-10">
              <div className="inline-flex p-4 rounded-full bg-rp-blue/10 text-rp-blue mb-4">
                <Edit3 size={24} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Modify <span className="text-rp-blue">Registry</span></h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{selectedMou.partnerName}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Operational Status</label>
                <select 
                  className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl outline-none font-bold text-white focus:border-rp-blue transition-all appearance-none cursor-pointer text-xs"
                  value={selectedMou.status}
                  onChange={(e) => setSelectedMou({...selectedMou, status: e.target.value})}
                >
                  <option value="Draft" className="bg-[#0a0c10]">Drafting Phase</option>
                  <option value="Active" className="bg-[#0a0c10]">Operational / Active</option>
                  <option value="Expired" className="bg-[#0a0c10]">Archived / Expired</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Lifecycle Stage</label>
                  <span className="text-xs font-black text-rp-blue italic">Step {selectedMou.currentStep} / 10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rp-blue"
                  value={selectedMou.currentStep}
                  onChange={(e) => setSelectedMou({...selectedMou, currentStep: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setSelectedMou(null)} className="flex-1 py-5 bg-white/5 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                <button disabled={isUpdating} className="flex-1 py-5 bg-rp-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-900/40">
                  {isUpdating ? 'Syncing...' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-rp-blue/10 text-rp-blue border-rp-blue/20',
    Draft: 'bg-rp-gold/10 text-rp-gold border-rp-gold/20',
    Expired: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    default: 'bg-white/5 text-gray-400 border-white/10'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-[0.25em] ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
};
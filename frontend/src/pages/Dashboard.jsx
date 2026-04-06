import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import METracker from '../components/METracker';
import NewMoUModal from '../components/NewMoUModal';
import SigningManager from '../components/SigningManager';
import { getAllMous } from '../services/mouService';


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { token, isExecutive } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch MoUs (Updated)
  const fetchMous = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getAllMous(token);
      setMous(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchMous();
  }, [fetchMous]);

  // View File
  const handleViewFile = (fileName) => {
    if (!fileName) return alert("No document linked to this record yet.");
    const fileUrl = `${API}/uploads/${fileName}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  // Optimized Filtering
  const filteredMous = useMemo(() => {
    return mous.filter(mou => 
      mou.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mou.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mous, searchTerm]);

  return (
    <div className="flex min-h-screen bg-rp-slate">
      <Sidebar />

      <main className="flex-1 p-8 pt-24 lg:pt-12 overflow-y-auto z-10">
        <div className="max-w-7xl mx-auto animate-fade-up">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Executive <span className="text-rp-blue">Dashboard</span>
              </h1>
              <p className="text-rp-gold font-bold text-[10px] uppercase tracking-[0.4em]">
                Regional Partnership Monitoring & Evaluation
              </p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Partners..." 
                className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm focus:ring-2 focus:ring-rp-blue outline-none w-full md:w-72 transition-all placeholder:text-gray-600 font-bold"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div 
                onClick={fetchMous}
                className="glass-panel px-8 py-3 rounded-2xl border border-white/10 text-center min-w-[140px] cursor-pointer hover:border-rp-blue/30 transition-all group active:scale-95"
              >
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-rp-blue">
                  Active MoUs
                </p>
                <p className="text-2xl font-black text-rp-gold">
                  {mous.length}
                </p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              <METracker progress={78} />

              <div className="glass-panel rounded-[40px] shadow-2xl overflow-hidden border border-white/5">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-black text-white uppercase tracking-widest text-xs">
                    Partnership Registry
                  </h3>
                  <button className="text-[10px] font-black text-rp-blue hover:text-rp-gold transition-colors tracking-widest uppercase">
                    Export Data
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.02]">
                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                          Institution
                        </th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">
                          Status
                        </th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">
                          Lifecycle
                        </th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">
                          Operation
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.05]">
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="p-32 text-center text-rp-blue font-black animate-pulse uppercase tracking-[0.3em] text-xs">
                            Retrieving Satellite Link...
                          </td>
                        </tr>
                      ) : filteredMous.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-20 text-center text-gray-500 uppercase font-black text-[10px] tracking-widest">
                            No matching records found.
                          </td>
                        </tr>
                      ) : (
                        filteredMous.map((mou) => (
                          <tr 
                            key={mou._id} 
                            className="hover:bg-white/[0.03] transition-colors group"
                          >
                            <td className="px-8 py-6">
                              <p className="font-bold text-gray-100 leading-none group-hover:text-white transition-colors">
                                {mou.partnerName}
                              </p>
                              <p className="text-[9px] text-gray-500 uppercase font-black mt-1.5 tracking-widest">
                                {mou.country}
                              </p>
                            </td>

                            <td className="px-8 py-6 text-center">
                              <span className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg border inline-block min-w-[80px] ${
                                mou.status === 'Active' || mou.status === 'Signed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-rp-blue/10 text-rp-blue border-rp-blue/20'
                              }`}>
                                {mou.status || 'Initiation'}
                              </span>
                            </td>

                            <td className="px-8 py-6">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${
                                      mou.currentStep >= 8 
                                      ? 'bg-emerald-500' 
                                      : 'bg-rp-gold'
                                    }`} 
                                    style={{ 
                                      width: `${((mou.currentStep || 1) / 10) * 100}%` 
                                    }}
                                  />
                                </div>

                                <span className="text-[8px] font-black text-gray-500 uppercase">
                                  {mou.currentStep || 1}/10
                                </span>
                              </div>
                            </td>

                            <td className="px-8 py-6 text-right">
                              {mou.currentStep === 6 && isExecutive ? (
                                <SigningManager
                                  mouId={mou._id}
                                  partnerName={mou.partnerName}
                                  onComplete={fetchMous}
                                />
                              ) : (
                                <button 
                                  onClick={() => handleViewFile(mou.fileUrl)}
                                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border active:scale-95 ${
                                    mou.fileUrl 
                                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-rp-blue hover:text-white'
                                    : 'bg-transparent border-white/5 text-gray-700 cursor-not-allowed'
                                  }`}
                                >
                                  {mou.fileUrl 
                                    ? 'View File' 
                                    : 'Pending Upload'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-8">

              <div className="glass-panel p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rp-blue/10 rounded-full blur-3xl"></div>

                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rp-gold mb-8">
                  Staff Command
                </h3>

                <div className="space-y-4 relative z-10">
                  <QuickButton 
                    label="New Initiation" 
                    icon="📡"
                    onClick={() => setIsModalOpen(true)}
                  />

                  <QuickButton 
                    label="Audit Submission" 
                    icon="📑"
                  />

                  <QuickButton 
                    label="Resource Log" 
                    icon="📈"
                  />
                </div>

              </div>

              <div className="glass-panel p-10 rounded-[40px] border border-white/10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">
                  System Alerts
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-5 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-rp-gold mt-2 shrink-0" />
                    
                    <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-wider">
                      {mous.some(m => m.currentStep === 10) 
                        ? "A partnership has reached Final Certification." 
                        : "Regional satellite data sharing project requires status update."}
                    </p>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <NewMoUModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchMous}
      />

    </div>
  );
}

const QuickButton = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer active:scale-95"
  >
    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">
      {label}
    </span>

    <span className="text-lg group-hover:rotate-12 transition-transform">
      {icon}
    </span>

  </button>
);
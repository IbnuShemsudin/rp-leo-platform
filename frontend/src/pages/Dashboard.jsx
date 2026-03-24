import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import METracker from '../components/METracker';
import NewMoUModal from '../components/NewMoUModal';
import SigningManager from '../components/SigningManager';

export default function Dashboard() {
  const { token, isExecutive } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized fetch function to refresh data after updates
  const fetchMous = useCallback(() => {
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
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchMous();
  }, [fetchMous]);

  // Filter MoUs based on search input
  const filteredMous = mous.filter(mou => 
    mou.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mou.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Permanent Sidebar */}
      <Sidebar />

      {/* 2. Main Scrollable Content */}
      <main className="flex-1 p-8 pt-24 lg:pt-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Area */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-rp-slate uppercase tracking-tighter">Executive Dashboard</h1>
              <p className="text-rp-gold font-bold text-xs uppercase tracking-[0.2em] mt-1">Partnership Monitoring & Evaluation</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Partners..." 
                className="px-6 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm text-sm focus:ring-2 focus:ring-rp-blue outline-none w-full md:w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[10px] font-black text-gray-400 uppercase">Total MoUs</p>
                <p className="text-xl font-black text-rp-blue">{mous.length}</p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: List & Tracker */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* M&E Feature Card */}
              <METracker progress={78} />

              {/* Registry Table */}
              <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-black text-rp-slate uppercase tracking-tight text-sm">Active Registry</h3>
                  <button className="text-[10px] font-black text-rp-blue uppercase tracking-widest hover:text-rp-gold transition-colors">
                    Export CSV
                  </button>
                </div>
                
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400">Partner</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 text-center">Step</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing with RPD Database...</td></tr>
                    ) : filteredMous.length === 0 ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-medium">No matching partnerships found.</td></tr>
                    ) : filteredMous.map((mou) => (
                      <tr key={mou._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-rp-slate leading-none">{mou.partnerName}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">{mou.country}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${
                            mou.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {mou.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="bg-rp-gold h-full" style={{ width: `${(mou.currentStep / 10) * 100}%` }}></div>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400">{mou.currentStep}/10</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {/* Role-based action: Only executives can finalize signing (Step 7) */}
                          {mou.currentStep === 6 && isExecutive ? (
                            <SigningManager mouId={mou._id} partnerName={mou.partnerName} onComplete={fetchMous} />
                          ) : (
                            <button className="bg-gray-50 hover:bg-rp-blue hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                              Manage
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Actions & Notifications */}
            <div className="space-y-8">
              <div className="bg-rp-slate p-8 rounded-[40px] text-white shadow-2xl shadow-slate-900/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-rp-gold mb-6">Staff Quick Actions</h3>
                <div className="space-y-3">
                  <div onClick={() => setIsModalOpen(true)}>
                    <QuickButton label="New MoU Initiation" icon="➕" />
                  </div>
                  <QuickButton label="Upload Audit Report" icon="📤" />
                  <QuickButton label="Resource Mobilization" icon="💰" />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-rp-slate mb-6">Recent Alerts</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-rp-gold mt-1.5 shrink-0" />
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      EA-ROAD Regional project requires update on Step 10 report.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New MoU Entry Modal */}
      <NewMoUModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchMous} 
      />
    </div>
  );
}

const QuickButton = ({ label, icon }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer">
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <span className="group-hover:scale-125 transition-transform">{icon}</span>
  </button>
);
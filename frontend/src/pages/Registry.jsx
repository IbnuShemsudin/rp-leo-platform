import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

export default function Registry() {
  const { token, user } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedMou, setSelectedMou] = useState(null);
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
        fetchRegistry(); // Refresh data
      } else {
        alert("Update failed. Check permissions.");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredMous = mous.filter(mou => 
    mou.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mou.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header section remains the same as previous step */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h1 className="text-3xl font-black text-rp-slate uppercase tracking-tighter">Partnership Registry</h1>
              <p className="text-[10px] font-bold text-rp-gold uppercase tracking-[0.3em] mt-1">Official Database Access</p>
            </div>
            <div className="flex items-center gap-4">
               <input 
                  type="text" 
                  placeholder="Filter registry..." 
                  className="pl-6 pr-6 py-4 rounded-2xl border-none bg-white shadow-sm text-sm focus:ring-2 focus:ring-rp-blue outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </header>

          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Partner</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400">Lifecycle</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMous.map((mou) => (
                  <tr key={mou._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-10 py-7 font-black text-rp-slate">{mou.partnerName}</td>
                    <td className="px-10 py-7">
                      <StatusBadge status={mou.status} />
                    </td>
                    <td className="px-10 py-7">
                      <div className="text-xs font-black text-rp-blue">Step {mou.currentStep} of 10</div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      {['admin', 'executive'].includes(user?.role) && (
                        <button 
                          onClick={() => setSelectedMou(mou)}
                          className="px-5 py-3 rounded-xl bg-rp-slate text-white text-[10px] font-black uppercase hover:bg-rp-blue transition-all"
                        >
                          Quick Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* QUICK EDIT MODAL */}
      {selectedMou && (
        <div className="fixed inset-0 bg-rp-slate/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-rp-slate uppercase">Modify Status</h3>
              <p className="text-[10px] font-bold text-rp-gold uppercase tracking-widest mt-1">{selectedMou.partnerName}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Current State</label>
                <select 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-rp-slate"
                  value={selectedMou.status}
                  onChange={(e) => setSelectedMou({...selectedMou, status: e.target.value})}
                >
                  <option value="Draft">Drafting Phase</option>
                  <option value="Active">Operational / Active</option>
                  <option value="Expired">Archived / Expired</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Workflow Step ({selectedMou.currentStep}/10)</label>
                <input 
                  type="range" min="1" max="10" 
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rp-blue"
                  value={selectedMou.currentStep}
                  onChange={(e) => setSelectedMou({...selectedMou, currentStep: parseInt(e.target.value)})}
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase pt-2">
                  <span>Start</span>
                  <span className="text-rp-blue">Step {selectedMou.currentStep}</span>
                  <span>M&E</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setSelectedMou(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-[10px] hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isUpdating}
                  className="flex-1 py-4 bg-rp-blue text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-900/20 hover:bg-rp-slate transition-all"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Update'}
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
    Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Draft: 'bg-amber-50 text-amber-600 border-amber-100',
    Expired: 'bg-rose-50 text-rose-600 border-rose-100',
    default: 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
};
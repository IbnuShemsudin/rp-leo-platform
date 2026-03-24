// src/components/SigningManager.jsx
import React, { useState } from 'react';

export default function SigningManager({ mouId, partnerName, onComplete }) {
  const [isSigning, setIsSigning] = useState(false);
  const [signData, setSignData] = useState({
    date: new Date().toISOString().split('T'),
    signatoryName: '',
    documentRef: ''
  });

  const handleFinalize = async () => {
    // Logic to update Step 7 in MongoDB
    const response = await fetch(`http://localhost:5000/api/mou/sign/${mouId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...signData, currentStep: 7, status: 'Active' })
    });

    if (response.ok) {
      alert(`MoU with ${partnerName} officially signed!`);
      setIsSigning(false);
      onComplete();
    }
  };

  if (!isSigning) {
    return (
      <button 
        onClick={() => setIsSigning(true)}
        className="px-4 py-2 bg-rp-gold/10 text-rp-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rp-gold hover:text-white transition-all"
      >
        Finalize Step 7
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z- bg-rp-slate/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl border-t-8 border-rp-gold">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🖋️</span>
          </div>
          <h2 className="text-2xl font-black text-rp-slate uppercase tracking-tighter">Official Signing</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Partner: {partnerName}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Signing Date</label>
            <input 
              type="date" 
              className="bg-gray-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rp-gold"
              value={signData.date}
              onChange={(e) => setSignData({...signData, date: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">SSGI Authorized Signatory</label>
            <input 
              type="text" 
              placeholder="Full Name of Executive"
              className="bg-gray-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rp-gold"
              onChange={(e) => setSignData({...signData, signatoryName: e.target.value})}
            />
          </div>

          <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-[10px] text-orange-800 font-medium leading-relaxed italic">
              "By finalizing, you confirm that physical signatures from both SSGI and {partnerName} have been obtained."
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setIsSigning(false)}
              className="flex-1 py-4 text-xs font-black uppercase text-gray-400 hover:text-rp-slate"
            >
              Cancel
            </button>
            <button 
              onClick={handleFinalize}
              className="flex-2 py-4 bg-rp-slate text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/30"
            >
              Complete Step 7
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
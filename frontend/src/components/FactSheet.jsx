// src/components/FactSheet.jsx
import React from 'react';

export default function FactSheet({ mou }) {
  if (!mou) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-4xl mx-auto border border-gray-100 print:shadow-none print:p-0">
      {/* Header with SSGI Branding */}
      <div className="flex justify-between items-start border-b-2 border-rp-blue pb-8 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-rp-blue rounded-2xl flex items-center justify-center">
            <span className="text-white font-black text-xl">SSGI</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-rp-slate uppercase tracking-tighter">Strategic Partnership</h1>
            <p className="text-[10px] font-black text-rp-gold uppercase tracking-[0.2em]">Regional Partnership Lead Executive Office</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase">Document Ref</p>
          <p className="text-sm font-bold text-rp-slate">{mou._id?.substring(0, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <DetailItem label="Partner Institution" value={mou.partnerName} />
        <DetailItem label="Host Country" value={mou.country} />
        <DetailItem label="Funding Model" value={mou.fundingType || "Non-Funded"} />
        <DetailItem label="Status" value={`Step ${mou.currentStep}: ${mou.status}`} isGold />
      </div>

      {/* Articles Summary Section */}
      <div className="space-y-6 mb-12">
        <h3 className="text-xs font-black text-rp-slate uppercase tracking-widest border-l-4 border-rp-gold pl-4">
          Executive Summary (Article 5: Objectives)
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-3xl">
          {mou.objectives || "No objectives defined in the digital registry yet."}
        </p>
      </div>

      {/* Footer / Official Stamp Area */}
      <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Authorized by</p>
          <div className="w-48 h-12 border-b border-dashed border-gray-300"></div>
          <p className="text-[10px] font-bold text-rp-slate uppercase">RP-LEO Executive Director</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-rp-slate text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rp-blue transition-all print:hidden"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value, isGold }) {
  return (
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-black tracking-tight ${isGold ? 'text-rp-gold' : 'text-rp-slate'}`}>{value}</p>
    </div>
  );
}
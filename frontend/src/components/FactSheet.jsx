// src/components/FactSheet.jsx
import React from 'react';
import { Shield, Globe, Award, Calendar, FileText, Hash } from 'lucide-react';

export default function FactSheet({ mou }) {
  if (!mou) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-16 shadow-2xl max-w-[210mm] mx-auto border-t-[12px] border-rp-blue relative overflow-hidden print:shadow-none print:p-8 print:border-t-[8px]">
      
      {/* Background Decorative Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Shield size={600} className="text-rp-blue" />
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="flex gap-6">
          <div className="w-20 h-20 bg-rp-slate rounded-2xl flex items-center justify-center shadow-lg shadow-rp-slate/20">
            <span className="text-white font-black text-2xl tracking-tighter">SSGI</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-rp-slate tracking-tight">
              Memorandum of Understanding
            </h1>
            <p className="text-[11px] font-black text-rp-blue uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe size={12} /> Regional Partnership Lead Executive Office
            </p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Space Science & Geo-Spatial Institute • Strategic Registry
            </p>
          </div>
        </div>
        
        <div className="text-right border-l-2 border-gray-100 pl-6">
          <div className="flex items-center justify-end gap-2 text-gray-400 mb-1">
            <Hash size={10} />
            <p className="text-[10px] font-black uppercase tracking-widest">Registry ID</p>
          </div>
          <p className="text-lg font-mono font-bold text-rp-slate tracking-tighter">
            {mou._id?.substring(0, 12).toUpperCase()}
          </p>
          <p className="text-[9px] font-bold text-rp-gold uppercase mt-1 italic">Classification: Restricted</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gray-50 border-y border-gray-200 py-4 px-8 mb-12 flex justify-between items-center rounded-sm">
        <div className="flex items-center gap-6">
           <StatusField icon={<Calendar size={14}/>} label="Issued Date" value={new Date().toLocaleDateString('en-GB')} />
           <StatusField icon={<Award size={14}/>} label="Legal Status" value={mou.status?.toUpperCase()} color="text-rp-blue" />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase">Document Version</p>
          <p className="text-xs font-bold text-rp-slate">v2.0.4-Stable</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-y-10 gap-x-12 mb-16 relative z-10">
        <div className="col-span-2">
           <DetailItem label="Primary Partner Institution" value={mou.partnerName} />
        </div>
        <DetailItem label="Host Jurisdiction" value={mou.country} />
        
        <DetailItem label="Funding Framework" value={mou.fundingType || "Non-Governmental / Private"} />
        <DetailItem label="Operational Step" value={`Phase ${mou.currentStep} of 10`} />
        <DetailItem label="Liaison Office" value="RP-LEO HQ" />
      </div>

      {/* Objectives / Article 5 */}
      <div className="space-y-4 mb-16 relative z-10">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
          <FileText size={16} className="text-rp-gold" />
          <h3 className="text-xs font-black text-rp-slate uppercase tracking-[0.2em]">
            Article V: Strategic Objectives & Scope
          </h3>
        </div>
        <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 min-h-[150px]">
          <p className="text-[13px] font-serif leading-relaxed text-slate-700 italic">
            "{mou.objectives || "The specific collaborative frameworks, technical requirements, and strategic goals for this partnership are pending final administrative validation. This document serves as the interim digital record of intent."}"
          </p>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="mt-24 pt-12 border-t-2 border-gray-100 flex justify-between items-start relative z-10">
        <div className="flex gap-16">
          <div className="space-y-6">
            <div className="w-40 h-[1px] bg-rp-slate"></div>
            <div>
              <p className="text-[10px] font-black text-rp-slate uppercase">Authorized Signatory</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Lead Executive Director, SSGI</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="w-40 h-[1px] bg-rp-slate"></div>
            <div>
              <p className="text-[10px] font-black text-rp-slate uppercase">Partner Representative</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Authorized Legal Entity</p>
            </div>
          </div>
        </div>

        {/* Digital Verification (The "Stamp") */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 border-2 border-rp-blue/20 rounded-xl flex items-center justify-center mx-auto opacity-40 grayscale group-hover:grayscale-0 transition-all">
             <div className="grid grid-cols-2 gap-1 p-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-4 h-4 bg-rp-blue"></div>)}
             </div>
          </div>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Digital System<br/>Verification</p>
        </div>
      </div>

      {/* Floating Action Button (Hidden on Print) */}
      <button 
        onClick={handlePrint}
        className="absolute bottom-8 right-8 bg-rp-slate text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rp-blue hover:scale-105 transition-all shadow-2xl shadow-rp-blue/30 print:hidden flex items-center gap-3"
      >
        <FileText size={16} />
        Finalize as PDF
      </button>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-bold text-slate-800 tracking-tight leading-tight">{value}</p>
    </div>
  );
}

function StatusField({ icon, label, value, color = "text-rp-slate" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{label}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{value}</p>
      </div>
    </div>
  );
}
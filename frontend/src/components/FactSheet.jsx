// src/components/FactSheet.jsx
import React from 'react';
import { Shield, Globe, Award, Calendar, FileText, Hash, Download, Printer, CheckCircle } from 'lucide-react';

export default function FactSheet({ mou }) {
  if (!mou) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>MoU - ${mou.partnerName}</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
            .header { border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .status { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin: 30px 0; }
            .objectives { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
            .footer { border-top: 2px solid #e5e7eb; padding-top: 30px; margin-top: 50px; }
            .signature { margin-top: 20px; }
            .signature-line { border-bottom: 1px solid #374151; width: 200px; height: 1px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Memorandum of Understanding</h1>
            <p>Space Science & Geo-Spatial Institute</p>
            <p>Registry ID: ${mou._id?.substring(0, 12).toUpperCase()}</p>
          </div>

          <div class="status">
            <p><strong>Status:</strong> ${mou.status?.toUpperCase()}</p>
            <p><strong>Partner:</strong> ${mou.partnerName}</p>
            <p><strong>Country:</strong> ${mou.country}</p>
          </div>

          <div class="grid">
            <div>
              <p><strong>Funding Framework:</strong> ${mou.fundingType || "Non-Governmental / Private"}</p>
              <p><strong>Operational Step:</strong> Phase ${mou.currentStep} of 10</p>
            </div>
            <div>
              <p><strong>Liaison Office:</strong> RP-LEO HQ</p>
              <p><strong>Classification:</strong> Restricted</p>
            </div>
          </div>

          <div class="objectives">
            <h3>Article V: Strategic Objectives & Scope</h3>
            <p>"${mou.objectives || "The specific collaborative frameworks, technical requirements, and strategic goals for this partnership are pending final administrative validation. This document serves as the interim digital record of intent."}"</p>
          </div>

          <div class="footer">
            <div style="display: flex; justify-content: space-between;">
              <div class="signature">
                <div class="signature-line"></div>
                <p><strong>Authorized Signatory</strong></p>
                <p>Lead Executive Director, SSGI</p>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <p><strong>Partner Representative</strong></p>
                <p>Authorized Legal Entity</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white p-16 shadow-2xl max-w-[210mm] mx-auto border-t-[12px] border-rp-blue relative overflow-hidden print:shadow-none print:p-8 print:border-t-[8px] animate-in slide-in-from-bottom-4 duration-700">

      {/* Enhanced Background Effects */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rp-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-rp-gold/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Background Decorative Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Shield size={600} className="text-rp-blue" />
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="flex gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-rp-slate to-rp-blue rounded-2xl flex items-center justify-center shadow-lg shadow-rp-slate/20 hover:shadow-rp-blue/30 transition-all duration-300 group">
            <span className="text-white font-black text-2xl tracking-tighter group-hover:scale-110 transition-transform">SSGI</span>
            <div className="absolute inset-0 rounded-2xl bg-rp-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-rp-slate tracking-tight hover:text-rp-blue transition-colors">
              Memorandum of Understanding
            </h1>
            <p className="text-[11px] font-black text-rp-blue uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe size={12} className="animate-pulse" /> Regional Partnership Lead Executive Office
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
          <p className="text-lg font-mono font-bold text-rp-slate tracking-tighter hover:text-rp-blue transition-colors">
            {mou._id?.substring(0, 12).toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle size={12} className="text-emerald-500" />
            <p className="text-[9px] font-bold text-rp-gold uppercase italic">Classification: Restricted</p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-y border-gray-200 py-4 px-8 mb-12 flex justify-between items-center rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6">
           <StatusField icon={<Calendar size={14} className="text-blue-500" />} label="Issued Date" value={new Date().toLocaleDateString('en-GB')} />
           <StatusField icon={<Award size={14} className="text-rp-blue" />} label="Legal Status" value={mou.status?.toUpperCase()} color="text-rp-blue" />
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[9px] font-black text-gray-400 uppercase">Document Version</p>
          </div>
          <p className="text-xs font-bold text-rp-slate bg-white/50 px-2 py-1 rounded-md">v2.0.4-Stable</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-y-10 gap-x-12 mb-16 relative z-10">
        <div className="col-span-2 group">
           <DetailItem label="Primary Partner Institution" value={mou.partnerName} />
           <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-500"></div>
        </div>
        <div className="group">
          <DetailItem label="Host Jurisdiction" value={mou.country} />
          <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-500"></div>
        </div>

        <div className="group">
          <DetailItem label="Funding Framework" value={mou.fundingType || "Non-Governmental / Private"} />
          <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-500"></div>
        </div>
        <div className="group">
          <DetailItem label="Operational Step" value={`Phase ${mou.currentStep} of 10`} />
          <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-500"></div>
        </div>
        <div className="group">
          <DetailItem label="Liaison Office" value="RP-LEO HQ" />
          <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-500"></div>
        </div>
      </div>

      {/* Objectives / Article 5 */}
      <div className="space-y-4 mb-16 relative z-10">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2 group">
          <FileText size={16} className="text-rp-gold group-hover:text-rp-blue transition-colors" />
          <h3 className="text-xs font-black text-rp-slate uppercase tracking-[0.2em] group-hover:text-rp-blue transition-colors">
            Article V: Strategic Objectives & Scope
          </h3>
        </div>
        <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 p-8 rounded-2xl border border-gray-100 min-h-[150px] hover:shadow-lg transition-shadow group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rp-gold to-rp-blue rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[13px] font-serif leading-relaxed text-slate-700 italic group-hover:text-slate-800 transition-colors">
            "{mou.objectives || "The specific collaborative frameworks, technical requirements, and strategic goals for this partnership are pending final administrative validation. This document serves as the interim digital record of intent."}"
          </p>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="mt-24 pt-12 border-t-2 border-gray-100 flex justify-between items-start relative z-10">
        <div className="flex gap-16">
          <div className="space-y-6 group">
            <div className="w-40 h-[1px] bg-gradient-to-r from-rp-slate to-rp-blue group-hover:from-rp-blue group-hover:to-rp-gold transition-all duration-500"></div>
            <div>
              <p className="text-[10px] font-black text-rp-slate uppercase group-hover:text-rp-blue transition-colors">Authorized Signatory</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-gray-500 transition-colors">Lead Executive Director, SSGI</p>
            </div>
          </div>
          <div className="space-y-6 group">
            <div className="w-40 h-[1px] bg-gradient-to-r from-rp-slate to-rp-blue group-hover:from-rp-blue group-hover:to-rp-gold transition-all duration-500"></div>
            <div>
              <p className="text-[10px] font-black text-rp-slate uppercase group-hover:text-rp-blue transition-colors">Partner Representative</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-gray-500 transition-colors">Authorized Legal Entity</p>
            </div>
          </div>
        </div>

        {/* Digital Verification (The "Stamp") */}
        <div className="text-center space-y-2 group">
          <div className="w-20 h-20 border-2 border-rp-blue/20 rounded-xl flex items-center justify-center mx-auto opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all hover:scale-105 hover:shadow-lg hover:shadow-rp-blue/20">
             <div className="grid grid-cols-2 gap-1 p-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-4 h-4 bg-rp-blue animate-pulse"></div>)}
             </div>
          </div>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-rp-blue transition-colors">Digital System<br/>Verification</p>
        </div>
      </div>

      {/* Floating Action Buttons (Hidden on Print) */}
      <div className="absolute bottom-8 right-8 flex gap-3 print:hidden">
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-2 group"
        >
          <Download size={14} className="group-hover:animate-bounce" />
          Download
        </button>
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-rp-slate to-rp-blue text-white px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:from-rp-blue hover:to-rp-gold hover:scale-105 transition-all shadow-2xl shadow-rp-blue/30 flex items-center gap-2 group"
        >
          <Printer size={14} className="group-hover:animate-bounce" />
          Print PDF
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1 group">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-rp-blue transition-colors">{label}</p>
      <p className="text-base font-bold text-slate-800 tracking-tight leading-tight group-hover:text-rp-slate transition-colors">{value}</p>
    </div>
  );
}

function StatusField({ icon, label, value, color = "text-rp-slate" }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="text-gray-400 group-hover:text-rp-blue transition-colors">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-rp-blue transition-colors">{label}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${color} group-hover:scale-105 transition-transform`}>{value}</p>
      </div>
    </div>
  );
}
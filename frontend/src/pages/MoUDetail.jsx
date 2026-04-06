import React from 'react';
import Navbar from '../components/Navbar';
import WorkflowStepper from '../components/WorkflowStepper';

const STAGE_REQUIREMENTS = {
  5: { // Content Development Stage
    docs: [
      { name: "Legal Draft v1.0", status: "Approved", owner: "Legal Dept" },
      { name: "Technical Annex", status: "Pending", owner: "Space Science Div" },
      { name: "Financial Framework", status: "Under Review", owner: "Finance" }
    ],
    meetings: ["Legal Review (Mar 20)", "Technical Alignment (Mar 22)"]
  }
};

export default function MoUDetails() {
  const currentStep = 5; // Example: This MoU is currently at Step 5
  const requirements = STAGE_REQUIREMENTS[currentStep] || { docs: [], meetings: [] };

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header: Partnership Identity */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-rp-blue/20 border border-rp-blue/30 text-[10px] font-black text-rp-blue uppercase tracking-widest">
                  Ref: SSGI-MOU-2026-042
                </span>
                <span className="w-2 h-2 rounded-full bg-rp-gold animate-pulse"></span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                Global <span className="text-rp-gold">Sat-Tech</span> <br /> Cooperation
              </h1>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Download Full Log
              </button>
              <button className="bg-rp-blue text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 hover:scale-105 transition-all">
                Submit For Approval
              </button>
            </div>
          </div>

          {/* Progress Tracker Integration */}
          <WorkflowStepper currentStep={currentStep} />

          {/* Technical Documentation & Requirements */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Stage-Specific Checklist */}
            <div className="lg:col-span-2 glass-panel p-10 rounded-[48px] border border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Stage {currentStep}: Documents</h3>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Required for Progression</span>
              </div>

              <div className="space-y-4">
                {requirements.docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl group-hover:bg-rp-blue/20 transition-colors">
                        📄
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">{doc.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{doc.owner}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rp-gold/10 text-rp-gold'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: Metadata & Timeline */}
            <div className="space-y-8">
              <div className="glass-panel p-8 rounded-[40px] border border-white/10">
                <h4 className="text-xs font-black text-rp-gold uppercase tracking-[0.3em] mb-6">Upcoming Milestones</h4>
                <div className="space-y-6">
                  {requirements.meetings.map((meeting, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-[1px] bg-rp-blue/30 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rp-blue shadow-[0_0_10px_#1e3a8a]"></div>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-4">{meeting}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-rp-blue/10 border border-rp-blue/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">🛰️</div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Lead SSGI Officer</h4>
                <p className="text-[10px] text-rp-blue font-black uppercase mt-2 tracking-widest">Abdurezak Shemsu</p>
                <p className="text-[9px] text-gray-500 font-bold mt-1">Regional Partnership Division</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
// src/components/METracker.jsx
import React from 'react';

export default function METracker({ mouName, progress = 75 }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-rp-slate uppercase tracking-tight">Audit & Impact Report</h3>
          <p className="text-[10px] font-black text-rp-gold uppercase tracking-[0.2em] mt-1">
            Monitoring & Evaluation Phase (Step 10)
          </p>
        </div>
        <button className="bg-gray-50 hover:bg-rp-blue hover:text-white p-3 rounded-2xl transition-all">
          <span className="text-xs font-black uppercase tracking-widest px-4">Upload Audit PDF</span>
        </button>
      </div>

      {/* Progress Visualization */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Implementation Goal Reach</span>
          <span className="text-3xl font-black text-rp-blue">{progress}%</span>
        </div>
        
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1">
          <div 
            className="h-full bg-linear-to-r from-rp-blue to-rp-gold rounded-full transition-all duration-1000 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <MetricCard label="Resources Mobilized" value="High" color="text-green-500" />
          <MetricCard label="Timeline Status" value="On Track" color="text-rp-blue" />
          <MetricCard label="Policy Alignment" value="Verified" color="text-rp-gold" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black uppercase ${color}`}>{value}</p>
    </div>
  );
}
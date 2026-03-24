// src/pages/MoUDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const ARTICLES = [
  "Background", "Institutional Profiles", "Definition of Terms", 
  "Partner Description", "Objectives", "Modalities", 
  "Dispute Settlement", "Responsibilities", "Confidentiality", 
  "Funding", "Amendment", "Termination"
];

export default function MoUDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white pt-28 px-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-12">
        <div>
          <span className="text-[10px] font-black text-rp-gold uppercase tracking-[0.3em]">Agreement ID: {id}</span>
          <h1 className="text-4xl font-black text-rp-slate mt-2 tracking-tighter">Strategic Partnership Detail</h1>
        </div>
        <button className="bg-rp-blue text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">
          Download Signed PDF
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Compliance Checklist */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-black uppercase text-rp-slate mb-4">Article Compliance Tracker</h2>
          <div className="grid grid-cols-1 gap-3">
            {ARTICLES.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-rp-blue/20 transition-colors">
                <span className="text-xs font-bold text-gray-700">{index + 1}. {article}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-green-600 uppercase">Verified</span>
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="p-6 bg-rp-slate rounded-[32px] text-white">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">Current Lifecycle</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rp-gold animate-pulse"></div>
                <p className="text-sm font-bold">Step 8: Registration</p>
              </div>
              <p className="text-[10px] text-gray-400">MoU has been signed and is currently being registered into the RPD Database.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
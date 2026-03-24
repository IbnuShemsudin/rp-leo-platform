// src/components/MoUForm.jsx
import React, { useState } from 'react';

export default function MoUForm() {
  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    duration: '',
    fundingStatus: 'Non-funded',
    objectives: '',
    confidentiality: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl border border-gray-100 shadow-2xl">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 bg-rp-gold rounded-xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-rp-slate uppercase tracking-tight">Register New MoU</h2>
          <p className="text-xs font-bold text-rp-gold uppercase tracking-widest mt-1">Institutional Partnership Registry</p>
        </div>
      </div>

      <form className="space-y-8">
        {/* Section 1: Partner Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Partner Institution [Article 4]</label>
            <input 
              name="partnerName"
              type="text" 
              placeholder="e.g. Addis Ababa University"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Country / Region</label>
            <input 
              name="country"
              type="text" 
              placeholder="e.g. Ethiopia"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 2: Objectives & Modalities */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Primary Objectives [Article 5]</label>
          <textarea 
            name="objectives"
            rows="3"
            placeholder="Outline the main goals of this collaboration..."
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Section 3: Financial & Legal [Articles 9 & 10] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Duration [Article 12]</label>
            <input 
              name="duration"
              type="text" 
              placeholder="e.g. 5 Years"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Funding [Article 10]</label>
            <select 
              name="fundingStatus"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate appearance-none"
              onChange={handleChange}
            >
              <option>Non-funded</option>
              <option>Jointly Funded</option>
              <option>External Grant</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confidentiality [Article 9]</label>
            <select 
              name="confidentiality"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue transition-all outline-none font-medium text-rp-slate appearance-none"
              onChange={handleChange}
            >
              <option>Standard</option>
              <option>High (Sensitive Data)</option>
              <option>Open Access</option>
            </select>
          </div>
        </div>

        {/* File Upload for Signed PDF [Step 7] */}
        <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center group hover:border-rp-gold transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-rp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Signed MoU (PDF)</p>
        </div>

        <button className="w-full py-5 bg-rp-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-900/20 hover:bg-rp-slate transition-all active:scale-[0.98]">
          Submit to RPD Database
        </button>
      </form>
    </div>
  );
}
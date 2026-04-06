import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadFile from '../components/UploadFile'; // Import the component we built
import { useNavigate } from 'react-router-dom';

export default function InitiateMoU() {
  const navigate = useNavigate();
  const [uploadedFilename, setUploadedFilename] = useState(''); // Store server filename
  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    sector: 'Satellite Manufacturing',
    description: '',
    expectedDuration: '5 Years'
  });

  const handleUploadSuccess = (filename) => {
    setUploadedFilename(filename);
    console.log("File Linked to Record:", filename);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      documentUrl: uploadedFilename, // Attaching the file reference
      status: 'Pending Validation',
      dateInitiated: new Date()
    };

    console.log("Final Submission Payload:", finalData);

    try {
      // Example API call to save the MoU record
      // const res = await fetch('http://localhost:5000/api/mous/initiate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(finalData)
      // });
      
      navigate('/registry');
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const sectors = [
    'Satellite Manufacturing', 
    'Geospatial Analytics', 
    'Ground Station Ops', 
    'Capacity Building',
    'EA-ROAD Regional'
  ];

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0" />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-[10px] font-black text-rp-blue uppercase tracking-[0.5em] mb-4">Phase 01: Initiation</h1>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              New Partnership <span className="text-rp-gold">Entry</span>
            </h2>
            <p className="text-gray-500 mt-4 text-sm font-medium tracking-wide">
              Enter preliminary details and upload the base agreement to begin the validation workflow.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="glass-panel p-10 rounded-[48px] border border-white/10 space-y-10">
            {/* 1. Basic Info Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Partner Organization</label>
                <input 
                  type="text" required
                  placeholder="e.g. NASA, ESA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-rp-blue transition-all"
                  value={formData.partnerName}
                  onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Origin Country</label>
                <input 
                  type="text" required
                  placeholder="e.g. Ethiopia, USA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-rp-blue transition-all"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            {/* 2. Document Uplink Zone (Phase 8 Integration) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-rp-gold ml-2">Official Contract / Proposal</label>
              <UploadFile onUploadSuccess={handleUploadSuccess} uploadType="mous" />
              {uploadedFilename && (
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest text-center mt-2 animate-pulse">
                   ✓ Document Authenticated & Ready for Drafting
                </p>
              )}
            </div>

            {/* 3. Sector Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Strategic Sector</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sectors.map((sector) => (
                  <button
                    key={sector} type="button"
                    onClick={() => setFormData({...formData, sector})}
                    className={`py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                      formData.sector === sector 
                        ? 'bg-rp-blue border-rp-blue text-white shadow-lg shadow-blue-900/40' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Project Scope Summary</label>
              <textarea 
                rows="3"
                placeholder="Briefly outline the goals of this cooperation..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:border-rp-blue transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                Cancel Process
              </button>
              <button 
                type="submit"
                disabled={!uploadedFilename} // Button disabled until file is uploaded
                className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${
                  uploadedFilename 
                    ? 'bg-rp-gold text-white shadow-amber-900/30 hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                }`}
              >
                {uploadedFilename ? 'Generate Initiation Draft' : 'Waiting for Document...'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
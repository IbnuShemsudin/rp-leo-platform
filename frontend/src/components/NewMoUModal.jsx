// src/components/NewMoUModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function NewMoUModal({ isOpen, onClose, onRefresh }) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    objectives: '',
    fundingType: 'Non-funded',
    duration: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/mou/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Cinematic Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="glass-panel w-full max-w-2xl rounded-[48px] border border-white/10 relative z-10 shadow-3xl animate-in zoom-in slide-in-from-bottom-10 duration-500 my-auto overflow-hidden">
        
        {/* Glowing Decorative Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rp-blue/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-10 pb-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rp-gold animate-pulse shadow-[0_0_8px_#b45309]" />
              <span className="text-[9px] font-black text-rp-gold uppercase tracking-[0.4em]">Registry Uplink</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              Initiate <span className="text-rp-blue italic">Partnership</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4">
              Step {step} of 2: {step === 1 ? 'Institutional Profiling' : 'Operational Scope'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-10 pt-8">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Partner Institution" 
                  placeholder="e.g. NASA, ESA, AAU" 
                  value={formData.partnerName} 
                  onChange={(e) => setFormData({...formData, partnerName: e.target.value})} 
                />
                <Input 
                  label="Country / Region" 
                  placeholder="e.g. Ethiopia" 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} 
                />
              </div>
              <Input 
                label="Primary Objectives" 
                placeholder="Briefly describe the collaborative goals..." 
                isTextArea
                value={formData.objectives} 
                onChange={(e) => setFormData({...formData, objectives: e.target.value})} 
              />
              <button 
                onClick={() => setStep(2)} 
                className="w-full py-5 bg-rp-blue text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-blue-900/30 hover:bg-white hover:text-rp-blue transition-all active:scale-[0.98]"
              >
                Proceed to Operational Details
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Funding Model</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-bold focus:border-rp-blue transition-all appearance-none cursor-pointer"
                      value={formData.fundingType}
                      onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
                    >
                      <option className="bg-rp-slate">Non-funded</option>
                      <option className="bg-rp-slate">Jointly Funded</option>
                      <option className="bg-rp-slate">External Grant</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                  </div>
                </div>
                <Input 
                  label="Duration (Period)" 
                  placeholder="e.g. 5 Years" 
                  value={formData.duration} 
                  onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                />
              </div>
              
              <div className="p-6 bg-rp-blue/5 rounded-3xl border border-rp-blue/20">
                <p className="text-[11px] text-rp-blue/80 font-bold uppercase tracking-wider leading-relaxed">
                  <span className="text-rp-gold">Notice:</span> By submitting this payload, you confirm that Step 1 of the SSGI RPD Workflow has been verified.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-5 bg-white/5 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="flex- py-5 bg-rp-gold text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-orange-900/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                  Transmit to Registry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, placeholder, isTextArea, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">{label}</label>
    {isTextArea ? (
      <textarea 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-bold min-h-[120px] focus:border-rp-blue transition-all placeholder:text-white/5 resize-none" 
      />
    ) : (
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white text-sm font-bold focus:border-rp-blue transition-all placeholder:text-white/5" 
      />
    )}
  </div>
);
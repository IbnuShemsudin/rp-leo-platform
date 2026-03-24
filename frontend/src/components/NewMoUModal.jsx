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
        onRefresh(); // Refresh the dashboard list
        onClose();   // Close modal
      }
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z- flex items-center justify-center bg-rp-slate/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-rp-slate uppercase tracking-tight">Initiate New Partnership</h2>
            <p className="text-[10px] font-black text-rp-gold uppercase tracking-widest mt-1">Workflow Step 1: Initiation & Profiling</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-rp-slate font-bold text-xl">✕</button>
        </div>

        {/* Form Steps */}
        <div className="p-10">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Partner Institution" placeholder="e.g. NASA, ESA, AAU" 
                  value={formData.partnerName} 
                  onChange={(e) => setFormData({...formData, partnerName: e.target.value})} />
                <Input label="Country" placeholder="e.g. Ethiopia" 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
              <Input label="Primary Objectives" placeholder="Briefly describe the collaboration goals..." isTextArea
                value={formData.objectives} 
                onChange={(e) => setFormData({...formData, objectives: e.target.value})} />
              <button onClick={() => setStep(2)} className="w-full py-4 bg-rp-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs">Next Phase</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Funding Model</label>
                  <select 
                    className="bg-gray-50 p-4 rounded-xl outline-none text-sm font-bold border-none"
                    value={formData.fundingType}
                    onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
                  >
                    <option>Non-funded</option>
                    <option>Jointly Funded</option>
                    <option>External Grant</option>
                  </select>
                </div>
                <Input label="Duration" placeholder="e.g. 5 Years" 
                  value={formData.duration} 
                  onChange={(e) => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 italic text-[11px] text-rp-blue font-medium">
                Note: By submitting, you confirm that Step 1 (Initiation) of the SSGI RPD workflow has been completed.
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs">Back</button>
                <button onClick={handleSubmit} className="flex-2 py-4 bg-rp-gold text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-900/20">Submit to Registry</button>
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
    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{label}</label>
    {isTextArea ? (
      <textarea placeholder={placeholder} value={value} onChange={onChange} className="bg-gray-50 p-4 rounded-xl outline-none text-sm font-bold min-h-[100px] border-none focus:ring-2 focus:ring-rp-blue transition-all" />
    ) : (
      <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="bg-gray-50 p-4 rounded-xl outline-none text-sm font-bold border-none focus:ring-2 focus:ring-rp-blue transition-all" />
    )}
  </div>
);
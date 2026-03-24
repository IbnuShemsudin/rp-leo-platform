import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function InitiateMoU() {
  const [step, setStep] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    objective: '',
    focalPointName: '',
    focalPointEmail: '',
    legalReviewStatus: 'Pending',
    draftVersion: '1.0'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mou/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/registry');
      } else {
        alert("Failed to initiate MoU. Please check required fields.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto">
          {/* Progress Tracker */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {.map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${step >= i ? 'bg-rp-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-300'}`}>
                    {i}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${step >= i ? 'text-rp-slate' : 'text-gray-300'}`}>Step {i}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-rp-blue transition-all duration-500" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-slate-200 border border-gray-100">
            {step === 1 && <StepOne data={formData} setData={setFormData} />}
            {step === 2 && <StepTwo data={formData} setData={setFormData} />}
            {step === 3 && <StepThree data={formData} setData={setFormData} />}
            {step >= 4 && step <= 6 && <StepReview step={step} data={formData} />}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-gray-50">
              {step > 1 && (
                <button onClick={prevStep} className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all">
                  Previous Phase
                </button>
              )}
              {step < 6 ? (
                <button onClick={nextStep} className="flex-1 py-5 bg-rp-slate text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rp-blue transition-all shadow-xl shadow-slate-200">
                  Continue to Step {step + 1}
                </button>
              ) : (
                <button onClick={handleSubmit} className="flex-1 py-5 bg-rp-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rp-slate transition-all shadow-xl shadow-blue-200">
                  Finalize Draft & Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner code
const StepOne = ({ data, setData }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <h2 className="text-xl font-black text-rp-slate uppercase tracking-tight">Step 1: Initiation</h2>
    <div className="space-y-4">
      <Input label="Partner Institution" value={data.partnerName} onChange={(e) => setData({...data, partnerName: e.target.value})} />
      <Input label="Country of Origin" value={data.country} onChange={(e) => setData({...data, country: e.target.value})} />
    </div>
  </div>
);

const StepTwo = ({ data, setData }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <h2 className="text-xl font-black text-rp-slate uppercase tracking-tight">Step 2: Technical Objective</h2>
    <textarea 
      className="w-full p-6 bg-gray-50 rounded-2xl border-none h-40 font-bold text-rp-slate outline-none focus:ring-2 focus:ring-rp-blue"
      placeholder="Describe the primary goal of this partnership..."
      value={data.objective}
      onChange={(e) => setData({...data, objective: e.target.value})}
    />
  </div>
);

const StepThree = ({ data, setData }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <h2 className="text-xl font-black text-rp-slate uppercase tracking-tight">Step 3: Focal Points</h2>
    <Input label="Full Name" value={data.focalPointName} onChange={(e) => setData({...data, focalPointName: e.target.value})} />
    <Input label="Official Email" value={data.focalPointEmail} onChange={(e) => setData({...data, focalPointEmail: e.target.value})} />
  </div>
);

const StepReview = ({ step, data }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center py-10">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full mb-4">
      <span className="text-3xl">📄</span>
    </div>
    <h2 className="text-xl font-black text-rp-slate uppercase tracking-tight">Step {step}: Workflow Internal</h2>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
      This phase involves internal SSGI {step === 4 ? 'Legal Review' : step === 5 ? 'Security Clearance' : 'Final Editorial'}. 
      Click continue to progress.
    </p>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    <input className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-rp-slate focus:ring-2 focus:ring-rp-blue transition-all" value={value} onChange={onChange} />
  </div>
);
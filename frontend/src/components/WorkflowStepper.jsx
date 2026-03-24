// src/components/WorkflowStepper.jsx
import React from 'react';

const STEPS = [
  { id: 1, title: "Initiation", desc: "Explore via department or executive level" }, // [cite: 62]
  { id: 2, title: "Identification", desc: "Identify level of partnership" }, // [cite: 79]
  { id: 3, title: "Alignment", desc: "Check alignment with SSGI focus areas" }, // 
  { id: 4, title: "Endorsement", desc: "Need high-level executive approval" }, // [cite: 96, 110]
  { id: 5, title: "Content Development", desc: "Consult with legal and departments" }, // [cite: 93, 98]
  { id: 6, title: "Finalization", desc: "DG approval and final MoU prep" }, // [cite: 83]
  { id: 7, title: "Signing", desc: "Physical or Virtual ceremony" }, // [cite: 85, 87]
  { id: 8, title: "Registration", desc: "Enter into RPD Database" }, // 
  { id: 9, title: "Action Plan", desc: "Both partners prepare implementation plan" }, // [cite: 101]
  { id: 10, title: "Audit & Report", desc: "Monitor and report to DG" } // [cite: 102, 106]
];

export default function WorkflowStepper({ currentStep = 1 }) {
  return (
    <div className="py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-xl">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-black text-rp-slate uppercase tracking-widest">
          Partnership <span className="text-rp-blue">Lifecycle</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">RP-LEO Standard Operating Procedure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative group">
              {/* Connector Line (Desktop) */}
              {index !== STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-gray-100 -z-10">
                  <div 
                    className={`h-full bg-rp-blue transition-all duration-700 ${isCompleted ? 'w-full' : 'w-0'}`} 
                  />
                </div>
              )}

              <div className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-blue-50/50 scale-105 shadow-sm' : ''
              }`}>
                {/* Step Circle */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted ? 'bg-rp-blue border-rp-blue text-white' : 
                  isActive ? 'bg-white border-rp-gold text-rp-gold shadow-lg rotate-3' : 
                  'bg-white border-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xl font-black">{step.id}</span>
                  )}
                </div>

                {/* Step Content */}
                <h3 className={`mt-4 text-xs font-black uppercase tracking-tighter ${
                  isActive ? 'text-rp-blue' : 'text-rp-slate'
                }`}>
                  {step.title}
                </h3>
                <p className="mt-2 text-[10px] leading-tight text-gray-400 font-medium px-2">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
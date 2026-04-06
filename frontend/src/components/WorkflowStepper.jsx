import React from 'react';

const STEPS = [
  { id: 1, title: "Initiation", desc: "Explore via department or executive level" },
  { id: 2, title: "Identification", desc: "Identify level of partnership" },
  { id: 3, title: "Alignment", desc: "Check alignment with SSGI focus areas" },
  { id: 4, title: "Endorsement", desc: "Need high-level executive approval" },
  { id: 5, title: "Content Development", desc: "Consult with legal and departments" },
  { id: 6, title: "Finalization", desc: "DG approval and final MoU prep" },
  { id: 7, title: "Signing", desc: "Physical or Virtual ceremony" },
  { id: 8, title: "Registration", desc: "Enter into RPD Database" },
  { id: 9, title: "Action Plan", desc: "Both partners prepare implementation plan" },
  { id: 10, title: "Audit & Report", desc: "Monitor and report to DG" }
];

export default function WorkflowStepper({ currentStep = 1 }) {
  return (
    <div className="py-16 px-8 glass-panel rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rp-blue/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>

      <div className="mb-16 text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
          Partnership <span className="text-rp-blue">Lifecycle</span>
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-[1px] w-12 bg-rp-gold/30"></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">RP-LEO Standard Operating Procedure</p>
          <div className="h-[1px] w-12 bg-rp-gold/30"></div>
        </div>
      </div>

      {/* Grid container: 5 columns on large screens to split the 10 steps into 2 clean rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-8 relative">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative group">
              
              {/* Connector Line (Desktop Logic) */}
              {index !== STEPS.length - 1 && (
                <div className={`hidden lg:block absolute top-10 left-1/2 w-full h-[1px] -z-10 ${
                  (index + 1) % 5 === 0 ? 'hidden' : ''
                }`}>
                  <div className="w-full h-full bg-white/5 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-rp-blue to-rp-gold transition-all duration-1000 ease-in-out" 
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}

              <div className={`flex flex-col items-center text-center transition-all duration-500 ${
                isActive ? 'scale-110' : ''
              }`}>
                {/* Step Icon/Number */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border transition-all duration-700 relative ${
                  isCompleted ? 'bg-rp-blue border-rp-blue shadow-[0_0_20px_rgba(30,58,138,0.4)]' : 
                  isActive ? 'bg-white border-rp-gold shadow-[0_0_25px_rgba(180,83,9,0.3)] rotate-6' : 
                  'bg-white/5 border-white/10 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <svg className="w-10 h-10 text-white animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-2xl font-black ${isActive ? 'text-rp-gold' : 'text-gray-500'}`}>
                      {step.id < 10 ? `0${step.id}` : step.id}
                    </span>
                  )}
                  
                  {/* Active Pulse effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-3xl border border-rp-gold animate-ping opacity-20"></div>
                  )}
                </div>

                {/* Text Content */}
                <div className="mt-6 space-y-2">
                  <h3 className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                    isActive ? 'text-rp-gold' : isCompleted ? 'text-rp-blue' : 'text-white'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-gray-500 font-medium px-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
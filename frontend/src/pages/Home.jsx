import React from 'react';
import Navbar from '../components/Navbar';
import WorkflowStepper from '../components/WorkflowStepper';

// Internal Sub-component: FocusCard
const FocusCard = ({ title, desc }) => (
  <div className="space-y-4 group p-6 rounded-2xl hover:bg-white/5 transition-colors">
    <div className="w-12 h-1 bg-rp-gold group-hover:w-24 transition-all duration-500"></div>
    <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

// Internal Sub-component: StatSection
const StatSection = () => {
  const stats = [
    { label: "Active MoUs", value: "120+", icon: "📄" },
    { label: "Global Partners", value: "45", icon: "🌍" },
    { label: "Regional Reach", value: "EA-ROAD", icon: "📡" },
    { label: "Growth Models", value: "10+", icon: "📈" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-gray-50 hover:border-rp-gold hover:shadow-2xl transition-all duration-500">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-black text-rp-blue tracking-tighter group-hover:scale-110 transition-transform origin-left">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Internal Sub-component: RegionalFocus
const RegionalFocus = () => (
  <section className="py-24 overflow-hidden bg-gray-50/50">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="aspect-square rounded-full border-2 border-dashed border-blue-100 animate-[spin_60s_linear_infinite] p-12">
          <div className="w-full h-full rounded-full bg-linear-to-tr from-rp-blue/5 to-rp-gold/10 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center rotate-12">
              <span className="text-rp-blue font-black text-xl tracking-tighter">EA-ROAD</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-4xl font-black text-rp-slate uppercase tracking-tighter">
          Regional Integration & <br />
          <span className="text-rp-gold">Coordination</span>
        </h2>
        <p className="text-gray-500 font-medium leading-relaxed max-w-xl">
          Coordinating the East Africa Regional Office of Astronomy for Development (EA-ROAD). 
          We manage regional projects and resource mobilization to bridge geospatial gaps.
        </p>
      </div>
    </div>
  </section>
);

// MAIN COMPONENT EXPORT
export default function Home() {
  return (
    <div className="min-h-screen bg-white geospatial-grid">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/30 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rp-blue">
                Space Science & Geospatial Institute
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-rp-slate leading-[0.9] tracking-tighter">
              Connecting <br />
              <span className="text-rp-blue">Space & Geo</span> <br />
              Sector Goals.
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
              Fostering collaborative growth models with national, regional, and 
              international industry players to enhance Ethiopia's development.
            </p>
            <div className="flex gap-4">
              <button className="bg-rp-blue text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-900/30 hover:bg-rp-slate transition-all">
                Registry Portal
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-square bg-linear-to-tr from-rp-blue to-blue-400 rounded-[40px] rotate-3 shadow-2xl flex items-center justify-center p-8 overflow-hidden">
              <span className="text-8xl font-black opacity-20 italic text-white">SSGI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <StatSection />

      {/* 3. CORE FOCUS AREAS */}
      <section className="py-24 bg-rp-slate text-white rounded-[60px] mx-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FocusCard 
              title="Strategic Collaboration" 
              desc="Facilitating strategic collaborations at national, regional, and international levels." 
            />
            <FocusCard 
              title="M&E Management" 
              desc="Overseeing, monitoring, and evaluating signed MoUs and tracking implementations." 
            />
            <FocusCard 
              title="Research & Policy" 
              desc="Conducting research on Space Science sectors and identifying regional integration gaps." 
            />
          </div>
        </div>
      </section>

      {/* 4. REGIONAL FOCUS */}
      <RegionalFocus />

      {/* 5. THE WORKFLOW */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <WorkflowStepper currentStep={2} />
      </section>

      {/* 6. CTA FOOTER */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-rp-gold p-12 rounded-[40px] text-center text-white shadow-2xl shadow-orange-900/20">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Ready to Collaborate?</h2>
          <button className="bg-white text-rp-gold px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-rp-slate hover:text-white transition-all">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
}
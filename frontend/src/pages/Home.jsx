import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import WorkflowStepper from '../components/WorkflowStepper';
import ContactModal from '../components/ContactModal'; // Import the new modal component
import { Link } from 'react-router-dom';

// Internal Sub-component: FocusCard (Dark Themed)
const FocusCard = ({ title, desc }) => (
  <div className="space-y-4 group p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-rp-blue/50 transition-all duration-500 hover:bg-white/[0.07]">
    <div className="w-12 h-1 bg-rp-gold group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_#b45309]"></div>
    <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

// Internal Sub-component: StatSection (Glassmorphism)
const StatSection = () => {
  const stats = [
    { label: "Active MoUs", value: "120+", icon: "📄" },
    { label: "Global Partners", value: "45", icon: "🌍" },
    { label: "Regional Reach", value: "EA-ROAD", icon: "📡" },
    { label: "Growth Models", value: "10+", icon: "📈" },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel group p-8 rounded-[40px] border border-white/5 hover:border-rp-gold/30 hover:shadow-[0_0_30px_rgba(180,83,9,0.1)] transition-all duration-500 text-center lg:text-left">
              <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
              <div className="text-4xl font-black text-white tracking-tighter group-hover:text-rp-blue transition-colors">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Internal Sub-component: RegionalFocus (Orbit Animation)
const RegionalFocus = () => (
  <section className="py-24 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative order-2 lg:order-1">
        <div className="aspect-square rounded-full border border-white/10 animate-[spin_60s_linear_infinite] p-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-rp-blue rounded-full shadow-[0_0_15px_#1e3a8a]"></div>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-rp-blue/10 to-rp-gold/5 flex items-center justify-center backdrop-blur-3xl">
            <div className="glass-panel w-40 h-40 rounded-[40px] shadow-2xl flex items-center justify-center rotate-12 border border-white/20">
              <span className="text-rp-blue font-black text-2xl tracking-tighter">EA-ROAD</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 order-1 lg:order-2">
        <div className="w-20 h-1 bg-rp-blue mb-8"></div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
          Regional <span className="text-rp-blue text-outline">Integration</span> <br />
          & <span className="text-rp-gold">Coordination</span>
        </h2>
        <p className="text-gray-400 font-medium leading-relaxed max-w-xl text-lg">
          Coordinating the East Africa Regional Office of Astronomy for Development (EA-ROAD). 
          We bridge geospatial gaps through resource mobilization and inter-continental synergy.
        </p>
      </div>
    </div>
  </section>
);

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 selection:bg-rp-gold selection:text-white transition-colors duration-500 relative">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-56 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 animate-fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rp-blue animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Space Science & Geospatial Institute
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
              Connecting <br />
              <span className="text-rp-blue">Space & Geo</span> <br />
              Sector Goals.
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
              Fostering collaborative growth models with national and international 
              industry players to enhance Ethiopia's technological development.
            </p>
            
            <div className="flex gap-6 pt-4">
              <Link to="/login" className="bg-rp-blue text-white px-12 py-5 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-900/40 hover:bg-white hover:text-rp-blue transition-all active:scale-95">
                Registry Portal
              </Link>
              <button 
                onClick={() => document.getElementById('about-rpd').scrollIntoView({ behavior: 'smooth' })}
                className="border border-white/10 text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in zoom-in duration-1000">
            <div className="aspect-square bg-gradient-to-tr from-rp-blue/40 to-blue-600/10 rounded-[80px] rotate-6 shadow-3xl border border-white/10 flex items-center justify-center p-12 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 geospatial-grid"></div>
                <span className="text-9xl font-black italic text-white/10 select-none">SSGI</span>
                <div className="absolute bottom-10 right-10 flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-rp-gold"></div>
                   <div className="w-2 h-2 rounded-full bg-rp-blue"></div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <StatSection />

      {/* 3. CORE FOCUS AREAS */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FocusCard 
              title="Strategic Collaboration" 
              desc="Facilitating strategic collaborations at national, regional, and international levels to align with Ethiopian developmental goals." 
            />
            <FocusCard 
              title="M&E Management" 
              desc="Overseeing, monitoring, and evaluating signed MoUs and tracking implementations through rigorous geospatial benchmarks." 
            />
            <FocusCard 
              title="Research & Policy" 
              desc="Conducting research on Space Science sectors and identifying regional integration gaps within the East African block." 
            />
          </div>
        </div>
      </section>

      {/* 4. REGIONAL FOCUS */}
      <RegionalFocus />

      {/* 4.5. THE MANDATE (NEW ABOUT SECTION) */}
      <section id="about-rpd" className="py-32 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-[10px] font-black text-rp-blue uppercase tracking-[0.5em] mb-4 text-glow">The Mandate</h2>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                Advancing <span className="text-rp-gold">National</span> <br />
                Technological Sovereignty.
              </h3>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed text-lg">
              The Regional Partnership Division (RPD) acts as the strategic bridge between SSGI and the global space industry, ensuring every partnership translates into tangible growth for Ethiopia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:border-rp-blue/30 transition-colors">
                <span className="text-rp-blue font-black text-xs uppercase tracking-widest">01. Synergy</span>
                <p className="text-[11px] text-gray-500 font-bold mt-2 uppercase tracking-wider">Aligning international standards with local capacity.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:border-rp-gold/30 transition-colors">
                <span className="text-rp-gold font-black text-xs uppercase tracking-widest">02. Oversight</span>
                <p className="text-[11px] text-gray-500 font-bold mt-2 uppercase tracking-wider">Ensuring 100% compliance with signed bilateral MoUs.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-12 rounded-[60px] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8"><div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div></div>
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Strategic Pillars</h4>
              <ul className="space-y-5">
                {['Space Policy Alignment', 'Knowledge Exchange', 'Regional Resource Mobilization'].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-rp-gold' : 'bg-rp-blue'}`}></span> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE WORKFLOW */}
      <section className="py-32 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-rp-gold uppercase tracking-[0.5em] mb-4">Standard Operating Procedure</h2>
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Partnership Lifecycle</h3>
        </div>
        <WorkflowStepper currentStep={1} />
      </section>

      {/* 6. CTA FOOTER */}
      <section className="pb-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto glass-panel p-16 rounded-[60px] text-center border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rp-blue/20 rounded-full blur-3xl"></div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">Ready to <span className="text-rp-gold">Collaborate?</span></h2>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="bg-rp-gold text-white px-14 py-6 rounded-[24px] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-amber-900/20 relative z-10"
          >
            Contact RPD Division
          </button>
        </div>
      </section>

      {/* MODAL COMPONENT */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
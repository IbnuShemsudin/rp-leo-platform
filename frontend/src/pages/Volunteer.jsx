// src/pages/Volunteer.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const PROGRAMS = [
  { 
    title: "Space Ambassadors", 
    icon: "🚀",
    desc: "Represent SSGI in universities and schools to promote astronomy and geospatial awareness." 
  },
  { 
    title: "Technical Internships", 
    icon: "💻",
    desc: "Work alongside our Full-stack developers and Space scientists on real-world projects." 
  },
  { 
    title: "Regional Outreach", 
    icon: "🌍",
    desc: "Travel with the EA-ROAD team to coordinate events across the 11 member nations." 
  }
];

export default function Volunteer() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. VIBRANT HERO */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-gold/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-7xl font-black text-rp-slate leading-none tracking-tighter mb-8">
            Inspiring the Next <br />
            <span className="text-rp-blue">Generation of Explorers.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The RP-LEO Youth & Volunteer program is the bridge between academic 
            curiosity and professional space science excellence.
          </p>
        </div>
      </section>

      {/* 2. PROGRAM GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {PROGRAMS.map((prog, i) => (
            <div key={i} className="group p-10 rounded-[40px] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-rp-blue/10 transition-all duration-500">
              <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500 inline-block">{prog.icon}</div>
              <h3 className="text-xl font-black text-rp-slate uppercase tracking-tight mb-4">{prog.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{prog.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. APPLICATION FORM (Simplified) */}
      <section className="py-24 bg-rp-slate mx-4 rounded-[60px] text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Join the Movement</h2>
            <p className="text-gray-400 font-medium">Submit your profile to be considered for our 2026 cohorts.</p>
          </div>

          <form className="grid sm:grid-cols-2 gap-6">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-rp-gold transition-all font-medium"
            />
            <input 
              type="email" 
              placeholder="Official Email" 
              className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-rp-gold transition-all font-medium"
            />
            <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-rp-gold transition-all font-medium sm:col-span-2 appearance-none">
              <option className="text-black">Select Program of Interest</option>
              {PROGRAMS.map(p => <option key={p.title} className="text-black">{p.title}</option>)}
            </select>
            <button className="sm:col-span-2 bg-rp-gold text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-rp-gold transition-all shadow-xl shadow-orange-900/20">
              Submit Application
            </button>
          </form>
        </div>
      </section>

      <footer className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
        Regional Partnership Lead Executive Office &copy; 2026
      </footer>
    </div>
  );
}
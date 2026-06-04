import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const PROGRAMS = [
  { 
    title: "Space Ambassadors", 
    icon: "🚀",
    color: "from-blue-500/20 to-transparent",
    desc: "Represent SSGI in universities and schools to promote astronomy and geospatial awareness." 
  },
  { 
    title: "Technical Internships", 
    icon: "💻",
    color: "from-rp-gold/20 to-transparent",
    desc: "Work alongside our Full-stack developers and Space scientists on real-world projects." 
  },
  { 
    title: "Regional Outreach", 
    icon: "🌍",
    color: "from-emerald-500/20 to-transparent",
    desc: "Travel with the EA-ROAD team to coordinate events across the 11 member nations." 
  }
];

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0].title);
  const [formData, setFormData] = useState({ name: '', email: '', program: PROGRAMS[0].title });

  const handleApply = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Add API logic here later
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProgramSelect = (title) => {
    setSelectedProgram(title);
    setFormData((prev) => ({ ...prev, program: title }));
  };

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative selection:bg-rp-blue/30">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0" />

      {/* 1. CINEMATIC HERO */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rp-blue/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rp-gold/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black text-rp-gold uppercase tracking-[0.5em] mb-6 block">
            Cohort 2026 Now Open
          </span>
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase">
            Inspiring the Next <br />
            <span className="text-rp-blue italic">Explorers.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
            The RP-LEO Youth program is the bridge between academic 
            curiosity and professional space science excellence. Join the SSGI mission today.
          </p>
        </div>
      </section>

      {/* 2. PROGRAM GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {PROGRAMS.map((prog, i) => {
            const isSelected = prog.title === selectedProgram;
            return (
              <button
                key={prog.title}
                type="button"
                onClick={() => handleProgramSelect(prog.title)}
                aria-pressed={isSelected}
                className={`group p-12 rounded-[48px] glass-panel border transition-all duration-700 relative overflow-hidden text-left ${isSelected ? 'border-rp-gold/60 bg-rp-gold/10 shadow-rp-gold/10' : 'border-white/10 hover:border-rp-blue/50 hover:bg-white/5'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${prog.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-8 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 inline-block drop-shadow-2xl">
                    {prog.icon}
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-tight mb-4 transition-colors ${isSelected ? 'text-rp-gold' : 'text-white'}`}>
                    {prog.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100">
                    {prog.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. APPLICATION PORTAL */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="glass-panel p-12 lg:p-20 rounded-[64px] border border-white/10 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl pointer-events-none">🛰️</div>
          
          <div className="max-w-2xl mx-auto relative z-10">
            {submitted ? (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg shadow-emerald-500/20">✓</div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Transmission Received</h2>
                <p className="text-gray-500 mt-4 font-bold uppercase text-[10px] tracking-[0.2em]">Your application for <span className="text-white">{formData.program}</span> has been received.</p>
                <p className="text-gray-500 mt-4 font-bold uppercase text-[10px] tracking-[0.2em]">Our recruitment officer will contact you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-[10px] font-black text-rp-gold uppercase tracking-widest hover:underline"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Join the Movement</h2>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Official 2026 Intake Portal</p>
                </div>

                <form onSubmit={handleApply} className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Full Legal Name</label>
                    <input 
                      type="text" required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Abdurezak Shemsu" 
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-rp-blue transition-all font-bold text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Institutional Email</label>
                    <input 
                      type="email" required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="university@email.com" 
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-rp-blue transition-all font-bold text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Specialization Track</label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-rp-blue transition-all font-bold text-sm text-white appearance-none cursor-pointer"
                    >
                      {PROGRAMS.map((p) => (
                        <option key={p.title} value={p.title} className="bg-rp-slate">{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <button className="sm:col-span-2 bg-rp-blue text-white py-6 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rp-gold hover:text-white transition-all shadow-2xl shadow-blue-900/40 active:scale-95">
                    Launch Application
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="py-20 text-center">
         <div className="h-[1px] w-12 bg-white/10 mx-auto mb-8" />
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600">
            Regional Partnership Lead Executive Office &copy; 2026
         </p>
      </footer>
    </div>
  );
}
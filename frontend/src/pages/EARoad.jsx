import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const REGIONAL_GOALS = [
  { title: "Building Capacity", desc: "Training the next generation of East African scientists and engineers through specialized workshops." },
  { title: "Resource Mobilization", desc: "Securing international grants and funding for regional space projects and infrastructure." },
  { title: "Science Diplomacy", desc: "Strengthening ties between the 11 member nations through shared satellite data and research." },
  { title: "Public Outreach", desc: "Using space science to inspire youth and promote STEM education across the region." }
];

const MEMBER_STATES = [
  'Ethiopia', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 
  'Burundi', 'Seychelles', 'South Sudan', 'Djibouti', 'Eritrea', 'Somalia'
];

export default function EARoad() {
  const navigate = useNavigate();
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [marqueePaused, setMarqueePaused] = useState(false);

  // Array for the 11 orbital nodes (360 degrees / 11 countries)
  const nodeRotations = Array.from({ length: 11 }, (_, i) => (i * (360 / 11)));
  const selectedGoal = REGIONAL_GOALS[activeGoalIndex];
  const activeCountry = MEMBER_STATES[activeCountryIndex];

  const goToInitiate = () => {
    navigate('/initiate', { state: { focus: selectedGoal.title, country: activeCountry } });
  };

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0" />

      {/* 1. REGIONAL HERO */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rp-blue/20 rounded-full blur-[120px] -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-block px-4 py-1 bg-rp-blue/10 border border-rp-blue/20 rounded-full mb-8 animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rp-gold">International Coordination Hub</span>
          </div>
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10 uppercase">
            EA <span className="text-rp-gold">-</span> ROAD
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium tracking-wide">
            The East Africa Regional Office of Astronomy for Development leads 11 nations 
            in leveraging space science as a strategic tool for regional socio-economic progress.
          </p>
        </div>
      </section>

      {/* 2. THE REGIONAL NETWORK VISUAL */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative group flex justify-center">
          <div className="aspect-square w-full max-w-lg glass-panel rounded-[60px] flex items-center justify-center p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none geospatial-grid"></div>
            
            {/* Spinning Orbit */}
            <div className="w-full h-full border-2 border-dashed border-rp-blue/30 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
              <div className="w-48 h-48 glass-panel rounded-3xl shadow-3xl flex items-center justify-center -rotate-12 border border-rp-blue/40 bg-rp-blue/10">
                 <span className="text-white font-black text-2xl tracking-tighter uppercase text-center">East <br/> Africa</span>
              </div>
            </div>

            {/* Country Nodes (Fixed the .map error here) */}
            {nodeRotations.map((rotate, i) => {
              const isActive = i === activeCountryIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveCountryIndex(i)}
                  aria-label={`Select ${MEMBER_STATES[i]}`}
                  className={`absolute w-3 h-3 rounded-full shadow-[0_0_20px_#b45309] transition-transform duration-500 ${isActive ? 'bg-rp-gold scale-125' : 'bg-rp-gold/70 group-hover:scale-150'}`}
                  style={{ transform: `rotate(${rotate}deg) translateY(-140px)` }}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-xs font-black text-rp-gold uppercase tracking-[0.4em] mb-4">Our Mission</h2>
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
              Strategic Focus <br/> & Regional Impact
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {REGIONAL_GOALS.map((goal, i) => {
                const isSelected = i === activeGoalIndex;
                return (
                  <button
                    key={goal.title}
                    type="button"
                    onClick={() => setActiveGoalIndex(i)}
                    className={`text-left p-8 rounded-[32px] glass-panel border transition-all duration-500 group ${isSelected ? 'border-rp-gold/70 bg-rp-gold/10 shadow-rp-gold/10' : 'border-white/5 hover:border-rp-blue/40 hover:bg-white/5'}`}
                  >
                    <div className="w-8 h-8 bg-rp-blue/10 rounded-xl flex items-center justify-center text-[10px] text-rp-blue font-black mb-4 transition-all duration-500 group-hover:bg-rp-blue group-hover:text-white">
                      0{i + 1}
                    </div>
                    <h4 className="text-xs font-black uppercase text-white mb-3 tracking-widest">{goal.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                      {goal.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-white/5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.5em] text-rp-gold mb-4">Selected Insight</p>
            <h3 className="text-4xl font-black text-white mb-6">{selectedGoal.title}</h3>
            <p className="text-gray-300 leading-relaxed mb-6">{selectedGoal.desc}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-2 rounded-full bg-rp-blue/10 border border-rp-blue/20 text-[10px] uppercase tracking-[0.25em] text-rp-blue font-black">{selectedGoal.title}</span>
              <span className="px-3 py-2 rounded-full bg-rp-gold/10 border border-rp-gold/20 text-[10px] uppercase tracking-[0.25em] text-rp-gold font-black">{activeCountry}</span>
            </div>
            <button
              type="button"
              onClick={goToInitiate}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-rp-gold/20 bg-rp-gold/10 text-rp-gold text-[10px] uppercase tracking-[0.2em] font-black hover:bg-rp-gold hover:text-slate-950 transition-all"
            >
              Join EA-ROAD
              <span className="text-xl">→</span>
            </button>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-white/5 backdrop-blur-xl">
            <h4 className="text-3xl font-black text-white mb-4">Regional Pulse</h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">Tap any orbital node to highlight a member state. The ticker can also be paused for easier reading.</p>
            <div className="space-y-4">
              <div className="rounded-3xl border border-rp-blue/20 bg-rp-blue/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-rp-blue mb-2">Current state</p>
                <p className="font-black text-white text-xl">{activeCountry}</p>
                <p className="text-gray-300">Selected from the orbital network for deeper regional context.</p>
              </div>
              <button
                type="button"
                onClick={() => setMarqueePaused((prev) => !prev)}
                className="w-full py-4 rounded-2xl border border-white/10 text-[10px] uppercase tracking-[0.2em] font-black text-white bg-white/5 hover:bg-white/10 transition-all"
              >
                {marqueePaused ? 'Resume Marquee' : 'Pause Marquee'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEMBER STATES TICKER (Cinematic Marquee) */}
      <section className="py-24 bg-rp-blue relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="whitespace-nowrap flex animate-marquee gap-24" style={{ animationPlayState: marqueePaused ? 'paused' : 'running' }}>
          {[...MEMBER_STATES, ...MEMBER_STATES].map((country, i) => (
            <span 
              key={i} 
              className="text-white/20 text-5xl font-black uppercase tracking-[0.2em] italic hover:text-white/80 transition-colors cursor-default"
            >
              {country}
            </span>
          ))}
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
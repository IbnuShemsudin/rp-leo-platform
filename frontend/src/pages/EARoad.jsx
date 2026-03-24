// src/pages/EARoad.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const REGIONAL_GOALS = [
  { title: "Building Capacity", desc: "Training the next generation of East African scientists and engineers." },
  { title: "Resource Mobilization", desc: "Securing international grants and funding for regional space projects." },
  { title: "Science Diplomacy", desc: "Strengthening ties between the 11 member nations through shared data." },
  { title: "Public Outreach", desc: "Using space science to inspire youth and promote STEM education." }
];

export default function EARoad() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. REGIONAL HERO */}
      <section className="pt-40 pb-20 bg-rp-slate text-white rounded-b-[80px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rp-blue/10 rounded-full blur-[120px] -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-block px-4 py-1 bg-white/10 border border-white/20 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rp-gold">International Coordination</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
            EA <span className="text-rp-gold">-</span> ROAD
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed font-medium">
            The East Africa Regional Office of Astronomy for Development leads 11 nations 
            in leveraging space science as a tool for regional progress.
          </p>
        </div>
      </section>

      {/* 2. THE REGIONAL MAP / MISSION */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          {/* Visualizing the "Networking" concept */}
          <div className="aspect-square bg-gray-50 rounded-[60px] flex items-center justify-center p-12 border border-gray-100 shadow-inner relative">
            <div className="absolute inset-0 opacity-10 geospatial-grid"></div>
            <div className="w-full h-full border-2 border-dashed border-rp-blue/20 rounded-full animate-[spin_100s_linear_infinite] flex items-center justify-center">
              <div className="w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center -rotate-12 border border-blue-50">
                 <span className="text-rp-blue font-black text-2xl">EAST AFRICA</span>
              </div>
            </div>
            {/* Country Nodes Mockup */}
            {.map((rotate, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 bg-rp-gold rounded-full shadow-[0_0_15px_rgba(180,83,9,0.5)]"
                style={{ transform: `rotate(${rotate}deg) translateY(-120px)` }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-black text-rp-slate uppercase tracking-tight mb-6">Strategic Focus Areas</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {REGIONAL_GOALS.map((goal, i) => (
                <div key={i} className="p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all border border-transparent hover:border-blue-100">
                  <h4 className="text-xs font-black uppercase text-rp-blue mb-2 tracking-wider">{goal.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEMBER STATES TICKET */}
      <section className="py-20 bg-rp-blue overflow-hidden">
        <div className="whitespace-nowrap flex animate-marquee gap-20">
          {['Ethiopia', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Seychelles', 'Sudan', 'Djibouti', 'Eritrea', 'Somalia'].map((country, i) => (
            <span key={i} className="text-white/40 text-4xl font-black uppercase tracking-widest italic">{country}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
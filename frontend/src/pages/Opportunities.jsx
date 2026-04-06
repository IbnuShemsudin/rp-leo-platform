import React from 'react';
import Navbar from '../components/Navbar';

const SECTORS = [
  {
    id: 'SAT-01',
    title: 'Satellite Manufacturing',
    focus: 'CubeSat & NanoSat Development',
    status: 'High Priority',
    description: 'Seeking partners for local assembly, integration, and testing (AIT) facilities to bolster Ethiopia’s indigenous space capabilities.',
    tags: ['AIT', 'Hardware', 'Hardware Transfer']
  },
  {
    id: 'GEO-02',
    title: 'Geospatial Analytics',
    focus: 'AI-Driven Earth Observation',
    status: 'Open for Proposals',
    description: 'Collaborating on deep-learning models for agricultural yield prediction, urban planning, and disaster management using Sentinel-2 data.',
    tags: ['Big Data', 'Machine Learning', 'Agriculture']
  },
  {
    id: 'AST-03',
    title: 'Observatory Operations',
    focus: 'Entoto Radio Astronomy',
    status: 'Strategic Research',
    description: 'Development of VLBI (Very Long Baseline Interferometry) capabilities in coordination with the EA-ROAD regional network.',
    tags: ['Radio Astronomy', 'EA-ROAD', 'Deep Space']
  },
  {
    id: 'EDU-04',
    title: 'Capacity Building',
    focus: 'Post-Doc & Technical Training',
    status: 'Continuous',
    description: 'Joint PhD programs and technical certifications in Space Engineering and Remote Sensing for African scholars.',
    tags: ['Education', 'STEM', 'Fellowships']
  }
];

export default function Opportunities() {
  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative">
      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 animate-fade-up">
            <h1 className="text-[10px] font-black text-rp-blue uppercase tracking-[0.5em] mb-4">Investment & Cooperation</h1>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter">
              Strategic <span className="text-rp-gold">Sectors</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-2xl font-medium leading-relaxed">
              SSGI identifies critical gaps in the regional aerospace landscape. We invite 
              international industry leaders and research institutions to join these high-impact initiatives.
            </p>
          </header>

          {/* Sector Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {SECTORS.map((sector) => (
              <div key={sector.id} className="glass-panel p-10 rounded-[48px] border border-white/5 hover:border-rp-blue/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[10px] font-black text-white/10 group-hover:text-rp-blue/20 transition-colors">
                  {sector.id}
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${sector.status === 'High Priority' ? 'bg-rp-gold animate-pulse' : 'bg-rp-blue'}`}></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{sector.status}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white group-hover:text-rp-gold transition-colors">{sector.title}</h3>
                    <p className="text-rp-blue text-xs font-black uppercase tracking-widest">{sector.focus}</p>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {sector.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {sector.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase text-gray-500 group-hover:text-white group-hover:border-white/10 transition-all">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-4 rounded-2xl border border-rp-blue/20 text-rp-blue text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rp-blue hover:text-white transition-all">
                    Request Technical Brief
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Data Request Section */}
          <section className="mt-20 p-12 glass-panel rounded-[60px] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Looking for Raw Data?</h4>
              <p className="text-gray-400 text-sm max-w-md">Access our open-source geospatial repositories or request high-resolution multispectral imagery for research purposes.</p>
            </div>
            <button className="bg-white text-rp-slate px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rp-gold hover:text-white transition-all whitespace-nowrap">
              Access Data Portal
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Rocket, Globe, Radio, GraduationCap, TrendingUp, FileText, ArrowRight, Activity, Shield, Zap } from 'lucide-react';

const SECTORS = [
  {
    id: 'SAT-01',
    title: 'Satellite Manufacturing',
    focus: 'CubeSat & NanoSat Development',
    status: 'High Priority',
    description: 'Seeking partners for local assembly, integration, and testing (AIT) facilities to bolster Ethiopia’s indigenous space capabilities.',
    tags: ['AIT', 'Hardware', 'Hardware Transfer'],
    icon: Rocket,
    color: 'text-rp-gold'
  },
  {
    id: 'GEO-02',
    title: 'Geospatial Analytics',
    focus: 'AI-Driven Earth Observation',
    status: 'Open for Proposals',
    description: 'Collaborating on deep-learning models for agricultural yield prediction, urban planning, and disaster management using Sentinel-2 data.',
    tags: ['Big Data', 'Machine Learning', 'Agriculture'],
    icon: Globe,
    color: 'text-rp-blue'
  },
  {
    id: 'AST-03',
    title: 'Observatory Operations',
    focus: 'Entoto Radio Astronomy',
    status: 'Strategic Research',
    description: 'Development of VLBI (Very Long Baseline Interferometry) capabilities in coordination with the EA-ROAD regional network.',
    tags: ['Radio Astronomy', 'EA-ROAD', 'Deep Space'],
    icon: Radio,
    color: 'text-emerald-400'
  },
  {
    id: 'EDU-04',
    title: 'Capacity Building',
    focus: 'Post-Doc & Technical Training',
    status: 'Continuous',
    description: 'Joint PhD programs and technical certifications in Space Engineering and Remote Sensing for African scholars.',
    tags: ['Education', 'STEM', 'Fellowships'],
    icon: GraduationCap,
    color: 'text-purple-400'
  }
];

export default function Opportunities() {
  const navigate = useNavigate();
  const [activeSector, setActiveSector] = useState(SECTORS[0].id);
  const [briefRequestedFor, setBriefRequestedFor] = useState(null);
  const [portalOpen, setPortalOpen] = useState(false);

  const selectedSector = SECTORS.find((sector) => sector.id === activeSector) ?? SECTORS[0];

  const requestBrief = (sector) => {
    setActiveSector(sector.id);
    setBriefRequestedFor(sector);
    navigate('/initiate', { state: { sectorId: sector.id, sectorTitle: sector.title } });
  };

  const openPortal = () => {
    setPortalOpen(true);
  };

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rp-blue/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rp-gold/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-full h-full border-[0.5px] border-rp-blue/20 rounded-full"></div>
        <div className="absolute top-[15%] right-[-5%] w-2/3 h-2/3 border-[0.5px] border-rp-gold/15 rounded-full"></div>
      </div>

      <Navbar />
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 animate-fade-up group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-gradient-to-r from-rp-blue to-rp-gold group-hover:w-12 transition-all duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-rp-blue group-hover:text-rp-gold transition-colors">Investment & Cooperation</span>
            </div>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter group-hover:text-rp-blue transition-colors">
              Strategic <span className="text-rp-gold group-hover:text-rp-blue transition-colors">Sectors</span>
            </h2>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-gray-400 font-medium leading-relaxed max-w-2xl group-hover:text-gray-300 transition-colors">
                  SSGI identifies critical gaps in the regional aerospace landscape. We invite
                  international industry leaders and research institutions to join these high-impact initiatives.
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-rp-blue/10 border border-rp-blue/20 rounded-full">
                <Activity size={10} className="text-rp-blue" />
                <span className="text-[8px] font-black text-rp-blue uppercase tracking-tighter">4 ACTIVE SECTORS</span>
              </div>
            </div>
          </header>

          {/* Sector Grid */}
          <div className="mb-10 flex flex-wrap gap-3">
            {SECTORS.map((sector) => (
              <button
                key={sector.id}
                type="button"
                onClick={() => setActiveSector(sector.id)}
                className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.4em] transition-all font-black ${activeSector === sector.id ? 'bg-rp-gold text-slate-950 shadow-xl shadow-rp-gold/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                {sector.id}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              const isActive = activeSector === sector.id;
              return (
                <div
                  key={sector.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveSector(sector.id)}
                  onKeyDown={(event) => event.key === 'Enter' && setActiveSector(sector.id)}
                  className={`glass-panel p-10 rounded-[48px] border transition-all duration-500 group cursor-pointer hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden ${isActive ? 'border-rp-gold/70 shadow-rp-gold/20 bg-white/5' : 'border-white/5 hover:border-rp-blue/30 hover:shadow-rp-blue/10'}`}
                >
                  {/* Ambient Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rp-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="absolute top-0 right-0 p-8 text-[10px] font-black text-white/10 group-hover:text-rp-blue/20 transition-colors">
                    {sector.id}
                  </div>

                  <div className="relative space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-rp-blue/30 transition-all duration-300 group-hover:scale-110">
                        <Icon size={20} className={`text-gray-400 ${sector.color} transition-colors`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sector.status === 'High Priority' ? 'bg-rp-gold animate-pulse' : sector.status === 'Open for Proposals' ? 'bg-rp-blue animate-pulse' : sector.status === 'Strategic Research' ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400 animate-pulse'}`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{sector.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className={`text-3xl font-black leading-tight ${isActive ? 'text-rp-gold' : 'text-white'} transition-colors`}>{sector.title}</h3>
                      <p className="text-rp-blue text-xs font-black uppercase tracking-widest transition-colors">{sector.focus}</p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed transition-colors">
                      {sector.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {sector.tags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveSector(sector.id);
                          }}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase text-gray-500 hover:bg-white/10 transition-all hover:scale-105"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        requestBrief(sector);
                      }}
                      className="w-full mt-6 py-4 rounded-2xl border border-rp-blue/20 text-rp-blue text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rp-blue hover:text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-rp-blue/20 relative group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Request Technical Brief
                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="glass-panel p-10 rounded-[48px] border border-white/5 bg-white/5 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.6em] text-rp-blue mb-4">Selected Focus</p>
              <h3 className="text-4xl font-black text-white mb-4">{selectedSector.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">{selectedSector.description}</p>
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[10px] uppercase tracking-[0.5em] text-gray-300 font-black">{selectedSector.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedSector.tags.map((tag) => (
                  <span key={tag} className="px-3 py-2 rounded-full bg-rp-blue/10 border border-rp-blue/20 text-[10px] uppercase tracking-[0.25em] text-rp-blue font-black">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={openPortal}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-rp-gold/20 bg-rp-gold/10 text-rp-gold text-[10px] uppercase tracking-[0.2em] font-black hover:bg-rp-gold hover:text-slate-950 transition-all"
              >
                Open Data Portal
                <ArrowRight size={16} />
              </button>
            </section>

            <aside className="glass-panel p-10 rounded-[48px] border border-white/5 bg-white/5 backdrop-blur-xl">
              <h4 className="text-3xl font-black text-white mb-4">Live Actions</h4>
              <div className="space-y-4 text-sm text-gray-300">
                <p>Click any sector card to focus the briefing, then request a technical brief for that sector.</p>
                {briefRequestedFor && (
                  <div className="rounded-3xl border border-rp-blue/20 bg-rp-blue/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-rp-blue mb-2">Request queued</p>
                    <p className="font-black text-white">{briefRequestedFor.title}</p>
                    <p className="text-gray-300">Our team will follow up with a tailored technical package within 24 hours.</p>
                  </div>
                )}
                <div className="rounded-3xl border border-rp-gold/20 bg-rp-gold/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-rp-gold mb-2">Portal status</p>
                  <p className="font-black text-white">{portalOpen ? 'Access granted' : 'Ready to open'}</p>
                  <p className="text-gray-300">{portalOpen ? 'The data portal link is now active for secure geospatial requests.' : 'Use the action button to activate portal access and review open data options.'}</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Data Request Section */}
          <section className="mt-20 p-12 glass-panel rounded-[60px] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10 group hover:border-rp-gold/20 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-rp-gold/10 relative overflow-hidden">
            {/* Ambient Glow Effect */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rp-gold/20 rounded-full blur-3xl group-hover:bg-rp-blue/20 transition-colors duration-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rp-blue/20 rounded-full blur-3xl group-hover:bg-rp-gold/20 transition-colors duration-500"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-rp-gold transition-colors">Looking for Raw Data?</h4>
                <div className="w-3 h-3 bg-rp-gold rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              <p className="text-gray-400 text-sm max-w-md group-hover:text-gray-300 transition-colors">Access our open-source geospatial repositories or request high-resolution multispectral imagery for research purposes.</p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <FileText size={12} className="text-rp-blue" />
                  <span className="text-[8px] font-black text-rp-blue uppercase tracking-tighter">OPEN DATA</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <Shield size={12} className="text-emerald-400" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">SECURE ACCESS</span>
                </div>
              </div>
            </div>
            <button className="bg-white text-rp-slate px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rp-gold hover:text-white transition-all whitespace-nowrap hover:scale-105 hover:shadow-lg hover:shadow-rp-gold/20 relative group/btn">
              <span className="relative z-10 flex items-center gap-2">
                Access Data Portal
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
import React from 'react';
import Sidebar from '../components/Sidebar';

const PROJECTS = [
  { id: 1, name: 'Entoto Observatory', location: 'Addis Ababa, ET', status: 'Operational', type: 'Optical', health: 98 },
  { id: 2, name: 'Rift Valley Array', location: 'Kenya / Ethiopia', status: 'Construction', type: 'Radio', health: 45 },
  { id: 3, name: 'Nile Basin Geo-Node', location: 'Khartoum, SD', status: 'Maintenance', type: 'Geospatial', health: 72 },
  { id: 4, name: 'Lamu Satellite Link', location: 'Lamu, KE', status: 'Operational', type: 'Downlink', health: 100 },
];

export default function Projects() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-fade-up">
          
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
              Regional <span className="text-rp-blue">Assets</span>
            </h1>
            <p className="text-rp-gold font-bold text-[10px] uppercase tracking-[0.4em] mt-2">
              EA-ROAD Infrastructure Monitoring
            </p>
          </header>

          {/* Asset Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Regional Map Placeholder (Visual Integration) */}
          <div className="mt-12 glass-panel rounded-[40px] h-[400px] border border-white/5 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-space-portal opacity-50"></div>
             {/* This is where a Leaflet or Mapbox integration would go */}
             <div className="relative text-center space-y-4">
                <div className="w-16 h-16 bg-rp-blue/20 rounded-full flex items-center justify-center mx-auto border border-rp-blue/30 animate-pulse">
                   <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   Geospatial Data Visualization Engine <br/> 
                   <span className="text-rp-blue text-[8px]">Awaiting Telemetry Link...</span>
                </h3>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const ProjectCard = ({ project }) => (
  <div className="glass-panel p-6 rounded-[32px] border border-white/10 hover:border-rp-blue/40 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl group-hover:bg-rp-blue/20 transition-colors">
        {project.type === 'Optical' ? '🔭' : project.type === 'Radio' ? '📡' : '🛰️'}
      </div>
      <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${
        project.status === 'Operational' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-rp-gold border-rp-gold/20 bg-rp-gold/5'
      }`}>
        {project.status}
      </span>
    </div>

    <div className="space-y-1 mb-6">
      <h4 className="text-lg font-black text-white group-hover:text-rp-blue transition-colors">{project.name}</h4>
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
        📍 {project.location}
      </p>
    </div>

    <div className="space-y-2 border-t border-white/5 pt-4">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Signal Health</span>
        <span className="text-[10px] font-black text-white">{project.health}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-rp-blue group-hover:bg-rp-gold transition-all duration-700" 
          style={{ width: `${project.health}%` }}
        ></div>
      </div>
    </div>
  </div>
);
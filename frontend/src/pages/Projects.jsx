import React from 'react';
import Sidebar from '../components/Sidebar';
import { MapPin, Activity, Radio, Satellite, Eye, TrendingUp, AlertTriangle, CheckCircle, Globe, Zap } from 'lucide-react';

const PROJECTS = [
  { id: 1, name: 'Entoto Observatory', location: 'Addis Ababa, ET', status: 'Operational', type: 'Optical', health: 98, coordinates: [9.05, 38.76] },
  { id: 2, name: 'Rift Valley Array', location: 'Kenya / Ethiopia', status: 'Construction', type: 'Radio', health: 45, coordinates: [0.02, 37.91] },
  { id: 3, name: 'Nile Basin Geo-Node', location: 'Khartoum, SD', status: 'Maintenance', type: 'Geospatial', health: 72, coordinates: [15.59, 32.53] },
  { id: 4, name: 'Lamu Satellite Link', location: 'Lamu, KE', status: 'Operational', type: 'Downlink', health: 100, coordinates: [-2.27, 40.90] },
];

export default function Projects() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rp-blue/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rp-gold/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-full h-full border-[0.5px] border-rp-blue/20 rounded-full"></div>
        <div className="absolute top-[15%] right-[-5%] w-2/3 h-2/3 border-[0.5px] border-rp-gold/15 rounded-full"></div>
      </div>

      <Sidebar />
      <main className="flex-1 p-10 z-10 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <header className="mb-12 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-gradient-to-r from-rp-blue to-rp-gold group-hover:w-12 transition-all duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-rp-blue group-hover:text-rp-gold transition-colors">Infrastructure Assets</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic hover:text-rp-blue transition-colors">
              Regional <span className="text-rp-blue group-hover:text-rp-gold transition-colors">Assets</span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-rp-gold font-bold text-[10px] uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                  EA-ROAD Infrastructure Monitoring
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-rp-blue/10 border border-rp-blue/20 rounded-full">
                <Activity size={10} className="text-rp-blue" />
                <span className="text-[8px] font-black text-rp-blue uppercase tracking-tighter">4 ACTIVE NODES</span>
              </div>
            </div>
          </header>

          {/* Asset Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Status Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-[24px] border border-white/10 hover:border-emerald-400/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">Operational</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">2 Assets</p>
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">100%</div>
            </div>

            <div className="glass-panel p-6 rounded-[24px] border border-white/10 hover:border-rp-gold/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rp-gold/20 rounded-xl flex items-center justify-center border border-rp-gold/30">
                  <AlertTriangle size={20} className="text-rp-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">Maintenance</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">1 Asset</p>
                </div>
              </div>
              <div className="text-2xl font-black text-rp-gold">72%</div>
            </div>

            <div className="glass-panel p-6 rounded-[24px] border border-white/10 hover:border-rp-blue/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rp-blue/20 rounded-xl flex items-center justify-center border border-rp-blue/30">
                  <TrendingUp size={20} className="text-rp-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">Construction</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">1 Asset</p>
                </div>
              </div>
              <div className="text-2xl font-black text-rp-blue">45%</div>
            </div>
          </div>

          {/* Regional Map Placeholder (Visual Integration) */}
          <div className="mt-12 glass-panel rounded-[40px] h-[400px] border border-white/5 relative overflow-hidden group hover:border-rp-blue/20 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-space-portal/30 via-transparent to-rp-blue/5 opacity-60"></div>

             {/* Animated Grid Overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
               <div className="w-full h-full border-[0.5px] border-rp-blue/20 rounded-full animate-spin" style={{animationDuration: '60s'}}></div>
               <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-[0.5px] border-rp-gold/15 rounded-full animate-spin" style={{animationDuration: '45s', animationDirection: 'reverse'}}></div>
             </div>

             {/* This is where a Leaflet or Mapbox integration would go */}
             <div className="relative text-center space-y-6 h-full flex flex-col justify-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-rp-blue/20 to-rp-gold/20 rounded-full flex items-center justify-center border border-rp-blue/30 animate-pulse group-hover:scale-110 transition-transform duration-500">
                       <Globe size={32} className="text-rp-blue group-hover:text-rp-gold transition-colors" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 animate-bounce">
                      <Zap size={12} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">
                     Geospatial Data Visualization Engine
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rp-blue animate-pulse"></div>
                    <span className="text-rp-blue text-[10px] font-bold uppercase tracking-widest group-hover:text-rp-gold transition-colors">
                       Awaiting Telemetry Link...
                    </span>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">GPS SYNC</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-rp-blue animate-pulse"></div>
                    <span className="text-[8px] font-black text-rp-blue uppercase tracking-widest">SATELLITE LINK</span>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const ProjectCard = ({ project }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'Optical': return <Eye size={20} className="text-rp-blue group-hover:text-rp-gold transition-colors" />;
      case 'Radio': return <Radio size={20} className="text-rp-blue group-hover:text-rp-gold transition-colors" />;
      case 'Geospatial': return <MapPin size={20} className="text-rp-blue group-hover:text-rp-gold transition-colors" />;
      case 'Downlink': return <Satellite size={20} className="text-rp-blue group-hover:text-rp-gold transition-colors" />;
      default: return <Globe size={20} className="text-rp-blue group-hover:text-rp-gold transition-colors" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Operational': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'Maintenance': return 'text-rp-gold border-rp-gold/20 bg-rp-gold/5';
      case 'Construction': return 'text-rp-blue border-rp-blue/20 bg-rp-blue/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-[32px] border border-white/10 hover:border-rp-blue/40 transition-all duration-500 group cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-rp-blue/10 relative overflow-hidden">
      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-rp-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-rp-blue/30 transition-all duration-300 group-hover:scale-110">
            {getIcon(project.type)}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(project.status)} group-hover:scale-105 transition-transform`}>
              {project.status}
            </span>
            <div className={`w-2 h-2 rounded-full ${project.status === 'Operational' ? 'bg-emerald-500' : project.status === 'Maintenance' ? 'bg-rp-gold' : 'bg-rp-blue'} animate-pulse`} />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="text-lg font-black text-white group-hover:text-rp-blue transition-colors leading-tight">{project.name}</h4>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-gray-500 group-hover:text-rp-gold transition-colors" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
              {project.location}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/5 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Signal Health</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white group-hover:text-rp-blue transition-colors">{project.health}%</span>
              {project.health >= 90 && <CheckCircle size={10} className="text-emerald-400" />}
              {project.health < 90 && project.health >= 70 && <AlertTriangle size={10} className="text-rp-gold" />}
              {project.health < 70 && <AlertTriangle size={10} className="text-red-400" />}
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-1000 ease-out ${
                project.health >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                project.health >= 70 ? 'bg-gradient-to-r from-rp-gold to-yellow-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              } group-hover:shadow-lg`}
              style={{ width: `${project.health}%` }}
            />
          </div>
        </div>

        {/* Hover Action Indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-rp-blue/20 rounded-full flex items-center justify-center border border-rp-blue/30">
            <TrendingUp size={12} className="text-rp-blue" />
          </div>
        </div>
      </div>
    </div>
  );
};
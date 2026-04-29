import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  MapPin, Activity, Radio, Satellite, Eye, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Globe, Zap, Terminal, Maximize2 
} from 'lucide-react';

const PROJECTS = [
  { id: 'ASSET-001', name: 'Entoto Observatory', location: 'Addis Ababa, ET', status: 'Operational', type: 'Optical', health: 98, uptime: '99.9%', latency: '12ms' },
  { id: 'ASSET-002', name: 'Rift Valley Array', location: 'Kenya / Ethiopia', status: 'Construction', type: 'Radio', health: 45, uptime: 'N/A', latency: '240ms' },
  { id: 'ASSET-003', name: 'Nile Basin Geo-Node', location: 'Khartoum, SD', status: 'Maintenance', type: 'Geospatial', health: 72, uptime: '84.2%', latency: '45ms' },
  { id: 'ASSET-004', name: 'Lamu Satellite Link', location: 'Lamu, KE', status: 'Operational', type: 'Downlink', health: 100, uptime: '100%', latency: '8ms' },
];

export default function Projects() {
  return (
    <div className="flex min-h-screen bg-[#05070a] text-slate-100 font-sans selection:bg-rp-blue/30 selection:text-rp-blue">
      {/* HUD Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 z-10 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-10">
          
          {/* Top Command Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rp-blue">
                <Terminal size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">System://Infrastructure/Regional_Nodes</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-rp-blue to-blue-400">Assets</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <StatMini label="Global Uptime" value="94.2%" color="text-emerald-400" />
              <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
              <StatMini label="Active Nodes" value="04" color="text-rp-blue" />
            </div>
          </div>

          {/* Key Metric Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Telemetry Health" value="Stable" trend="+2.4%" />
            <MetricCard title="Signal Integrity" value="High" trend="98%" />
            <MetricCard title="Regional Sync" value="92%" trend="-0.5%" />
            <MetricCard title="Security Level" value="Level 4" trend="Active" />
          </div>

          {/* Main Asset Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Central Visualization Hub */}
          <div className="relative group rounded-[40px] border border-white/5 bg-[#0a0c10] overflow-hidden min-h-[500px]">
             <div className="absolute top-8 left-8 z-20 space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic">Geospatial Mapping Hub</h3>
                <div className="flex gap-2">
                  <Badge text="Live Feed" color="bg-emerald-500" />
                  <Badge text="Encrypted" color="bg-rp-blue" />
                </div>
             </div>
             
             {/* Map Placeholder Content */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center opacity-40">
                  <div className="absolute w-[400px] h-[400px] border border-rp-blue/20 rounded-full animate-[spin_60s_linear_infinite]" />
                  <div className="absolute w-[600px] h-[600px] border border-rp-gold/10 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
                  <Globe size={120} className="text-rp-blue/20" />
                </div>
                <button className="z-20 bg-white/5 hover:bg-rp-blue hover:text-white border border-white/10 px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all backdrop-blur-md">
                   Initialize Full-Scale Map
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- Sub-Components --- */

const ProjectCard = ({ project }) => (
  <div className="relative group cursor-pointer">
    {/* Background Glow */}
    <div className="absolute -inset-[1px] bg-gradient-to-br from-rp-blue/20 to-transparent opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-500" />
    
    <div className="relative h-full glass-panel p-6 rounded-[32px] border border-white/10 bg-[#0d1117] transition-all duration-500 group-hover:-translate-y-2">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-rp-blue font-mono">{project.id}</p>
          <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-rp-blue transition-colors">{project.name}</h4>
        </div>
        <div className={`p-2 rounded-xl border border-white/5 bg-white/5 ${project.status === 'Operational' ? 'text-emerald-400' : 'text-rp-gold'}`}>
           <Maximize2 size={16} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <DataPoint label="Latency" value={project.latency} />
        <DataPoint label="Uptime" value={project.uptime} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-black text-gray-500 uppercase">Operational Health</span>
          <span className="text-xs font-black text-white">{project.health}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-rp-blue to-blue-400 transition-all duration-1000"
            style={{ width: `${project.health}%` }}
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
           <MapPin size={12} className="text-rp-gold" />
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{project.location}</span>
        </div>
        <button className="text-[9px] font-black text-rp-blue uppercase tracking-widest border-b border-transparent hover:border-rp-blue transition-all">View Logs</button>
      </div>
    </div>
  </div>
);

const StatMini = ({ label, value, color }) => (
  <div className="text-right">
    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

const MetricCard = ({ title, value, trend }) => (
  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
    <div className="flex items-baseline justify-between">
      <span className="text-xl font-black text-white italic">{value}</span>
      <span className={`text-[10px] font-bold ${trend.includes('+') ? 'text-emerald-400' : 'text-rp-blue'}`}>{trend}</span>
    </div>
  </div>
);

const DataPoint = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
    <p className="text-xs font-bold text-white/80">{value}</p>
  </div>
);

const Badge = ({ text, color }) => (
  <div className={`${color} bg-opacity-10 border border-${color} border-opacity-20 px-3 py-1 rounded-full`}>
    <span className={`text-[8px] font-black uppercase text-${color} tracking-tighter`}>{text}</span>
  </div>
);
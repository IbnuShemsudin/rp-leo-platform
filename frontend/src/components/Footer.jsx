import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rp-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rp-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Intel */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                REGIONAL<span className="text-rp-blue">PORTAL</span>
              </h2>
              <p className="text-rp-gold font-bold text-[8px] uppercase tracking-[0.4em] mt-1">
                Partnership Monitoring System
              </p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-medium">
              A high-security, encrypted environment for managing international institutional MoUs and regional collaborative frameworks.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon="🌐" />
              <SocialIcon icon="🐦" />
              <SocialIcon icon="💼" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Command Center</h4>
            <ul className="space-y-3">
              <FooterLink label="Executive Dashboard" />
              <FooterLink label="Partnership Registry" />
              <FooterLink label="Global Analytics" />
              <FooterLink label="Project Roadmap" />
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Protocol Support</h4>
            <ul className="space-y-3">
              <FooterLink label="User Documentation" />
              <FooterLink label="API Uplink" />
              <FooterLink label="Security Audit" />
              <FooterLink label="Compliance standards" />
            </ul>
          </div>

          {/* Column 4: Newsletter / System Updates */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">System Intel</h4>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Subscribe to regional alerts
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL@AGENCY.GOV" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-rp-blue transition-all placeholder:text-gray-700 font-bold"
              />
              <button className="absolute right-2 top-2 bg-rp-blue text-white p-1.5 rounded-lg text-[10px] hover:scale-105 active:scale-95 transition-all">
                GO
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
              Satellite Sync Active: <span className="text-gray-400">Stable Connection</span>
            </p>
          </div>

          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
            © {currentYear} RP-PORTAL. ALL RIGHTS RESERVED. DATA ENCRYPTED.
          </p>

          <div className="flex gap-8">
            <a href="#" className="text-[9px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-[9px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({ label }) => (
  <li>
    <a href="#" className="text-xs font-bold text-gray-500 hover:text-rp-gold transition-all flex items-center group">
      <span className="w-0 group-hover:w-3 h-[1px] bg-rp-gold transition-all mr-0 group-hover:mr-2" />
      {label}
    </a>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-rp-blue hover:text-white transition-all hover:-translate-y-1">
    {icon}
  </a>
);
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';



export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-space-portal/80 backdrop-blur-xl border-b border-white/5 h-20 shadow-2xl' 
        : 'bg-transparent h-28'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl shadow-2xl transition-all duration-500 transform group-hover:rotate-[360deg] ${
              isScrolled ? 'bg-rp-blue/20 border border-rp-blue/30' : 'bg-white/5 backdrop-blur-lg border border-white/10'
            }`}>
              <span className="text-white font-black text-[10px] tracking-tighter z-10">SSGI</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-rp-blue/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-2 w-4 h-[1.5px] bg-rp-gold animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none text-white transition-all group-hover:tracking-widest">
                RP-LEO
              </span>
              <span className="text-[7px] font-black text-rp-gold uppercase tracking-[0.4em] mt-1 opacity-80">
                Regional Partnership
              </span>
            </div>
          </Link>

          {/* Nav Links - High Tech Tracking */}
          <div className="hidden lg:flex items-center space-x-10">
            <NavLink to="/" active={location.pathname === '/'} isScrolled={isScrolled}>Home</NavLink>
            <NavLink to="/opportunities" active={location.pathname === '/opportunities'} isScrolled={isScrolled}>Sectors</NavLink>
            <NavLink to="/initiate" active={location.pathname === '/initiate'} isScrolled={isScrolled}>
              Initiate
            </NavLink>
            <NavLink to="/ea-road" active={location.pathname === '/ea-road'} isScrolled={isScrolled}>EA-ROAD</NavLink>
            <NavLink to="/volunteer" active={location.pathname === '/volunteer'} isScrolled={isScrolled}>Volunteer</NavLink>
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">
                    {user.name}
                  </span>
                  <span className="text-[7px] font-bold text-rp-gold uppercase tracking-[0.3em]">{user.role}</span>
                </div>
                
                <button 
                  onClick={() => navigate('/initiate')}
                  className="bg-rp-blue hover:bg-white hover:text-rp-blue text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 active:scale-90"
                >
                  New MoU
                </button>

                <button 
                  onClick={logout}
                  className="p-2.5 rounded-xl transition-all bg-white/5 border border-white/5 hover:border-red-500/50 group"
                  title="Secure Logout"
                >
                  <span className="text-gray-400 group-hover:text-red-500 transition-colors text-sm">⏻</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 px-7 py-3.5 rounded-2xl transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:border-rp-blue/50 shadow-2xl"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rp-gold animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                  Staff Portal
                </span>
                <span className="text-rp-blue group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}




const NavLink = ({ to, children, active, isScrolled }) => (
  <Link 
    to={to} 
    className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all relative group py-2 ${
      active 
        ? 'text-rp-blue' 
        : 'text-gray-400 hover:text-white'
    }`}
  >
    {children}
    {/* Cinematic Underline */}
    <span className={`absolute bottom-0 left-0 h-[2px] bg-rp-gold transition-all duration-500 rounded-full ${
      active ? 'w-full shadow-[0_0_10px_#b45309]' : 'w-0 group-hover:w-2/3 opacity-50'
    }`}></span>
  </Link>
);
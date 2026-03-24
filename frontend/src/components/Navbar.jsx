// src/components/Navbar.jsx
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

  // Use a conditional class to highlight the active page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm h-16' : 'bg-transparent h-24'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex flex-col items-center justify-center w-12 h-12 bg-rp-blue rounded-lg shadow-lg group-hover:bg-rp-slate transition-colors">
              <span className="text-white font-black text-[10px] tracking-tighter">SSGI</span>
              <div className="absolute bottom-2 w-5 h-[2px] bg-rp-gold"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-rp-slate tracking-tight leading-none">RP-LEO</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Regional Partnership</span>
            </div>
          </Link>

          {/* Nav Links - Swapped <a> for <Link> */}
          <div className="hidden lg:flex items-center space-x-10">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/partnerships">Partnerships</NavLink>
            <NavLink to="/dashboard">MoU Registry</NavLink>
            <NavLink to="/ea-road">EA-ROAD</NavLink>
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-6">
            {user ? (
              <button 
                onClick={logout}
                className="hidden sm:block text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:block text-xs font-bold text-rp-blue hover:text-rp-gold uppercase tracking-widest transition-colors"
              >
                Staff Login
              </button>
            )}
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="relative overflow-hidden group bg-rp-blue text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
            >
              <span className="relative z-10">Admin Portal</span>
              <div className="absolute inset-0 bg-rp-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

// Internal NavLink helper using React Router's Link
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-600 hover:text-rp-blue transition-all relative group"
  >
    {children}
    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-rp-gold transition-all duration-300 group-hover:w-full"></span>
  </Link>
);
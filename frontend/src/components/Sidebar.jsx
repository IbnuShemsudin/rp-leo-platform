import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Import useAuth to check roles

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get user details from context

  // Base menu items for everyone
  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: '📊' },
    { label: 'MoU Registry', path: '/registry', icon: '📜' },
    { label: 'EA-ROAD Projects', path: '/projects', icon: '📡' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-rp-slate text-white p-6 hidden lg:flex flex-col border-r border-white/5">
      <div className="mb-12">
        <h2 className="text-rp-gold font-black text-xs uppercase tracking-widest">RP-LEO Admin</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Management Portal</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              location.pathname === item.path 
              ? 'bg-rp-blue text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Admin-Only Section: Bottom of Sidebar */}
      {user?.role === 'admin' && (
        <div className="pt-6 mt-6 border-t border-white/5">
          <button
            onClick={() => navigate('/register')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-rp-gold/30 hover:bg-rp-gold hover:text-white ${
              location.pathname === '/register' 
              ? 'bg-rp-gold text-white' 
              : 'text-rp-gold'
            }`}
          >
            <span>👤</span>
            Add Staff
          </button>
        </div>
      )}
    </aside>
  );
}
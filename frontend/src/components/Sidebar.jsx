import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Radio,
  Settings,
  UserPlus,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['admin','staff'] },
    { label: 'MoU Registry', path: '/registry', icon: FileText, roles: ['admin','staff'] },
    { label: 'EA-ROAD Projects', path: '/projects', icon: Radio, roles: ['admin','staff'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['admin','staff'] },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-rp-slate text-white p-4 hidden lg:flex flex-col border-r border-white/5 transition-all duration-300`}
    >
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-rp-gold font-black text-xs uppercase tracking-widest">
              RP-LEO Admin
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              Management Portal
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/5 transition"
        >
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? 'bg-rp-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {!collapsed && item.label}
              </button>
            );
          })}
      </nav>

      {/* Admin Only */}
      {user?.role === 'admin' && (
        <div className="pt-6 mt-6 border-t border-white/5">
          <button
            onClick={() => navigate('/register')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border border-rp-gold/30 text-rp-gold hover:bg-rp-gold hover:text-white transition-all"
          >
            <UserPlus size={16}/>
            {!collapsed && 'Add Staff'}
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="pt-6 mt-6 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rp-blue flex items-center justify-center text-xs font-black">
            {user?.name?.charAt(0) || 'U'}
          </div>

          {!collapsed && (
            <div>
              <p className="text-[10px] font-black uppercase">
                {user?.name}
              </p>
              <p className="text-[8px] text-gray-400 uppercase">
                {user?.role}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <LogOut size={16}/>
          {!collapsed && 'Logout'}
        </button>
      </div>

    </aside>
  );
}
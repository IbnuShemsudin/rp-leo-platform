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
  ChevronRight,
  Shield,
  Crown,
  User,
  Power
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['admin','staff'], description: 'Executive Dashboard' },
    { label: 'MoU Registry', path: '/registry', icon: FileText, roles: ['admin','staff'], description: 'Partnership Management' },
    { label: 'EA-ROAD Projects', path: '/projects', icon: Radio, roles: ['admin','staff'], description: 'Regional Initiatives' },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['admin','staff'], description: 'System Configuration' },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-gradient-to-b from-rp-slate via-[#1a1f2e] to-rp-slate text-white p-4 hidden lg:flex flex-col border-r border-white/10 transition-all duration-500 relative overflow-hidden`}
    >

      {/* Enhanced Background Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rp-blue/10 rounded-full blur-[60px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-rp-gold/8 rounded-full blur-[40px] pointer-events-none" />

      {/* Subtle Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[0.5px] border-rp-blue/30 rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-1/2 h-1/2 border-[0.5px] border-rp-gold/20 rounded-full"></div>
      </div>
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between relative z-10">
        {!collapsed && (
          <div className="group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-rp-blue/20 to-rp-gold/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <h2 className="text-rp-gold font-black text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                RP-LEO Admin
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 group-hover:text-gray-300 transition-colors">
                Management Portal
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rp-blue/20 to-rp-gold/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            {collapsed ? <ChevronRight size={16} className="text-rp-blue group-hover:text-rp-gold transition-colors" /> : <ChevronLeft size={16} className="text-rp-blue group-hover:text-rp-gold transition-colors" />}
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 relative z-10">
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-rp-blue/20 to-rp-gold/20 rounded-xl blur opacity-75"></div>
                )}
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all group/btn ${
                    isActive
                      ? 'bg-gradient-to-r from-rp-blue to-rp-gold text-white shadow-lg shadow-rp-blue/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-md hover:shadow-white/10'
                  }`}
                  title={collapsed ? item.description : undefined}
                >
                  <Icon size={18} className={`${isActive ? 'text-white' : 'text-rp-blue group-hover/btn:text-rp-gold'} transition-colors`} />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="leading-tight">{item.label}</span>
                      <span className="text-[8px] text-gray-500 group-hover/btn:text-gray-300 transition-colors font-medium normal-case">
                        {item.description}
                      </span>
                    </div>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>
              </div>
            );
          })}
      </nav>

      {/* Admin Only */}
      {user?.role === 'admin' && (
        <div className="pt-6 mt-6 border-t border-white/10 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rp-gold/20 to-rp-blue/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <button
              onClick={() => navigate('/register')}
              className="relative w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border border-rp-gold/30 text-rp-gold hover:bg-gradient-to-r hover:from-rp-gold hover:to-rp-blue hover:text-white hover:border-transparent transition-all hover:shadow-lg hover:shadow-rp-gold/20 group/btn"
            >
              <Crown size={16} className="group-hover/btn:scale-110 transition-transform" />
              {!collapsed && 'Add Staff'}
              {!collapsed && <UserPlus size={12} className="ml-auto group-hover/btn:rotate-12 transition-transform" />}
            </button>
          </div>
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
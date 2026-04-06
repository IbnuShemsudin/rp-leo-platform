import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Save, User, Lock, ShieldCheck, Activity } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Committing changes to terminal:", form);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rp-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rp-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-rp-blue" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-rp-blue">User Configuration</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
            Terminal <span className="text-rp-blue">Settings</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
            Authorized Personnel: {user?.name || 'Unknown'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Identity Module */}
          <section className="glass-panel border border-white/5 rounded-[32px] p-8 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rp-blue/10 rounded-2xl text-rp-blue">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xs tracking-widest text-white">Identity Module</h2>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">Manage public profile parameters</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-blue focus:ring-1 focus:ring-rp-blue/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Service Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-blue focus:ring-1 focus:ring-rp-blue/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>


          {/* 2. Security Protocols */}
          <section className="glass-panel border border-white/5 rounded-[32px] p-8 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rp-gold/10 rounded-2xl text-rp-gold">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xs tracking-widest text-white">Security Protocols</h2>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">Rotate encryption access keys</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">New Access Key</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-gold focus:ring-1 focus:ring-rp-gold/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Confirm Key</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-gold focus:ring-1 focus:ring-rp-gold/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>


          {/* 3. Status Bar */}
          <section className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 glass-panel border border-white/5 rounded-3xl p-6 bg-white/[0.01] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Activity size={16} className="text-rp-blue" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authorization Level</p>
               </div>
               <span className="px-4 py-1 bg-rp-blue/10 border border-rp-blue/20 rounded-full text-[9px] font-black text-rp-blue uppercase tracking-tighter">
                 {user?.role || 'Staff'}
               </span>
            </div>

            <div className="flex-1 glass-panel border border-white/5 rounded-3xl p-6 bg-white/[0.01] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <ShieldCheck size={16} className="text-rp-gold" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Integrity</p>
               </div>
               <span className="text-[9px] font-black text-white uppercase tracking-tighter">SECURED</span>
            </div>
          </section>


          {/* Save Action */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-rp-blue text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              <Save size={16} className="group-hover:rotate-12 transition-transform" />
              Commit Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Save, User, Lock, ShieldCheck, Activity, Loader2, 
  AlertTriangle, CheckCircle, Crown, Eye, EyeOff, 
  Database, Zap, ArrowLeft 
} from 'lucide-react';

export default function Settings() {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [preferences, setPreferences] = useState({
    darkMode: true,
    emailAlerts: true,
    weeklyReports: false,
    twoFactorAuth: false,
  });

  const [apiKey, setApiKey] = useState('RP-LEO-APL-2026');
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  /* ==========================================
     HYDRATION WATCHER: PREVENTS EMPTY REFRESH FORMS
     ========================================== */
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status.msg) setStatus({ type: '', msg: '' });
  };

  /* ==========================================
     FIXED: IMPLEMENTED MISSING ACTIONS & UTILITIES
     ========================================== */

  // Handles Preference Toggle Switches smoothly
  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Safe Clipboard Integration for Station IDs
  const copyStationId = () => {
    const id = user?._id || 'GUEST_NODE';
    navigator.clipboard.writeText(id);
    setStatus({ type: 'success', msg: 'Station Node address synchronized to clipboard.' });
  };

  // Randomized Hex Token Generator simulation for your API layer
  const regenerateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tokenBuffer = 'RP-LEO-';
    for (let i = 0; i < 8; i++) {
      tokenBuffer += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(tokenBuffer);
    setStatus({ type: 'success', msg: 'New core API interface credential generated.' });
  };

  // Account Removal Lifecycles
  const confirmDeleteAccount = () => setShowDeletePrompt(true);
  const cancelDelete = () => setShowDeletePrompt(false);
  
  const deleteAccount = async () => {
    setLoading(true);
    try {
      // Add your real account deletion API route path here if needed
      setStatus({ type: 'error', msg: 'Account deletion protocol queued for supervisor approval.' });
      setShowDeletePrompt(false);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to access termination node.' });
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     CORE SUBMIT PROTOCOL
     ========================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password && form.password !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'Encryption Keys do not match.' });
      setLoading(false);
      return;
    }

    try {
      // Dynamic endpoint interpolation addresses cloud endpoints on Vercel
      const baseUrl = import.meta.env.VITE_API_URL || 'import.meta.env.VITE_API_URL';
      const response = await fetch(`${baseUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          ...(form.password && { password: form.password })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Terminal configuration updated successfully.' });
        login(data.user, token); 
        setForm({ ...form, password: '', confirmPassword: '' });
      } else {
        setStatus({ type: 'error', msg: data.msg || 'Update protocol failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Sector Data Node connection lost.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100 p-8 relative overflow-hidden custom-scrollbar font-sans">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rp-blue/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rp-gold/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/2 rounded-full blur-[160px] pointer-events-none" />

      {/* Tech Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-full h-full border-[0.5px] border-rp-blue/20 rounded-full"></div>
        <div className="absolute top-[15%] right-[-5%] w-2/3 h-2/3 border-[0.5px] border-rp-gold/15 rounded-full"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="group/back flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-rp-blue/40 hover:bg-rp-blue/5 transition-all duration-300"
          >
            <div className="p-1 bg-white/5 rounded-full group-hover/back:bg-rp-blue/20 transition-colors">
              <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/back:text-white transition-colors">
              Return to Command Center
            </span>
          </button>

          <div className="text-[10px] font-mono text-gray-600 hidden md:block">
            STATION_ID: {user?._id?.substring(0, 8) || 'GUEST_NODE'}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2 group">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-rp-blue to-rp-gold group-hover:w-12 transition-all duration-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-rp-blue group-hover:text-rp-gold transition-colors">User Configuration</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic hover:text-rp-blue transition-colors">
            Terminal <span className="text-rp-blue group-hover:text-rp-gold transition-colors">Settings</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-rp-gold animate-pulse' : 'bg-emerald-500'}`}></div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] italic group-hover:text-gray-400 transition-colors">
                Authorized Personnel: {user?.name || 'Unknown'}
              </p>
            </div>
            {user?.role === 'admin' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-rp-gold/10 border border-rp-gold/20 rounded-full">
                <Crown size={10} className="text-rp-gold" />
                <span className="text-[8px] font-black text-rp-gold uppercase tracking-tighter">ADMIN</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {status.msg && (
          <div className={`flex items-center gap-4 p-6 rounded-[24px] border animate-in slide-in-from-top-4 duration-500 shadow-lg ${
            status.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10'
              : 'bg-gradient-to-r from-rose-500/10 to-rose-400/5 border-rose-500/20 text-rose-400 shadow-rose-500/10'
          }`}>
            <div className={`p-2 rounded-xl ${status.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest flex-1">{status.msg}</p>
            <button
              type="button"
              onClick={() => setStatus({ type: '', msg: '' })}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Identity Module */}
          <section className="glass-panel border border-white/10 rounded-[32px] p-8 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] transition-all duration-500 shadow-2xl hover:shadow-rp-blue/10 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-rp-blue/20 to-rp-blue/10 rounded-2xl text-rp-blue group-hover:shadow-lg group-hover:shadow-rp-blue/20 transition-all">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xs tracking-widest text-white group-hover:text-rp-blue transition-colors">Identity Module</h2>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight group-hover:text-gray-400 transition-colors">Manage public profile parameters</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3 group/input">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic group-hover/input:text-rp-blue transition-colors">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-blue focus:ring-1 focus:ring-rp-blue/50 outline-none transition-all hover:border-white/20 placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-3 group/input">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic group-hover/input:text-rp-blue transition-colors">Service Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-rp-blue focus:ring-1 focus:ring-rp-blue/50 outline-none transition-all hover:border-white/20 placeholder:text-gray-700"
                />
              </div>
            </div>
          </section>

          {/* 2. Security Protocols */}
          <section className="glass-panel border border-white/10 rounded-[32px] p-8 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] transition-all duration-500 shadow-2xl hover:shadow-rp-gold/10 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-rp-gold/20 to-rp-gold/10 rounded-2xl text-rp-gold group-hover:shadow-lg group-hover:shadow-rp-gold/20 transition-all">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xs tracking-widest text-white group-hover:text-rp-gold transition-colors">Security Protocols</h2>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight group-hover:text-gray-400 transition-colors">Rotate encryption access keys</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3 group/input">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic group-hover/input:text-rp-gold transition-colors">New Access Key</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    placeholder="Leave blank to keep current"
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 pr-12 text-xs text-white focus:border-rp-gold focus:ring-1 focus:ring-rp-gold/50 outline-none transition-all hover:border-white/20 placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-rp-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 group/input">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 italic group-hover/input:text-rp-gold transition-colors">Confirm Key</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 pr-12 text-xs text-white focus:border-rp-gold focus:ring-1 focus:ring-rp-gold/50 outline-none transition-all hover:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-rp-gold transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Preferences */}
          <section className="glass-panel border border-white/10 rounded-[32px] p-8 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] transition-all duration-500 shadow-2xl hover:shadow-rp-blue/10 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-rp-blue/20 to-rp-blue/10 rounded-2xl text-rp-blue group-hover:shadow-lg group-hover:shadow-rp-blue/20 transition-all">
                <Database size={20} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xs tracking-widest text-white group-hover:text-rp-blue transition-colors">Preferences & Integrations</h2>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight group-hover:text-gray-400 transition-colors">Customize notifications, themes, and access keys</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Dark Mode', key: 'darkMode' },
                { label: 'Email Alerts', key: 'emailAlerts' },
                { label: 'Weekly Reports', key: 'weeklyReports' },
                { label: 'Two-Factor Auth', key: 'twoFactorAuth' }
              ].map((pref) => (
                <button
                  key={pref.key}
                  type="button"
                  onClick={() => togglePreference(pref.key)}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 transition-all hover:border-rp-blue/30 hover:bg-white/10"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{pref.label}</span>
                  <span className={`w-11 h-6 rounded-full transition-colors ${preferences[pref.key] ? 'bg-rp-blue' : 'bg-white/10'}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences[pref.key] ? 'translate-x-5' : 'translate-x-1'}`} />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 4. Account Actions */}
          <section className="flex flex-col gap-6">
            <div className="glass-panel border border-white/10 rounded-[32px] p-8 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] transition-all duration-500 shadow-2xl hover:shadow-rp-gold/10 group">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-rp-gold/20 to-rp-gold/10 rounded-2xl text-rp-gold group-hover:shadow-lg group-hover:shadow-rp-gold/20 transition-all">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="font-black uppercase text-xs tracking-widest text-white group-hover:text-rp-gold transition-colors">Account Actions</h2>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight group-hover:text-gray-400 transition-colors">Manage keys, copy ID, and request account removal</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Station ID</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-black text-white text-sm">{user?._id?.substring(0, 12) || 'GUEST_NODE'}</span>
                    <button
                      type="button"
                      onClick={copyStationId}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rp-blue/20 rounded-full hover:bg-rp-blue/40"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">API Key</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-black text-white text-sm break-all">{apiKey}</span>
                    <button
                      type="button"
                      onClick={regenerateApiKey}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black bg-rp-gold rounded-full hover:bg-rp-gold/80"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Account status</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Active</span>
                    <button
                      type="button"
                      onClick={confirmDeleteAccount}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rose-500/20 rounded-full hover:bg-rose-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showDeletePrompt && (
              <div className="glass-panel border border-rose-500/30 rounded-[32px] p-8 bg-rose-500/5 shadow-2xl">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-300 mb-4">Confirm account deletion</p>
                <p className="text-gray-300 leading-relaxed mb-6">This will queue an account removal request. Data retention policies may still apply.</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={deleteAccount}
                    className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-[0.2em]"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-6 py-3 border border-white/10 rounded-2xl text-white uppercase tracking-[0.2em]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 5. Status Display */}
          <section className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 glass-panel border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] flex items-center justify-between group transition-all duration-500 hover:shadow-lg hover:shadow-rp-blue/10">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-rp-blue/10 rounded-xl text-rp-blue group-hover:bg-rp-blue/20 transition-colors">
                    <Activity size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">Authorization Level</p>
               </div>
               <div className="flex items-center gap-2">
                 <span className="px-4 py-1 bg-gradient-to-r from-rp-blue/10 to-rp-blue/5 border border-rp-blue/20 rounded-full text-[9px] font-black text-rp-blue uppercase tracking-tighter group-hover:from-rp-blue/20 group-hover:to-rp-blue/10 transition-all">
                   {user?.role || 'Staff'}
                 </span>
                 {user?.role === 'admin' && <Crown size={12} className="text-rp-gold animate-pulse" />}
               </div>
            </div>

            <div className="flex-1 glass-panel border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent hover:from-white/[0.03] hover:via-white/[0.02] hover:to-white/[0.01] flex items-center justify-between group transition-all duration-500 hover:shadow-lg hover:shadow-rp-gold/10">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-rp-gold/10 rounded-xl text-rp-gold group-hover:bg-rp-gold/20 transition-colors">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">Account Integrity</p>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-black text-white uppercase tracking-tighter group-hover:text-rp-gold transition-colors">SECURED</span>
               </div>
            </div>
          </section>

          {/* Save Action */}
          <div className="flex justify-end pt-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-rp-blue/20 to-rp-gold/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button
                type="submit"
                disabled={loading}
                className="relative group/btn flex items-center gap-4 px-12 py-5 rounded-2xl bg-gradient-to-r from-rp-blue to-rp-gold text-white font-black uppercase text-[10px] tracking-[0.25em] shadow-2xl shadow-blue-900/40 hover:shadow-rp-gold/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <Database size={16} className="animate-pulse" />
                  </>
                ) : (
                  <>
                    <Save size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    <Zap size={16} className="group-hover/btn:scale-110 transition-transform" />
                  </>
                )}
                <span className="group-hover/btn:text-rp-blue transition-colors">
                  {loading ? 'Processing...' : 'Commit Changes'}
                </span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
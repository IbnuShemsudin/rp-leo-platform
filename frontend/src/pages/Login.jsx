import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        if (data.verificationRequired) {
          navigate('/verify-email', { state: { email: data.email || email } });
          return;
        }
        alert(data.msg || 'Authorization failed. Please check your credentials.');
      }
    } catch (err) {
      alert("Critical: Could not connect to the SSGI Authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative selection:bg-rp-blue/30 overflow-hidden">
      <Navbar />
      
      {/* Cinematic Background Elements */}
      <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-blue/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rp-gold/5 rounded-full blur-[100px] -z-10" />

      <div className="flex items-center justify-center min-h-screen pt-20 px-6">
        <div className="max-w-md w-full glass-panel p-12 rounded-[48px] border border-white/10 relative z-10 shadow-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Subtle Satellite Icon Backdrop */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl pointer-events-none">🛰️</div>

          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-rp-gold uppercase tracking-[0.5em] mb-4 block">
              Restricted Access
            </span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
              Staff <span className="text-rp-blue italic">Uplink</span>
            </h2>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-4">
              Authorize Personnel Credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">
                Official Email
              </label>
              <input 
                type="email" 
                value={email}
                required
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-rp-blue transition-all font-bold text-sm text-white placeholder:text-white/10 disabled:opacity-50"
                placeholder="name@ssgi.gov.et"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">
                Security Key
              </label>
              <input 
                type="password" 
                value={password}
                required
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-rp-blue transition-all font-bold text-sm text-white placeholder:text-white/10 disabled:opacity-50"
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-rp-blue text-white py-6 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rp-gold hover:text-white transition-all shadow-2xl shadow-blue-900/40 active:scale-95 flex justify-center items-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synchronizing...
                </>
              ) : (
                'Launch Uplink'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-[10px] font-bold text-rp-gold hover:text-white transition-colors uppercase tracking-widest">
              Create New Account
            </Link>
          </div>

          {/* System Footer Status */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Protocol <span className="text-gray-300">Secure</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              { [0, 1, 2].map((i) => (
                <div key={i} className="w-8 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-rp-gold/60 ${i === 0 ? 'w-full animate-pulse' : 'w-0'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 text-center relative z-10">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-700">
          Regional Partnership Lead Executive Office &copy; 2026
        </p>
      </footer>
    </div>
  );
}

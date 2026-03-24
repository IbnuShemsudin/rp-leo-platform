import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update global auth state and persist to local storage
        login(data.user, data.token);
        // Navigate to dashboard using React Router's internal state
        navigate('/dashboard');
      } else {
        // Detailed error reporting for the 400 Bad Request
        console.error("Auth Error Status:", response.status);
        console.error("Server Message:", data.msg);
        alert(data.msg || 'Authorization failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Network/Server Connection Error:", err);
      alert("Critical: Could not connect to the SSGI Authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 geospatial-grid">
      <div className="max-w-md w-full p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rp-blue rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
            <span className="text-white font-black text-xl tracking-tighter">SSGI</span>
          </div>
          <h2 className="text-2xl font-black text-rp-slate uppercase tracking-tight">Staff Access</h2>
          <p className="text-[10px] font-black text-rp-gold uppercase tracking-[0.2em] mt-2 leading-none">
            Regional Partnership Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Official Email</label>
            <input 
              type="email" 
              required
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-rp-blue focus:bg-white outline-none transition-all font-bold text-rp-slate placeholder:text-gray-300 placeholder:font-medium disabled:opacity-50"
              placeholder="name@ssgi.gov.et"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Security Key</label>
            <input 
              type="password" 
              required
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-rp-blue focus:bg-white outline-none transition-all font-bold text-rp-slate placeholder:text-gray-300 disabled:opacity-50"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 bg-rp-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-rp-slate transition-all active:scale-95 flex justify-center items-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              'Authorize Entry'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Secured by RPD Cybersecurity Protocol
        </p>
      </div>
    </div>
  );
}
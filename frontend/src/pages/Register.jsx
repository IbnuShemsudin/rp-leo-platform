// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, UserPlus, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      alert("System node connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Background Subtle Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[1px] border-rp-blue rounded-full"></div>
      </div>

      <div className="max-w-md w-full p-12 bg-white rounded-[48px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rp-slate rounded-[24px] mb-6 shadow-2xl shadow-slate-900/20">
            <ShieldCheck size={32} className="text-rp-gold" />
          </div>
          <h2 className="text-3xl font-black text-rp-slate uppercase tracking-tighter italic">Staff <span className="opacity-40">Access</span></h2>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-3">Regional Partnership Division Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Legal Name" 
            type="text" 
            placeholder="e.g. Abdurezak Shemsu" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          
          <Input 
            label="Institutional Email" 
            type="email" 
            placeholder="name@ssgi.gov.et" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <Input 
            label="Security Cipher (Password)" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />

          <div className="space-y-2 relative">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Assigned Security Clearance</label>
            <div className="relative group">
              <select 
                className="w-full px-7 py-5 bg-gray-50 border-2 border-transparent rounded-[20px] outline-none font-bold text-rp-slate text-xs appearance-none cursor-pointer focus:border-rp-blue/20 transition-all group-hover:bg-gray-100"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="staff">Standard Operations Staff</option>
                <option value="executive">Lead Regional Executive</option>
                <option value="admin">System Administrator</option>
              </select>
              <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-rp-blue transition-colors" />
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-5 bg-rp-slate text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/30 hover:bg-rp-blue hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus size={16} />
                Initialize Identity
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                SSGI Internal Use Only • Unauthorized Access is Prohibited
            </p>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, type, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{label}</label>
    <input 
      type={type} 
      required
      value={value}
      className="w-full px-7 py-5 bg-gray-50 border-2 border-transparent rounded-[20px] focus:border-rp-blue/20 focus:bg-white outline-none transition-all font-bold text-rp-slate text-xs placeholder:text-gray-300 placeholder:font-semibold"
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);
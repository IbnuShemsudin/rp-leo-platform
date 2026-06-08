// src/pages/Register.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    secretCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        'http://import.meta.env.VITE_API_URL/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Identity initialized successfully! Redirecting...');

        login(data.user, data.token);

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setError('System node connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-[#0a0c10] to-[#05070a] text-slate-100 relative overflow-x-hidden p-4 md:p-8">
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-rp-blue/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-rp-gold/5 rounded-full blur-[60px] md:blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-500/3 rounded-full blur-[100px] md:blur-[200px] pointer-events-none -z-10" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none hidden sm:block">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full border border-rp-blue rounded-full" />
        <div className="absolute top-[10%] right-[-10%] w-3/4 h-3/4 border border-rp-gold/30 rounded-full" />
      </div>

      <div className="max-w-md w-full p-6 sm:p-8 md:p-12 glass-panel rounded-[32px] md:rounded-[48px] border border-white/10 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent shadow-3xl backdrop-blur-xl relative z-10">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="relative inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-rp-blue/20 to-blue-600/20 rounded-[20px] md:rounded-[28px] mb-6 md:mb-8 shadow-2xl shadow-rp-blue/20">
            <ShieldCheck className="text-rp-blue w-8 h-8 md:w-9 md:h-9" />
            <div className="absolute inset-0 rounded-[20px] md:rounded-[28px] bg-rp-blue/10 animate-ping" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            Staff{' '}
            <span className="text-rp-blue bg-gradient-to-r from-rp-blue to-blue-400 bg-clip-text text-transparent">
              Access
            </span>
          </h2>

          <p className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-400 mt-2 md:mt-4 max-w-sm mx-auto leading-relaxed">
            Regional Partnership Division Portal
            <br className="hidden sm:block" />
            Secure Identity Initialization
          </p>
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-6 md:mb-8">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-rose-400 shrink-0" />
                <p className="text-xs md:text-sm text-rose-400 font-bold">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                <p className="text-xs md:text-sm text-emerald-400 font-bold">
                  {success}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

          <Input
            label="Full Legal Name"
            type="text"
            placeholder="e.g. Abdurezak Shemsu"
            icon={<User size={18} className="text-gray-400" />}
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
            }
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="name@ssgi.gov.et"
            icon={<Mail size={18} className="text-gray-400" />}
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
            }
          />

          <Input
            label="Security Cipher"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} className="text-gray-400" />}
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
          />

          {/* Role Selection */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">
              Security Clearance
            </label>

            <div className="relative group">
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                    secretCode: ''
                  })
                }
                className="w-full px-5 md:px-6 py-4 md:py-5 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl md:rounded-2xl outline-none font-bold text-white text-xs md:text-sm appearance-none cursor-pointer focus:border-rp-blue focus:ring-2 focus:ring-rp-blue/20 transition-all"
              >
                <option value="staff" className="bg-[#0a0c10] text-white">
                  Standard Operations
                </option>

                <option value="executive" className="bg-[#0a0c10] text-white">
                  Lead Executive
                </option>

                <option value="admin" className="bg-[#0a0c10] text-white">
                  System Admin
                </option>
              </select>

              <ChevronDown
                size={18}
                className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Secret Code Input */}
          {formData.role !== 'staff' && (
            <Input
              label="Authorization Secret Code"
              type="password"
              placeholder="Enter secure role code"
              icon={<ShieldCheck size={18} className="text-gray-400" />}
              value={formData.secretCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secretCode: e.target.value
                })
              }
            />
          )}

          {/* Submit */}
          <button
            disabled={isSubmitting}
            className="w-full py-5 md:py-6 bg-gradient-to-r from-rp-blue to-blue-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Initialize Identity
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck size={14} className="text-rp-gold shrink-0" />
            <p className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
              SSGI Internal Use Only • Secure Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange
}) => (
  <div className="space-y-2 md:space-y-3">
    <label className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">
      {label}
    </label>

    <div className="relative group">
      <input
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-4 md:py-5 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl md:rounded-2xl focus:border-rp-blue focus:ring-2 focus:ring-rp-blue/20 outline-none transition-all font-medium text-white text-xs md:text-sm placeholder:text-gray-500"
      />

      <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);
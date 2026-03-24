// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' // Default role
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
        // Log them in immediately after registration
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 geospatial-grid">
      <div className="max-w-md w-full p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rp-gold rounded-2xl mb-4 shadow-lg shadow-orange-900/20">
            <span className="text-white font-black text-xl">RPD</span>
          </div>
          <h2 className="text-2xl font-black text-rp-slate uppercase tracking-tight">Staff Registration</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Create New Portal Identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" type="text" placeholder="e.g. Abdurezak Shemsu" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <Input label="Official Email" type="email" placeholder="name@ssgi.gov.et" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <Input label="Security Key" type="password" placeholder="••••••••" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Assigned Role</label>
            <select 
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-rp-slate text-sm appearance-none"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="staff">Standard Staff</option>
              <option value="executive">Lead Executive</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-5 bg-rp-slate text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:bg-rp-blue transition-all active:scale-95"
          >
            {isSubmitting ? 'Processing...' : 'Register to Registry'}
          </button>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, type, placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    <input 
      type={type} 
      required
      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rp-blue outline-none transition-all font-bold text-rp-slate placeholder:text-gray-300 placeholder:font-medium"
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);
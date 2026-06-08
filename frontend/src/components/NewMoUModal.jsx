import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Send, ChevronRight, Loader2, Upload, CheckCircle, FileText, AlertCircle, Building2, MapPin, Target, DollarSign, Calendar, FileCheck } from 'lucide-react';

export default function NewMoUModal({ isOpen, onClose, onRefresh }) {
  const { token, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [selectedFileLabel, setSelectedFileLabel] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    objectives: '',
    fundingType: 'Non-funded',
    duration: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      partnerName: '',
      country: '',
      objectives: '',
      fundingType: 'Non-funded',
      duration: ''
    });
    setUploadedFilename('');
    setSelectedFileLabel('');
    setStep(1);
    setErrors({});
    setSubmitError('');
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.partnerName.trim()) {
        newErrors.partnerName = 'Institution name is required';
      }
      if (!formData.country.trim()) {
        newErrors.country = 'Region/Country is required';
      }
      if (!formData.objectives.trim()) {
        newErrors.objectives = 'Objectives are required';
      }
    } else if (currentStep === 2) {
      if (!formData.duration.trim()) {
        newErrors.duration = 'Duration is required';
      }
      if (!uploadedFilename) {
        newErrors.upload = 'Document upload is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ CRITICAL FIX: Handles the file upload immediately upon selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Capture the actual file object
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ upload: 'Please select a PDF or Word document' });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ upload: 'File size must be less than 10MB' });
      return;
    }

    setSelectedFileLabel(file.name);
    setUploading(true);
    setErrors({});

    const fileData = new FormData();
    // Key MUST match your backend (e.g., upload.single('file'))
    fileData.append('file', file);

    try {
      const res = await fetch('import.meta.env.VITE_API_URL/api/upload', {
        method: 'POST',
        headers: {
          'x-auth-token': token
          // Do NOT set Content-Type here
        },
        body: fileData,
      });

      const data = await res.json();

      if (res.ok) {
        // Extract the filename string saved by Multer
        const serverFilename = data.file?.filename || data.filename;
        setUploadedFilename(serverFilename);
        setErrors({});
      } else {
        setErrors({ upload: data.message || "Upload failed. Please try again." });
        setSelectedFileLabel('');
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrors({ upload: "Network error during upload. Please check your connection." });
      setSelectedFileLabel('');
    } finally {
      setUploading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep(1)) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const res = await fetch('import.meta.env.VITE_API_URL/api/mou/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...formData,
          initialDocumentUrl: uploadedFilename, // Sending the string name from the server
          status: 'Draft',
          currentStep: 1
        })
      });

      if (res.ok) {
        await onRefresh();
        resetForm();
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || errorData.msg || errorData.error || "Submission failed";

        if (res.status === 401 || res.status === 403) {
          logout();
          window.location.href = '/login';
          throw new Error(message);
        }

        setSubmitError(message);
        throw new Error(message);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with animation */}
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />

      <div className="glass-panel w-full max-w-3xl rounded-[48px] border border-white/10 relative z-10 bg-gradient-to-br from-[#0a0c10] via-[#0d0f14] to-[#0a0c10] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Enhanced Header */}
        <div className="relative p-8 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-white/[0.01]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rp-blue/5 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-rp-gold/5 rounded-full blur-xl -z-10" />

          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-rp-gold animate-pulse shadow-lg shadow-rp-gold/50" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-rp-gold/30 animate-ping" />
                </div>
                <span className="text-[9px] font-black text-rp-gold uppercase tracking-[0.4em]">Registry Uplink</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                Initiate <span className="text-rp-blue bg-gradient-to-r from-rp-blue to-blue-400 bg-clip-text text-transparent">Partnership</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Create a new Memorandum of Understanding with institutional partners
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Step Progress Bar */}
        <div className="px-8 py-6 bg-gradient-to-r from-white/[0.02] to-white/[0.01] border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex gap-3 flex-1">
              <div className={`h-2 flex-1 rounded-full transition-all duration-700 shadow-sm ${step >= 1 ? 'bg-gradient-to-r from-rp-blue to-blue-500 shadow-rp-blue/25' : 'bg-white/10'}`} />
              <div className={`h-2 flex-1 rounded-full transition-all duration-700 shadow-sm ${step >= 2 ? 'bg-gradient-to-r from-rp-blue to-blue-500 shadow-rp-blue/25' : 'bg-white/10'}`} />
            </div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Step {step} of 2
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {/* Partner Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 size={20} className="text-rp-blue" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Partner Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={14} />
                      Institution *
                    </label>
                    <input
                      type="text"
                      placeholder="NASA / ESA / Partner Organization"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                        errors.partnerName ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                      }`}
                    />
                    {errors.partnerName && (
                      <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.partnerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={14} />
                      Region / Country *
                    </label>
                    <input
                      type="text"
                      placeholder="Addis Ababa / Washington DC"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                        errors.country ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                      }`}
                    />
                    {errors.country && (
                      <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} />
                    Objectives *
                  </label>
                  <textarea
                    placeholder="Describe the core collaborative goals, scope, and expected outcomes of this partnership..."
                    value={formData.objectives}
                    onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    rows="4"
                    className={`w-full bg-white/5 border rounded-3xl px-6 py-4 text-sm font-medium resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      errors.objectives ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                  />
                  {errors.objectives && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.objectives}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-5 bg-gradient-to-r from-rp-blue to-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02]"
              >
                Operational Details
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              {/* Operational Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={20} className="text-emerald-400" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Operational Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={14} />
                      Funding Model
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rp-blue/50 focus:border-rp-blue transition-all duration-300 hover:border-white/20 appearance-none"
                      value={formData.fundingType}
                      onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
                    >
                      <option value="Non-funded">Non-funded</option>
                      <option value="Jointly Funded">Jointly Funded</option>
                      <option value="External Grant">External Grant</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} />
                      Duration *
                    </label>
                    <input
                      type="text"
                      placeholder="5 Years / 36 Months"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                        errors.duration ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                      }`}
                    />
                    {errors.duration && (
                      <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck size={20} className="text-rp-gold" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Documentation
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} />
                    Initiation Document (PDF/DOC) *
                  </label>

                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                      uploadedFilename
                        ? 'border-emerald-400/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                        : errors.upload
                        ? 'border-rose-400/40 bg-rose-500/5'
                        : 'border-white/10 bg-white/5 group-hover:border-rp-blue/50 group-hover:bg-white/10'
                    }`}>
                      <div className="relative">
                        {uploading ? (
                          <Loader2 className="animate-spin text-rp-blue" size={32} />
                        ) : uploadedFilename ? (
                          <div className="relative">
                            <CheckCircle className="text-emerald-400" size={32} />
                            <div className="absolute inset-0 text-emerald-400 animate-ping opacity-20">
                              <CheckCircle size={32} />
                            </div>
                          </div>
                        ) : (
                          <Upload className="text-gray-500 group-hover:text-rp-blue transition-colors" size={32} />
                        )}
                      </div>

                      <div className="text-center space-y-1">
                        <span className={`text-sm font-bold ${
                          uploadedFilename ? 'text-white' :
                          errors.upload ? 'text-rose-400' : 'text-gray-400 group-hover:text-white'
                        }`}>
                          {uploading ? "Uploading to Registry..." :
                           selectedFileLabel ? selectedFileLabel :
                           "Select or Drag Proposal Document"}
                        </span>
                        <p className="text-xs text-gray-500">
                          PDF or Word documents up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.upload && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                      <p className="text-xs text-rose-400 font-bold flex items-center gap-2">
                        <AlertCircle size={14} />
                        {errors.upload}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {submitError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                  <p className="text-sm text-rose-400 font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {submitError}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || uploading || !uploadedFilename}
                  className="flex-1 py-4 bg-gradient-to-r from-rp-gold to-yellow-500 text-black rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] shadow-lg shadow-rp-gold/25 hover:shadow-xl hover:shadow-rp-gold/40 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Confirm Initiation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, placeholder, isTextArea, value, onChange }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">{label}</label>
    {isTextArea ? (
      <textarea 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white text-xs font-bold min-h-[120px] focus:border-rp-blue transition-all resize-none" 
      />
    ) : (
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white text-xs font-bold focus:border-rp-blue transition-all" 
      />
    )}
  </div>
);
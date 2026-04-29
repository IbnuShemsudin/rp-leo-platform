import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadFile from '../components/UploadFile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerMoU } from '../services/mouService';
import { CheckCircle, AlertCircle, Loader2, FileText, Building2, MapPin, Calendar, Briefcase, User, Mail, Phone, Eye, Edit3, ChevronRight } from 'lucide-react';

export default function InitiateMoU() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Redirect to login if not authenticated
  if (!token || !user) {
    navigate('/login');
    return null;
  }

  const [uploadedFilename, setUploadedFilename] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    partnerName: '',
    country: '',
    sector: 'Satellite Manufacturing',
    description: '',
    expectedDuration: '5 Years',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    partnershipType: 'Strategic Alliance',
    priorityLevel: 'Medium'
  });

  const handleUploadSuccess = (filename) => {
    setUploadedFilename(filename);
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.partnerName.trim()) {
      errors.partnerName = 'Partner organization name is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person name is required';
    }

    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'Contact phone number is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }

    if (!uploadedFilename) {
      errors.upload = 'Document upload is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');
    setFormErrors({});

    if (!token) {
      setSubmissionError('Authentication required. Please log in again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    console.log("Token available:", !!token);
    console.log("Token value:", token);

    const finalData = {
      ...formData,
      initialDocumentUrl: uploadedFilename,
      status: 'Draft',
      currentStep: 1,
      dateInitiated: new Date().toISOString()
    };

    try {
      await registerMoU(finalData, token);
      setIsSubmitted(true);
    } catch (err) {
      setSubmissionError(err.message || 'Failed to initiate partnership');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectors = [
    'Satellite Manufacturing',
    'Geospatial Analytics',
    'Ground Station Ops',
    'Capacity Building',
    'EA-ROAD Regional'
  ];

  const partnershipTypes = [
    'Strategic Alliance',
    'Technology Transfer',
    'Joint Research',
    'Capacity Development',
    'Commercial Partnership'
  ];

  const priorityLevels = [
    { value: 'Low', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { value: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { value: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { value: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  ];

  const durationOptions = [
    '1 Year', '2 Years', '3 Years', '5 Years', '7 Years', '10 Years', 'Indefinite'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-space-portal flex items-center justify-center px-6">
        <div className="glass-panel p-16 rounded-[48px] border border-emerald-500/20 max-w-xl w-full text-center animate-fade-up shadow-2xl">
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle size={48} className="text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              Initiation <span className="text-emerald-400">Successful</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto" />
          </div>

          <p className="text-gray-300 text-sm font-medium leading-relaxed mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
            Partnership proposal for{" "}
            <span className="text-white font-bold bg-rp-blue/20 px-2 py-1 rounded">
              {formData.partnerName}
            </span>{" "}
            has been successfully initiated and moved to the Validation Phase.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-rp-blue to-rp-blue/80 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:from-rp-blue/90 hover:to-rp-blue/70 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-95"
            >
              Return to Dashboard
            </button>

            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all duration-300 border border-white/10 py-3 rounded-xl hover:bg-white/5 hover:border-white/20"
            >
              Initiate Another Partnership
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Reference ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-space-portal text-slate-100 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-blue/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rp-gold/5 rounded-full blur-[100px] -z-10" />

        <Navbar />

        <main className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto">

            {/* Header Section */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em]">
                  Preview Mode
                </span>
              </div>

              <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
                Review <span className="text-purple-400">Partnership</span>
              </h1>

              <p className="text-gray-400 text-sm font-medium max-w-2xl mx-auto">
                Please review all details before final submission. You can edit any information if needed.
              </p>
            </header>

            {/* Preview Card */}
            <div className="glass-panel p-12 rounded-[48px] border border-white/10 space-y-8 shadow-2xl backdrop-blur-xl">

              {/* Partner Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 size={20} className="text-rp-blue" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Partner Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Organization</p>
                    <p className="text-white font-medium">{formData.partnerName}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Country</p>
                    <p className="text-white font-medium">{formData.country}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Contact Person</p>
                    <p className="text-white font-medium">{formData.contactPerson}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Email</p>
                    <p className="text-white font-medium">{formData.contactEmail}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Phone</p>
                    <p className="text-white font-medium">{formData.contactPhone}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Priority Level</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${priorityLevels.find(p => p.value === formData.priorityLevel)?.bg} ${priorityLevels.find(p => p.value === formData.priorityLevel)?.color} border ${priorityLevels.find(p => p.value === formData.priorityLevel)?.border}`}>
                      {formData.priorityLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Partnership Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase size={20} className="text-emerald-400" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Partnership Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Sector</p>
                    <p className="text-white font-medium">{formData.sector}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Type</p>
                    <p className="text-white font-medium">{formData.partnershipType}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Duration</p>
                    <p className="text-white font-medium">{formData.expectedDuration}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Project Description</p>
                  <p className="text-white font-medium leading-relaxed">{formData.description}</p>
                </div>

                {uploadedFilename && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Document</p>
                    <p className="text-emerald-400 font-medium flex items-center gap-2">
                      <FileText size={16} />
                      {uploadedFilename}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <button
                  onClick={handleEdit}
                  className="px-8 py-4 text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest border border-white/10 rounded-2xl hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Details
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-lg transform active:scale-95 flex items-center gap-3 ${
                    isSubmitting
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rp-blue/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rp-gold/5 rounded-full blur-[100px] -z-10" />

      <Navbar />

      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rp-blue/10 border border-rp-blue/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-rp-blue rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-rp-blue uppercase tracking-[0.5em]">
                Phase 01: Initiation
              </span>
            </div>

            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
              New Partnership
              <span className="text-rp-gold"> Entry</span>
            </h1>

            <p className="text-gray-400 text-sm font-medium max-w-2xl mx-auto">
              Initiate a new Memorandum of Understanding by providing partner details and uploading supporting documentation.
            </p>
          </header>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="glass-panel p-12 rounded-[48px] border border-white/10 space-y-10 shadow-2xl backdrop-blur-xl"
          >

            {/* Partner Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 size={20} className="text-rp-blue" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Partner Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} />
                    Partner Organization *
                  </label>
                  <input
                    required
                    value={formData.partnerName}
                    onChange={(e)=>setFormData({...formData, partnerName:e.target.value})}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      formErrors.partnerName ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                    placeholder="Enter organization name"
                  />
                  {formErrors.partnerName && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.partnerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} />
                    Origin Country *
                  </label>
                  <input
                    required
                    value={formData.country}
                    onChange={(e)=>setFormData({...formData, country:e.target.value})}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      formErrors.country ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                    placeholder="Enter country name"
                  />
                  {formErrors.country && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <User size={20} className="text-purple-400" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Contact Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <User size={14} />
                    Contact Person *
                  </label>
                  <input
                    required
                    value={formData.contactPerson}
                    onChange={(e)=>setFormData({...formData, contactPerson:e.target.value})}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      formErrors.contactPerson ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                    placeholder="Enter contact person's full name"
                  />
                  {formErrors.contactPerson && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.contactPerson}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Mail size={14} />
                    Contact Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e)=>setFormData({...formData, contactEmail:e.target.value})}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      formErrors.contactEmail ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                    placeholder="Enter contact email address"
                  />
                  {formErrors.contactEmail && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.contactEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} />
                    Contact Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e)=>setFormData({...formData, contactPhone:e.target.value})}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                      formErrors.contactPhone ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                    }`}
                    placeholder="Enter contact phone number"
                  />
                  {formErrors.contactPhone && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.contactPhone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} />
                    Priority Level
                  </label>
                  <select
                    value={formData.priorityLevel}
                    onChange={(e)=>setFormData({...formData, priorityLevel:e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 hover:border-white/20 focus:border-rp-blue"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority.value} value={priority.value} className="bg-gray-800 text-white">
                        {priority.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-rp-gold" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Documentation
                </h3>
              </div>

              <UploadFile
                onUploadSuccess={handleUploadSuccess}
                uploadType="mous"
              />

              {formErrors.upload && (
                <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formErrors.upload}
                </p>
              )}
            </div>

            {/* Sector Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={20} className="text-emerald-400" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Sector Focus
                </h3>
              </div>

              <SectorSelect
                sectors={sectors}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            {/* Project Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className="text-purple-400" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Project Details
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Project Scope Summary *
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the partnership objectives, scope, and expected outcomes..."
                  className={`w-full bg-white/5 border rounded-3xl px-6 py-4 text-sm font-medium resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 ${
                    formErrors.description ? 'border-rose-400 bg-rose-500/5' : 'border-white/10 hover:border-white/20 focus:border-rp-blue'
                  }`}
                  value={formData.description}
                  onChange={(e)=>setFormData({...formData, description:e.target.value})}
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {submissionError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                <p className="text-xs text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} />
                  {submissionError}
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={()=>navigate(-1)}
                className="px-8 py-4 text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest border border-white/10 rounded-2xl hover:bg-white/5 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!uploadedFilename || isSubmitting}
                className={`px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-lg transform active:scale-95 flex items-center gap-3 ${
                  isSubmitting || !uploadedFilename
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rp-gold to-rp-gold/80 text-black hover:from-rp-gold/90 hover:to-rp-gold/70 shadow-rp-gold/25 hover:shadow-xl hover:shadow-rp-gold/40 hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate Initiation Draft
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

const Input = ({label,value,onChange}) => (
  <div className="space-y-2">
    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">
      {label}
    </label>
    <input
      required
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rp-blue/50 hover:border-white/20 focus:border-rp-blue"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
)

const SectorSelect = ({sectors,formData,setFormData}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {sectors.map((sector)=>(
      <button
        key={sector}
        type="button"
        onClick={()=>setFormData({...formData,sector})}
        className={`p-4 rounded-2xl text-sm font-bold uppercase tracking-widest border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          formData.sector === sector
            ? 'bg-rp-blue text-white border-rp-blue shadow-lg shadow-rp-blue/25'
            : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10 hover:text-white'
        }`}
      >
        {sector}
      </button>
    ))}
  </div>
)
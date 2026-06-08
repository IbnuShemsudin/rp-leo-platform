import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadFile from '../components/UploadFile';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerMoU } from '../services/mouService';

import {
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Building2,
  Calendar,
  User,
  Edit3,
  Eye,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  ArrowRight,
} from 'lucide-react';

const API =
  import.meta.env.VITE_API_URL ||
  'import.meta.env.VITE_API_URLL';

export default function InitiateMoU() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [uploadedFilename, setUploadedFilename] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionError, setSubmissionError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [showPreview, setShowPreview] = useState(false);

  // =========================
  // NEW: PARTNER INBOX
  // =========================
  const [myMous, setMyMous] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(true);

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
    priorityLevel: 'Medium',
  });

  /*
  ========================
  AUTH CHECK
  ========================
  */

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  /*
  ========================
  FETCH PARTNER INBOX
  ========================
  */

  const fetchMyMous = async () => {
    try {
      if (!token) return;

      setLoadingInbox(true);

      const res = await fetch(`${API}/api/mou/my-mous`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-auth-token': token,
        },
      });

      const data = await res.json();

      console.log('📥 MY MOUS:', data);

      if (Array.isArray(data)) {
        setMyMous(data);
      } else if (Array.isArray(data?.mous)) {
        setMyMous(data.mous);
      } else {
        setMyMous([]);
      }
    } catch (err) {
      console.error('❌ Inbox Error:', err);
      setMyMous([]);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    fetchMyMous();
  }, [token]);

  /*
  ========================
  FILE UPLOAD SUCCESS
  ========================
  */

  const handleUploadSuccess = (fileData) => {
    console.log('✅ Uploaded File Data:', fileData);

    if (!fileData) return;

    setUploadedFilename(
      fileData.filename ||
      fileData.fileName ||
      fileData.name ||
      ''
    );

    setUploadedFileUrl(
      fileData.url || ''
    );
  };

  /*
  ========================
  VALIDATION
  ========================
  */

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

  /*
  ========================
  PREVIEW
  ========================
  */

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  /*
  ========================
  SUBMIT
  ========================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmissionError('');
    setFormErrors({});

    if (!token) {
      setSubmissionError(
        'Authentication required. Please login again.'
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('🔐 Token Available:', !!token);

      const finalData = {
        ...formData,

        initialDocumentUrl:
          uploadedFileUrl || uploadedFilename,

        uploadedFilename,

        status: 'Draft',

        currentStep: 1,

        dateInitiated: new Date().toISOString(),
      };

      console.log('📦 Final Submission Data:', finalData);

      await registerMoU(finalData, token);

      await fetchMyMous();

      setIsSubmitted(true);

    } catch (err) {
      console.error('❌ Submission Error:', err);

      setSubmissionError(
        err?.message ||
        'Failed to initiate partnership'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  ========================
  SUCCESS SCREEN
  ========================
  */

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-space-portal flex items-center justify-center px-6">
        <div className="glass-panel p-16 rounded-[48px] border border-emerald-500/20 max-w-xl w-full text-center shadow-2xl">

          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
            <CheckCircle
              size={48}
              className="text-emerald-400"
            />
          </div>

          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
            Initiation
            <span className="text-emerald-400">
              {' '}Successful
            </span>
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
            Partnership proposal for{' '}
            <span className="text-white font-bold">
              {formData.partnerName}
            </span>{' '}
            has been successfully initiated.
          </p>

          <div className="flex flex-col gap-4">

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-rp-blue to-rp-blue/80 py-4 rounded-2xl text-white font-black uppercase tracking-widest"
            >
              Return to Dashboard
            </button>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setShowPreview(false);
              }}
              className="border border-white/10 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
            >
              Initiate Another Partnership
            </button>

          </div>
        </div>
      </div>
    );
  }

  /*
  ========================
  PREVIEW MODE
  ========================
  */

  if (showPreview) {
    return (
      <div className="min-h-screen bg-space-portal text-slate-100 relative overflow-hidden">

        <Navbar />

        <main className="pt-32 pb-20 px-6 relative z-10">

          <div className="max-w-4xl mx-auto">

            <header className="mb-12 text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                <Eye size={14} className="text-purple-400" />

                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em]">
                  Preview Mode
                </span>
              </div>

              <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
                Review
                <span className="text-purple-400">
                  {' '}Partnership
                </span>
              </h1>

            </header>

            <div className="glass-panel p-12 rounded-[48px] border border-white/10 space-y-8 shadow-2xl">

              <div className="grid md:grid-cols-2 gap-6">

                <PreviewCard
                  title="Organization"
                  value={formData.partnerName}
                />

                <PreviewCard
                  title="Country"
                  value={formData.country}
                />

                <PreviewCard
                  title="Contact Person"
                  value={formData.contactPerson}
                />

                <PreviewCard
                  title="Email"
                  value={formData.contactEmail}
                />

                <PreviewCard
                  title="Phone"
                  value={formData.contactPhone}
                />

                <PreviewCard
                  title="Sector"
                  value={formData.sector}
                />

              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
                  Project Description
                </p>

                <p className="text-white leading-relaxed">
                  {formData.description}
                </p>
              </div>

              {uploadedFilename && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">

                  <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-3">
                    Uploaded Document
                  </p>

                  <div className="flex items-center justify-between gap-4 flex-wrap">

                    <div className="flex items-center gap-3">
                      <FileText
                        size={18}
                        className="text-emerald-400"
                      />

                      <span className="text-white text-sm font-medium break-all">
                        {uploadedFilename}
                      </span>
                    </div>

                    {uploadedFileUrl && (
                      <a
                        href={uploadedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        View PDF
                      </a>
                    )}

                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-white/10">

                <button
                  onClick={handleEdit}
                  className="px-8 py-4 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Details
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
                    isSubmitting
                      ? 'bg-white/10 text-gray-400'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
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

  /*
  ========================
  MAIN FORM + INBOX
  ========================
  */

  return (
    <div className="min-h-screen bg-space-portal text-slate-100 relative overflow-hidden">

      <Navbar />

      <main className="pt-32 pb-20 px-6 relative z-10">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_420px] gap-8">

          {/* LEFT SIDE */}
          <div>

            <header className="mb-12 text-center">

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rp-blue/10 border border-rp-blue/20 rounded-full mb-6">
                <ShieldCheck
                  size={14}
                  className="text-rp-blue"
                />

                <span className="text-[10px] font-black text-rp-blue uppercase tracking-[0.5em]">
                  Phase 01: Initiation
                </span>
              </div>

              <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
                New Partnership
                <span className="text-rp-gold">
                  {' '}Entry
                </span>
              </h1>

            </header>

            <form
              onSubmit={handleSubmit}
              className="glass-panel p-12 rounded-[48px] border border-white/10 space-y-10 shadow-2xl"
            >

              {/* PARTNER INFO */}

              <div className="space-y-6">

                <SectionTitle
                  icon={<Building2 size={20} />}
                  title="Partner Information"
                />

                <div className="grid md:grid-cols-2 gap-8">

                  <Input
                    label="Partner Organization"
                    value={formData.partnerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnerName: e.target.value,
                      })
                    }
                    error={formErrors.partnerName}
                  />

                  <Input
                    label="Origin Country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        country: e.target.value,
                      })
                    }
                    error={formErrors.country}
                  />

                </div>

              </div>

              {/* CONTACT */}

              <div className="space-y-6">

                <SectionTitle
                  icon={<User size={20} />}
                  title="Contact Information"
                />

                <div className="grid md:grid-cols-2 gap-8">

                  <Input
                    label="Contact Person"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    error={formErrors.contactPerson}
                  />

                  <Input
                    label="Contact Email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactEmail: e.target.value,
                      })
                    }
                    error={formErrors.contactEmail}
                  />

                  <Input
                    label="Contact Phone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPhone: e.target.value,
                      })
                    }
                    error={formErrors.contactPhone}
                  />

                </div>

              </div>

              {/* UPLOAD */}

              <div className="space-y-4">

                <SectionTitle
                  icon={<FileText size={20} />}
                  title="Documentation"
                />

                <UploadFile
                  onUploadSuccess={handleUploadSuccess}
                  uploadType="mous"
                />

                {uploadedFilename && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">

                    <div className="flex items-center justify-between gap-4 flex-wrap">

                      <div className="flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-emerald-400"
                        />

                        <div>
                          <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold">
                            Uploaded Successfully
                          </p>

                          <p className="text-white text-sm break-all">
                            {uploadedFilename}
                          </p>
                        </div>
                      </div>

                      {uploadedFileUrl && (
                        <a
                          href={uploadedFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                          Open PDF
                        </a>
                      )}

                    </div>

                  </div>
                )}

                {formErrors.upload && (
                  <p className="text-xs text-rose-400 font-bold">
                    {formErrors.upload}
                  </p>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="space-y-4">

                <SectionTitle
                  icon={<Calendar size={20} />}
                  title="Project Details"
                />

                <textarea
                  rows="5"
                  placeholder="Describe the partnership objectives, scope, and expected outcomes..."
                  className={`w-full bg-white/5 border rounded-3xl px-6 py-4 text-sm font-medium resize-none transition-all duration-300 focus:outline-none ${
                    formErrors.description
                      ? 'border-rose-400'
                      : 'border-white/10'
                  }`}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />

              </div>

              {/* ERROR */}

              {submissionError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
                  <p className="text-rose-400 text-sm font-bold">
                    {submissionError}
                  </p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex justify-between items-center pt-8 border-t border-white/10">

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 border border-white/10 rounded-2xl text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <div className="flex gap-4">

                  <button
                    type="button"
                    onClick={handlePreview}
                    className="px-8 py-4 border border-rp-blue/30 bg-rp-blue/10 text-rp-blue rounded-2xl font-bold uppercase tracking-widest flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>

                  <button
                    type="submit"
                    disabled={!uploadedFilename || isSubmitting}
                    className={`px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
                      isSubmitting || !uploadedFilename
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rp-gold to-rp-gold/80 text-black'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ChevronRight size={18} />
                        Generate Initiation Draft
                      </>
                    )}
                  </button>

                </div>

              </div>

            </form>

          </div>

          {/* RIGHT SIDE - CLIENT INBOX */}

          <div className="sticky top-28 h-fit">

            <div className="glass-panel rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">

              {/* HEADER */}
              <div className="p-6 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rp-blue to-blue-700 flex items-center justify-center shadow-xl">
                    <MessageSquare size={24} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">
                      Partner Inbox
                    </h2>

                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Messages & Approvals
                    </p>
                  </div>

                </div>

              </div>

              {/* BODY */}
              <div className="max-h-[800px] overflow-y-auto p-5 space-y-4">

                {loadingInbox ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-4">
                    <Loader2
                      size={32}
                      className="animate-spin text-rp-blue"
                    />

                    <p className="text-xs uppercase tracking-widest text-gray-400 font-black">
                      Loading Inbox...
                    </p>
                  </div>
                ) : myMous.length === 0 ? (
                  <div className="py-16 text-center opacity-60">

                    <MessageSquare
                      size={60}
                      className="mx-auto mb-5"
                    />

                    <h3 className="text-sm font-black uppercase tracking-widest">
                      No Partnerships Yet
                    </h3>

                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      Your submitted partnerships
                      and admin replies will appear here.
                    </p>

                  </div>
                ) : (
                  myMous.map((mou, index) => (
                    <div
                      key={mou._id || mou.id || index}
                      className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 hover:border-rp-blue/30 transition-all duration-300"
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-4 mb-4">

                        <div>
                          <h3 className="text-white font-black uppercase tracking-wide text-sm">
                            {mou.partnerName}
                          </h3>

                          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                            {mou.country}
                          </p>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                            mou.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : mou.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}
                        >
                          {mou.status || 'Pending'}
                        </div>

                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-5">
                        {mou.description}
                      </p>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">

                        <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase tracking-widest">
                          <Clock size={12} />
                          {new Date(
                            mou.createdAt || mou.created_at
                          ).toLocaleDateString()}
                        </div>

                        <Link
                          to={`/messages/${mou._id || mou.id}`}
                          className="bg-gradient-to-r from-rp-blue to-blue-700 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                          Open Chat
                          <ArrowRight size={14} />
                        </Link>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

/*
========================
REUSABLE COMPONENTS
========================
*/

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="text-rp-blue">
      {icon}
    </div>

    <h3 className="text-lg font-black text-white uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

const PreviewCard = ({ title, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
      {title}
    </p>

    <p className="text-white font-medium">
      {value}
    </p>
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
}) => (
  <div className="space-y-2">

    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">
      {label}
    </label>

    <input
      required
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300 focus:outline-none ${
        error
          ? 'border-rose-400 bg-rose-500/5'
          : 'border-white/10 hover:border-white/20'
      }`}
      placeholder={`Enter ${label.toLowerCase()}`}
    />

    {error && (
      <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
        <AlertCircle size={12} />
        {error}
      </p>
    )}

  </div>
);

const SectorSelect = ({
  sectors,
  formData,
  setFormData,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

    {sectors.map((sector) => (

      <button
        key={sector}
        type="button"
        onClick={() =>
          setFormData({
            ...formData,
            sector,
          })
        }
        className={`p-4 rounded-2xl text-sm font-bold uppercase tracking-widest border transition-all duration-300 ${
          formData.sector === sector
            ? 'bg-rp-blue text-white border-rp-blue'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
        }`}
      >
        {sector}
      </button>

    ))}

  </div>
);
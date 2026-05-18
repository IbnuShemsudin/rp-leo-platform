// src/components/FactSheet.jsx

import React, { useState } from 'react';
import {
  Shield,
  Globe,
  Award,
  Calendar,
  FileText,
  Hash,
  Download,
  Printer,
  CheckCircle,
  ExternalLink,
  FileBadge,
  User,
  Phone,
  Mail,
  Building2,
  Clock,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FactSheet({
  mou,
  user,
  token,
  onApprove,
  approving
}) {
  if (!mou) return null;
  const [iframeError, setIframeError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // SUPPORT ALL POSSIBLE FILE FIELDS (include nested shapes)
  const fileUrl =
    mou.fileUrl ||
    mou.documentUrl ||
    mou.document ||
    mou.pdf ||
    mou.pdfUrl ||
    mou.uploadedFile ||
    mou.initialDocumentUrl ||
    mou.signedDocumentUrl ||
    mou.file?.url ||
    mou.file ||
    mou.upload?.url ||
    mou.upload?.path ||
    mou.filePath ||
    mou.path ||
    null;

  // helpers
  const isRemoteUrl = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);

  const buildFinalUrl = (u) => {
    if (!u) return null;
    if (isRemoteUrl(u)) return u;
    // normalize leading slash
    const path = u.startsWith('/') ? u : `/${u}`;
    // if path already contains uploads, just prefix API
    if (path.includes('/uploads/')) return `${API}${path}`;
    return `${API}/uploads${path}`;
  };

  const finalFileUrl = buildFinalUrl(fileUrl);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // If a direct file URL exists try fetching it and forcing a download (handles protected files via token)
    if (finalFileUrl) {
      (async () => {
        setDownloading(true);
        try {
          const res = await fetch(finalFileUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
          if (!res.ok) throw new Error('Network response was not ok');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          const name = (mou.partnerName || 'mou').replace(/[^a-z0-9-_]/gi, '_') + '.pdf';
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (e) {
          // fallback to opening in new tab (some servers block blob downloads)
          window.open(finalFileUrl, '_blank');
        } finally {
          setDownloading(false);
        }
      })();
      return;
    }

    // No file URL: open a sanitized print-only window with textual details
    const escapeHtml = (str) => {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const printWindow = window.open('', '_blank');
    const partner = escapeHtml(mou.partnerName || 'Unknown Partner');
    const country = escapeHtml(mou.country || 'Unknown');
    const status = escapeHtml(mou.status || 'Unknown');
    const sector = escapeHtml(mou.sector || 'N/A');
    const objectives = escapeHtml(mou.objectives || 'No objectives provided.');

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>MoU - ${partner}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 40px; color: #111827 }
            .title { font-size: 28px; font-weight: 700; color: #1e40af; margin-bottom: 20px }
            .section { margin-bottom: 12px }
            .label { font-weight: 700 }
          </style>
        </head>
        <body>
          <div class="title">Memorandum of Understanding</div>
          <div class="section"><div class="label">Partner:</div><div>${partner}</div></div>
          <div class="section"><div class="label">Country:</div><div>${country}</div></div>
          <div class="section"><div class="label">Status:</div><div>${status}</div></div>
          <div class="section"><div class="label">Sector:</div><div>${sector}</div></div>
          <div class="section"><div class="label">Objectives:</div><div>${objectives}</div></div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="bg-white p-16 shadow-2xl max-w-[210mm] mx-auto border-t-[12px] border-rp-blue relative overflow-hidden print:shadow-none print:p-8 print:border-t-[8px] animate-in slide-in-from-bottom-4 duration-700">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rp-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-rp-gold/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* WATERMARK */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Shield size={600} className="text-rp-blue" />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-12 relative z-10">

        <div className="flex gap-6">

          <div className="w-20 h-20 bg-gradient-to-br from-rp-slate to-rp-blue rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-2xl tracking-tighter">
              SSGI
            </span>
          </div>

          <div className="space-y-1">

            <h1 className="text-3xl font-serif font-bold text-rp-slate tracking-tight">
              Memorandum of Understanding
            </h1>

            <p className="text-[11px] font-black text-rp-blue uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe size={12} />
              Regional Partnership Lead Executive Office
            </p>

            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Space Science & Geo-Spatial Institute • Strategic Registry
            </p>

          </div>
        </div>

        <div className="text-right border-l-2 border-gray-100 pl-6">

          <div className="flex items-center justify-end gap-2 text-gray-400 mb-1">
            <Hash size={10} />

            <p className="text-[10px] font-black uppercase tracking-widest">
              Registry ID
            </p>
          </div>

          <p className="text-lg font-mono font-bold text-rp-slate tracking-tighter">
            {(mou._id || mou.id)?.substring(0, 12).toUpperCase()}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <CheckCircle size={12} className="text-emerald-500" />

            <p className="text-[9px] font-bold text-rp-gold uppercase italic">
              Classification: Restricted
            </p>
          </div>

        </div>
      </div>

      {/* STATUS BANNER */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-y border-gray-200 py-4 px-8 mb-12 flex justify-between items-center rounded-lg shadow-sm">

        <div className="flex items-center gap-6">

          <StatusField
            icon={<Calendar size={14} className="text-blue-500" />}
            label="Issued Date"
            value={new Date().toLocaleDateString('en-GB')}
          />

          <StatusField
            icon={<Award size={14} className="text-rp-blue" />}
            label="Legal Status"
            value={mou.status?.toUpperCase()}
            color="text-rp-blue"
          />

        </div>

        <div className="text-right">

          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>

            <p className="text-[9px] font-black text-gray-400 uppercase">
              Document Version
            </p>
          </div>

          <p className="text-xs font-bold text-rp-slate bg-white/50 px-2 py-1 rounded-md">
            v2.0.4-Stable
          </p>

        </div>
      </div>

      {/* MAIN DETAILS */}
      <div className="grid grid-cols-3 gap-y-10 gap-x-12 mb-16 relative z-10">

        <div className="col-span-2">
          <DetailItem
            label="Primary Partner Institution"
            value={mou.partnerName}
          />
        </div>

        <div>
          <DetailItem
            label="Host Jurisdiction"
            value={mou.country}
          />
        </div>

        <div>
          <DetailItem
            label="Funding Framework"
            value={mou.fundingType || "Non-Governmental / Private"}
          />
        </div>

        <div>
          <DetailItem
            label="Operational Step"
            value={`Phase ${mou.currentStep || 1} of 10`}
          />
        </div>

        <div>
          <DetailItem
            label="Liaison Office"
            value="RP-LEO HQ"
          />
        </div>

      </div>

      {/* CLIENT INFORMATION */}
      <div className="col-span-3 border-t border-gray-200 pt-10 mt-4 mb-16">

        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-rp-blue mb-8">
          Client Submitted Information
        </h3>

        <div className="grid grid-cols-2 gap-8">

          <DetailItem
            icon={<User size={16} />}
            label="Contact Person"
            value={mou.contactPerson || "Not Provided"}
          />

          <DetailItem
            icon={<Phone size={16} />}
            label="Phone Number"
            value={mou.phone || mou.contactPhone || "Not Provided"}
          />

          <DetailItem
            icon={<Mail size={16} />}
            label="Email Address"
            value={mou.contactEmail || "Not Provided"}
          />

          <DetailItem
            icon={<Building2 size={16} />}
            label="Sector"
            value={mou.sector || "Not Specified"}
          />

          <DetailItem
            icon={<Clock size={16} />}
            label="Submission Date"
            value={
              mou.createdAt
                ? new Date(mou.createdAt).toLocaleString()
                : "Unknown"
            }
          />

          <DetailItem
            label="Submitted By"
            value={mou.createdBy?.name || "Unknown User"}
          />

          <div className="col-span-2">
            <DetailItem
              label="Description"
              value={mou.description || "No description provided"}
            />
          </div>

        </div>
      </div>

      {/* PDF SECTION */}
      <div className="mb-16 relative z-10">

        <div className="flex items-center gap-3 mb-6">

          <FileBadge size={18} className="text-rp-blue" />

          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-rp-blue">
            Uploaded Document
          </h3>

        </div>

        {finalFileUrl ? (
          <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-xl">

            {/* PDF HEADER */}
            <div className="bg-gradient-to-r from-rp-blue to-blue-700 text-white px-6 py-4 flex justify-between items-center">

              <div>

                <p className="font-black uppercase tracking-widest text-xs">
                  Uploaded PDF Document
                </p>

                <p className="text-xs opacity-80 mt-1">
                  Admin can preview and approve this file
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => window.open(finalFileUrl, '_blank')}
                  aria-label="Open document in new tab"
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase"
                >
                  <ExternalLink size={14} />
                  Open
                </button>

              </div>

            </div>

            {/* PDF PREVIEW */}
            {finalFileUrl && !iframeError ? (
              <iframe
                src={finalFileUrl}
                title="MoU PDF"
                onError={() => setIframeError(true)}
                className="w-full h-[700px] bg-white"
              />
            ) : (
              <div className="p-6">
                <div className="text-sm text-gray-600 mb-4">
                  {iframeError ? 'Preview unavailable — the document may be blocked from embedding.' : 'No uploaded PDF found.'}
                </div>
                {finalFileUrl ? (
                  <div className="flex gap-2">
                    <a
                      href={finalFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-rp-blue text-white rounded-xl"
                    >
                      Open Document
                    </a>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      aria-label="Download document"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
                    >
                      {downloading ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                ) : null}
              </div>
            )}

          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-bold">
            No uploaded PDF found.
          </div>
        )}

      </div>

      {/* OBJECTIVES */}
      <div className="space-y-4 mb-16 relative z-10">

        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">

          <FileText size={16} className="text-rp-gold" />

          <h3 className="text-xs font-black text-rp-slate uppercase tracking-[0.2em]">
            Article V: Strategic Objectives & Scope
          </h3>

        </div>

        <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 p-8 rounded-2xl border border-gray-100 min-h-[150px]">

          <p className="text-[13px] font-serif leading-relaxed text-slate-700 italic">
            "
            {mou.objectives ||
              "The specific collaborative frameworks, technical requirements, and strategic goals for this partnership are pending final administrative validation."
            }
            "
          </p>

        </div>
      </div>

      {/* APPROVAL WORKFLOW */}
      {['admin', 'executive'].includes(user?.role) && (
        <div className="mb-16 border-2 border-rp-blue/20 bg-rp-blue/5 rounded-3xl p-8 relative z-10">

          <div className="flex justify-between items-center flex-wrap gap-6">

            <div>

              <h3 className="text-xl font-black text-rp-blue uppercase tracking-tight">
                Approval Workflow
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Draft → Pending Validation → Signed
              </p>

            </div>

            <div className="flex gap-4 flex-wrap">

              {mou.status === "Draft" && (
                <button
                  onClick={() => onApprove?.("Pending Validation")}
                  disabled={approving}
                  className="px-6 py-4 rounded-2xl bg-yellow-500 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                  Move To Review
                </button>
              )}

              {mou.status === "Pending Validation" && (
                <button
                  onClick={() => onApprove?.("Signed")}
                  disabled={approving}
                  className="px-6 py-4 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                  Approve & Sign
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* FOOTER */}
      <div className="mt-24 pt-12 border-t-2 border-gray-100 flex justify-between items-start relative z-10">

        <div className="flex gap-16">

          <div className="space-y-6">

            <div className="w-40 h-[1px] bg-gradient-to-r from-rp-slate to-rp-blue"></div>

            <div>

              <p className="text-[10px] font-black text-rp-slate uppercase">
                Authorized Signatory
              </p>

              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Lead Executive Director, SSGI
              </p>

            </div>
          </div>

          <div className="space-y-6">

            <div className="w-40 h-[1px] bg-gradient-to-r from-rp-slate to-rp-blue"></div>

            <div>

              <p className="text-[10px] font-black text-rp-slate uppercase">
                Partner Representative
              </p>

              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Authorized Legal Entity
              </p>

            </div>
          </div>

        </div>

        <div className="text-center space-y-2">

          <div className="w-20 h-20 border-2 border-rp-blue/20 rounded-xl flex items-center justify-center mx-auto opacity-60">

            <div className="grid grid-cols-2 gap-1 p-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-rp-blue"></div>
              ))}
            </div>

          </div>

          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
            Digital System
            <br />
            Verification
          </p>

        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="absolute bottom-8 right-8 flex gap-3 print:hidden">

        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
        >
          <Download size={14} />
          Download
        </button>

        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-rp-slate to-rp-blue text-white px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
        >
          <Printer size={14} />
          Print PDF
        </button>

      </div>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="space-y-1">

      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <p className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </p>
      </div>

      <p className="text-base font-bold text-slate-800 tracking-tight leading-tight break-words">
        {value}
      </p>

    </div>
  );
}

function StatusField({ icon, label, value, color = "text-rp-slate" }) {
  return (
    <div className="flex items-center gap-3">

      <div className="text-gray-400">
        {icon}
      </div>

      <div>

        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
          {label}
        </p>

        <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
          {value}
        </p>

      </div>
    </div>
  );
}
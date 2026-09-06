import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(state?.email || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Verification failed.");
      login(data.user, data.token);
      navigate(["admin", "executive"].includes(data.user?.role) ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Could not resend the code.");
      setMessage(data.msg);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-[#05070a] text-slate-100">
      <form onSubmit={verify} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0f17] p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#00A8B5]/15 text-[#00A8B5] flex items-center justify-center mb-6">
          <MailCheck size={28} />
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-[#DE984B] uppercase">Account security</p>
        <h1 className="text-2xl font-black mt-2">Verify your email</h1>
        <p className="text-sm text-slate-400 mt-2">Enter the six-digit code sent to your email. It expires after 10 minutes.</p>

        {error && <p className="mt-5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-300">{error}</p>}
        {message && <p className="mt-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-300">{message}</p>}

        <label className="block mt-6 text-xs font-bold text-slate-300">Email address</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#00A8B5]" />
        <label className="block mt-5 text-xs font-bold text-slate-300">Verification code</label>
        <input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-xl tracking-[0.45em] text-white outline-none focus:border-[#00A8B5]" />

        <button disabled={busy} className="mt-6 w-full rounded-xl bg-[#00A8B5] py-3 font-black text-sm disabled:opacity-60 flex justify-center items-center gap-2">
          {busy ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />} Verify email
        </button>
        <button type="button" disabled={busy || !email} onClick={resend} className="mt-3 w-full py-2 text-sm font-bold text-[#DE984B] disabled:opacity-50 flex justify-center items-center gap-2">
          <RefreshCw size={15} /> Resend code
        </button>
      </form>
    </main>
  );
}

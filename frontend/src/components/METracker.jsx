import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllMous } from '../services/mouService';

export default function METracker({
  progress = 78,
  compliance = 92,
  reporting = 65,
  pendingMoUs = 4,
  lastUpdated = null,
  realtime = false,
  pollingInterval = 8000,
}) {
  const { token } = useAuth();

  const [prog, setProg] = useState(Math.max(0, Math.min(100, Number(progress) || 0)));
  const [comp, setComp] = useState(Math.max(0, Math.min(100, Number(compliance) || 0)));
  const [rep, setRep] = useState(Math.max(0, Math.min(100, Number(reporting) || 0)));
  const [pending, setPending] = useState(pendingMoUs || 0);
  const [lastUpd, setLastUpd] = useState(lastUpdated);
  const [animated, setAnimated] = useState(0);

  // SVG Circle Math
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    let raf;
    let start;
    const duration = 900; // ms
    const from = animated;
    const to = prog;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prog]);

  useEffect(() => {
    if (!realtime) return;
    let mounted = true;

    const fetchStats = async () => {
      try {
        const data = await getAllMous(token);
        if (!mounted || !Array.isArray(data)) return;

        const total = data.length || 0;
        const sumSteps = data.reduce((s, m) => s + (m.current_step || m.currentStep || 1), 0);
        const avgCompletion = total ? Math.round((sumSteps / (10 * total)) * 100) : 0;

        const active = data.filter(m => ((m.status || '').toString().toLowerCase() === 'active')).length;
        const complianceVal = total ? Math.round((active / total) * 100) : 0;

        const reportingVal = total ? Math.round((data.filter(m => (m.current_step || m.currentStep || 0) >= 7).length / total) * 100) : 0;

        const pendingCount = data.filter(m => ['pending validation', 'draft'].includes((m.status || '').toString().toLowerCase())).length;

        const latestTs = data.reduce((mx, m) => {
          const t = new Date(m.updated_at || m.updatedAt || 0).getTime();
          return t > mx ? t : mx;
        }, 0);

        if (mounted) {
          setProg(avgCompletion);
          setComp(complianceVal);
          setRep(reportingVal);
          setPending(pendingCount);
          setLastUpd(latestTs ? new Date(latestTs).toISOString() : null);
        }
      } catch (err) {
        console.error('METracker realtime fetch failed', err);
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, pollingInterval);
    return () => { mounted = false; clearInterval(id); };
  }, [realtime, token, pollingInterval]);

  return (
    <div className="glass-panel p-8 rounded-[40px] flex items-center gap-10 border border-white/5 relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rp-blue/5 to-transparent pointer-events-none"></div>

      {/* Radial Progress Gauge */}
      <div className="relative flex items-center justify-center shrink-0" role="img" aria-label={`Efficiency ${animated} percent`}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          role="progressbar"
          aria-valuenow={animated}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Regional efficiency score"
        >
          <defs>
            <linearGradient id="rpGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Progress Track */}
          <circle
            stroke="url(#rpGrad)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 280ms linear' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{animated}%</span>
          <span className="text-[8px] font-black text-rp-gold uppercase tracking-widest mt-1">Efficiency</span>
        </div>
      </div>

      {/* Data Readout */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">System Health</h3>
          <p className="text-xl font-black text-white uppercase tracking-tighter">Regional Impact Rating</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-500 uppercase">Compliance</span>
              <span className="text-[10px] font-black text-white/80">{Math.round(comp)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, comp))}%` }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-500 uppercase">Reporting</span>
              <span className="text-[10px] font-black text-white/80">{Math.round(rep)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-rp-gold" style={{ width: `${Math.max(0, Math.min(100, rep))}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
            <span className="text-emerald-400">● LIVE:</span> SSGI regional assets are performing within nominal parameters.
          </p>
          <div className="text-right">
            <div className="text-[12px] font-black text-white">{pending} MoUs</div>
            <div className="text-[10px] text-gray-400">Pending evaluation</div>
            {lastUpd && (
              <div className="text-[9px] text-gray-500 mt-1">Updated: {new Date(lastUpd).toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
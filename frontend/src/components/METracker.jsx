import React from 'react';

export default function METracker({ progress = 78 }) {
  // SVG Circle Math
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-panel p-8 rounded-[40px] flex items-center gap-10 border border-white/5 relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rp-blue/5 to-transparent pointer-events-none"></div>

      {/* Radial Progress Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
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
            stroke="var(--color-rp-blue)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{progress}%</span>
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
            <span className="text-[9px] font-black text-gray-500 uppercase">Compliance</span>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[92%]"></div>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase">Reporting</span>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-rp-gold w-[65%]"></div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 font-bold leading-relaxed border-t border-white/5 pt-4">
          <span className="text-emerald-400">● LIVE:</span> SSGI regional assets are performing within nominal parameters. 4 MoUs pending quarterly evaluation.
        </p>
      </div>
    </div>
  );
}
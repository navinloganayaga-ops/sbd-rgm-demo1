import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function EnterpriseHeader() {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800/80 py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 shadow-2xl relative z-20">
      <div className="flex items-center gap-3">
        {/* SBD Inspired Solid Block Logo Accent */}
        <div className="bg-[#FFC20E] text-black font-display font-black text-lg px-3 py-1 select-none tracking-tighter flex items-center justify-center relative shadow-[0_2px_10px_rgba(255,194,14,0.15)]">
          SBD
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-base md:text-lg text-white tracking-tight leading-none uppercase">
              Art of the Possible: <span className="text-[#FFC20E] relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#FFC20E]/40">SBD Enterprise RGM AI Suite</span>
            </h1>
          </div>
          <p className="text-[9px] font-mono text-zinc-500 tracking-wider mt-1 uppercase flex items-center gap-1.5 font-bold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFC20E] animate-pulse"></span>
            COMMERCIAL INTELLIGENCE & AGENT ENGINE • ROADMAP VISION
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Angled SBD Yellow Badge */}
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-yellow-400/10 blur-sm rounded-none"></div>
          <div className="relative bg-[#FFC20E] text-black font-display font-black text-[9px] px-3.5 py-1.5 tracking-widest uppercase transform skew-x-12 border border-black/10 select-none">
            <span className="block transform -skew-x-12">SBD ADVANCED ANALYTICS</span>
          </div>
        </div>

        {/* Live Status Indicator Badge */}
        <div className="bg-[#0f1b11] border border-emerald-500/10 rounded-none px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          <Cpu size={12} className="text-emerald-400" />
          <span>AI AGENTS: 5/5 LIVE</span>
        </div>
      </div>
    </header>
  );
}

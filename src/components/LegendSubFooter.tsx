import React from 'react';

export default function LegendSubFooter() {
  return (
    <div className="bg-zinc-950 border-t border-zinc-900 py-3.5 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-xs font-sans">
      {/* Bottom Left Legend */}
      <div className="flex flex-wrap items-center gap-5 text-zinc-500">
        <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest mr-1">
          Aesthetic Legend:
        </span>
        
        {/* Diagnostics (Historical Data) */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-zinc-800 border border-zinc-700 inline-block rounded-sm" />
          <span className="text-[11px] text-zinc-400 font-medium">Diagnostics (Historical)</span>
        </div>

        {/* Predictive Modeling */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-600 border border-[#FFC20E]/20 inline-block rounded-sm animate-pulse" />
          <span className="text-[11px] text-zinc-400 font-medium">Predictive Modeling</span>
        </div>

        {/* Pure SBD Yellow Pill - Active Autonomous AI Agents */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FFC20E] inline-block rounded-sm" />
          <span className="text-[11px] font-bold text-zinc-200">Active AI Agents</span>
        </div>
      </div>

      {/* Bottom Right Versioning */}
      <div className="text-[10px] text-zinc-600 font-bold tracking-wider text-right uppercase">
        SBD-RGM-PROTOTYPE // v2.4
      </div>
    </div>
  );
}

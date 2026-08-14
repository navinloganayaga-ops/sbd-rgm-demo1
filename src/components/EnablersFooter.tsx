import React from 'react';
import { Database, RefreshCw, Layers, Users, Globe } from 'lucide-react';

export default function EnablersFooter() {
  const pillars = [
    {
      title: 'Data Foundation',
      desc: 'SBD SAP ERP + Databricks Transference/Cannibalization Models + Circana POS + Attribute Cosine Similarity Engine.',
      icon: Database,
    },
    {
      title: 'Agile Processes',
      desc: 'Continuous Value Track: Bi-weekly data science refinement loops optimizing algorithmic models.',
      icon: RefreshCw,
    },
    {
      title: 'Insights & Tooling',
      desc: 'Advanced AI Infrastructure: Scalable Databricks data layers mapped straight to LLM orchestration layers.',
      icon: Layers,
    },
    {
      title: 'People & Organization',
      desc: 'Commercial Enablement: Specialized upsell tool training modules for field account managers.',
      icon: Users,
    },
    {
      title: 'Capability Scale',
      desc: 'Global Execution Framework: Scaling successful localized RGM models across worldwide operational units.',
      icon: Globe,
    },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 py-6 px-6 mt-auto shadow-2xl shrink-0 font-sans">
      <div className="max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-900">
          <div>
            <span className="text-[10px] text-[#FFC20E] uppercase tracking-widest block font-bold mb-0.5">SBD Foundational Pillars</span>
            <h3 className="text-sm font-black text-zinc-100 tracking-wide">
              Enterprise RGM AI Enablement Layer
            </h3>
          </div>
          <div className="text-right text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            Roadmap Framework // Secure Data Domain
          </div>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="bg-zinc-900 border border-zinc-800/80 rounded-sm p-4 hover:border-[#FFC20E]/40 hover:bg-zinc-950/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-zinc-950 p-2 rounded-sm text-[#FFC20E] border border-zinc-850">
                    <Icon size={14} />
                  </div>
                  <h4 className="font-bold text-[11px] text-zinc-100 tracking-wide uppercase">
                    {idx + 1}. {pillar.title}
                  </h4>
                </div>
                
                <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

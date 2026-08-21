import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

target = """    const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setCurrentPhase(1)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Step 1</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Set Price Increase' : 'Optimization Parameters'}</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 1 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
        <button onClick={() => setCurrentPhase(2)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 2 ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 2 ? 'text-slate-400' : currentPhase > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>Step 2</div>
            <div className="text-sm font-bold tracking-tight">Set Customer Targets</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 2 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
        <button onClick={() => setCurrentPhase(3)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 3 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 3 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'}`}>
            3
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 3 ? 'text-slate-400' : 'text-slate-500'}`}>Step 3</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Financial Outputs' : 'Optimized Output'}</div>
          </div>
          <Sparkles size={16} className={currentPhase === 3 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
      </div>
    </div>
  );"""

replacement = """    const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setCurrentPhase(1)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : 'bg-emerald-600 text-white'}`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Step 1</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Set Price Increase' : 'Optimization Parameters'}</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 1 ? 'text-[#FFC20E]' : 'text-emerald-600'} />
        </button>
        <button onClick={() => setCurrentPhase(2)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'}`}>
            2
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 2 ? 'text-slate-400' : 'text-slate-500'}`}>Step 2</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Financial Outputs' : 'Optimized Output'}</div>
          </div>
          <Sparkles size={16} className={currentPhase === 2 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
      </div>
    </div>
  );"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully!")
else:
    print("Target not found.")

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)

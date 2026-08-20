const fs = require('fs');

let content = fs.readFileSync('src/components/StrategicPricingModule.tsx', 'utf8');

// Ensure ChevronRight is imported
if (!content.includes('ChevronRight')) {
  content = content.replace('Filter } from \'lucide-react\';', 'Filter, ChevronRight } from \'lucide-react\';');
}

// Add state for currentPhase
if (!content.includes('const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState<TabType>\('simulator'\);/,
    "const [activeTab, setActiveTab] = useState<TabType>('simulator');\n  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);"
  );
}

// Modify simulate function to increment phase
content = content.replace(
  /const simulate = \(\) => {[\s\S]*?setIsSimulated\(true\);[\s\S]*?};/,
  `const simulate = () => {
    // Reset output block
    setIsSimulated(false);
    setTimeout(() => {
      setSkus(skus.map(s => ({ ...s, status: s.proposedIncrease > 0 ? 'Modified' : 'Base' })));
      setIsSimulated(true);
      setCurrentPhase(3);
    }, 800);
  };`
);

// We need to inject the phase indicators block inside the render method.
const renderPhaseIndicatorsStr = `
  const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setCurrentPhase(1)} className={\`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors \${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}\`}>
          <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 \${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}\`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <div className={\`text-[10px] font-semibold uppercase tracking-wider \${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}\`}>Step 1</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Set Price Increase' : 'Optimization Parameters'}</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 1 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>

        <button onClick={() => setCurrentPhase(2)} className={\`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors \${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}\`}>
          <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 \${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}\`}>
            {currentPhase > 2 ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <div className={\`text-[10px] font-semibold uppercase tracking-wider \${currentPhase === 2 ? 'text-slate-400' : currentPhase > 2 ? 'text-emerald-700' : 'text-slate-500'}\`}>Step 2</div>
            <div className="text-sm font-bold tracking-tight">Set Customer Targets</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 2 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>

        <button onClick={() => setCurrentPhase(3)} className={\`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors \${currentPhase === 3 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}\`}>
          <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 \${currentPhase === 3 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'}\`}>
            3
          </div>
          <div className="flex-1">
            <div className={\`text-[10px] font-semibold uppercase tracking-wider \${currentPhase === 3 ? 'text-slate-400' : 'text-slate-500'}\`}>Step 3</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Financial Outputs' : 'Optimized Output'}</div>
          </div>
          <Sparkles size={16} className={currentPhase === 3 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
      </div>
    </div>
  );
`;

content = content.replace(
  'return (',
  renderPhaseIndicatorsStr + '\n  return ('
);

// We need to replace the entire top header structure!
const newHeader = `
    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">
      <div className="bg-white flex flex-col shrink-0">
        <div className="px-6 pt-5 pb-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('simulator'); setCurrentPhase(1); setIsSimulated(false); }}
              className={\`px-5 py-2.5 text-sm font-bold rounded flex items-center justify-center transition-colors \${
                activeTab === 'simulator' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }\`}
            >
              Simulator
            </button>
            <button 
              onClick={() => { setActiveTab('optimizer'); setCurrentPhase(1); setIsSimulated(false); }}
              className={\`px-5 py-2.5 text-sm font-bold rounded flex items-center justify-center transition-colors \${
                activeTab === 'optimizer' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white border border-transparent text-slate-500 hover:text-slate-900'
              }\`}
            >
              Optimizer
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
            Channel Owner Home / Prescriptive RGM
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'simulator' ? 'Strategic Pricing Simulator' : 'Strategic Pricing Optimizer'}
            </h1>
            <span className={\`text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-wide \${
              activeTab === 'simulator' 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }\`}>
              {activeTab === 'simulator' ? 'Interactive Module' : 'Algorithmic Engine'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Scenario:</span>
            <input 
              type="text" 
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="text-sm font-bold text-slate-900 border-b border-dashed border-slate-300 focus:outline-none focus:border-slate-500 bg-transparent px-1 min-w-[300px]"
            />
          </div>
        </div>

        <div className="px-6 pb-4">
          <GlobalFilterBar 
            filters={filterState} 
            onChange={setFilterState} 
            onApply={() => console.log('Filters Applied', filterState)} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {renderPhaseIndicators()}
`;

// Find where header starts.
// Looking for: <GlobalFilterBar ... /> all the way to <div className="flex-1 overflow-auto p-6 space-y-6">
const startStr = `<GlobalFilterBar `;
const endStr = `<div className="flex-1 overflow-auto p-6 space-y-6">`;
if (content.includes(startStr) && content.includes(endStr)) {
  const headPart = content.substring(0, content.indexOf(startStr));
  const tailPart = content.substring(content.indexOf(endStr) + endStr.length);
  content = headPart + newHeader + tailPart;
}

fs.writeFileSync('src/components/StrategicPricingModule.tsx', content);

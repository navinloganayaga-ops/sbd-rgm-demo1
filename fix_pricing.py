import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Fix duplicate return
content = content.replace('  return (\n    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">\n      \n    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">', '  return (\n    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">')

# Remove "(Germany Level)"
content = content.replace('Simulated GSV (Germany Level)', 'Simulated GSV')

# Add MultiSelect import
if "import MultiSelect" not in content:
    content = content.replace("import GlobalFilterBar", "import MultiSelect from './MultiSelect';\nimport GlobalFilterBar")

# Find and replace mockSkus
mock_skus_regex = re.compile(r'const mockSkus = \[.*?\];', re.DOTALL)
new_mock_skus = """
export const productOptions = [
  { id: '1', label: 'DeWalt 20V MAX Cordless Drill Kit', subtitle: 'SKU: DCD771C2', price: 159.00, vol: '124.5K' },
  { id: '2', label: 'Stanley FatMax 25ft Tape Measure 2-Pack', subtitle: 'SKU: FMHT33338', price: 24.99, vol: '85.2K' },
  { id: '3', label: 'Craftsman 135-Pc Mechanics Tool Set', subtitle: 'SKU: CMMT99206', price: 99.00, vol: '42.0K' },
  { id: '4', label: 'BLACK+DECKER Mouse Detail Sander', subtitle: 'SKU: BDEMS600', price: 34.00, vol: '56.1K' },
  { id: '5', label: 'DeWalt 20V MAX Circular Saw', subtitle: 'SKU: DCS391B', price: 129.00, vol: '90.3K' },
  { id: '6', label: 'PORTER-CABLE Compact Router', subtitle: 'SKU: PCE6430', price: 119.99, vol: '31.4K' }
];

const mockSkus = [
  { id: '1', sku: 'DCD771C2', desc: 'DeWalt 20V MAX Cordless Drill Kit', listPrice: 159.00, proposedIncrease: 10, newPrice: 174.90, cogsInc: 5, status: 'Base' },
  { id: '2', sku: 'FMHT33338', desc: 'Stanley FatMax 25ft Tape Measure', listPrice: 24.99, proposedIncrease: 0, newPrice: 24.99, cogsInc: 0, status: 'Base' },
  { id: '3', sku: 'CMMT99206', desc: 'Craftsman 135-Pc Mechanics Tool Set', listPrice: 99.00, proposedIncrease: 15, newPrice: 113.85, cogsInc: 8, status: 'Base' },
  { id: '4', sku: 'BDEMS600', desc: 'BLACK+DECKER Mouse Detail Sander', listPrice: 34.00, proposedIncrease: 5, newPrice: 35.70, cogsInc: 2, status: 'Base' },
  { id: '5', sku: 'DCS391B', desc: 'DeWalt 20V MAX Circular Saw', listPrice: 129.00, proposedIncrease: 8, newPrice: 139.32, cogsInc: 3, status: 'Base' },
  { id: '6', sku: 'PCE6430', desc: 'PORTER-CABLE Compact Router', listPrice: 119.99, proposedIncrease: 0, newPrice: 119.99, cogsInc: 0, status: 'Base' }
];
"""
content = mock_skus_regex.sub(new_mock_skus.strip(), content, 1)

# Modify phase logic
content = content.replace('const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);', "const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);\n  const [selectedSkus, setSelectedSkus] = useState<string[]>(['1', '2', '3']);")

content = content.replace('setCurrentPhase(2);', 'setCurrentPhase(3);')
content = content.replace('currentPhase === 2', 'currentPhase === 3')
# We need to change `currentPhase === 1` blocks to `currentPhase === 2` manually, but first we replace the indicators.

# Replace indicators
old_indicators_regex = re.compile(r'const renderPhaseIndicators = \(\) => \(.*?\);\n', re.DOTALL)
new_indicators = """const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setCurrentPhase(1)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : 'bg-emerald-600 text-white'}`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Step 1</div>
            <div className="text-sm font-bold tracking-tight">Scenario Setup</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 1 ? 'text-[#FFC20E]' : 'text-emerald-600'} />
        </button>
        <button onClick={() => setCurrentPhase(2)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 2 ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 2 ? 'text-slate-400' : currentPhase > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>Step 2</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Set Price Increase' : 'Optimization Parameters'}</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 2 ? 'text-[#FFC20E]' : currentPhase > 2 ? 'text-emerald-600' : 'text-slate-400'} />
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
  );
"""
content = old_indicators_regex.sub(new_indicators, content, 1)

# Now, we need to shift Phase 1 blocks to Phase 2.
# Then we prepend Phase 1 code.
# In `StrategicPricingModule`, there is a `{activeTab === 'simulator' && (` and `{activeTab === 'optimizer' && (`.
# Actually, Scenario Setup should apply to BOTH tabs, so we can just put it outside of the tab condition? Or inside both?
# The user might want the setup step to be tab-independent. So if currentPhase === 1, we show the setup block.
# Let's see the structure:
"""
        {renderPhaseIndicators()}

        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentPhase === 1 && (<>...
"""
# We can just change all `currentPhase === 1` to `currentPhase === 2`. (But wait, `currentPhase === 1` is also in `renderPhaseIndicators`, which we just replaced! So we should be careful.)
# Better to do a precise replacement.

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)


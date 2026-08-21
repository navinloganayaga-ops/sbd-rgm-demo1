import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# 1. Update existing Phase conditions
content = content.replace('{currentPhase === 2 && (', '{currentPhase === 3 && (')
content = content.replace('{currentPhase === 2 && isSimulated && (', '{currentPhase === 3 && isSimulated && (')
content = content.replace('{currentPhase === 1 && (<>', '{currentPhase === 2 && (<>')

# Now `currentPhase === 1` is completely gone. We need to add it before the `{activeTab === 'simulator' && (` part.
# Let's find: `{activeTab === 'simulator' && (`
# Wait, let's insert it right after `{renderPhaseIndicators()}`
scenario_setup_block = """
        {currentPhase === 1 && (
          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col p-6 animate-in fade-in duration-300">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4 mb-4">
              <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">1</span>
              Scenario Setup
            </h3>
            
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scenario Name</label>
                  <input 
                    type="text" 
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded p-2 focus:outline-none focus:border-slate-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Retailer Channel</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-500">
                    <option>Home Depot</option>
                    <option>Lowe's</option>
                    <option>Amazon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Participating Product Lines</label>
                <p className="text-xs text-slate-500 -mt-1 mb-3">Select SKUs to include in this pricing scenario. Only selected items will be available in the next step.</p>
                <div className="max-w-xl">
                  <MultiSelect 
                    options={productOptions}
                    selectedIds={selectedSkus}
                    onChange={setSelectedSkus}
                    placeholder="Select participating SKUs..."
                  />
                </div>
                {selectedSkus.length > 0 && (
                  <div className="mt-4 border border-slate-200 rounded overflow-hidden max-w-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3 text-right">Base Price</th>
                          <th className="p-3 text-right">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedSkus.map(id => {
                          const opt = productOptions.find(o => o.id === id);
                          if (!opt) return null;
                          return (
                            <tr key={id}>
                              <td className="p-3">
                                <div className="font-semibold text-slate-900">{opt.label}</div>
                                <div className="text-[10px] text-slate-500">{opt.subtitle}</div>
                              </td>
                              <td className="p-3 text-right font-medium text-slate-700">${opt.price?.toFixed(2)}</td>
                              <td className="p-3 text-right font-medium text-slate-700">{opt.vol}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                <Save size={16} /> Save Scenario
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                 Compare Scenarios
              </button>
              <button 
                onClick={() => setCurrentPhase(2)}
                className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                disabled={selectedSkus.length === 0}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
"""
content = content.replace('{renderPhaseIndicators()}\n\n        {activeTab === \'simulator\' && (', '{renderPhaseIndicators()}\n\n' + scenario_setup_block + '\n        {activeTab === \'simulator\' && (')

# Wait, we need to filter `skus` in Phase 2 so that only `selectedSkus` are mapped.
# In `StrategicPricingModule.tsx`, there are blocks mapping over `skus`:
# `{skus.map(sku => (` -> `{skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => (`
content = content.replace('{skus.map(sku => (', '{skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => (')
# There's also one `{skus.map(sku => {` 
content = content.replace('{skus.map(sku => {', '{skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => {')

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)


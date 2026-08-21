import re

with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    content = f.read()

# State injection
state_injection = """  const [expandedSimulationId, setExpandedSimulationId] = useState<string | null>(null);
  const [includedSimulations, setIncludedSimulations] = useState<Record<string, boolean>>({});"""

if "expandedSimulationId" not in content:
    content = content.replace("const [npiTargetId, setNpiTargetId] = useState<string | null>(null);", "const [npiTargetId, setNpiTargetId] = useState<string | null>(null);\n" + state_injection)

# Helper function
helper_injection = """
  // Helper to toggle inclusion
  const toggleSimulationInclusion = (id: string) => {
    setIncludedSimulations(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };
"""

if "toggleSimulationInclusion" not in content:
    content = content.replace("const handleOpenNpiModal =", helper_injection + "\n  const handleOpenNpiModal =")

tab3_regex = re.compile(r"\{\/\* TAB 3: TRANSFERENCE SIMULATION \*\/.*?\{\/\* TAB 4: SCENARIO GOVERNANCE \*\/", re.DOTALL)

tab3_replacement = """{/* TAB 3: TRANSFERENCE SIMULATION */}
          {activeTab === 'simulation' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Demand Transference Analysis</h2>
                  <p className="text-slate-500 font-medium text-sm mt-1">Review AI-predicted volume shifts and select which actions to include in the final scenario.</p>
                </div>
              </div>

              <div className="space-y-4">
                {workspaceSkus.filter(s => s.action === 'delist' || s.action === 'swap' || (s.isNpi && !s.linkedTo)).map(actionSku => {
                  const isExpanded = expandedSimulationId === actionSku.id;
                  const isIncluded = includedSimulations[actionSku.id] !== false; // default true
                  
                  return (
                    <div key={actionSku.id} className={`bg-white border rounded shadow-sm overflow-hidden transition-all duration-200 ${isIncluded ? 'border-slate-300' : 'border-slate-200 opacity-70 bg-slate-50/50'}`}>
                      {/* Summary Header */}
                      <div className="p-4 flex items-center gap-4 bg-white cursor-pointer hover:bg-slate-50" onClick={() => setExpandedSimulationId(isExpanded ? null : actionSku.id)}>
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isIncluded}
                            onChange={() => toggleSimulationInclusion(actionSku.id)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                        
                        <div className="w-24 shrink-0">
                          {actionSku.action === 'delist' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700"><AlertTriangle size={12}/> Delist</span>}
                          {actionSku.action === 'swap' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700"><RefreshCw size={12}/> Swap</span>}
                          {actionSku.action === 'none' && actionSku.isNpi && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700"><Sparkles size={12}/> New NPI</span>}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900">{actionSku.description}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">Base GSV: {actionSku.gsv} | Margin: {actionSku.mac}</div>
                        </div>

                        <div className="text-right">
                           {actionSku.action === 'delist' && (
                             <>
                               <div className="text-sm font-bold text-slate-900">74.2% Retained</div>
                               <div className="text-xs text-slate-500">25.8% Walk-Away</div>
                             </>
                           )}
                           {actionSku.action === 'swap' && (
                             <>
                               <div className="text-sm font-bold text-emerald-600">+1.2M GSV</div>
                               <div className="text-xs text-slate-500">NPI Cannibalizes 58%</div>
                             </>
                           )}
                           {actionSku.action === 'none' && actionSku.isNpi && (
                             <>
                               <div className="text-sm font-bold text-emerald-600">30% Incremental</div>
                               <div className="text-xs text-slate-500">70% Cannibalization</div>
                             </>
                           )}
                        </div>

                        <div className="ml-4 text-slate-400">
                          {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50">
                          {actionSku.action === 'delist' && (
                            <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
                              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><ArrowRight size={14} className="text-emerald-500"/> Where the demand shifts</h5>
                              <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                                  <tr>
                                    <th className="p-3">Destination SKU</th>
                                    <th className="p-3 text-right">Share of Lost Vol</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  <tr>
                                    <td className="p-3 font-medium text-slate-900">DeWalt 20V Combo 2-Tool</td>
                                    <td className="p-3 text-right font-bold text-emerald-600">45.0%</td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 font-medium text-slate-900">DeWalt 20V MAX Drill Driver</td>
                                    <td className="p-3 text-right font-bold text-emerald-600">29.2%</td>
                                  </tr>
                                  <tr className="bg-rose-50/50">
                                    <td className="p-3 font-medium text-slate-600 italic">Competitor Walk-Away</td>
                                    <td className="p-3 text-right font-bold text-rose-600">25.8%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          {actionSku.action === 'swap' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
                                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><ArrowRight size={14} className="text-amber-500 rotate-180"/> Source of NPI Volume</h5>
                                <table className="w-full text-left text-sm">
                                  <thead className="text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                                    <tr>
                                      <th className="p-3">Source</th>
                                      <th className="p-3 text-right">Share</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    <tr>
                                      <td className="p-3 font-medium text-slate-900">Cannibalized: {actionSku.description} (Legacy)</td>
                                      <td className="p-3 text-right font-bold text-amber-600">58.0%</td>
                                    </tr>
                                    <tr>
                                      <td className="p-3 font-medium text-slate-900">Cannibalized: 12V Max Drill</td>
                                      <td className="p-3 text-right font-bold text-amber-600">12.0%</td>
                                    </tr>
                                    <tr className="bg-emerald-50/50">
                                      <td className="p-3 font-medium text-slate-900">Pure Incremental Growth</td>
                                      <td className="p-3 text-right font-bold text-emerald-600">30.0%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="bg-emerald-50 border border-emerald-100 rounded p-4 flex flex-col justify-center shadow-sm">
                                <div className="text-center">
                                  <div className="text-3xl font-black text-emerald-700 mb-1">+180 bps</div>
                                  <div className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Net Margin Expansion</div>
                                  <p className="text-xs text-emerald-600 mt-2">NPI trades up users to a higher margin profile while mitigating full platform walk-away.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {actionSku.action === 'none' && actionSku.isNpi && (
                            <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
                              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><ArrowRight size={14} className="text-amber-500 rotate-180"/> Cannibalization Impact</h5>
                              <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                                  <tr>
                                    <th className="p-3">Source Volume</th>
                                    <th className="p-3 text-right">Share</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  <tr>
                                    <td className="p-3 font-medium text-slate-900">Cannibalized from existing 20V Core</td>
                                    <td className="p-3 text-right font-bold text-amber-600">45.0%</td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 font-medium text-slate-900">Cannibalized from 12V Max Platform</td>
                                    <td className="p-3 text-right font-bold text-amber-600">25.0%</td>
                                  </tr>
                                  <tr className="bg-emerald-50/50">
                                    <td className="p-3 font-medium text-slate-900">Pure Incremental Growth</td>
                                    <td className="p-3 text-right font-bold text-emerald-600">30.0%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {workspaceSkus.filter(s => s.action === 'delist' || s.action === 'swap' || (s.isNpi && !s.linkedTo)).length === 0 && (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded shadow-sm text-slate-500">
                    <AlertTriangle size={32} className="mx-auto mb-3 text-slate-400" />
                    <h3 className="font-bold text-slate-900">No actions to simulate</h3>
                    <p className="text-sm mt-1">Go back to step 2 and select SKUs to delist, swap, or add new NPIs.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 flex justify-end">
                <button 
                  onClick={() => setActiveTab('governance')}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded font-bold shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
                  disabled={workspaceSkus.filter(s => s.action === 'delist' || s.action === 'swap' || (s.isNpi && !s.linkedTo)).length === 0}
                >
                  Apply Selections & View Summary <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SCENARIO GOVERNANCE */}"""

content = tab3_regex.sub(tab3_replacement, content)


# Now to remove the Cross Functional Sign Off from Tab 4
tab4_grid_regex = re.compile(r'<div className="grid grid-cols-1 md:grid-cols-3 gap-6">\s*\{/\* Main Content Area \(2/3 width\) \*/\}\s*<div className="md:col-span-2 space-y-6">', re.DOTALL)
content = tab4_grid_regex.sub('<div className="space-y-6">', content)

cross_functional_regex = re.compile(r'\{/\* SBD Collaboration Panel \(Right Column\) \*/\}.*?(?=</main>)', re.DOTALL)
content = cross_functional_regex.sub('', content)

# But wait, there might be closing divs!
# The grid has `</div>` at the end of the col-span-2, then `<div className="md:col-span-1">` 
# I will instead just use string replacements for the specific start of the right column until its end.

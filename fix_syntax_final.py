with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Fix Simulator Phase 1 end syntax error
sim_err = """                    ))}
                  </tbody>
                </table>
              </div>
            </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}"""

sim_fix = """                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}"""

content = content.replace(sim_err, sim_fix)

# Fix Optimizer Phase 1 end syntax error
opt_err = """                </div>
              </div>
            </div>
            </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Run Optimizer Engine
                </button>
              </div>
            </div>
            </>)}"""

opt_fix = """                </div>
              </div>
            </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Run Optimizer Engine
                </button>
              </div>
            </div>
            </>)}"""

content = content.replace(opt_err, opt_fix)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)

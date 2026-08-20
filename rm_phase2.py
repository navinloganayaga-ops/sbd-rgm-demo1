with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# For Simulator Tab: Phase 2 Removal
start_marker = "            </>)}\n            {currentPhase === 2 && (\n            <>\n            {/* Step 2: Customer Targets */}"
end_marker = "            {/* Output Deep Dive (Visible after simulation) */}\n            {currentPhase === 3 && isSimulated && ("

if start_marker in content and end_marker in content:
    before = content.split(start_marker)[0]
    after = content.split(end_marker)[1]
    
    new_middle = '''              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}
            {/* Output Deep Dive (Visible after simulation) */}
            {currentPhase === 2 && isSimulated && ('''
            
    content = before + new_middle + after
else:
    print("Failed to find Simulator markers.")


# For Optimizer Tab: Phase 2 Removal
start_marker_opt = "            </>)}\n            {currentPhase === 2 && (\n            <>\n            {/* Step 2: Customer Targets */}"
end_marker_opt = "            {/* Empty State Table / Simulated State */}\n            {currentPhase === 3 && ("

if start_marker_opt in content and end_marker_opt in content:
    before = content.split(start_marker_opt)[0]
    after = content.split(end_marker_opt)[1]
    
    new_middle_opt = '''              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Run Optimizer Engine
                </button>
              </div>
            </div>
            </>)}
            {/* Empty State Table / Simulated State */}
            {currentPhase === 2 && ('''
            
    content = before + new_middle_opt + after
else:
    print("Failed to find Optimizer markers.")

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)

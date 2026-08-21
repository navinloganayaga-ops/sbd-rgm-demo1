import re

with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    content = f.read()

target = """                    <button 
                      onClick={() => handleOpenNpiModal()}
                      className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                    >
                      <Sparkles size={16} /> Introduce Innovation (NPI Ghost SKU)
                    </button>"""

replacement = """                    <button 
                      onClick={() => handleOpenNpiModal()}
                      className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Sparkles size={16} /> Introduce Innovation (NPI Ghost SKU)
                    </button>"""

if target in content:
    content = content.replace(target, replacement)
    print("NPI button fixed.")
else:
    print("NPI button target not found.")

with open('src/components/PortfolioTransferenceModule.tsx', 'w') as f:
    f.write(content)


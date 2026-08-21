import re

with open('src/components/PromoPlanner.tsx', 'r') as f:
    content = f.read()

# 1. Add import for MultiSelect
import_statement = "import MultiSelect from './MultiSelect';\n"
if "import MultiSelect" not in content:
    content = content.replace("import GlobalFilterBar", import_statement + "import GlobalFilterBar")

# 2. Add product options array (after the imports or inside the component)
options_code = """
const productOptions = [
  { id: 'dewalt_drill', label: 'DeWalt 20V MAX Cordless Drill Kit', subtitle: 'SKU: DCD771C2', price: 159.00, vol: '124.5K' },
  { id: 'stanley_tape', label: 'Stanley FatMax 25ft Tape Measure 2-Pack', subtitle: 'SKU: FMHT33338', price: 24.99, vol: '85.2K' },
  { id: 'craftsman_toolset', label: 'Craftsman 135-Pc Mechanics Tool Set', subtitle: 'SKU: CMMT99206', price: 99.00, vol: '42.0K' },
  { id: 'black_decker_mouse', label: 'BLACK+DECKER Mouse Detail Sander', subtitle: 'SKU: BDEMS600', price: 34.00, vol: '56.1K' },
  { id: 'dewalt_saw', label: 'DeWalt 20V MAX Circular Saw', subtitle: 'SKU: DCS391B', price: 129.00, vol: '90.3K' },
  { id: 'porter_cable_router', label: 'PORTER-CABLE Compact Router', subtitle: 'SKU: PCE6430', price: 119.99, vol: '31.4K' }
];
"""

# Let's just put it before the component export
if "const productOptions =" not in content:
    content = content.replace("export default function PromoPlanner", options_code + "\nexport default function PromoPlanner")

# 3. Replace the checkboxes block with the MultiSelect
# The block is from `<div className="space-y-3 pt-4 border-t border-slate-100">` down to before `<div className="pt-6 border-t border-slate-200 flex justify-end">`

# We need to find the specific block to replace.
checkboxes_regex = re.compile(r'<div className="space-y-3 pt-4 border-t border-slate-100">.*?</div>\s*(?=<div className="pt-6 border-t border-slate-200 flex justify-end">)', re.DOTALL)

replacement = """<div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="font-semibold text-slate-800 block text-base">
              Participating Product Lines
            </label>
            <p className="text-xs text-slate-500 -mt-2 mb-3">Select SKUs to include in this scenario. Displays baseline volume and base price.</p>
            <div className="max-w-xl">
              <MultiSelect 
                options={productOptions}
                selectedIds={selectedSkus}
                onChange={setSelectedSkus}
                placeholder="Select participating SKUs..."
              />
            </div>
            {selectedSkus.length > 0 && (
              <div className="mt-4 border border-slate-200 rounded overflow-hidden">
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
                            <div className="text-xs text-slate-500">{opt.subtitle}</div>
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
          """

if checkboxes_regex.search(content):
    content = checkboxes_regex.sub(replacement, content, 1)
    print("Successfully replaced Product Lines checkboxes with MultiSelect in PromoPlanner.")
else:
    print("Could not find the Product Lines block in PromoPlanner.")

with open('src/components/PromoPlanner.tsx', 'w') as f:
    f.write(content)


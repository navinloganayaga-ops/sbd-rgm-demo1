import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

target = """              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Objective Function</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-500">
                    <option>Maximize MAC (Margin)</option>
                    <option>Maximize GSV (Revenue)</option>
                    <option>Maintain Retailer Margin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">National Target Increase %</label>
                  <div className="flex items-center gap-2">
                    <button className="bg-slate-100 text-slate-600 px-3 py-2 rounded border border-slate-300 hover:bg-slate-200 font-bold">-</button>
                    <input type="text" value="7.0" className="w-20 text-center font-bold text-slate-900 border border-slate-300 rounded py-2 focus:outline-none bg-slate-50" readOnly />
                    <button className="bg-slate-100 text-slate-600 px-3 py-2 rounded border border-slate-300 hover:bg-slate-200 font-bold">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Price Increase Cap</label>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="15%" className="w-full font-bold text-slate-900 border border-slate-300 rounded p-2 focus:outline-none bg-slate-50" />
                </div>
              </div>
            </div>"""

replacement = """              <div className="mb-6 max-w-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Objective Function</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-500">
                  <option>Maximize MAC (Margin)</option>
                  <option>Maximize GSV (Revenue)</option>
                  <option>Maintain Retailer Margin</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">SKU Number</th>
                      <th className="p-4">Product Description</th>
                      <th className="p-4 text-right">Base List Price</th>
                      <th className="p-4 text-center">Max Price Increase %</th>
                      <th className="p-4 text-center">Max Volume Drop %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {skus.map(sku => (
                      <tr key={'opt-'+sku.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900">{sku.sku}</td>
                        <td className="p-4 font-medium text-slate-700">{sku.desc}</td>
                        <td className="p-4 text-right font-medium text-slate-500">${sku.listPrice.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <input 
                              type="number" 
                              defaultValue={15} 
                              className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded p-1 focus:outline-none focus:border-slate-500"
                            /> <span className="text-slate-500 font-bold">%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <input 
                              type="number" 
                              defaultValue={10} 
                              className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded p-1 focus:outline-none focus:border-slate-500"
                            /> <span className="text-slate-500 font-bold">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced Optimizer Step 1 successfully!")
else:
    print("Target not found. Let's do it with regex to ignore whitespace.")
    
with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)

import re

with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    content = f.read()

# We will just replace from {activeTab === 'governance' && ( to the end of that block.
# Wait, it's easier to find the end of the file:
end_regex = re.compile(r'\{\/\* TAB 4: SCENARIO GOVERNANCE \*\/.*?(?=\{\/\* Modals \*\/)', re.DOTALL)

tab4_content = """{/* TAB 4: SCENARIO GOVERNANCE */}
          {activeTab === 'governance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                {/* Financial Impact Waterfall Chart */}
                <div className="bg-white border border-slate-200 rounded shadow-sm p-5 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-base mb-4">Financial Impact Bridge (GSV & Margin)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}> 
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                         <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `$${val}M`} axisLine={false} tickLine={false} />
                         <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: any) => [`$${value}M`, 'Value']} />
                         <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {waterfallData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                         </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">Net Margin Impact: +180 bps Margin Expansion</span>
                  </div>
                </div>

                {/* Central Scenario Database Table */}
                <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Scenario Database & Approvals</h3>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">+ New Scenario</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Scenario ID</th>
                          <th className="p-4">Scenario Name</th>
                          <th className="p-4">Retailer</th>
                          <th className="p-4">SKUs Delisted</th>
                          <th className="p-4">NPIs Added</th>
                          <th className="p-4">Net Incremental Margin</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        <tr className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-500">SCN-8842</td>
                          <td className="p-4 font-bold text-slate-900">FY26 Q1 DeWalt Drill Consolidation</td>
                          <td className="p-4 text-slate-700">Home Depot</td>
                          <td className="p-4 text-slate-700">2 SKUs</td>
                          <td className="p-4 text-slate-700">1 NPI</td>
                          <td className="p-4 font-medium text-emerald-600">+180 bps</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                              Assigned for Review
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium space-x-3">
                            <button className="text-slate-500 hover:text-slate-700">View</button>
                            <button className="text-blue-600 hover:text-blue-700">Approve</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-500">SCN-8841</td>
                          <td className="p-4 font-bold text-slate-900">Craftsman Hand Tool Rationalization</td>
                          <td className="p-4 text-slate-700">Lowe's</td>
                          <td className="p-4 text-slate-700">14 SKUs</td>
                          <td className="p-4 text-slate-700">0 NPIs</td>
                          <td className="p-4 font-medium text-emerald-600">+85 bps</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                              Published
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium space-x-3">
                            <button className="text-slate-500 hover:text-slate-700">View</button>
                            <button className="text-emerald-600 hover:text-emerald-700">Sign-Off</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-500">SCN-8839</td>
                          <td className="p-4 font-bold text-slate-900">Stanley Measure Tapes Q4</td>
                          <td className="p-4 text-slate-700">Amazon</td>
                          <td className="p-4 text-slate-700">4 SKUs</td>
                          <td className="p-4 text-slate-700">2 NPIs</td>
                          <td className="p-4 font-medium text-emerald-600">+110 bps</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium space-x-3">
                            <button className="text-slate-500 hover:text-slate-700">View</button>
                            <button className="text-slate-500 hover:text-slate-700 line-through">Push to SAP</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      """

content = end_regex.sub(tab4_content, content)

with open('src/components/PortfolioTransferenceModule.tsx', 'w') as f:
    f.write(content)


import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Remove the COGS column header
content = content.replace('<th className="p-4 text-center">COGS Change %</th>', '')

# Remove the COGS data cell in the mapping block
cogs_cell_to_remove = """                            <td className="p-4 text-center">
                              <span className="text-slate-600 font-medium">{sku.cogsInc}%</span>
                            </td>"""
content = content.replace(cogs_cell_to_remove, '')

# Now let's inject the KPI cards right after the Sparkles alert box
target_alert = """                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 font-bold flex items-center gap-2">
                  <Sparkles size={18} />
                  Optimizer successfully generated target price increases to maximize MAC within constraints.
                </div>"""

# Replace the alert with the alert + KPIs + Charts
kpis_to_add = """                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 font-bold flex items-center gap-2">
                  <Sparkles size={18} />
                  Optimizer successfully generated target price increases to maximize MAC within constraints.
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Optimized GSV</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">$455.2M</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +4.8%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trade Margin (MAC)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">42.8%</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +210 bps</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sales Volume (Units)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">1.25M</span>
                      <span className="text-sm font-bold text-rose-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1 rotate-180"/> -1.8%</span>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Waterfall Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Price/Volume/Mix GSV Impact</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} tickFormatter={(val) => `$${val}M`} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={60}>
                            {waterfallData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : entry.name.includes('Simulated') ? '#0f172a' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Customer Profit Pool Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Customer Level KPI Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={[
                          { name: 'Home Depot', base: 45, sim: 51 },
                          { name: 'Lowe\\'s', base: 32, sim: 36 },
                          { name: 'Amazon', base: 28, sim: 29 },
                          { name: 'Ace Hrdwr', base: 15, sim: 17 },
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                          <Bar dataKey="base" name="Base Net Spread" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="sim" name="Optimized Net Spread" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>"""

content = content.replace(target_alert, kpis_to_add)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)

print("Modifications done.")

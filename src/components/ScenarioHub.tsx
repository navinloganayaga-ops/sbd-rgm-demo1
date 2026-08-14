import React from 'react';
import { LayoutDashboard, CheckCircle2, AlertTriangle, Play, Archive, Database, Server } from 'lucide-react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface ScenarioHubProps {
  filterState: any;
  onFilterChange: (filters: any) => void;
  onFilterApply: () => void;
}

const HEATMAP_DATA = [
  { name: 'DeWalt Power Tools', size: 1250, nsv: 450, spend: 35, growth: 12, roi: 1.8, fill: '#10b981' },
  { name: 'Stanley Hand Tools', size: 850, nsv: 210, spend: 18, growth: 4, roi: 1.2, fill: '#f59e0b' },
  { name: 'Craftsman Storage', size: 650, nsv: 180, spend: 22, growth: -2, roi: 0.9, fill: '#ef4444' },
  { name: 'Black+Decker Home', size: 450, nsv: 95, spend: 8, growth: 1, roi: 1.4, fill: '#f59e0b' },
  { name: 'MAC Tools Automotive', size: 550, nsv: 150, spend: 12, growth: 8, roi: 1.9, fill: '#10b981' },
];

const SCENARIOS = [
  {
    id: 1,
    name: 'Q4 DeWalt Holiday Blitz',
    retailer: 'Home Depot',
    year: '2026',
    lastEdit: '2026-08-04',
    targetAchieved: true,
    syncStatus: 'Synced (2026-08-05 10:14 AM)',
    syncType: 'SAP ERP'
  },
  {
    id: 2,
    name: "Lowe's Tariff Defense",
    retailer: "Lowe's",
    year: '2026',
    lastEdit: '2026-08-02',
    targetAchieved: false,
    syncStatus: 'Pending Review',
    syncType: 'Databricks'
  },
  {
    id: 3,
    name: 'Amazon Prime Day Acceleration',
    retailer: 'Amazon',
    year: '2026',
    lastEdit: '2026-07-28',
    targetAchieved: true,
    syncStatus: 'Synced (2026-07-29 08:30 AM)',
    syncType: 'SAP ERP'
  }
];

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, fill, nsv, roi } = props;
  
  if (width < 40 || height < 40) return null;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} />
      <text x={x + 10} y={y + 20} fill="#fff" fontSize={14} fontWeight="bold">{name}</text>
      <text x={x + 10} y={y + 40} fill="#fff" fontSize={12} opacity={0.9}>NSV: ${nsv}M | ROI: {roi}x</text>
    </g>
  );
};

export default function ScenarioHub({ filterState }: ScenarioHubProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="text-[#FFC20E]" size={28} />
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Scenario Hub & Dashboard</h2>
          <p className="text-sm text-slate-600 font-medium">Enterprise Portfolio Overview & Scenario Management</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 text-base">Portfolio Heatmap (Category Performance)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={HEATMAP_DATA}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomizedContent />}
            >
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-slate-200 rounded shadow-md text-sm">
                        <p className="font-bold text-slate-900 mb-1">{data.name}</p>
                        <p className="text-slate-600">Net Sales Val: <strong className="text-slate-900">${data.nsv}M</strong></p>
                        <p className="text-slate-600">Trade Spend: <strong className="text-slate-900">${data.spend}M</strong></p>
                        <p className="text-slate-600">Growth: <strong className={data.growth > 0 ? "text-emerald-600" : "text-rose-600"}>{data.growth > 0 ? '+' : ''}{data.growth}%</strong></p>
                        <p className="text-slate-600">Trade ROI: <strong className="text-slate-900">{data.roi}x</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-4 text-xs font-semibold text-slate-500 justify-end">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> ROI &gt; 1.5x (Target Achieved)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> ROI 1.0 - 1.5x (At Risk)</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> ROI &lt; 1.0x (Value Destructive)</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900 text-base">Scenario Manager</h3>
          <button className="bg-slate-900 text-[#FFC20E] px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
            + New Scenario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b border-slate-200">Scenario Name</th>
                <th className="p-4 border-b border-slate-200">Retailer / Year</th>
                <th className="p-4 border-b border-slate-200">Last Edit Date</th>
                <th className="p-4 border-b border-slate-200 text-center">Target Achieved</th>
                <th className="p-4 border-b border-slate-200">System Sync Status</th>
                <th className="p-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCENARIOS.map(scenario => (
                <tr key={scenario.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{scenario.name}</td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700">{scenario.retailer}</span>
                    <span className="text-slate-400 mx-2">|</span>
                    <span className="text-slate-500">{scenario.year}</span>
                  </td>
                  <td className="p-4 text-slate-600">{scenario.lastEdit}</td>
                  <td className="p-4 text-center">
                    {scenario.targetAchieved ? (
                      <CheckCircle2 className="text-emerald-600 mx-auto" size={18} />
                    ) : (
                      <AlertTriangle className="text-rose-500 mx-auto" size={18} />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {scenario.syncType === 'SAP ERP' ? (
                        <Database size={14} className="text-blue-600" />
                      ) : (
                        <Server size={14} className="text-orange-500" />
                      )}
                      <span className="text-xs font-medium text-slate-600">{scenario.syncStatus}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-colors">
                        <Play size={12} /> Open
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded text-xs font-bold transition-colors">
                        <Archive size={12} /> Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

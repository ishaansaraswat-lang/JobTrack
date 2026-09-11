import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ApplicationStats, APPLICATION_STATUSES } from '@/types/application';
import { STATUS_CONFIG } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';

interface StatusChartProps {
  stats: ApplicationStats;
}

export const StatusChart: React.FC<StatusChartProps> = ({ stats }) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');

  const chartData = APPLICATION_STATUSES.map((status) => {
    const key = status.toLowerCase() as keyof ApplicationStats;
    const count = (stats[key] as number) || 0;
    return {
      name: status,
      value: count,
      color: STATUS_CONFIG[status].chartColor,
    };
  }).filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  return (
    <Card className="h-full flex flex-col border border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Pipeline Distribution
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown across active stages
          </p>
        </div>

        {/* Toggle between donut and bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setChartType('donut')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              chartType === 'donut'
                ? 'bg-white shadow-xs text-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Donut Chart"
          >
            <PieIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              chartType === 'bar'
                ? 'bg-white shadow-xs text-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Bar Chart"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center p-4">
        {!hasData ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No applications to display in chart yet.</p>
          </div>
        ) : chartType === 'donut' ? (
          <div className="w-full flex flex-col items-center">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} application${val === 1 ? '' : 's'}`, 'Count']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700">{item.name}</span>
                  <span className="text-slate-400 font-semibold ml-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`${val} application${val === 1 ? '' : 's'}`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

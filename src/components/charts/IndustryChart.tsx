import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { INDUSTRY_LABELS } from '@/types';
import type { Industry } from '@/types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

export function IndustryChart() {
  const { projects, darkMode } = useStore();

  const data = Object.entries(
    projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.industry] = (acc[p.industry] || 0) + p.budget;
      return acc;
    }, {})
  ).map(([industry, value]) => ({
    name: INDUSTRY_LABELS[industry as Industry],
    value,
  }));

  return (
    <div className={cn(
      'rounded-xl p-5 border animate-fade-in',
      darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
    )}>
      <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
        Revenue por Industria
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#fff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#000',
              }}
              formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}k`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className={cn('text-xs truncate', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

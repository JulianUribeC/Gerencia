import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueData } from '@/data/mock';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export function RevenueChart() {
  const { darkMode } = useStore();

  return (
    <div className={cn(
      'rounded-xl p-5 border animate-fade-in',
      darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
    )}>
      <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
        Revenue & Profit
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#fff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#000',
              }}
              formatter={(value) => [formatCurrency(Number(value)), '']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="profit" stroke="#8b5cf6" fill="url(#profitGrad)" strokeWidth={2} name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

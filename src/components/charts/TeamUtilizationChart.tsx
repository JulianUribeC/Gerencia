import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function TeamUtilizationChart() {
  const { developers, darkMode } = useStore();

  const data = developers.map((d) => ({
    name: d.name.split(' ')[0],
    utilization: 100 - d.availability,
    available: d.availability,
  }));

  return (
    <div className={cn(
      'rounded-xl p-5 border animate-fade-in',
      darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
    )}>
      <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
        Utilización del Equipo
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} width={70} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#fff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? '#fff' : '#000',
              }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Bar dataKey="utilization" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Ocupado" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

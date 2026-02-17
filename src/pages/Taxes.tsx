import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import {
  taxObligations, taxPayments, deductibles,
  TAX_TYPE_LABELS, TAX_STATUS_COLORS, TAX_STATUS_LABELS,
} from '@/data/taxes';
import { Receipt, DollarSign, TrendingDown, Calculator, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#64748b'];

export function Taxes() {
  const { darkMode } = useStore();

  const currentMonth = taxPayments[taxPayments.length - 1];
  const prevMonth = taxPayments[taxPayments.length - 2];
  const totalPaidYTD = taxPayments.reduce((s, p) => s + p.total, 0);
  const totalDeductible = deductibles.reduce((s, d) => s + d.amount, 0);
  const monthChange = prevMonth ? ((currentMonth.total - prevMonth.total) / prevMonth.total * 100).toFixed(1) : '0';
  const pendingCount = taxObligations.filter((o) => o.status === 'pendiente').length;
  const overdueCount = taxObligations.filter((o) => o.status === 'vencido').length;

  const tooltipStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: darkMode ? '#fff' : '#000',
  };
  const tickStyle = { fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' };
  const cardClass = cn(
    'rounded-xl p-5 border animate-fade-in',
    darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
  );
  const headingClass = cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Impuestos"
        subtitle="Obligaciones fiscales, pagos y deducciones"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pago Mes Actual" value={formatCurrency(currentMonth.total)} subtitle={`${Number(monthChange) > 0 ? '+' : ''}${monthChange}% vs anterior`} icon={Receipt} color="blue" />
        <StatCard title="Total Pagado (12m)" value={formatCurrency(totalPaidYTD)} icon={DollarSign} color="green" />
        <StatCard title="Deducciones" value={formatCurrency(totalDeductible)} subtitle="Total deducible" icon={Calculator} color="purple" />
        <StatCard title="Obligaciones" value={`${pendingCount} pendientes`} subtitle={overdueCount > 0 ? `${overdueCount} vencidas` : 'Ninguna vencida'} icon={AlertTriangle} color="orange" />
      </div>

      {/* Obligations Table */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4 text-accent-400" />
          <h3 className={headingClass} style={{ marginBottom: 0 }}>Obligaciones Fiscales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                {['Obligación', 'Tipo', 'Tasa', 'Frecuencia', 'Día Límite', 'Estado'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-4 py-3', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taxObligations.map((ob) => (
                <tr key={ob.id} className={cn('border-b', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{ob.name}</td>
                  <td className="px-4 py-3">
                    <Badge className={cn('text-xs', darkMode ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-700')}>
                      {TAX_TYPE_LABELS[ob.type]}
                    </Badge>
                  </td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                    {ob.rate > 0 ? `${ob.rate}%` : 'Variable'}
                  </td>
                  <td className={cn('px-4 py-3 text-sm capitalize', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{ob.frequency}</td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>Día {ob.dueDay}</td>
                  <td className="px-4 py-3">
                    <Badge className={TAX_STATUS_COLORS[ob.status]}>{TAX_STATUS_LABELS[ob.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Tax Payments - Stacked Area */}
        <div className={cardClass}>
          <h3 className={headingClass}>Pagos Mensuales por Tipo</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taxPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={tickStyle} />
                <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                <Legend />
                <Area type="monotone" dataKey="iva" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="IVA" />
                <Area type="monotone" dataKey="isr" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="ISR" />
                <Area type="monotone" dataKey="retenciones" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Retenciones" />
                <Area type="monotone" dataKey="imss" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="IMSS" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total vs Deductible */}
        <div className={cardClass}>
          <h3 className={headingClass}>Total vs Deducible</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={tickStyle} />
                <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                <Legend />
                <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total Pagado" />
                <Bar dataKey="deducible" fill="#10b981" radius={[4, 4, 0, 0]} name="Deducible" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deductibles Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cn(cardClass, 'lg:col-span-1')}>
          <h3 className={headingClass}>Deducciones por Categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deductibles} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="amount" nameKey="category">
                  {deductibles.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(cardClass, 'lg:col-span-2')}>
          <h3 className={headingClass}>Detalle de Deducciones</h3>
          <div className="space-y-3">
            {deductibles.map((d, i) => (
              <div key={d.category} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-xs font-medium truncate', darkMode ? 'text-white' : 'text-gray-900')}>{d.category}</span>
                    <span className={cn('text-xs font-semibold ml-2', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(d.amount)}</span>
                  </div>
                  <div className={cn('h-1.5 rounded-full overflow-hidden', darkMode ? 'bg-surface-800' : 'bg-gray-100')}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${d.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
                <span className={cn('text-[10px] font-medium w-8 text-right', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly payments detail table */}
      <div className={cardClass}>
        <h3 className={headingClass}>Historial de Pagos Mensuales</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                {['Mes', 'IVA', 'ISR', 'Retenciones', 'IMSS', 'Total', 'Deducible'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-4 py-3', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taxPayments.map((p) => (
                <tr key={p.month} className={cn('border-b', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                  <td className={cn('px-4 py-2.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{p.month}</td>
                  <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(p.iva)}</td>
                  <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(p.isr)}</td>
                  <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(p.retenciones)}</td>
                  <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(p.imss)}</td>
                  <td className={cn('px-4 py-2.5 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{formatCurrency(p.total)}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-emerald-400">{formatCurrency(p.deducible)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

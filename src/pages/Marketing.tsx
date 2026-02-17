import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, Cell,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import {
  campaigns, funnelData, channelPerformance, monthlyMarketing,
  CHANNEL_LABELS, CAMPAIGN_STATUS_COLORS,
} from '@/data/marketing';
import { Megaphone, DollarSign, Users, Target, TrendingUp, MousePointerClick, Eye, ArrowDownRight } from 'lucide-react';

const FUNNEL_WIDTHS = [100, 85, 65, 50, 38, 24, 20];

export default function Marketing() {
  const { darkMode } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = statusFilter === 'all'
    ? campaigns
    : campaigns.filter((c) => c.status === statusFilter);

  const totalSpend = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const avgCAC = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const overallCTR = campaigns.reduce((s, c) => s + c.impressions, 0) > 0
    ? (campaigns.reduce((s, c) => s + c.clicks, 0) / campaigns.reduce((s, c) => s + c.impressions, 0) * 100)
    : 0;

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
        title="Marketing"
        subtitle="CampaÃ±as, adquisiciÃ³n y funnel de conversiÃ³n"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Gasto Total" value={formatCurrency(totalSpend)} icon={DollarSign} color="blue" />
        <StatCard title="Leads Generados" value={totalLeads.toLocaleString()} subtitle={`CTR: ${overallCTR.toFixed(2)}%`} icon={Users} color="green" />
        <StatCard title="Conversiones" value={totalConversions.toLocaleString()} icon={Target} color="purple" />
        <StatCard title="CAC Promedio" value={formatCurrency(Math.round(avgCAC))} icon={MousePointerClick} color="orange" />
        <StatCard title="CampaÃ±as Activas" value={campaigns.filter((c) => c.status === 'active').length.toString()} subtitle={`${campaigns.length} total`} icon={Megaphone} color="pink" />
      </div>

      {/* Funnel Visualization */}
      <div className={cardClass}>
        <h3 className={headingClass}>Funnel de ConversiÃ³n</h3>
        <div className="flex flex-col items-center gap-1 py-4">
          {funnelData.map((stage, i) => {
            const width = FUNNEL_WIDTHS[i];
            const convRate = i > 0 ? ((stage.count / funnelData[i - 1].count) * 100).toFixed(1) : '100';
            return (
              <div key={stage.stage} className="flex items-center gap-4 w-full max-w-2xl">
                <div className="w-24 text-right">
                  <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{stage.stage}</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="rounded-md py-2 px-3 text-center transition-all duration-300"
                    style={{
                      width: `${width}%`,
                      backgroundColor: stage.color + '30',
                      borderLeft: `3px solid ${stage.color}`,
                    }}
                  >
                    <span className={cn('text-sm font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-16">
                  {i > 0 && (
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3 text-yellow-400" />
                      <span className={cn('text-[11px] font-medium', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{convRate}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Performance + Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <h3 className={headingClass}>ROI por Canal</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} horizontal={false} />
                <XAxis type="number" tick={tickStyle} tickFormatter={(v) => `${v}x`} />
                <YAxis type="category" dataKey="channel" tick={tickStyle} width={110} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}x`, 'ROI']} />
                <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                  {channelPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.roi > 5 ? '#10b981' : entry.roi > 2 ? '#3b82f6' : entry.roi > 1 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className={headingClass}>Tendencia Mensual</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMarketing}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Leads" />
                <Line type="monotone" dataKey="trials" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Trials" />
                <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Conversiones" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CAC Trend + Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <h3 className={headingClass}>EvoluciÃ³n del CAC</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyMarketing}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={tickStyle} />
                <YAxis tick={tickStyle} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'CAC']} />
                <Area type="monotone" dataKey="cac" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className={headingClass}>Gasto Mensual en Marketing</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMarketing}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={tickStyle} />
                <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'Gasto']} />
                <Bar dataKey="spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className={cardClass}>
        <h3 className={headingClass}>Rendimiento por Canal</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                {['Canal', 'Gasto', 'Leads', 'Conversiones', 'CAC', 'ROI'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-4 py-3', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channelPerformance.map((ch) => (
                <tr key={ch.channel} className={cn('border-b', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{ch.channel}</td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(ch.spend)}</td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{ch.leads.toLocaleString()}</td>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{ch.conversions}</td>
                  <td className={cn('px-4 py-3 text-sm', ch.cac < 25 ? 'text-emerald-400' : ch.cac < 60 ? 'text-yellow-400' : 'text-red-400')}>
                    {formatCurrency(ch.cac)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-sm font-bold',
                      ch.roi > 5 ? 'text-emerald-400' : ch.roi > 2 ? 'text-blue-400' : ch.roi > 1 ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {ch.roi}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={headingClass} style={{ marginBottom: 0 }}>CampaÃ±as</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer',
              darkMode ? 'bg-surface-800 border-surface-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
            )}
          >
            <option value="all">Todos</option>
            <option value="active">Activas</option>
            <option value="paused">Pausadas</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                {['CampaÃ±a', 'Canal', 'Estado', 'Presupuesto', 'Gastado', 'Impresiones', 'Clicks', 'Leads', 'Conversiones', 'CTR'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-3 py-3 whitespace-nowrap', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => {
                const ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100).toFixed(2) : 'â€”';
                const spentPct = c.budget > 0 ? Math.round(c.spent / c.budget * 100) : 0;
                return (
                  <tr key={c.id} className={cn('border-b', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                    <td className={cn('px-3 py-2.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                      {c.name}
                      <p className={cn('text-[10px]', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                        {c.startDate} â†’ {c.endDate}
                      </p>
                    </td>
                    <td className={cn('px-3 py-2.5 text-xs', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{CHANNEL_LABELS[c.channel]}</td>
                    <td className="px-3 py-2.5">
                      <Badge className={CAMPAIGN_STATUS_COLORS[c.status]}>
                        {c.status === 'active' ? 'Activa' : c.status === 'paused' ? 'Pausada' : 'Completada'}
                      </Badge>
                    </td>
                    <td className={cn('px-3 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{formatCurrency(c.budget)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm', darkMode ? 'text-white' : 'text-gray-900')}>{formatCurrency(c.spent)}</span>
                        <span className={cn('text-[10px]', spentPct > 90 ? 'text-red-400' : spentPct > 70 ? 'text-yellow-400' : 'text-emerald-400')}>
                          {spentPct}%
                        </span>
                      </div>
                    </td>
                    <td className={cn('px-3 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{c.impressions > 0 ? c.impressions.toLocaleString() : 'â€”'}</td>
                    <td className={cn('px-3 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{c.clicks > 0 ? c.clicks.toLocaleString() : 'â€”'}</td>
                    <td className={cn('px-3 py-2.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{c.leads.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-sm font-bold text-emerald-400">{c.conversions}</td>
                    <td className={cn('px-3 py-2.5 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{ctr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

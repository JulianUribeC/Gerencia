import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatMetricValue, getMetricHealth, HEALTH_COLORS, HEALTH_DOT, HEALTH_BG } from '@/lib/metrics';
import { revenueData } from '@/data/mock';
import {
  INDUSTRY_LABELS, STATUS_LABELS, STATUS_COLORS,
  METRIC_DEFINITIONS, METRIC_CATEGORY_LABELS,
} from '@/types';
import type { Industry, ProjectStatus, MetricCategory } from '@/types';
import { DollarSign, TrendingUp, Clock, Target, Users, Filter, LayoutGrid, BarChart3, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];
const STATUS_CHART_COLORS: Record<ProjectStatus, string> = {
  proposal: '#eab308',
  in_development: '#3b82f6',
  testing: '#8b5cf6',
  completed: '#10b981',
  on_hold: '#6b7280',
};

const METRIC_CATEGORIES: MetricCategory[] = [
  'supervivencia', 'ingresos', 'rentabilidad', 'adquisicion',
  'retencion', 'engagement', 'valor_cliente', 'producto', 'estrategica',
];

// Key metrics to show in cards when a single project is selected
const KEY_METRIC_KEYS = [
  'totalUsers', 'mrr', 'netRevenue', 'arpu', 'grossMargin', 'churnRate',
  'retentionRate', 'dauMauRatio', 'ltv', 'ltvCacRatio', 'cac', 'startupHealthScore',
];

export function Analytics() {
  const { projects, darkMode } = useStore();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [metricCategory, setMetricCategory] = useState<MetricCategory | 'all'>('all');

  const scope = useMemo(() => {
    if (selectedProject === 'all') return projects;
    const p = projects.find((x) => x.id === selectedProject);
    return p ? [p] : projects;
  }, [selectedProject, projects]);

  const singleProject = selectedProject !== 'all' ? projects.find((x) => x.id === selectedProject) : null;

  const totalBudget = scope.reduce((s, p) => s + p.budget, 0);
  const totalSpent = scope.reduce((s, p) => s + p.spent, 0);
  const completedCount = scope.filter((p) => p.status === 'completed').length;
  const successRate = scope.length > 0 ? Math.round((completedCount / scope.length) * 100) : 0;
  const avgProgress = scope.length > 0 ? Math.round(scope.reduce((s, p) => s + p.progress, 0) / scope.length) : 0;
  const totalUsers = scope.reduce((s, p) => s + (p.metrics.totalUsers ?? 0), 0);

  // Filtered metrics for the category
  const filteredMetrics = metricCategory === 'all'
    ? METRIC_DEFINITIONS.filter((m) => METRIC_CATEGORIES.includes(m.category))
    : METRIC_DEFINITIONS.filter((m) => m.category === metricCategory);

  // Industry data
  const industryData = Object.entries(
    scope.reduce<Record<string, { budget: number; spent: number }>>((acc, p) => {
      if (!acc[p.industry]) acc[p.industry] = { budget: 0, spent: 0 };
      acc[p.industry].budget += p.budget;
      acc[p.industry].spent += p.spent;
      return acc;
    }, {})
  ).map(([industry, data]) => ({
    name: INDUSTRY_LABELS[industry as Industry],
    budget: data.budget,
    spent: data.spent,
  }));

  // Status distribution
  const statusData = Object.entries(
    scope.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status as ProjectStatus],
    value: count,
    color: STATUS_CHART_COLORS[status as ProjectStatus],
  }));

  // Profitability
  const profitabilityData = scope
    .filter((p) => p.spent > 0)
    .map((p) => ({
      name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
      margin: Math.round(((p.budget - p.spent) / p.budget) * 100),
    }))
    .sort((a, b) => b.margin - a.margin);

  // Radar for single project
  const radarKeys = ['startupHealthScore', 'grossMargin', 'retentionRate', 'dauMauRatio', 'activationRate'];
  const radarLabels: Record<string, string> = {
    startupHealthScore: 'Health',
    grossMargin: 'Margen',
    retentionRate: 'Retención',
    dauMauRatio: 'DAU/MAU',
    activationRate: 'Activación',
  };

  const radarData = singleProject
    ? radarKeys.map((key) => ({
        metric: radarLabels[key],
        value: singleProject.metrics[key] ?? 0,
        fullMark: 100,
      }))
    : null;

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
        title="Analytics"
        subtitle={singleProject ? singleProject.name : 'Vista consolidada de todos los proyectos'}
        action={
          <div className="flex items-center gap-3">
            {/* Project selector */}
            <div className="flex items-center gap-2">
              <Filter className={cn('w-4 h-4', darkMode ? 'text-surface-200/50' : 'text-gray-400')} />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={cn(
                  'px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer min-w-[180px]',
                  darkMode ? 'bg-surface-800 border-surface-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
                )}
              >
                <option value="all">Todos los Proyectos</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Revenue Total" value={formatCurrency(totalBudget)} icon={DollarSign} color="green" />
        <StatCard title="Tasa de Éxito" value={`${successRate}%`} subtitle={`${completedCount} completados`} icon={Target} color="blue" />
        <StatCard title="Progreso" value={`${avgProgress}%`} icon={TrendingUp} color="purple" />
        <StatCard title="Margen Bruto" value={`${totalBudget > 0 ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0}%`} subtitle={formatCurrency(totalBudget - totalSpent)} icon={Clock} color="orange" />
        <StatCard title="Total Usuarios" value={totalUsers.toLocaleString()} subtitle="Acumulado user_registered" icon={Users} color="pink" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart or Radar */}
        <div className={cn(cardClass, singleProject ? '' : 'lg:col-span-2')}>
          {singleProject && radarData ? (
            <>
              <h3 className={headingClass}>Perfil de Salud</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <PolarAngleAxis dataKey="metric" tick={tickStyle} />
                    <PolarRadiusAxis domain={[0, 100]} tick={tickStyle} />
                    <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip contentStyle={tooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <h3 className={headingClass}>Revenue Mensual</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="month" tick={tickStyle} />
                    <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Gastos" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Status pie */}
        <div className={cardClass}>
          <h3 className={headingClass}>
            {singleProject ? 'Distribución de Presupuesto' : 'Estado de Proyectos'}
          </h3>
          {singleProject ? (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>Gastado</span>
                  <span className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {formatCurrency(singleProject.spent)}
                  </span>
                </div>
                <ProgressBar value={singleProject.spent} max={singleProject.budget} size="md" color="bg-red-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>Restante</span>
                  <span className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {formatCurrency(singleProject.budget - singleProject.spent)}
                  </span>
                </div>
                <ProgressBar value={singleProject.budget - singleProject.spent} max={singleProject.budget} size="md" color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>Progreso</span>
                  <span className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {singleProject.progress}%
                  </span>
                </div>
                <ProgressBar value={singleProject.progress} size="md" />
              </div>
              <div className={cn('border-t pt-3 mt-3', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                <Badge className={STATUS_COLORS[singleProject.status]}>
                  {STATUS_LABELS[singleProject.status]}
                </Badge>
                <p className={cn('text-xs mt-2', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                  {singleProject.milestones.filter((m) => m.completed).length}/{singleProject.milestones.length} hitos completados
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {singleProject.techStack.map((t) => (
                  <span key={t} className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium',
                    darkMode ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-700'
                  )}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className={cn('text-xs', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{item.name}</span>
                    </div>
                    <span className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Revenue line for single project too */}
        {singleProject && (
          <div className={cn(cardClass, 'lg:col-span-2')}>
            <h3 className={headingClass}>Revenue Mensual (Global)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="month" tick={tickStyle} />
                  <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Industry + Profitability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <h3 className={headingClass}>Revenue por Industria</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="name" tick={tickStyle} />
                <YAxis tick={tickStyle} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), '']} />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Presupuesto" />
                <Bar dataKey="spent" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Gastado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className={headingClass}>Margen de Rentabilidad</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={tickStyle} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={tickStyle} width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Margen']} />
                <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                  {profitabilityData.map((entry, i) => (
                    <Cell key={i} fill={entry.margin > 20 ? '#10b981' : entry.margin > 0 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Summary Table */}
      <div className={cardClass}>
        <h3 className={headingClass}>Resumen Financiero</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
                {['Proyecto', 'Usuarios', 'Presupuesto', 'Gastado', 'MRR', 'ARPU', 'LTV', 'Health Score'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-4 py-3', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scope.map((p) => {
                const healthScore = p.metrics.startupHealthScore ?? 0;
                const healthStatus = getMetricHealth('startupHealthScore', healthScore);
                return (
                  <tr key={p.id} className={cn('border-b', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                    <td className="px-4 py-3">
                      <Link to={`/projects/${p.id}`} className={cn('text-sm font-medium hover:underline', darkMode ? 'text-white' : 'text-gray-900')}>
                        {p.name}
                      </Link>
                      <p className={cn('text-[10px]', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                        {INDUSTRY_LABELS[p.industry]}
                      </p>
                    </td>
                    <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                      {(p.metrics.totalUsers ?? 0).toLocaleString()}
                    </td>
                    <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-white' : 'text-gray-900')}>
                      {formatCurrency(p.budget)}
                    </td>
                    <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                      {formatCurrency(p.spent)}
                    </td>
                    <td className={cn('px-4 py-3 text-sm font-medium', (p.metrics.mrr ?? 0) > 0 ? 'text-emerald-400' : darkMode ? 'text-surface-200/30' : 'text-gray-300')}>
                      {(p.metrics.mrr ?? 0) > 0 ? formatCurrency(p.metrics.mrr) : '—'}
                    </td>
                    <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                      {(p.metrics.arpu ?? 0) > 0 ? `$${p.metrics.arpu}` : '—'}
                    </td>
                    <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                      {(p.metrics.ltv ?? 0) > 0 ? formatCurrency(p.metrics.ltv) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', HEALTH_DOT[healthStatus])} />
                        <span className={cn('text-sm font-semibold', HEALTH_COLORS[healthStatus])}>
                          {healthScore > 0 ? `${healthScore}/100` : '—'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Control Tower Metrics Section ─── */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-400" />
            <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              Control Tower — Métricas
            </h3>
          </div>
          <select
            value={metricCategory}
            onChange={(e) => setMetricCategory(e.target.value as MetricCategory | 'all')}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer',
              darkMode ? 'bg-surface-800 border-surface-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
            )}
          >
            <option value="all">Todas las Categorías</option>
            {METRIC_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{METRIC_CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>

        {singleProject ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {KEY_METRIC_KEYS.map((key) => {
                const def = METRIC_DEFINITIONS.find((m) => m.key === key);
                if (!def) return null;
                if (metricCategory !== 'all' && def.category !== metricCategory) return null;
                const val = singleProject.metrics[key] ?? 0;
                const health = getMetricHealth(key, val);
                return (
                  <div key={key} className={cn('rounded-lg p-3 border', HEALTH_BG[health])}>
                    <p className={cn('text-[10px] font-medium mb-1', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{def.name}</p>
                    <p className={cn('text-lg font-bold', HEALTH_COLORS[health])}>{formatMetricValue(val, def.unit)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={cn('w-1.5 h-1.5 rounded-full', HEALTH_DOT[health])} />
                      <span className={cn('text-[9px] capitalize', HEALTH_COLORS[health])}>
                        {health === 'healthy' ? 'Saludable' : health === 'warning' ? 'Advertencia' : 'Crítico'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={cn('rounded-lg border overflow-hidden', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
              <table className="w-full">
                <thead>
                  <tr className={darkMode ? 'bg-surface-800/50' : 'bg-gray-50'}>
                    {['Métrica', 'Categoría', 'Valor', 'Fórmula', 'Eventos', 'Estado'].map((h) => (
                      <th key={h} className={cn('text-left text-xs font-semibold px-3 py-2', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMetrics.map((metric) => {
                    const val = singleProject.metrics[metric.key] ?? 0;
                    const health = getMetricHealth(metric.key, val);
                    return (
                      <tr key={metric.key} className={cn('border-t', darkMode ? 'border-surface-700/20' : 'border-gray-100')}>
                        <td className={cn('px-3 py-2 text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{metric.name}</td>
                        <td className={cn('px-3 py-2 text-[10px]', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{METRIC_CATEGORY_LABELS[metric.category]}</td>
                        <td className={cn('px-3 py-2 text-xs font-semibold', HEALTH_COLORS[health])}>{formatMetricValue(val, metric.unit)}</td>
                        <td className={cn('px-3 py-2 text-[10px] max-w-[160px]', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>{metric.formula}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {metric.events.slice(0, 2).map((e) => (
                              <code key={e} className={cn('text-[9px] px-1 py-0.5 rounded', darkMode ? 'bg-surface-700/50 text-primary-400' : 'bg-gray-100 text-primary-600')}>{e}</code>
                            ))}
                            {metric.events.length > 2 && <span className={cn('text-[9px]', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>+{metric.events.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className={cn('w-2 h-2 rounded-full', HEALTH_DOT[health])} />
                            <span className={cn('text-[10px] capitalize', HEALTH_COLORS[health])}>{health === 'healthy' ? 'OK' : health === 'warning' ? 'Alerta' : 'Crítico'}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={cn('rounded-lg border overflow-x-auto', darkMode ? 'border-surface-700/30' : 'border-gray-200')}>
            <table className="w-full">
              <thead>
                <tr className={darkMode ? 'bg-surface-800/50' : 'bg-gray-50'}>
                  <th className={cn('text-left text-xs font-semibold px-3 py-2 sticky left-0 z-10', darkMode ? 'text-surface-200/50 bg-surface-800/50' : 'text-gray-500 bg-gray-50')}>Métrica</th>
                  {projects.map((p) => (
                    <th key={p.id} className={cn('text-center text-xs font-semibold px-2 py-2 min-w-[100px]', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                      <Link to={`/projects/${p.id}`} className="hover:underline">{p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.map((metric, i) => {
                  const prev = i > 0 ? filteredMetrics[i - 1].category : null;
                  const showHeader = metric.category !== prev;
                  return [
                    showHeader && (
                      <tr key={`hdr-${metric.category}`}>
                        <td colSpan={1 + projects.length} className={cn('px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider', darkMode ? 'bg-surface-900/50 text-accent-400' : 'bg-gray-100 text-primary-600')}>
                          {METRIC_CATEGORY_LABELS[metric.category]}
                        </td>
                      </tr>
                    ),
                    <tr key={metric.key} className={cn('border-t', darkMode ? 'border-surface-700/15 hover:bg-surface-800/20' : 'border-gray-50 hover:bg-gray-50')}>
                      <td className={cn('px-3 py-1.5 text-xs font-medium sticky left-0', darkMode ? 'text-white bg-surface-900' : 'text-gray-900 bg-white')}>{metric.name}</td>
                      {projects.map((p) => {
                        const val = p.metrics[metric.key] ?? 0;
                        const health = getMetricHealth(metric.key, val);
                        return (
                          <td key={p.id} className="px-2 py-1.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', HEALTH_DOT[health])} />
                              <span className={cn('text-[11px] font-medium', HEALTH_COLORS[health])}>{formatMetricValue(val, metric.unit)}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

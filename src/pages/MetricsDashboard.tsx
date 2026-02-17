import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { formatMetricValue, getMetricHealth, HEALTH_COLORS, HEALTH_BG, HEALTH_DOT } from '@/lib/metrics';
import {
  METRIC_DEFINITIONS, METRIC_CATEGORY_LABELS, FUNDAMENTAL_EVENTS,
  STATUS_LABELS, STATUS_COLORS,
} from '@/types';
import type { MetricCategory, Project } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChevronDown, Activity, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_CATEGORIES = Object.keys(METRIC_CATEGORY_LABELS) as MetricCategory[];

export default function MetricsDashboard() {
  const { projects, darkMode } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory | 'all'>('all');
  const [showEvents, setShowEvents] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const activeProjects = projects.filter((p) => p.status !== 'proposal');

  const filteredMetrics = selectedCategory === 'all'
    ? METRIC_DEFINITIONS
    : METRIC_DEFINITIONS.filter((m) => m.category === selectedCategory);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compareProjects = projects.filter((p) => compareIds.includes(p.id));

  // Radar data for comparison
  const radarKeys = ['startupHealthScore', 'grossMargin', 'retentionRate', 'dauMauRatio', 'growthEfficiency'];
  const radarLabels: Record<string, string> = {
    startupHealthScore: 'Health Score',
    grossMargin: 'Margen Bruto',
    retentionRate: 'RetenciÃ³n',
    dauMauRatio: 'DAU/MAU',
    growthEfficiency: 'Eficiencia',
  };
  const radarData = radarKeys.map((key) => {
    const entry: Record<string, string | number> = { metric: radarLabels[key] };
    compareProjects.forEach((p) => {
      entry[p.name] = p.metrics[key] ?? 0;
    });
    return entry;
  });

  const radarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  const tooltipStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: darkMode ? '#fff' : '#000',
  };
  const tickStyle = { fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' };

  // Bar chart data per category selected
  const barMetrics = filteredMetrics.slice(0, 6);
  const barData = barMetrics.map((metric) => {
    const entry: Record<string, string | number> = { name: metric.name };
    activeProjects.forEach((p) => {
      entry[p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name] = p.metrics[metric.key] ?? 0;
    });
    return entry;
  });

  const projectColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control Tower"
        subtitle="MÃ©tricas completas basadas en los 9 Eventos Fundamentales"
        action={
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
              darkMode ? 'border-surface-700/50 bg-surface-800 text-surface-200/70 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900'
            )}
          >
            <Zap className="w-4 h-4" />
            9 Eventos
            <ChevronDown className={cn('w-4 h-4 transition-transform', showEvents && 'rotate-180')} />
          </button>
        }
      />

      {/* 9 Fundamental Events panel */}
      {showEvents && (
        <div className={cn(
          'rounded-xl p-5 border animate-fade-in',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
            9 Eventos Fundamentales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {FUNDAMENTAL_EVENTS.map((event) => (
              <div key={event.name} className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                darkMode ? 'border-surface-700/30 bg-surface-800/30' : 'border-gray-100 bg-gray-50'
              )}>
                <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                <div>
                  <code className={cn('text-xs font-mono font-semibold', darkMode ? 'text-primary-400' : 'text-primary-600')}>
                    {event.name}
                  </code>
                  <p className={cn('text-xs mt-0.5', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category dropdown */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Activity className={cn('w-4 h-4', darkMode ? 'text-primary-400' : 'text-primary-600')} />
          <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>CategorÃ­a:</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as MetricCategory | 'all')}
          className={cn(
            'px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer',
            darkMode
              ? 'bg-surface-800 border-surface-700/50 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          )}
        >
          <option value="all">Todas las CategorÃ­as</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{METRIC_CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
        <span className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
          {filteredMetrics.length} mÃ©tricas
        </span>
      </div>

      {/* Metrics comparison table */}
      <div className={cn(
        'rounded-xl border overflow-hidden animate-fade-in',
        darkMode ? 'border-surface-700/50' : 'border-gray-200'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-surface-900/50' : 'bg-gray-50'}>
                <th className={cn('text-left text-xs font-semibold px-4 py-3 sticky left-0 z-10', darkMode ? 'text-surface-200/60 bg-surface-900/50' : 'text-gray-500 bg-gray-50')}>
                  MÃ©trica
                </th>
                <th className={cn('text-left text-xs font-semibold px-3 py-3', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                  FÃ³rmula
                </th>
                {activeProjects.map((p) => (
                  <th key={p.id} className={cn('text-center text-xs font-semibold px-3 py-3 min-w-[110px]', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                    <Link to={`/projects/${p.id}`} className="hover:underline">
                      {p.name.length > 16 ? p.name.slice(0, 16) + 'â€¦' : p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((metric, i) => {
                const prevCategory = i > 0 ? filteredMetrics[i - 1].category : null;
                const showCategoryHeader = metric.category !== prevCategory;
                return [
                  showCategoryHeader && (
                    <tr key={`cat-${metric.category}`}>
                      <td
                        colSpan={2 + activeProjects.length}
                        className={cn(
                          'px-4 py-2 text-xs font-bold uppercase tracking-wider',
                          darkMode ? 'bg-surface-800/50 text-accent-400' : 'bg-gray-100 text-primary-600'
                        )}
                      >
                        {METRIC_CATEGORY_LABELS[metric.category]}
                      </td>
                    </tr>
                  ),
                  <tr key={metric.key} className={cn(
                    'border-t transition-colors',
                    darkMode ? 'border-surface-700/20 hover:bg-surface-800/30' : 'border-gray-100 hover:bg-gray-50'
                  )}>
                    <td className={cn(
                      'px-4 py-2.5 text-xs font-medium sticky left-0',
                      darkMode ? 'text-white bg-surface-900' : 'text-gray-900 bg-white'
                    )}>
                      <div className="flex items-center gap-1.5">
                        {metric.name}
                        {metric.events.length > 0 && (
                          <span title={`Eventos: ${metric.events.join(', ')}`}>
                            <Info className="w-3 h-3 text-surface-200/30 cursor-help" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={cn('px-3 py-2.5 text-[10px] max-w-[180px]', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                      {metric.formula}
                    </td>
                    {activeProjects.map((p) => {
                      const val = p.metrics[metric.key] ?? 0;
                      const health = getMetricHealth(metric.key, val);
                      return (
                        <td key={p.id} className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className={cn('w-1.5 h-1.5 rounded-full', HEALTH_DOT[health])} />
                            <span className={cn('text-xs font-medium', HEALTH_COLORS[health])}>
                              {formatMetricValue(val, metric.unit)}
                            </span>
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
      </div>

      {/* Compare section */}
      <div className={cn(
        'rounded-xl p-5 border animate-fade-in',
        darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
          Comparar Proyectos (selecciona hasta 4)
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleCompare(p.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                compareIds.includes(p.id)
                  ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                  : darkMode
                    ? 'bg-surface-800 border-surface-700/50 text-surface-200/60 hover:text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900'
              )}
            >
              {p.name}
              <Badge className={cn('ml-2', STATUS_COLORS[p.status])}>
                {STATUS_LABELS[p.status]}
              </Badge>
            </button>
          ))}
        </div>

        {compareProjects.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Radar */}
            <div className={cn(
              'rounded-lg p-4 border',
              darkMode ? 'border-surface-700/30' : 'border-gray-200'
            )}>
              <h4 className={cn('text-xs font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
                Radar Comparativo
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <PolarAngleAxis dataKey="metric" tick={tickStyle} />
                    <PolarRadiusAxis tick={tickStyle} />
                    {compareProjects.map((p, i) => (
                      <Radar
                        key={p.id}
                        name={p.name}
                        dataKey={p.name}
                        stroke={radarColors[i]}
                        fill={radarColors[i]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                    <Tooltip contentStyle={tooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side by side metrics */}
            <div className={cn(
              'rounded-lg p-4 border',
              darkMode ? 'border-surface-700/30' : 'border-gray-200'
            )}>
              <h4 className={cn('text-xs font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
                MÃ©tricas Lado a Lado
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredMetrics.slice(0, 12).map((metric) => (
                  <div key={metric.key}>
                    <p className={cn('text-[10px] font-medium mb-1', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                      {metric.name}
                    </p>
                    <div className="flex gap-2">
                      {compareProjects.map((p, i) => {
                        const val = p.metrics[metric.key] ?? 0;
                        const health = getMetricHealth(metric.key, val);
                        return (
                          <div
                            key={p.id}
                            className={cn(
                              'flex-1 px-2 py-1 rounded text-center border',
                              HEALTH_BG[health]
                            )}
                          >
                            <span className={cn('text-xs font-semibold', HEALTH_COLORS[health])}>
                              {formatMetricValue(val, metric.unit)}
                            </span>
                            <p className={cn('text-[9px] truncate', darkMode ? 'text-surface-200/40' : 'text-gray-400')} style={{ color: radarColors[i] }}>
                              {p.name.slice(0, 18)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {compareProjects.length < 2 && (
          <p className={cn('text-xs text-center py-6', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
            Selecciona al menos 2 proyectos para ver la comparaciÃ³n
          </p>
        )}
      </div>

      {/* Per-category bar chart */}
      {selectedCategory !== 'all' && barData.length > 0 && (
        <div className={cn(
          'rounded-xl p-5 border animate-fade-in',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
            {METRIC_CATEGORY_LABELS[selectedCategory]} â€” ComparaciÃ³n Visual
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} horizontal={false} />
                <XAxis type="number" tick={tickStyle} />
                <YAxis type="category" dataKey="name" tick={tickStyle} width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                {activeProjects.map((p, i) => {
                  const key = p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name;
                  return (
                    <Bar key={p.id} dataKey={key} fill={projectColors[i % projectColors.length]} radius={[0, 3, 3, 0]} />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

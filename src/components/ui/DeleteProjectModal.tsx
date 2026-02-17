import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { formatMetricValue, getMetricHealth, HEALTH_COLORS, HEALTH_DOT } from '@/lib/metrics';
import { METRIC_DEFINITIONS, METRIC_CATEGORY_LABELS, STATUS_LABELS } from '@/types';
import type { Project, MetricCategory } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface DeleteProjectModalProps {
  project: Project;
  onClose: () => void;
  onConfirm: () => void;
}

const KEY_CATEGORIES: MetricCategory[] = ['supervivencia', 'ingresos', 'rentabilidad', 'retencion', 'valor_cliente'];

export function DeleteProjectModal({ project, onClose, onConfirm }: DeleteProjectModalProps) {
  const { darkMode, clients } = useStore();
  const [confirmText, setConfirmText] = useState('');
  const client = clients.find((c) => c.id === project.clientId);

  const keyMetrics = METRIC_DEFINITIONS.filter(
    (m) => KEY_CATEGORIES.includes(m.category) && (project.metrics[m.key] ?? 0) !== 0
  );

  const healthSummary = keyMetrics.reduce(
    (acc, m) => {
      const health = getMetricHealth(m.key, project.metrics[m.key] ?? 0);
      acc[health]++;
      return acc;
    },
    { healthy: 0, warning: 0, critical: 0 }
  );

  const canDelete = confirmText === project.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl',
        darkMode ? 'bg-surface-900 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between p-5 border-b',
          darkMode ? 'bg-surface-900 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                Eliminar Proyecto
              </h2>
              <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                Revisa las métricas antes de eliminar
              </p>
            </div>
          </div>
          <button onClick={onClose} className={cn(
            'p-2 rounded-lg transition-colors',
            darkMode ? 'hover:bg-surface-800 text-surface-200/60' : 'hover:bg-gray-100 text-gray-500'
          )}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Project info */}
          <div className={cn(
            'rounded-xl p-4 border',
            darkMode ? 'bg-surface-800/50 border-surface-700/30' : 'bg-gray-50 border-gray-200'
          )}>
            <h3 className={cn('text-base font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              {project.name}
            </h3>
            <p className={cn('text-sm mt-1', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
              {client?.name} &middot; {STATUS_LABELS[project.status]}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>Presupuesto</p>
                <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                  {formatCurrency(project.budget)}
                </p>
              </div>
              <div>
                <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>Gastado</p>
                <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                  {formatCurrency(project.spent)}
                </p>
              </div>
              <div>
                <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>Progreso</p>
                <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                  {project.progress}%
                </p>
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { label: 'Saludables', count: healthSummary.healthy, color: 'emerald' },
              { label: 'Advertencia', count: healthSummary.warning, color: 'yellow' },
              { label: 'Críticas', count: healthSummary.critical, color: 'red' },
            ] as const).map((item) => (
              <div key={item.label} className={cn(
                'rounded-lg p-3 border text-center',
                darkMode ? 'border-surface-700/30 bg-surface-800/30' : 'border-gray-200 bg-gray-50'
              )}>
                <p className={`text-xl font-bold text-${item.color}-400`}>{item.count}</p>
                <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          {keyMetrics.length > 0 && (
            <div>
              <h4 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
                Métricas Clave del Proyecto
              </h4>
              <div className={cn(
                'rounded-xl border overflow-hidden',
                darkMode ? 'border-surface-700/50' : 'border-gray-200'
              )}>
                <table className="w-full">
                  <thead>
                    <tr className={darkMode ? 'bg-surface-800/50' : 'bg-gray-50'}>
                      {['Métrica', 'Categoría', 'Valor', 'Estado'].map((h) => (
                        <th key={h} className={cn('text-left text-xs font-semibold px-3 py-2', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keyMetrics.map((metric) => {
                      const val = project.metrics[metric.key] ?? 0;
                      const health = getMetricHealth(metric.key, val);
                      return (
                        <tr key={metric.key} className={cn(
                          'border-t',
                          darkMode ? 'border-surface-700/20' : 'border-gray-100'
                        )}>
                          <td className={cn('px-3 py-2 text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                            {metric.name}
                          </td>
                          <td className={cn('px-3 py-2 text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                            {METRIC_CATEGORY_LABELS[metric.category]}
                          </td>
                          <td className={cn('px-3 py-2 text-xs font-medium', HEALTH_COLORS[health])}>
                            {formatMetricValue(val, metric.unit)}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <div className={cn('w-2 h-2 rounded-full', HEALTH_DOT[health])} />
                              <span className={cn('text-xs capitalize', HEALTH_COLORS[health])}>
                                {health === 'healthy' ? 'Saludable' : health === 'warning' ? 'Advertencia' : 'Crítico'}
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
          )}

          {/* Warning */}
          <div className={cn(
            'rounded-lg p-4 border',
            'bg-red-500/10 border-red-500/20'
          )}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  Esta acción es irreversible
                </p>
                <p className={cn('text-xs mt-1', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                  Se eliminarán todos los datos del proyecto, incluyendo milestones, asignaciones de equipo y métricas.
                  {project.spent > 0 && ` Se han invertido ${formatCurrency(project.spent)} en este proyecto.`}
                </p>
              </div>
            </div>
          </div>

          {/* Confirm input */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', darkMode ? 'text-surface-200/70' : 'text-gray-700')}>
              Escribe <span className="font-bold text-red-400">"{project.name}"</span> para confirmar:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.name}
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors',
                darkMode
                  ? 'bg-surface-800 border-surface-700/50 text-white placeholder:text-surface-200/30 focus:border-red-500/50'
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-red-500'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                darkMode
                  ? 'bg-surface-800 text-surface-200/70 hover:bg-surface-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={!canDelete}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                canDelete
                  ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                  : 'bg-red-500/20 text-red-500/40 cursor-not-allowed'
              )}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

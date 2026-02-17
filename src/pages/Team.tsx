import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ROLE_LABELS } from '@/types';
import { Mail, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Team() {
  const { developers, projects, darkMode } = useStore();

  const getDevProjects = (devId: string) => projects.filter((p) => p.teamIds.includes(devId) && p.status !== 'completed');
  const getTotalEarned = (devId: string) => {
    const devProjects = projects.filter((p) => p.teamIds.includes(devId));
    return devProjects.reduce((sum, p) => sum + Math.round(p.spent / p.teamIds.length), 0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo"
        subtitle={`${developers.length} miembros del equipo`}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Full Time', value: developers.length },
          { label: 'Disponibles', value: developers.filter((d) => d.availability > 50).length },
          { label: 'Ocupados', value: developers.filter((d) => d.availability <= 20).length },
          { label: 'Utilización Promedio', value: `${Math.round(developers.reduce((s, d) => s + (100 - d.availability), 0) / developers.length)}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl p-4 border text-center',
              darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
            )}
          >
            <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
              {stat.value}
            </p>
            <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {developers.map((dev) => {
          const devProjects = getDevProjects(dev.id);
          const utilization = 100 - dev.availability;

          return (
            <div
              key={dev.id}
              className={cn(
                'rounded-xl p-5 border transition-all duration-200 hover:scale-[1.01] animate-fade-in',
                darkMode
                  ? 'bg-surface-900/80 border-surface-700/50 hover:border-surface-700'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={dev.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className={cn('text-base font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {dev.name}
                  </h3>
                  <Badge className={cn(
                    'mt-1',
                    darkMode ? 'bg-primary-500/15 text-primary-400 border-primary-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
                  )}>
                    {ROLE_LABELS[dev.role]}
                  </Badge>
                  <div className="flex items-center gap-1 mt-2">
                    <Mail className={cn('w-3 h-3', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                    <span className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                      {dev.email}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                    ${dev.hourlyRate}
                  </p>
                  <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>/hora</p>
                </div>
              </div>

              {/* Utilization */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                    Utilización
                  </span>
                  <span className={cn(
                    'text-xs font-semibold',
                    utilization > 80 ? 'text-red-400' : utilization > 50 ? 'text-orange-400' : 'text-emerald-400'
                  )}>
                    {utilization}%
                  </span>
                </div>
                <ProgressBar
                  value={utilization}
                  color={utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-orange-500' : 'bg-emerald-500'}
                  size="md"
                />
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <Code2 className={cn('w-3 h-3', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                  <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                    Skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-medium',
                        darkMode ? 'bg-surface-700/50 text-surface-200/70' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Projects */}
              {devProjects.length > 0 && (
                <div className={cn('border-t pt-3', darkMode ? 'border-surface-700/30' : 'border-gray-100')}>
                  <p className={cn('text-xs font-medium mb-2', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                    Proyectos Activos ({devProjects.length})
                  </p>
                  {devProjects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className={cn(
                        'flex items-center justify-between text-xs py-1 px-2 rounded transition-colors',
                        darkMode ? 'hover:bg-surface-800 text-surface-200/60' : 'hover:bg-gray-50 text-gray-600'
                      )}
                    >
                      <span>{p.name}</span>
                      <span className="text-primary-400">{p.progress}%</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className={cn(
                'border-t mt-3 pt-3 flex items-center justify-between',
                darkMode ? 'border-surface-700/30' : 'border-gray-100'
              )}>
                <span className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                  Revenue generado
                </span>
                <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                  {formatCurrency(getTotalEarned(dev.id))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

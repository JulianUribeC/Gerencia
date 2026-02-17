import { FolderKanban, DollarSign, Users, TrendingUp, Clock, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { IndustryChart } from '@/components/charts/IndustryChart';
import { TeamUtilizationChart } from '@/components/charts/TeamUtilizationChart';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import { revenueData } from '@/data/mock';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { projects, clients, developers, sprints, darkMode } = useStore();

  const activeProjects = projects.filter((p) => p.status === 'in_development' || p.status === 'testing');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
  const avgUtilization = Math.round(developers.reduce((sum, d) => sum + (100 - d.availability), 0) / developers.length);
  const activeSprints = sprints.filter((s) => s.status === 'active');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Bienvenido de vuelta. Tienes ${activeProjects.length} proyectos activos.`}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proyectos Activos"
          value={activeProjects.length}
          subtitle={`${completedProjects.length} completados`}
          icon={FolderKanban}
          color="blue"
        />
        <StatCard
          title="Revenue (12 meses)"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 12, positive: true }}
          color="green"
        />
        <StatCard
          title="Equipo"
          value={developers.length}
          subtitle={`${avgUtilization}% utilización promedio`}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Clientes Activos"
          value={clients.length}
          subtitle={`${projects.filter(p => p.status === 'proposal').length} propuestas pendientes`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <IndustryChart />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Sprints */}
        <div className={cn(
          'rounded-xl p-5 border animate-fade-in',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary-400" />
            <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              Sprints Activos
            </h3>
          </div>
          <div className="space-y-4">
            {activeSprints.map((sprint) => {
              const project = projects.find((p) => p.id === sprint.projectId);
              return (
                <div key={sprint.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                        {sprint.name}
                      </p>
                      <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                        {project?.name}
                      </p>
                    </div>
                    <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                      {sprint.completedTasks}/{sprint.totalTasks}
                    </span>
                  </div>
                  <ProgressBar value={sprint.completedTasks} max={sprint.totalTasks} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Timeline */}
        <div className={cn(
          'rounded-xl p-5 border animate-fade-in',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-accent-400" />
            <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              Proyectos Activos
            </h3>
          </div>
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={cn(
                  'block p-3 rounded-lg transition-colors',
                  darkMode ? 'hover:bg-surface-800' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {project.name}
                  </p>
                  <Badge className={STATUS_COLORS[project.status]}>
                    {STATUS_LABELS[project.status]}
                  </Badge>
                </div>
                <ProgressBar value={project.progress} showLabel />
              </Link>
            ))}
          </div>
        </div>

        {/* Team Utilization */}
        <TeamUtilizationChart />
      </div>

      {/* Quick team overview */}
      <div className={cn(
        'rounded-xl p-5 border animate-fade-in',
        darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
          Equipo
        </h3>
        <div className="flex flex-wrap gap-3">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border',
                darkMode ? 'border-surface-700/50 bg-surface-800/50' : 'border-gray-200 bg-gray-50'
              )}
            >
              <Avatar name={dev.name} size="sm" />
              <div>
                <p className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                  {dev.name}
                </p>
                <p className={cn('text-[10px]', dev.availability > 50 ? 'text-emerald-400' : dev.availability > 0 ? 'text-orange-400' : 'text-red-400')}>
                  {dev.availability}% disponible
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

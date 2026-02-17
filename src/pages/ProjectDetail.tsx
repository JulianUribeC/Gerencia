import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, CheckCircle2, Circle, Clock, Trash2, Pencil } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { DeleteProjectModal } from '@/components/ui/DeleteProjectModal';
import { EditProjectModal } from '@/components/ui/EditProjectModal';
import { STATUS_LABELS, STATUS_COLORS, INDUSTRY_LABELS, ROLE_LABELS } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, clients, developers, sprints, darkMode, deleteProject } = useStore();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const project = projects.find((p) => p.id === id);
  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-surface-200/50">Proyecto no encontrado</p>
      </div>
    );
  }

  const client = clients.find((c) => c.id === project.clientId);
  const team = developers.filter((d) => project.teamIds.includes(d.id));
  const projectSprints = sprints.filter((s) => s.projectId === project.id);
  const completedMilestones = project.milestones.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/projects"
          className={cn(
            'p-2 rounded-lg transition-colors',
            darkMode ? 'hover:bg-surface-800 text-surface-200/60' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
              {project.name}
            </h1>
            <Badge className={STATUS_COLORS[project.status]}>
              {STATUS_LABELS[project.status]}
            </Badge>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  darkMode ? 'bg-primary-500/15 text-primary-400 hover:bg-primary-500/25' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                )}
                title="Editar proyecto"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  darkMode ? 'hover:bg-red-500/20 text-surface-200/40 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                )}
                title="Eliminar proyecto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className={cn('text-sm mt-1', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
            {client?.name} &middot; {INDUSTRY_LABELS[project.industry]}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className={cn('text-sm leading-relaxed', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
        {project.description}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Presupuesto', value: formatCurrency(project.budget), sub: `${formatCurrency(project.spent)} gastado` },
          { icon: Calendar, label: 'DuraciÃ³n', value: formatDate(project.startDate), sub: `hasta ${formatDate(project.endDate)}` },
          { icon: Users, label: 'Equipo', value: `${team.length} personas`, sub: project.techStack.slice(0, 3).join(', ') },
          { icon: CheckCircle2, label: 'Hitos', value: `${completedMilestones}/${project.milestones.length}`, sub: `${project.progress}% completado` },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl p-4 border',
              darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn('w-4 h-4', darkMode ? 'text-primary-400' : 'text-primary-500')} />
              <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                {stat.label}
              </span>
            </div>
            <p className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
              {stat.value}
            </p>
            <p className={cn('text-xs mt-0.5', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className={cn(
        'rounded-xl p-5 border',
        darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
            Progreso General
          </h3>
          <span className={cn('text-2xl font-bold', darkMode ? 'text-primary-400' : 'text-primary-600')}>
            {project.progress}%
          </span>
        </div>
        <ProgressBar value={project.progress} size="md" />
        <div className="flex items-center justify-between mt-2">
          <span className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
            {formatCurrency(project.spent)} de {formatCurrency(project.budget)}
          </span>
          <span className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
            Presupuesto utilizado: {Math.round((project.spent / project.budget) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Milestones */}
        <div className={cn(
          'rounded-xl p-5 border',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
            Hitos
          </h3>
          <div className="space-y-3">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3">
                {milestone.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className={cn('w-5 h-5 mt-0.5 flex-shrink-0', darkMode ? 'text-surface-200/30' : 'text-gray-300')} />
                )}
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    milestone.completed
                      ? darkMode ? 'text-surface-200/50 line-through' : 'text-gray-400 line-through'
                      : darkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {milestone.title}
                  </p>
                  <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                    {formatDate(milestone.dueDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={cn(
          'rounded-xl p-5 border',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
            Equipo Asignado
          </h3>
          <div className="space-y-3">
            {team.map((dev) => (
              <div key={dev.id} className="flex items-center gap-3">
                <Avatar name={dev.name} size="md" />
                <div className="flex-1">
                  <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {dev.name}
                  </p>
                  <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                    {ROLE_LABELS[dev.role]}
                  </p>
                </div>
                <span className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                  ${dev.hourlyRate}/hr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sprints */}
      {projectSprints.length > 0 && (
        <div className={cn(
          'rounded-xl p-5 border',
          darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-accent-400" />
            <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              Sprints
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectSprints.map((sprint) => (
              <div
                key={sprint.id}
                className={cn(
                  'p-3 rounded-lg border',
                  darkMode ? 'border-surface-700/30 bg-surface-800/30' : 'border-gray-100 bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {sprint.name}
                  </p>
                  <Badge className={
                    sprint.status === 'active'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-surface-500/20 text-surface-200/60 border-surface-700'
                  }>
                    {sprint.status === 'active' ? 'Activo' : 'Planeado'}
                  </Badge>
                </div>
                <ProgressBar value={sprint.completedTasks} max={sprint.totalTasks} showLabel />
                <p className={cn('text-xs mt-1', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                  {sprint.completedTasks}/{sprint.totalTasks} tareas
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div className={cn(
        'rounded-xl p-5 border',
        darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium',
                darkMode ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-primary-50 text-primary-700'
              )}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Costos */}
      {(project.fixedCosts.length > 0 || project.variableCosts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {project.fixedCosts.length > 0 && (
            <div className={cn('rounded-xl p-5 border', darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200')}>
              <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>Costos Fijos</h3>
              <div className="space-y-2">
                {project.fixedCosts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className={cn('text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{c.label || '—'}</span>
                    <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{formatCurrency(c.amount)}</span>
                  </div>
                ))}
                <div className={cn('flex items-center justify-between pt-2 mt-2 border-t', darkMode ? 'border-surface-700/50' : 'border-gray-200')}>
                  <span className={cn('text-xs font-semibold', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>Total</span>
                  <span className={cn('text-sm font-bold', darkMode ? 'text-primary-400' : 'text-primary-600')}>
                    {formatCurrency(project.fixedCosts.reduce((s, c) => s + c.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
          {project.variableCosts.length > 0 && (
            <div className={cn('rounded-xl p-5 border', darkMode ? 'bg-surface-900/80 border-surface-700/50' : 'bg-white border-gray-200')}>
              <h3 className={cn('text-sm font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>Costos Variables</h3>
              <div className="space-y-2">
                {project.variableCosts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className={cn('text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>{c.label || '—'}</span>
                    <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{formatCurrency(c.amount)}</span>
                  </div>
                ))}
                <div className={cn('flex items-center justify-between pt-2 mt-2 border-t', darkMode ? 'border-surface-700/50' : 'border-gray-200')}>
                  <span className={cn('text-xs font-semibold', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>Total</span>
                  <span className={cn('text-sm font-bold', darkMode ? 'text-accent-400' : 'text-accent-600')}>
                    {formatCurrency(project.variableCosts.reduce((s, c) => s + c.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <EditProjectModal project={project} onClose={() => setShowEdit(false)} />
      )}

      {/* Delete modal */}
      {showDelete && (
        <DeleteProjectModal
          project={project}
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            deleteProject(project.id);
            navigate('/projects');
          }}
        />
      )}
    </div>
  );
}

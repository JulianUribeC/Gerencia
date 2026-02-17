import { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, LayoutGrid, Plus, Search, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { DeleteProjectModal } from '@/components/ui/DeleteProjectModal';
import { NewProjectModal } from '@/components/ui/NewProjectModal';
import { STATUS_LABELS, STATUS_COLORS, INDUSTRY_LABELS, PRIORITY_COLORS } from '@/types';
import type { Project } from '@/types';
import type { ProjectStatus } from '@/types';

const kanbanColumns: { status: ProjectStatus; label: string; color: string }[] = [
  { status: 'proposal', label: 'Propuestas', color: 'border-t-yellow-500' },
  { status: 'in_development', label: 'En Desarrollo', color: 'border-t-blue-500' },
  { status: 'testing', label: 'Testing', color: 'border-t-purple-500' },
  { status: 'completed', label: 'Completados', color: 'border-t-emerald-500' },
];

export default function Projects() {
  const { projects, clients, developers, darkMode, deleteProject } = useStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    clients.find((c) => c.id === p.clientId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getClient = (id: string) => clients.find((c) => c.id === id);
  const getDevs = (ids: string[]) => developers.filter((d) => ids.includes(d.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        subtitle={`${projects.length} proyectos total`}
        action={
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border',
              darkMode ? 'bg-surface-800 border-surface-700/50' : 'bg-white border-gray-200'
            )}>
              <Search className="w-4 h-4 text-surface-200/50" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  'bg-transparent border-none outline-none text-sm w-48',
                  darkMode ? 'text-white placeholder:text-surface-200/40' : 'text-gray-900 placeholder:text-gray-400'
                )}
              />
            </div>
            <div className={cn(
              'flex rounded-lg border overflow-hidden',
              darkMode ? 'border-surface-700/50' : 'border-gray-200'
            )}>
              <button
                onClick={() => setView('kanban')}
                className={cn(
                  'p-2 transition-colors',
                  view === 'kanban'
                    ? 'bg-primary-500 text-white'
                    : darkMode ? 'bg-surface-800 text-surface-200/60 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-900'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'p-2 transition-colors',
                  view === 'list'
                    ? 'bg-primary-500 text-white'
                    : darkMode ? 'bg-surface-800 text-surface-200/60 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-900'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo
            </button>
          </div>
        }
      />

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colProjects = filtered.filter((p) => p.status === col.status);
            return (
              <div key={col.status} className="space-y-3">
                <div className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg border-t-2',
                  col.color,
                  darkMode ? 'bg-surface-900/50 border border-surface-700/30' : 'bg-gray-100 border border-gray-200'
                )}>
                  <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {col.label}
                  </span>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    darkMode ? 'bg-surface-700/50 text-surface-200/70' : 'bg-gray-200 text-gray-600'
                  )}>
                    {colProjects.length}
                  </span>
                </div>
                {colProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      'rounded-xl p-4 border transition-all duration-200 hover:scale-[1.01] animate-fade-in group relative',
                      darkMode
                        ? 'bg-surface-900/80 border-surface-700/50 hover:border-surface-700'
                        : 'bg-white border-gray-200 hover:shadow-md'
                    )}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(project); }}
                      className={cn(
                        'absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10',
                        darkMode ? 'hover:bg-red-500/20 text-surface-200/40 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                      )}
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link to={`/projects/${project.id}`} className="block space-y-3">
                      <div>
                        <p className={cn('text-sm font-semibold pr-6', darkMode ? 'text-white' : 'text-gray-900')}>
                          {project.name}
                        </p>
                        <p className={cn('text-xs mt-0.5', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                          {getClient(project.clientId)?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={PRIORITY_COLORS[project.priority]}>
                          {project.priority}
                        </Badge>
                        <Badge className={cn(darkMode ? 'bg-surface-700/50 text-surface-200/70 border-surface-700' : 'bg-gray-100 text-gray-600 border-gray-200')}>
                          {INDUSTRY_LABELS[project.industry]}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                            Progreso
                          </span>
                          <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                            {project.progress}%
                          </span>
                        </div>
                        <ProgressBar value={project.progress} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {getDevs(project.teamIds).slice(0, 3).map((dev) => (
                            <Avatar key={dev.id} name={dev.name} size="sm" className="ring-2 ring-surface-900" />
                          ))}
                          {project.teamIds.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-xs text-surface-200/70 ring-2 ring-surface-900">
                              +{project.teamIds.length - 3}
                            </div>
                          )}
                        </div>
                        <span className={cn('text-xs font-medium', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                          {formatCurrency(project.budget)}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={cn(
          'rounded-xl border overflow-hidden',
          darkMode ? 'border-surface-700/50' : 'border-gray-200'
        )}>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-surface-900/50' : 'bg-gray-50'}>
                {['Proyecto', 'Cliente', 'Estado', 'Progreso', 'Presupuesto', 'Equipo', ''].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold px-4 py-3', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className={cn(
                    'border-t transition-colors',
                    darkMode ? 'border-surface-700/30 hover:bg-surface-800/50' : 'border-gray-100 hover:bg-gray-50'
                  )}
                >
                  <td className="px-4 py-3">
                    <Link to={`/projects/${project.id}`} className={cn('text-sm font-medium hover:underline', darkMode ? 'text-white' : 'text-gray-900')}>
                      {project.name}
                    </Link>
                  </td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-surface-200/70' : 'text-gray-600')}>
                    {getClient(project.clientId)?.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLORS[project.status]}>
                      {STATUS_LABELS[project.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 w-36">
                    <ProgressBar value={project.progress} showLabel />
                  </td>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    {formatCurrency(project.budget)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {getDevs(project.teamIds).slice(0, 4).map((dev) => (
                        <Avatar key={dev.id} name={dev.name} size="sm" className="ring-2 ring-surface-900" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        darkMode ? 'hover:bg-red-500/20 text-surface-200/30 hover:text-red-400' : 'hover:bg-red-50 text-gray-300 hover:text-red-500'
                      )}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New project modal */}
      {showNewModal && (
        <NewProjectModal onClose={() => setShowNewModal(false)} />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteProjectModal
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteProject(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}

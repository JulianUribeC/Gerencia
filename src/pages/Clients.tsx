import { useState } from 'react';
import { Mail, Phone, MapPin, FolderKanban, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { INDUSTRY_LABELS } from '@/types';
import { Link } from 'react-router-dom';

export default function Clients() {
  const { clients, projects, darkMode } = useStore();
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const getClientProjects = (clientId: string) => projects.filter((p) => p.clientId === clientId);
  const getLifetimeValue = (clientId: string) =>
    getClientProjects(clientId).reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} clientes registrados`}
        action={
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border',
            darkMode ? 'bg-surface-800 border-surface-700/50' : 'bg-white border-gray-200'
          )}>
            <Search className="w-4 h-4 text-surface-200/50" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'bg-transparent border-none outline-none text-sm w-48',
                darkMode ? 'text-white placeholder:text-surface-200/40' : 'text-gray-900 placeholder:text-gray-400'
              )}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const clientProjects = getClientProjects(client.id);
          const activeCount = clientProjects.filter((p) => p.status !== 'completed').length;

          return (
            <div
              key={client.id}
              className={cn(
                'rounded-xl p-5 border transition-all duration-200 hover:scale-[1.01] animate-fade-in',
                darkMode
                  ? 'bg-surface-900/80 border-surface-700/50 hover:border-surface-700'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={client.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className={cn('text-base font-semibold truncate', darkMode ? 'text-white' : 'text-gray-900')}>
                    {client.name}
                  </h3>
                  <p className={cn('text-sm', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                    {client.contactName}
                  </p>
                  <Badge className={cn(
                    'mt-1',
                    darkMode ? 'bg-accent-500/15 text-accent-400 border-accent-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'
                  )}>
                    {INDUSTRY_LABELS[client.industry]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className={cn('w-3.5 h-3.5', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-600')}>
                    {client.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className={cn('w-3.5 h-3.5', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-600')}>
                    {client.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className={cn('w-3.5 h-3.5', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                  <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-600')}>
                    {client.address}
                  </span>
                </div>
              </div>

              <div className={cn(
                'border-t pt-4 flex items-center justify-between',
                darkMode ? 'border-surface-700/30' : 'border-gray-100'
              )}>
                <div>
                  <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                    Valor Lifetime
                  </p>
                  <p className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {formatCurrency(getLifetimeValue(client.id))}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <FolderKanban className={cn('w-3.5 h-3.5', darkMode ? 'text-surface-200/40' : 'text-gray-400')} />
                    <span className={cn('text-xs', darkMode ? 'text-surface-200/60' : 'text-gray-600')}>
                      {clientProjects.length} proyectos
                    </span>
                  </div>
                  {activeCount > 0 && (
                    <span className="text-xs text-emerald-400 font-medium">
                      {activeCount} activo{activeCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {clientProjects.length > 0 && (
                <div className={cn(
                  'border-t mt-4 pt-3 space-y-1',
                  darkMode ? 'border-surface-700/30' : 'border-gray-100'
                )}>
                  {clientProjects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className={cn(
                        'flex items-center justify-between text-xs py-1.5 px-2 rounded transition-colors',
                        darkMode ? 'hover:bg-surface-800 text-surface-200/60' : 'hover:bg-gray-50 text-gray-600'
                      )}
                    >
                      <span>{p.name}</span>
                      <span className={cn('font-medium', p.status === 'completed' ? 'text-emerald-400' : 'text-primary-400')}>
                        {p.progress}%
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

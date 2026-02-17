import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Activity,
  Receipt,
  Megaphone,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Proyectos' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/metrics', icon: Activity, label: 'Control Tower' },
  { to: '/taxes', icon: Receipt, label: 'Impuestos' },
  { to: '/marketing', icon: Megaphone, label: 'Marketing' },
];

export function Sidebar() {
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300 flex flex-col',
        darkMode
          ? 'bg-surface-900 border-surface-700/50'
          : 'bg-white border-gray-200',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b',
        darkMode ? 'border-surface-700/50' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className={cn('font-bold text-lg', darkMode ? 'text-white' : 'text-gray-900')}>
                Terranova
              </h1>
              <p className={cn('text-xs -mt-1', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
                Tech
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                sidebarOpen ? '' : 'justify-center',
                isActive
                  ? darkMode
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'bg-primary-50 text-primary-600'
                  : darkMode
                    ? 'text-surface-200/70 hover:bg-surface-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-sm')} />
                {sidebarOpen && (
                  <span className="text-sm font-medium animate-fade-in">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className={cn(
        'px-3 py-4 border-t space-y-2',
        darkMode ? 'border-surface-700/50' : 'border-gray-200'
      )}>
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
            sidebarOpen ? '' : 'justify-center',
            darkMode
              ? 'text-surface-200/70 hover:bg-surface-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {sidebarOpen && <span className="text-sm font-medium">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
            sidebarOpen ? '' : 'justify-center',
            darkMode
              ? 'text-surface-200/70 hover:bg-surface-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          {sidebarOpen && <span className="text-sm font-medium">Colapsar</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
            sidebarOpen ? '' : 'justify-center',
            darkMode
              ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400'
              : 'text-red-500/70 hover:bg-red-50 hover:text-red-600'
          )}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

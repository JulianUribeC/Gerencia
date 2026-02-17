import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function Layout() {
  const { darkMode, sidebarOpen } = useStore();

  return (
    <div className={cn(darkMode && 'dark')}>
      <div className={cn(
        'min-h-screen transition-colors duration-300',
        darkMode ? 'bg-surface-950 text-white' : 'bg-gray-50 text-gray-900'
      )}>
        <Sidebar />
        <main
          className={cn(
            'transition-all duration-300 min-h-screen',
            sidebarOpen ? 'ml-64' : 'ml-20'
          )}
        >
          <div className="p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

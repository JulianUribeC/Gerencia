import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { darkMode } = useStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn('text-sm mt-1', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

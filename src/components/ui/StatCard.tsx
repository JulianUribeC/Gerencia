import type { LucideIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

const colorMap = {
  blue: 'from-primary-500 to-primary-600',
  purple: 'from-accent-500 to-accent-600',
  green: 'from-emerald-500 to-emerald-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  const { darkMode } = useStore();

  return (
    <div className={cn(
      'rounded-xl p-5 border transition-all duration-200 hover:scale-[1.02] animate-fade-in',
      darkMode
        ? 'bg-surface-900/80 border-surface-700/50 hover:border-surface-700'
        : 'bg-white border-gray-200 hover:shadow-lg'
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', darkMode ? 'text-surface-200/60' : 'text-gray-500')}>
            {title}
          </p>
          <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-400')}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn('text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
              {trend.positive ? '+' : ''}{trend.value}% vs mes anterior
            </p>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center', colorMap[color])}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

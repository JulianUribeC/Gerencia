import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, size = 'sm', color, showLabel = false }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color || (pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-primary-500' : 'bg-orange-500');

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'flex-1 rounded-full bg-surface-700/30 overflow-hidden',
        size === 'sm' ? 'h-1.5' : 'h-2.5'
      )}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-surface-200/60 font-medium w-10 text-right">{Math.round(pct)}%</span>
      )}
    </div>
  );
}

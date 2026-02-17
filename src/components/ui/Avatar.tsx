import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colors = [
  'from-primary-500 to-primary-600',
  'from-accent-500 to-accent-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600',
  'from-rose-500 to-rose-600',
  'from-indigo-500 to-indigo-600',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white flex-shrink-0',
      sizeMap[size],
      getColor(name),
      className
    )}>
      {getInitials(name)}
    </div>
  );
}

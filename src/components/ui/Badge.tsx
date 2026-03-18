import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'green' | 'yellow' | 'blue' | 'rose' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  purple: 'bg-purple-100 text-purple-700 ring-purple-200',
  green: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-100 text-amber-700 ring-amber-200',
  blue: 'bg-sky-100 text-sky-700 ring-sky-200',
  rose: 'bg-rose-100 text-rose-700 ring-rose-200',
  gray: 'bg-gray-100 text-gray-600 ring-gray-200',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded-full',
  md: 'text-sm px-2.5 py-1 rounded-full',
};

export function Badge({ children, variant = 'purple', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium ring-1 ring-inset',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

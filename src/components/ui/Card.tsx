import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Card({ children, className, hover, padding = 'md', color }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white shadow-card border border-white/80',
        hover && 'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-soft',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-6',
        className
      )}
      style={color ? { background: color } : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, icon, className }: { children: React.ReactNode; icon?: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('flex items-center gap-2 text-lg font-bold text-gray-800', className)}>
      {icon && <span className="text-violet-500">{icon}</span>}
      {children}
    </h2>
  );
}

import { cn } from '../../utils/cn';

interface BlobProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  delay?: boolean;
}

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96',
};

export function Blob({ className, color = '#e9d5ff', size = 'lg', animated = true, delay }: BlobProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none',
        sizes[size],
        animated && 'animate-blob',
        delay && 'animation-delay-2000',
        className
      )}
      style={{ background: color }}
    />
  );
}

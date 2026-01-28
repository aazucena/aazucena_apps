import type { FC } from 'react';

export interface StatusBadgeProps {
  label?: string;
  variant?: 'green' | 'blue' | 'gray' | 'yellow' | 'red' | 'secondary';
  animated?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ 
  label, 
  variant = 'gray', 
  animated = false, 
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    green: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50',
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50',
    gray: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/50',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50',
    red: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400 dark:border-secondary-900/50'
  };

  const sizeMap: Record<'sm' | 'md', string> = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1.5 text-xs'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xl font-black uppercase tracking-widest border ${variantClasses[variant]} ${sizeMap[size]} ${className}`}>
      {animated && <div className="w-1 h-1 rounded-full bg-current animate-pulse" />}
      {label}
    </span>
  );
};

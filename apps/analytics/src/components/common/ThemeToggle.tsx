'use client';

import { useSyncExternalStore } from 'react';
import { Sun, Moon } from '@aazucena/icons';
import { cn } from '@/lib/utils';

// Define the available sizes
type ToggleSize = 'sm' | 'md' | 'lg';

interface ThemeToggleProps {
  size?: ToggleSize;
  className?: string;
}

export function ThemeToggle({ size = 'md', className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    },
    () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
    () => 'dark' as const,
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 1. SIZE MAPPING
  const sizeClasses = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2.5 rounded-xl',
    lg: 'p-4 rounded-2xl',
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'dark:bg-zinc-950/5 bg-zinc-50 border border-zinc-800 text-zinc-500 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer shadow-sm backdrop-blur-md',
        sizeClasses[size],
        className,
      )}
      aria-label="Toggle theme"
    >
      <div className="relative" style={{ width: iconSizes[size], height: iconSizes[size] }}>
        <div
          className={cn(
            'absolute inset-0 transition-all duration-500 transform',
            theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0',
          )}
        >
          <Sun size={iconSizes[size]} />
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-all duration-500 transform',
            theme === 'light' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0',
          )}
        >
          <Moon size={iconSizes[size]} />
        </div>
      </div>
    </button>
  );
}

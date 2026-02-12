import React from 'react';
import { Sun, Moon } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { useTheme } from '@aazucena/hooks';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'group cursor-pointer rounded-2xl border border-gray-100 bg-gray-50 p-3 text-gray-600 shadow-sm transition-all duration-300 hover:scale-110 hover:text-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:outline-none active:scale-95 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-400',
        className,
      )}
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <div
          className={cn(
            'absolute inset-0 transform transition-all duration-500',
            theme === 'dark' ? 'rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0',
          )}
        >
          <Sun size={20} />
        </div>
        <div
          className={cn(
            'absolute inset-0 transform transition-all duration-500',
            theme === 'light' ? 'rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
          )}
        >
          <Moon size={20} />
        </div>
      </div>
    </button>
  );
}

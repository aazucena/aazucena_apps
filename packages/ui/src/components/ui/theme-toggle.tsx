'use client';

import * as React from 'react';
import { Sun, Moon } from '@aazucena/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { useTheme } from '@aazucena/hooks';

const themeToggleVariants = cva(
  'group relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400',
        glass:
          'rounded-full bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 text-foreground/70 hover:text-white hover:bg-background/10 dark:bg-white/10 shadow-xl',
        cyber:
          'rounded-lg bg-background/40 dark:bg-black/40 border border-cyan-500/30 text-foreground0/70 hover:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
        ghost: 'bg-transparent border-none text-muted-foreground hover:text-foreground shadow-none',
      },
      size: {
        default: 'p-3',
        sm: 'p-2',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const sunIconVariants = cva('absolute inset-0 transform transition-all duration-500', {
  variants: {
    theme: {
      dark: 'rotate-0 opacity-100 scale-100',
      light: 'scale-0 rotate-90 opacity-0',
    },
  },
});

const moonIconVariants = cva('absolute inset-0 transform transition-all duration-500', {
  variants: {
    theme: {
      light: 'rotate-0 opacity-100 scale-100',
      dark: 'scale-0 -rotate-90 opacity-0',
    },
  },
});

export interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof themeToggleVariants> {}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { theme, toggleTheme } = useTheme();

    return (
      <button
        ref={ref}
        onClick={toggleTheme}
        className={cn(themeToggleVariants({ variant, size }), className)}
        aria-label="Toggle theme"
        {...props}
      >
        <div className="relative h-5 w-5">
          <div className={cn(sunIconVariants({ theme: theme as any }))}>
            <Sun size={20} />
          </div>
          <div className={cn(moonIconVariants({ theme: theme as any }))}>
            <Moon size={20} />
          </div>
        </div>
      </button>
    );
  },
);
ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, themeToggleVariants };

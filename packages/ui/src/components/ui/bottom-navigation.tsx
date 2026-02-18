'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const bottomNavigationVariants = cva(
  'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t safe-area-bottom',
  {
    variants: {
      variant: {
        default: 'bg-background border-border',
        glass: 'glass border-white/10',
        cyber:
          'bg-black/90 border-cyan-500/30 shadow-[0_-2px_20px_rgba(6,182,212,0.1)]',
      },
      size: {
        sm: 'h-14 px-2',
        md: 'h-16 px-4',
        lg: 'h-20 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface BottomNavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof bottomNavigationVariants> {}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  ({ className, variant, size, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Bottom navigation"
      className={cn(bottomNavigationVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
BottomNavigation.displayName = 'BottomNavigation';

const bottomNavigationItemVariants = cva(
  'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-foreground',
        glass: 'text-foreground/60 hover:text-foreground',
        cyber: 'text-cyan-500/50 hover:text-cyan-400',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'default', active: true, className: 'text-primary' },
      { variant: 'glass', active: true, className: 'text-foreground' },
      { variant: 'cyber', active: true, className: 'text-cyan-400' },
    ],
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  },
);

export interface BottomNavigationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof bottomNavigationItemVariants> {
  icon?: React.ReactNode;
  label?: string;
}

const BottomNavigationItem = React.forwardRef<HTMLButtonElement, BottomNavigationItemProps>(
  ({ className, variant, active, icon, label, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(bottomNavigationItemVariants({ variant, active }), className)}
      {...props}
    >
      {icon && <span className="[&_svg]:size-5">{icon}</span>}
      {label && <span className="truncate">{label}</span>}
    </button>
  ),
);
BottomNavigationItem.displayName = 'BottomNavigationItem';

export {
  BottomNavigation,
  BottomNavigationItem,
  bottomNavigationVariants,
  bottomNavigationItemVariants,
};

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const speedDialVariants = cva('fixed z-50', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    position: {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'bottom-right',
  },
});

const triggerClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg',
  glass: 'glass text-foreground shadow-xl',
  cyber:
    'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
};

const actionClasses: Record<string, string> = {
  default: 'bg-background border border-border text-foreground shadow-md hover:bg-accent',
  glass: 'glass-m text-foreground shadow-lg hover:opacity-80',
  cyber:
    'bg-black/80 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:bg-cyan-500/10',
};

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface SpeedDialProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof speedDialVariants> {
  icon?: React.ReactNode;
  actions: SpeedDialAction[];
  direction?: 'up' | 'left';
}

const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  ({ className, variant = 'default', position, icon, actions, direction = 'up', ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const v = variant ?? 'default';

    return (
      <div
        ref={ref}
        className={cn(speedDialVariants({ variant, position }), className)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {/* Actions */}
        <div
          className={cn(
            'absolute flex gap-2 transition-all duration-200',
            direction === 'up' ? 'bottom-full mb-2 flex-col-reverse' : 'right-full mr-2 flex-row-reverse',
            open ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none',
          )}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              type="button"
              aria-label={action.label}
              title={action.label}
              onClick={() => { action.onClick?.(); setOpen(false); }}
              className={cn(
                'flex size-10 items-center justify-center rounded-full transition-all [&_svg]:size-4',
                actionClasses[v],
              )}
              style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
            >
              {action.icon}
            </button>
          ))}
        </div>
        {/* Trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-label="Speed dial"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex size-14 items-center justify-center rounded-full transition-all [&_svg]:size-5',
            triggerClasses[v],
            open && 'rotate-45',
          )}
        >
          {icon ?? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
          )}
        </button>
      </div>
    );
  },
);
SpeedDial.displayName = 'SpeedDial';

export { SpeedDial, speedDialVariants };

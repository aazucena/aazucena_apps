import * as React from 'react';
/** @shadcn standard component */
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-widest',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        glass: 'glass-m text-foreground',
        cyber:
          'bg-primary/10 dark:bg-cyan-500/10 border-primary/30 dark:border-cyan-500/30 text-primary dark:text-cyan-400 font-mono italic',
        // Service-Specific Variants
        indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
        sky: 'bg-sky-500/10 border-sky-500/20 text-sky-500',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        rose: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
      },
      size: {
        xs: 'px-2 py-0.5 text-[8px] font-black tracking-tighter',
        sm: 'px-2.5 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  animated?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animated, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {animated && <div className="mr-1.5 h-1 w-1 animate-pulse rounded-full bg-current" />}
        {props.children}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };

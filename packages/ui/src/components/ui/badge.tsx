import * as React from 'react';
/** @shadcn standard component */
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-badge border font-mono font-medium uppercase tracking-[0.2em] transition-colors outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-signal',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-signal text-signal-foreground',
        secondary: 'border-transparent bg-panel-raised text-foreground',
        /** Pair with a ▲ in the label: coral never carries meaning alone. */
        destructive: 'border-alert bg-transparent text-alert',
        outline: 'border-rule text-foreground',
        glass: 'glass text-foreground',
        cyber: 'border-signal/60 bg-signal-faint text-signal',
        success: 'border-success/60 bg-success-subtle text-success',
        /** Pair with a ◆ in the label. */
        warning: 'border-warning/60 bg-warning-subtle text-warning',
        // Series variants (legacy names kept; mapped to the fixed series order)
        indigo: 'border-series-3/40 bg-transparent text-series-3',
        sky: 'border-series-1/40 bg-transparent text-series-1',
        emerald: 'border-success/40 bg-transparent text-success',
        rose: 'border-series-4/40 bg-transparent text-series-4',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-[9px]',
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-[11px]',
        lg: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
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
        {animated && (
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-current motion-safe:animate-pulse"
          />
        )}
        {props.children}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };

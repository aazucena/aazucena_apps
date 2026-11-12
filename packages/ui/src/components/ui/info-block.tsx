'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const infoBlockVariants = cva(
  'p-6 rounded-card flex items-center justify-between transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'bg-panel border border-rule text-foreground',
        primary: 'glass bg-signal-faint border border-primary/10 text-primary',
        secondary: 'bg-secondary/5 border border-secondary/10 text-secondary',
        success: 'bg-success/5 border border-success/10 text-success',
        warning: 'bg-warning/5 border border-warning/10 text-warning',
        cyber: 'bg-signal/5 border border-signal/10 text-signal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const InfoBlock = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof infoBlockVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(infoBlockVariants({ variant }), className)} {...props} />
));
InfoBlock.displayName = 'InfoBlock';

const InfoBlockContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-4', className)} {...props} />
  ),
);
InfoBlockContent.displayName = 'InfoBlockContent';

const InfoBlockActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-6', className)} {...props} />
  ),
);
InfoBlockActions.displayName = 'InfoBlockActions';

export { InfoBlock, InfoBlockContent, InfoBlockActions, infoBlockVariants };

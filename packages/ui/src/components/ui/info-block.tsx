'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const infoBlockVariants = cva(
  'p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground',
        primary: 'glass bg-primary-100 border border-primary/10 text-primary',
        secondary: 'bg-secondary/5 border border-secondary/10 text-secondary',
        success:
          'bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400',
        cyber: 'bg-cyan-500/5 border border-cyan-500/10 text-cyan-600 dark:text-cyan-400',
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

/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const skeletonVariants = cva('animate-pulse rounded-control transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-primary/10 dark:bg-primary/20',
      glass: 'glass shadow-none',
      cyber: 'glass bg-signal-faint border border-signal/20 dark:bg-background/40',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants({ variant }), className)} {...props} />;
}

export { Skeleton };

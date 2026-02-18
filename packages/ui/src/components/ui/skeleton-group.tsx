'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Skeleton } from './skeleton.js';

const skeletonGroupVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SkeletonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonGroupVariants> {
  preset?: 'card' | 'table' | 'list' | 'profile';
  rows?: number;
}

const SkeletonGroup = React.forwardRef<HTMLDivElement, SkeletonGroupProps>(
  ({ className, variant, preset = 'card', rows = 3, children, ...props }, ref) => {
    const v = { variant };

    const presets: Record<string, React.ReactNode> = {
      card: (
        <div className="space-y-4">
          <Skeleton {...v} className="h-48 w-full rounded-xl" />
          <Skeleton {...v} className="h-5 w-3/4 rounded" />
          <Skeleton {...v} className="h-4 w-full rounded" />
          <Skeleton {...v} className="h-4 w-2/3 rounded" />
          <Skeleton {...v} className="h-9 w-28 rounded-md" />
        </div>
      ),
      table: (
        <div className="space-y-3">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} {...v} className="h-4 flex-1 rounded" />
            ))}
          </div>
          {[...Array(rows)].map((_, ri) => (
            <div key={ri} className="flex gap-4">
              <Skeleton {...v} className="h-4 w-1/4 rounded" />
              <Skeleton {...v} className="h-4 w-1/3 rounded" />
              <Skeleton {...v} className="h-4 w-1/5 rounded" />
              <Skeleton {...v} className="h-4 flex-1 rounded" />
            </div>
          ))}
        </div>
      ),
      list: (
        <div className="space-y-4">
          {[...Array(rows)].map((_, ri) => (
            <div key={ri} className="flex items-center gap-3">
              <Skeleton {...v} className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton {...v} className="h-4 w-3/4 rounded" />
                <Skeleton {...v} className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ),
      profile: (
        <div className="flex flex-col items-center space-y-4">
          <Skeleton {...v} className="h-20 w-20 rounded-full" />
          <Skeleton {...v} className="h-5 w-40 rounded" />
          <div className="w-full space-y-2">
            <Skeleton {...v} className="h-4 w-full rounded" />
            <Skeleton {...v} className="h-4 w-full rounded" />
            <Skeleton {...v} className="h-4 w-2/3 rounded" />
          </div>
        </div>
      ),
    };

    return (
      <div ref={ref} className={cn(skeletonGroupVariants({ variant }), className)} {...props}>
        {children ?? presets[preset]}
      </div>
    );
  },
);
SkeletonGroup.displayName = 'SkeletonGroup';

export { SkeletonGroup, skeletonGroupVariants };

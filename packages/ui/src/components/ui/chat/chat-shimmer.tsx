'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const chatShimmerVariants = cva(
  'relative overflow-hidden rounded-md bg-muted animate-shimmer',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        glass: 'glass-shimmer',
        cyber: 'bg-gradient-to-r from-cyan-500/10 via-cyan-500/20 to-cyan-500/10',
      },
      shape: {
        textLine: 'h-4 w-full',
        avatar: 'h-8 w-8 rounded-full',
        bubble: 'h-16 w-48',
        card: 'h-32 w-full',
      },
    },
    defaultVariants: { variant: 'default', shape: 'textLine' },
  },
);

export interface ChatShimmerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatShimmerVariants> {}

const ChatShimmer = React.forwardRef<HTMLDivElement, ChatShimmerProps>(
  (
    {
      className,
      variant,
      shape,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(chatShimmerVariants({ variant, shape }), className)}
        {...props}
      />
    );
  },
);
ChatShimmer.displayName = 'ChatShimmer';

export { ChatShimmer, chatShimmerVariants };

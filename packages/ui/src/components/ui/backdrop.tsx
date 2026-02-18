'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const backdropVariants = cva(
  'fixed inset-0 z-40 transition-opacity duration-300',
  {
    variants: {
      variant: {
        default: 'bg-black/50',
        glass: 'bg-black/30 backdrop-blur-sm',
        cyber: 'bg-black/70 backdrop-blur-md',
        light: 'bg-white/50 backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BackdropProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backdropVariants> {
  open?: boolean;
  onDismiss?: () => void;
}

const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, variant, open = true, onDismiss, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        onClick={onDismiss}
        className={cn(
          backdropVariants({ variant }),
          open ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...props}
      />
    );
  },
);
Backdrop.displayName = 'Backdrop';

export { Backdrop, backdropVariants };

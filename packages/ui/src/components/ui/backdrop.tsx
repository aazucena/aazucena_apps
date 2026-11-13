'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const backdropVariants = cva('fixed inset-0 z-(--z-overlay) transition-opacity duration-300', {
  variants: {
    variant: {
      default: 'bg-panel',
      glass: 'bg-panel',
      cyber: 'bg-panel',
      light: 'bg-panel-raised',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BackdropProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof backdropVariants> {
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
        className={cn(backdropVariants({ variant }), open ? 'opacity-100' : 'opacity-0', className)}
        {...props}
      />
    );
  },
);
Backdrop.displayName = 'Backdrop';

export { Backdrop, backdropVariants };

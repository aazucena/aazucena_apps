'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const fieldsetVariants = cva('w-full rounded-control border p-4', {
  variants: {
    variant: {
      default: 'border-border bg-card',
      glass: 'border-rule bg-state text-foreground',
      cyber: 'border-signal/20 bg-background text-signal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface FieldsetProps
  extends React.HTMLAttributes<HTMLFieldSetElement>, VariantProps<typeof fieldsetVariants> {
  legend?: React.ReactNode;
  children: React.ReactNode;
}

const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, variant, legend, children, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn(fieldsetVariants({ variant }), 'space-y-4', className)}
        {...props}
      >
        {legend && (
          <legend
            className={cn(
              'px-2 text-lg font-semibold',
              variant === 'glass' && 'text-foreground',
              variant === 'cyber' && 'text-signal font-mono italic',
            )}
          >
            {legend}
          </legend>
        )}
        {children}
      </fieldset>
    );
  },
);
Fieldset.displayName = 'Fieldset';

export { Fieldset, fieldsetVariants };

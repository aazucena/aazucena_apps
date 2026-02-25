'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const fieldsetVariants = cva('w-full rounded-lg border p-4', {
  variants: {
    variant: {
      default: 'border-border bg-card',
      glass: 'border-white/10 bg-white/5 text-white backdrop-blur-md',
      cyber: 'border-cyan-500/20 bg-black text-cyan-50',
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
              variant === 'glass' && 'text-white',
              variant === 'cyber' && 'font-mono text-cyan-400 italic',
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

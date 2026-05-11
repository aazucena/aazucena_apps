'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';

const labelVariants = cva(
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        glass: 'text-foreground/80 dark:text-white/80',
        cyber: 'font-mono text-[10px] uppercase tracking-widest text-cyan-500/70 text-glow-cyan',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface LabelProps
  extends
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <LabelPrimitive.Root
        data-slot="label"
        ref={ref}
        className={cn(labelVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Label.displayName = 'Label';

export { Label };

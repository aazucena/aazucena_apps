'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const headingVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground/90 drop-shadow-md',
      cyber:
        'font-mono italic text-primary dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]',
      muted: 'text-muted-foreground',
      gradient: 'bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent',
    },
    size: {
      h1: 'text-4xl font-extrabold lg:text-5xl',
      h2: 'text-3xl font-semibold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'h2',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, size, as, ...props }, ref) => {
    const Comp = as ?? (size as HeadingLevel) ?? 'h2';
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };

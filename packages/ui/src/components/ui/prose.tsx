'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const proseVariants = cva('max-w-none transition-all duration-300', {
  variants: {
    variant: {
      default:
        'prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-a:transition-all',
      legal:
        'prose prose-base dark:prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-a:text-primary print:prose-sm print:text-black',
      cyber:
        'prose prose-lg dark:prose-invert font-mono prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-cyan-400 prose-a:decoration-cyan-400/30 hover:prose-a:decoration-cyan-400',
    },
    size: {
      sm: 'prose-sm',
      base: 'prose-base',
      lg: 'prose-lg',
      xl: 'prose-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
});

export interface ProseProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof proseVariants> {}

const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <div ref={ref} className={cn(proseVariants({ variant, size }), className)} {...props} />;
  },
);
Prose.displayName = 'Prose';

export { Prose, proseVariants };

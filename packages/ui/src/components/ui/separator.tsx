'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const separatorVariants = cva('shrink-0 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-border',
      glass: 'bg-background/10 dark:bg-white/10',
      cyber: 'bg-primary/30 dark:bg-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
      gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      'cyber-gradient':
        'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    },
    thickness: {
      default: 'h-[1px] w-[1px]',
      thin: 'h-[0.5px] w-[0.5px]',
      thick: 'h-1 w-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    thickness: 'default',
  },
});

export interface SeparatorProps
  extends
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, variant, thickness, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant, thickness }),
        orientation === 'horizontal'
          ? (thickness === 'thick' ? 'h-1' : thickness === 'thin' ? 'h-[0.5px]' : 'h-[1px]') +
              ' w-full'
          : (thickness === 'thick' ? 'w-1' : thickness === 'thin' ? 'w-[0.5px]' : 'w-[1px]') +
              ' h-full',
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

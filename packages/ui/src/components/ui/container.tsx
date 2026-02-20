'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
      prose: 'max-w-prose',
    },
    center: {
      true: 'flex flex-col items-center',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    maxWidth: 'xl',
    center: false,
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant, maxWidth, center, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ variant, maxWidth, center }), className)}
      {...props}
    />
  ),
);
Container.displayName = 'Container';

export { Container, containerVariants };

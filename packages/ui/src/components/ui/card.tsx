/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const cardVariants = cva('transition-[border-color,background-color] duration-200', {
  variants: {
    variant: {
      /** Tone-only panel surface: no shadow, no border (Avra 0.2). */
      default: 'bg-card text-card-foreground',
      glass: 'glass text-foreground',
      cyber:
        'border border-signal/40 bg-card text-foreground shadow-[inset_0_0_12px_var(--signal-faint)]',
      outline: 'border border-rule bg-transparent text-foreground',
      ghost: 'border-none bg-transparent text-foreground',
      /** @deprecated Analytics glass panel; renders as an instrument panel. Use `Panel`. */
      dashboard: 'bg-card text-card-foreground',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-panel',
      xl: 'p-6',
      '2xl': 'p-8',
    },
    /** All radii resolve to the 6px panel radius except `full`; legacy keys kept for API stability. */
    radius: {
      default: 'rounded-card',
      lg: 'rounded-card',
      xl: 'rounded-card',
      '2xl': 'rounded-card',
      '3xl': 'rounded-card',
      full: 'rounded-full',
    },
    hover: {
      true: 'hover:bg-state',
      false: '',
    },
    clickable: {
      true: 'cursor-pointer active:opacity-90',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'cyber', hover: true, className: 'hover:border-signal' },
    { variant: 'outline', hover: true, className: 'hover:border-rule-strong' },
  ],
  defaultVariants: {
    variant: 'default',
    padding: 'none',
    radius: 'default',
    hover: false,
    clickable: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, radius, clickable, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding, radius, clickable }), className)}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-panel flex flex-col gap-1.5', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-base leading-tight font-medium', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-panel pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-panel flex items-center gap-2 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

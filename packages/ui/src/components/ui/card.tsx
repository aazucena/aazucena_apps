/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const cardVariants = cva('transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground shadow-sm border',
      glass: 'glass text-foreground shadow-xl',
      cyber:
        'glass bg-primary-100 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-foreground dark:bg-background/80 dark:bg-black/80 dark:text-cyan-50',
      outline: 'bg-transparent border-2 border-muted text-foreground',
      ghost: 'bg-transparent border-none text-foreground shadow-none',
      // Dashboard variant absorbed from analytics app
      dashboard:
        'bg-background/5 dark:bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-10',
    },
    radius: {
      default: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
      '2xl': 'rounded-[2rem]',
      '3xl': 'rounded-[2.5rem]',
      full: 'rounded-full',
    },
    hover: {
      true: 'hover:scale-[1.01] hover:shadow-md',
      false: '',
    },
    clickable: {
      true: 'cursor-pointer active:scale-[0.98]',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'cyber',
      hover: true,
      className: 'hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    },
    {
      variant: 'glass',
      hover: true,
      className: 'hover:bg-background/10 dark:bg-white/10 hover:border-border/20',
    },
    {
      variant: 'dashboard',
      hover: true,
      className: 'hover:border-zinc-300 dark:hover:border-zinc-700 shadow-lg dark:shadow-none',
    },
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
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('leading-none font-semibold tracking-tight', className)}
      {...props}
    />
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
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

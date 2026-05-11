'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const ctaVariants = cva('relative py-32 overflow-hidden transition-all duration-500', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      cyber: 'glass bg-primary-100 border-y border-cyan-500/30 text-foreground dark:bg-black',
      glass: 'glass text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const CTA = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof ctaVariants>
>(({ className, variant, children, ...props }, ref) => (
  <section ref={ref} className={cn(ctaVariants({ variant }), className)} {...props}>
    {variant === 'default' && (
      <div
        className="absolute inset-0 bg-white opacity-10 backdrop-blur-3xl dark:bg-black"
        aria-hidden="true"
      />
    )}
    {variant === 'cyber' && (
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"
        aria-hidden="true"
      />
    )}
    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
));
CTA.displayName = 'CTA';

const CTATitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'mb-8 text-4xl font-black tracking-tighter text-current uppercase md:text-6xl',
        className,
      )}
      {...props}
    />
  ),
);
CTATitle.displayName = 'CTATitle';

const CTADescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'mx-auto mb-12 max-w-2xl text-xl leading-relaxed font-medium opacity-80',
      className,
    )}
    {...props}
  />
));
CTADescription.displayName = 'CTADescription';

const CTAActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center gap-4 sm:flex-row', className)}
      {...props}
    />
  ),
);
CTAActions.displayName = 'CTAActions';

export { CTA, CTATitle, CTADescription, CTAActions, ctaVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const heroVariants = cva('relative overflow-hidden transition-all duration-500', {
  variants: {
    variant: {
      default: 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800',
      glass: 'bg-background/20 backdrop-blur-3xl border-b border-border/10',
      cyber: 'bg-background dark:bg-black border-b border-border/10 dark:border-cyan-500/20',
    },
    size: {
      default: 'py-20 md:py-32',
      lg: 'py-32 md:py-48',
      xl: 'py-48 md:py-64',
      full: 'min-h-screen flex items-center',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const Hero = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof heroVariants>
>(({ className, variant, size, ...props }, ref) => (
  <header ref={ref} className={cn(heroVariants({ variant, size }), className)} {...props} />
));
Hero.displayName = 'Hero';

const HeroContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  ),
);
HeroContent.displayName = 'HeroContent';

const HeroHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-12 space-y-6 text-center', className)} {...props} />
  ),
);
HeroHeader.displayName = 'HeroHeader';

const heroTitleVariants = cva('font-black tracking-tighter leading-none transition-colors', {
  variants: {
    size: {
      default: 'text-5xl md:text-8xl',
      sm: 'text-4xl md:text-6xl',
      lg: 'text-6xl md:text-9xl',
    },
    variant: {
      default: 'text-gray-900 dark:text-white',
      glass: 'text-foreground',
      cyber: 'text-foreground drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

const HeroTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof heroTitleVariants>
>(({ className, size, variant, children, ...props }, ref) => (
  <h1 ref={ref} className={cn(heroTitleVariants({ size, variant }), className)} {...props}>
    {children}
    {variant === 'default' && <span className="text-blue-600">.</span>}
    {variant === 'cyber' && <span className="text-cyan-400">_</span>}
  </h1>
));
HeroTitle.displayName = 'HeroTitle';

const HeroSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'mx-auto max-w-3xl text-xl leading-relaxed font-medium opacity-70 md:text-2xl',
      className,
    )}
    {...props}
  />
));
HeroSubtitle.displayName = 'HeroSubtitle';

const HeroActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-10 flex flex-wrap items-center justify-center gap-4', className)}
      {...props}
    />
  ),
);
HeroActions.displayName = 'HeroActions';

export {
  Hero,
  HeroContent,
  HeroHeader,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  heroVariants,
  heroTitleVariants,
};

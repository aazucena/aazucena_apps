'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const showcaseVariants = cva('w-full transition-all duration-500', {
  variants: {
    variant: {
      default: 'space-y-12',
      grid: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Showcase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof showcaseVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(showcaseVariants({ variant }), className)} {...props} />
));
Showcase.displayName = 'Showcase';

const ShowcaseFigure = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <figure ref={ref} className={cn('group space-y-4', className)} {...props} />
  ),
);
ShowcaseFigure.displayName = 'ShowcaseFigure';

const showcaseImageVariants = cva('relative overflow-hidden border transition-all duration-700', {
  variants: {
    variant: {
      default: 'rounded-[2rem] border-border shadow-xl group-hover:shadow-2xl',
      glass: 'rounded-[2rem] border-border/10 dark:border-white/10 shadow-2xl',
      cyber:
        'rounded-xl border-border/10 dark:border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] group-hover:border-primary/40 dark:group-hover:border-cyan-400',
    },
    aspect: {
      video: 'aspect-video',
      square: 'aspect-square',
      auto: 'h-auto',
    },
  },
  defaultVariants: {
    variant: 'default',
    aspect: 'auto',
  },
});

const ShowcaseImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof showcaseImageVariants> & { src?: string; alt?: string }
>(({ className, variant, aspect, src, alt, ...props }, ref) => (
  <div ref={ref} className={cn(showcaseImageVariants({ variant, aspect }), className)} {...props}>
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100',
        variant === 'cyber'
          ? 'bg-gradient-to-tr from-cyan-500/10 to-transparent'
          : 'from-primary/5 bg-gradient-to-tr to-transparent',
      )}
    />
    {src && (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
        loading="lazy"
      />
    )}
  </div>
));
ShowcaseImage.displayName = 'ShowcaseImage';

const ShowcaseCaption = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { index?: number }
>(({ className, index, children, ...props }, ref) => (
  <figcaption
    ref={ref}
    className={cn(
      'text-center text-[10px] font-black tracking-widest uppercase opacity-40 transition-all duration-500 group-hover:translate-y-1 group-hover:opacity-100',
      className,
    )}
    {...props}
  >
    {index !== undefined && `Visual ${index}: `}
    {children}
  </figcaption>
));
ShowcaseCaption.displayName = 'ShowcaseCaption';

export {
  Showcase,
  ShowcaseFigure,
  ShowcaseImage,
  ShowcaseCaption,
  showcaseVariants,
  showcaseImageVariants,
};

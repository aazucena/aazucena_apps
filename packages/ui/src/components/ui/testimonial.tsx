'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Card } from './card.js';

const testimonialVariants = cva(
  'w-full max-w-lg rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col min-h-[280px]',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm',
        glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-md border-border/10 text-foreground shadow-xl',
        cyber: 'bg-background/80 dark:bg-black/80 border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      },
    },
    defaultVariants: {
      variant: 'glass',
    },
  },
);

const Testimonial = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof testimonialVariants>
>(({ className, variant, ...props }, ref) => (
  <Card
    ref={ref}
    variant={variant === 'cyber' ? 'cyber' : variant === 'glass' ? 'glass' : 'default'}
    padding="lg"
    className={cn(testimonialVariants({ variant }), className)}
    {...props}
  />
));
Testimonial.displayName = 'Testimonial';

const TestimonialQuote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn('flex-grow pt-4 text-base leading-relaxed opacity-80', className)}
      {...props}
    />
  ),
);
TestimonialQuote.displayName = 'TestimonialQuote';

const TestimonialFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-8 flex items-center justify-between gap-4', className)}
      {...props}
    />
  ),
);
TestimonialFooter.displayName = 'TestimonialFooter';

const TestimonialAuthor = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 text-left', className)} {...props} />
  ),
);
TestimonialAuthor.displayName = 'TestimonialAuthor';

const TestimonialName = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('text-base font-bold opacity-100', className)} {...props} />
  ),
);
TestimonialName.displayName = 'TestimonialName';

const TestimonialTitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('text-sm font-medium opacity-50', className)} {...props} />
  ),
);
TestimonialTitle.displayName = 'TestimonialTitle';

const testimonialAvatarVariants = cva(
  'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-transform duration-500 hover:scale-110',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        cyber: 'bg-primary/20 dark:bg-cyan-500/20 text-primary dark:text-cyan-400 border border-primary/40 dark:border-cyan-500/40',
        glass: 'bg-background/10 dark:bg-white/10 text-foreground border border-border/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TestimonialAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof testimonialAvatarVariants> & { src?: string; alt?: string }
>(({ className, variant, src, alt, children, ...props }, ref) => (
  <div ref={ref} className={cn(testimonialAvatarVariants({ variant }), className)} {...props}>
    {src ? (
      <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
    ) : (
      children
    )}
  </div>
));
TestimonialAvatar.displayName = 'TestimonialAvatar';

export {
  Testimonial,
  TestimonialQuote,
  TestimonialFooter,
  TestimonialAuthor,
  TestimonialName,
  TestimonialTitle,
  TestimonialAvatar,
  testimonialVariants,
  testimonialAvatarVariants,
};

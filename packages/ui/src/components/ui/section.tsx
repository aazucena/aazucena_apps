'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const sectionVariants = cva('container mx-auto transition-all duration-500', {
  variants: {
    contentWidth: {
      narrow: 'max-w-3xl',
      medium: 'max-w-5xl',
      wide: 'max-w-7xl',
      full: 'max-w-none',
    },
    variant: {
      default: '',
      glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 rounded-3xl p-8 my-8 shadow-xl',
      cyber:
        'bg-background/40 dark:bg-black/40 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-3xl p-8 my-8',
    },
    alignment: {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    },
  },
  defaultVariants: {
    contentWidth: 'wide',
    variant: 'default',
    alignment: 'center',
  },
});

const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof sectionVariants>
>(({ className, contentWidth, variant, alignment, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(sectionVariants({ contentWidth, variant, alignment }), className)}
    {...props}
  />
));
Section.displayName = 'Section';

const sectionHeaderVariants = cva('mb-12 flex flex-col', {
  variants: {
    alignment: {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
    },
  },
  defaultVariants: {
    alignment: 'center',
  },
});

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sectionHeaderVariants>
>(({ className, alignment, ...props }, ref) => (
  <div ref={ref} className={cn(sectionHeaderVariants({ alignment }), className)} {...props} />
));
SectionHeader.displayName = 'SectionHeader';

const sectionTitleVariants = cva('text-4xl leading-tight font-bold text-foreground md:text-6xl', {
  variants: {
    variant: {
      default: '',
      glass: 'text-foreground',
      cyber: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof sectionTitleVariants> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, variant, as = 'h2', ...props }, ref) => {
  const Heading = as;
  return (
    <Heading ref={ref} className={cn(sectionTitleVariants({ variant }), className)} {...props} />
  );
});
SectionTitle.displayName = 'SectionTitle';

const SectionSubtitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'mt-4 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-medium text-transparent md:text-3xl',
        className,
      )}
      {...props}
    />
  ),
);
SectionSubtitle.displayName = 'SectionSubtitle';

const SectionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props} />
  ),
);
SectionContent.displayName = 'SectionContent';

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
  sectionVariants,
  sectionHeaderVariants,
  sectionTitleVariants,
};

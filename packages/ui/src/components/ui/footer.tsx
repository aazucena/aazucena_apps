'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const footerVariants = cva('relative overflow-hidden transition-colors duration-300 border-t', {
  variants: {
    variant: {
      default: 'bg-background border-border text-foreground',
      glass: 'glass text-foreground dark:text-white',
      cyber:
        'glass bg-primary-100 border-cyan-500/20 text-foreground dark:bg-black dark:text-cyan-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Footer = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof footerVariants>
>(({ className, variant, ...props }, ref) => (
  <footer ref={ref} className={cn(footerVariants({ variant }), className)} {...props} />
));
Footer.displayName = 'Footer';

const FooterContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8', className)}
      {...props}
    />
  ),
);
FooterContent.displayName = 'FooterContent';

const FooterGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12', className)}
      {...props}
    />
  ),
);
FooterGrid.displayName = 'FooterGrid';

const FooterSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-8', className)} {...props} />
  ),
);
FooterSection.displayName = 'FooterSection';

const FooterHeader = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('text-sm font-bold tracking-widest uppercase opacity-90', className)}
      {...props}
    />
  ),
);
FooterHeader.displayName = 'FooterHeader';

const FooterNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn('flex flex-col space-y-4', className)} {...props} />
  ),
);
FooterNav.displayName = 'FooterNav';

const FooterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean; label?: string }
>(({ className, isActive, label, ...props }, ref) => (
  <a
    ref={ref}
    aria-label={label || (typeof props.children === 'string' ? props.children : undefined)}
    className={cn(
      'gap-group flex items-center text-sm font-bold transition-all duration-200 hover:translate-x-1',
      isActive ? 'text-primary' : 'hover:text-primary opacity-60 hover:opacity-100',
      className,
    )}
    {...props}
  />
));
FooterLink.displayName = 'FooterLink';

const FooterSocials = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-wrap gap-3', className)} {...props} />
  ),
);
FooterSocials.displayName = 'FooterSocials';

const FooterBottom = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-24 flex flex-col items-center justify-between gap-8 border-t border-current/10 pt-12 md:flex-row',
        className,
      )}
      {...props}
    />
  ),
);
FooterBottom.displayName = 'FooterBottom';

const FooterTechStack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-6 opacity-40', className)} {...props} />
  ),
);
FooterTechStack.displayName = 'FooterTechStack';

export {
  Footer,
  FooterContent,
  FooterGrid,
  FooterSection,
  FooterHeader,
  FooterNav,
  FooterLink,
  FooterSocials,
  FooterBottom,
  FooterTechStack,
  footerVariants,
};

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Menu, X } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { Button } from './button.js';

const navbarVariants = cva(
  'fixed top-0 right-0 left-0 z-[100] border-b transition-all duration-500',
  {
    variants: {
          variant: {
            default: 'bg-background/80 backdrop-blur-lg border-border text-foreground',
            glass: 'glass text-foreground dark:text-white',
            cyber:
              'glass bg-primary-100 border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)] dark:bg-background/80 dark:bg-black/80 dark:text-cyan-50',
          },      isScrolled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        isScrolled: true,
        className: 'py-4 shadow-sm bg-background/95',
      },
      {
        variant: 'default',
        isScrolled: false,
        className: 'py-6 bg-transparent border-transparent',
      },
      {
        variant: 'glass',
        isScrolled: true,
        className: 'py-4 bg-background/10 dark:bg-white/10 border-border/20 shadow-xl',
      },
      {
        variant: 'glass',
        isScrolled: false,
        className: 'py-6 bg-transparent border-transparent',
      },
      {
        variant: 'cyber',
        isScrolled: true,
        className: 'py-4 bg-background dark:bg-black/95 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      },
      {
        variant: 'cyber',
        isScrolled: false,
        className: 'py-6 bg-transparent border-transparent',
      },
    ],
    defaultVariants: {
      variant: 'default',
      isScrolled: false,
    },
  },
);

const Navbar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof navbarVariants>
>(({ className, variant, isScrolled, ...props }, ref) => (
  <nav ref={ref} className={cn(navbarVariants({ variant, isScrolled }), className)} {...props} />
));
Navbar.displayName = 'Navbar';

const NavbarContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8',
        className,
      )}
      {...props}
    />
  ),
);
NavbarContainer.displayName = 'NavbarContainer';

const NavbarBrand = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { label?: string }
>(({ className, label, ...props }, ref) => (
  <a
    ref={ref}
    aria-label={label || (typeof props.children === 'string' ? props.children : undefined)}
    className={cn('group relative z-[110] flex shrink-0 items-center gap-3', className)}
    {...props}
  />
));
NavbarBrand.displayName = 'NavbarBrand';

const navbarContentVariants = cva(
  'hidden items-center gap-1 rounded-full border p-1.5 backdrop-blur-md md:flex transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-gray-50/50 border-gray-100',
        glass: 'bg-background/10 dark:bg-white/10 border-border/20',
        cyber: 'bg-background/40 dark:bg-black/40 border-cyan-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const NavbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof navbarContentVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(navbarContentVariants({ variant }), className)} {...props} />
));
NavbarContent.displayName = 'NavbarContent';

const NavbarActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-[110] flex items-center gap-4', className)}
      {...props}
    />
  ),
);
NavbarActions.displayName = 'NavbarActions';

/**
 * NavbarMobile
 * High-level component for the mobile drawer system.
 */
const NavbarMobile = ({
  isOpen,
  onClose,
  children,
  variant = 'default',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'cyber';
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-background dark:bg-black/60 backdrop-blur-md md:hidden"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={cn(
            'fixed top-0 right-0 bottom-0 z-[130] flex w-[85vw] max-w-sm flex-col border-l p-8 md:hidden',
            variant === 'cyber' ? 'border-cyan-500/20 bg-background dark:bg-black' : 'bg-background border-border',
            variant === 'glass' && 'border-border/10 bg-background/5 dark:bg-white/5 backdrop-blur-xl',
          )}
        >
          <div className="mb-8 flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X size={24} />
            </Button>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const NavbarMobileTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn('rounded-full md:hidden', className)}
    {...props}
  >
    <Menu size={24} />
  </Button>
));
NavbarMobileTrigger.displayName = 'NavbarMobileTrigger';

export {
  Navbar,
  NavbarContainer,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  NavbarMobile,
  NavbarMobileTrigger,
  navbarVariants,
  navbarContentVariants,
};

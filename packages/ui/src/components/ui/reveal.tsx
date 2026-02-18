'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';
import { ChevronDown } from '@aazucena/icons';

const revealVariants = cva('w-full transition-all duration-300', {
  variants: {
    variant: {
      default: 'border-b border-border',
      glass: 'border-b border-border/10 dark:border-white/10 text-foreground',
      cyber: 'border-b border-border/10 dark:border-cyan-500/20 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const RevealContext = React.createContext<{
  isOpen: boolean;
  variant: 'default' | 'glass' | 'cyber';
}>({ isOpen: false, variant: 'default' });

const Reveal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof revealVariants> & { isOpen?: boolean }
>(({ className, variant = 'default', isOpen = false, ...props }, ref) => (
  <RevealContext.Provider value={{ isOpen, variant: variant || 'default' }}>
    <div ref={ref} className={cn(revealVariants({ variant }), className)} {...props} />
  </RevealContext.Provider>
));
Reveal.displayName = 'Reveal';

const RevealTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between py-4 text-left font-medium underline-offset-4 transition-all outline-none hover:underline',
      className,
    )}
    {...props}
  />
));
RevealTrigger.displayName = 'RevealTrigger';

const RevealContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = React.useContext(RevealContext);
    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              ref={ref}
              className={cn('pt-0 pb-4 text-sm leading-relaxed opacity-70', className)}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);
RevealContent.displayName = 'RevealContent';

const RevealIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, variant } = React.useContext(RevealContext);
    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0 transition-transform duration-300',
          isOpen && 'rotate-180',
          className,
        )}
        {...props}
      >
        <ChevronDown
          className={cn('h-4 w-4', variant === 'cyber' ? 'text-cyan-400' : 'text-muted-foreground')}
        />
      </div>
    );
  },
);
RevealIndicator.displayName = 'RevealIndicator';

export { Reveal, RevealTrigger, RevealContent, RevealIndicator, revealVariants };

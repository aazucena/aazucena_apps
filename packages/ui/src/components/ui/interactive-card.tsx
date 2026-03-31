'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';
import { ChevronDown } from '@aazucena/icons';
import { Card } from './card';

const interactiveCardVariants = cva(
  'group rounded-3xl transition-all duration-500 overflow-hidden',
  {
    variants: {
      isExpanded: {
        true: 'shadow-2xl scale-[1.01]',
        false: '',
      },
    },
    defaultVariants: {
      isExpanded: false,
    },
  },
);

const InteractiveCardContext = React.createContext<{
  isOpen: boolean;
  variant: string;
}>({ isOpen: false, variant: 'default' });

const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Card> & { isOpen?: boolean }
>(({ className, variant = 'default', radius = 'xl', isOpen = false, ...props }, ref) => (
  <InteractiveCardContext.Provider value={{ isOpen, variant: variant as string }}>
    <Card
      ref={ref}
      variant={variant}
      radius={radius}
      className={cn(interactiveCardVariants({ isExpanded: isOpen }), className)}
      {...props}
    />
  </InteractiveCardContext.Provider>
));
InteractiveCard.displayName = 'InteractiveCard';

const InteractiveCardHeader = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer items-start gap-4 border-none bg-transparent p-6 text-left outline-none',
      className,
    )}
    {...props}
  />
));
InteractiveCardHeader.displayName = 'InteractiveCardHeader';

const interactiveCardIconVariants = cva(
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground',
        glass: 'bg-background/10 dark:bg-white/10 text-foreground border border-border/20',
        cyber:
          'bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-border dark:border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
      },
      color: {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
        emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
        rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const InteractiveCardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof interactiveCardIconVariants>
>(({ className, variant, color, ...props }, ref) => {
  const context = React.useContext(InteractiveCardContext);
  return (
    <div
      ref={ref}
      className={cn(
        interactiveCardIconVariants({ variant: (variant || context.variant) as any, color }),
        className,
      )}
      {...props}
    />
  );
});
InteractiveCardIcon.displayName = 'InteractiveCardIcon';

const InteractiveCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-bold', className)} {...props} />
));
InteractiveCardTitle.displayName = 'InteractiveCardTitle';

const InteractiveCardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-[10px] font-black tracking-widest uppercase opacity-40', className)}
    {...props}
  />
));
InteractiveCardSubtitle.displayName = 'InteractiveCardSubtitle';

const InteractiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { forceOpen?: boolean }
>(({ className, forceOpen, children, ...props }, ref) => {
  const { isOpen } = React.useContext(InteractiveCardContext);
  const show = forceOpen || isOpen;

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={forceOpen ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            ref={ref}
            className={cn(
              'mt-0 border-t border-current/10 px-6 pt-0 pb-6 text-sm leading-relaxed opacity-80',
              className,
            )}
            {...props}
          >
            <div className="pt-4">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
InteractiveCardContent.displayName = 'InteractiveCardContent';

const InteractiveCardIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = React.useContext(InteractiveCardContext);
  return (
    <div
      ref={ref}
      className={cn(
        'ml-auto opacity-40 transition-transform duration-300',
        isOpen && 'rotate-180 opacity-100',
        className,
      )}
      {...props}
    >
      <ChevronDown size={20} />
    </div>
  );
});
InteractiveCardIndicator.displayName = 'InteractiveCardIndicator';

export {
  InteractiveCard,
  InteractiveCardHeader,
  InteractiveCardIcon,
  InteractiveCardTitle,
  InteractiveCardSubtitle,
  InteractiveCardContent,
  InteractiveCardIndicator,
  interactiveCardIconVariants,
};

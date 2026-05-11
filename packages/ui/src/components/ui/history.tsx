'use client';

import { ChevronDown } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

const historyVariants = cva('relative border-l-2 pl-8 transition-all duration-300', {
  variants: {
    variant: {
      default: 'border-border space-y-8',
      cyber:
        'border-border/10 dark:border-cyan-500/30 space-y-12 shadow-[inset_1px_0_0_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const History = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof historyVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(historyVariants({ variant }), className)} {...props} />
));
History.displayName = 'History';

const historyItemVariants = cva('group transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const HistoryItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof historyItemVariants> & { clickable?: boolean }
>(({ className, variant, clickable, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(historyItemVariants({ variant }), clickable && 'cursor-pointer', className)}
    {...props}
  />
));
HistoryItem.displayName = 'HistoryItem';

const historyTitleVariants = cva(
  'flex items-center gap-2 text-xl font-black tracking-tight transition-colors leading-none',
  {
    variants: {
      variant: {
        default: 'text-foreground group-hover:text-primary',
        cyber: 'text-foreground group-hover:text-primary dark:group-hover:text-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const HistoryTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof historyTitleVariants> & { isExpanded?: boolean; showIndicator?: boolean }
>(({ className, variant, isExpanded, showIndicator, children, ...props }, ref) => (
  <h3 ref={ref} className={cn(historyTitleVariants({ variant }), className)} {...props}>
    {children}
    {showIndicator && (
      <ChevronDown
        size={18}
        className={cn(
          'opacity-40 transition-transform duration-300',
          isExpanded && 'rotate-180 opacity-100',
        )}
      />
    )}
  </h3>
));
HistoryTitle.displayName = 'HistoryTitle';

const historySubtitleVariants = cva('text-sm font-bold mt-1.5 transition-colors', {
  variants: {
    variant: {
      default: 'text-primary',
      cyber: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const HistorySubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof historySubtitleVariants>
>(({ className, variant, ...props }, ref) => (
  <p ref={ref} className={cn(historySubtitleVariants({ variant }), className)} {...props} />
));
HistorySubtitle.displayName = 'HistorySubtitle';

const HistoryMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 flex flex-wrap items-center gap-3', className)} {...props} />
  ),
);
HistoryMeta.displayName = 'HistoryMeta';

const historyBadgeVariants = cva(
  'flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[9px] font-black tracking-widest uppercase transition-all',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground opacity-60',
        cyber: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5 opacity-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const HistoryBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof historyBadgeVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(historyBadgeVariants({ variant }), className)} {...props} />
));
HistoryBadge.displayName = 'HistoryBadge';

const HistoryDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }
>(({ className, isOpen = true, children, ...props }, ref) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          ref={ref}
          className={cn(
            'border-border/50 mt-6 border-t pt-6 text-base leading-relaxed font-medium opacity-70',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));
HistoryDescription.displayName = 'HistoryDescription';

export {
  History,
  HistoryBadge,
  historyBadgeVariants,
  HistoryDescription,
  HistoryItem,
  historyItemVariants,
  HistoryMeta,
  HistorySubtitle,
  historySubtitleVariants,
  HistoryTitle,
  historyTitleVariants,
  historyVariants,
};

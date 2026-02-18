'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const shareVariants = cva('pt-12 border-t border-current/10 w-full transition-all duration-500', {
  variants: {
    variant: {
      default: '',
      cyber: 'font-mono text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Share = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof shareVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(shareVariants({ variant }), className)} {...props} />
));
Share.displayName = 'Share';

const ShareHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-between gap-8 md:flex-row', className)}
      {...props}
    />
  ),
);
ShareHeader.displayName = 'ShareHeader';

const ShareGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-4', className)} {...props} />
  ),
);
ShareGroup.displayName = 'ShareGroup';

const shareActionVariants = cva(
  'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground',
        cyber:
          'bg-cyan-500/5 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]',
        glass:
          'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 text-foreground/60 hover:bg-background/10 dark:bg-white/10 hover:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ShareAction = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    VariantProps<typeof shareActionVariants> & { label?: string }
>(({ className, variant, label, ...props }, ref) => (
  <a
    ref={ref}
    aria-label={label || (typeof props.children === 'string' ? props.children : undefined)}
    className={cn(shareActionVariants({ variant }), className)}
    {...props}
  />
));
ShareAction.displayName = 'ShareAction';

export { Share, ShareHeader, ShareGroup, ShareAction, shareVariants, shareActionVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Dashboard Header & Page Typography
 */

const pageTitleVariants = cva(
  'text-4xl font-black tracking-tighter uppercase transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'text-zinc-900 dark:text-zinc-100',
        cyber: 'text-foreground drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]',
        glass: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const PageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof pageTitleVariants> & { version?: string }
>(({ className, variant, version, children, ...props }, ref) => (
  <h1 ref={ref} className={cn(pageTitleVariants({ variant }), className)} {...props}>
    {children}
    {version && <span className="text-primary-500 ml-1">{version}</span>}
  </h1>
));
PageTitle.displayName = 'PageTitle';

const pageSubtitleVariants = cva(
  'text-foreground0 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold text-wrap',
  {
    variants: {
      variant: {
        default: '',
        cyber: 'text-foreground0/60',
        glass: 'text-foreground/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const PageSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof pageSubtitleVariants>
>(({ className, variant, ...props }, ref) => (
  <p ref={ref} className={cn(pageSubtitleVariants({ variant }), className)} {...props} />
));
PageSubtitle.displayName = 'PageSubtitle';

/**
 * Dashboard Card & Header Primitives
 */

const dashboardCardVariants = cva('relative overflow-hidden transition-all duration-500', {
  variants: {
    variant: {
      default:
        'bg-background/5 dark:bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md rounded-[2.5rem]',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-xl border border-border/10 text-foreground shadow-2xl rounded-[2.5rem]',
      cyber:
        'bg-background/80 dark:bg-black/80 border border-cyan-500/30 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.1)] rounded-xl',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
  },
});

const DashboardCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dashboardCardVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(dashboardCardVariants({ variant, padding }), className)}
    {...props}
  />
));
DashboardCard.displayName = 'DashboardCard';

const DashboardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-b border-current/5 px-8 py-6',
      inset ? 'bg-zinc-50 dark:bg-zinc-900/50' : 'bg-transparent',
      className,
    )}
    {...props}
  />
));
DashboardHeader.displayName = 'DashboardHeader';

const iconBoxVariants = cva(
  'flex items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0 border',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-foreground0',
        primary:
          'bg-primary-500/10 border-primary-500/20 text-primary-500 shadow-sm shadow-primary-500/5',
        secondary:
          'bg-secondary-500/10 border-secondary-500/20 text-secondary-500 shadow-sm shadow-secondary-500/5',
        success:
          'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-sm shadow-emerald-500/5',
        cyber: 'bg-primary/10 dark:bg-cyan-500/10 border-border dark:border-cyan-500/20 text-primary dark:text-cyan-500 shadow-sm shadow-cyan-500/5',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

const IconBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof iconBoxVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(iconBoxVariants({ variant, size }), className)} {...props} />
));
IconBox.displayName = 'IconBox';

const DashboardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'flex items-center gap-3 text-xs font-black tracking-[0.2em] text-zinc-900 uppercase dark:text-zinc-300',
      className,
    )}
    {...props}
  />
));
DashboardTitle.displayName = 'DashboardTitle';

const DashboardStatus = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'font-mono text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-600',
        className,
      )}
      {...props}
    />
  ),
);
DashboardStatus.displayName = 'DashboardStatus';

const DashboardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ml-auto flex items-center gap-4', className)} {...props} />
  ),
);
DashboardActions.displayName = 'DashboardActions';

const DashboardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-8', className)} {...props} />,
);
DashboardBody.displayName = 'DashboardBody';

export {
  PageTitle,
  PageSubtitle,
  DashboardCard,
  DashboardHeader,
  DashboardTitle,
  DashboardStatus,
  DashboardActions,
  DashboardBody,
  IconBox,
  dashboardCardVariants,
  iconBoxVariants,
};

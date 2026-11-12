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
        default: 'text-foreground',
        cyber: 'text-foreground',
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
    {version && <span className="text-signal ml-1">{version}</span>}
  </h1>
));
PageTitle.displayName = 'PageTitle';

const pageSubtitleVariants = cva(
  'text-foreground0 dark:text-muted-foreground text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold text-wrap',
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
        'bg-background/5 dark:bg-panel-raised dark:bg-panel/30 border border-rule rounded-card',
      glass: 'bg-background/5 dark:bg-state border border-border/10 text-foreground rounded-card',
      cyber: 'bg-background/80 dark:bg-panel border border-signal/30 text-foreground rounded-card',
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
      inset ? 'bg-panel dark:bg-panel/50' : 'bg-transparent',
      className,
    )}
    {...props}
  />
));
DashboardHeader.displayName = 'DashboardHeader';

const iconBoxVariants = cva(
  'flex items-center justify-center rounded-control transition-all duration-300 group-hover:scale-110 shrink-0 border',
  {
    variants: {
      variant: {
        default: 'bg-panel dark:bg-panel-raised border-rule text-foreground0',
        primary: 'bg-signal/10 border-signal/20 text-signal',
        secondary:
          'bg-secondary-500/10 border-secondary-500/20 text-secondary-500 shadow-secondary-500/5',
        success: 'bg-success/10 border-success/20 text-success',
        cyber:
          'bg-primary/10 dark:bg-signal/10 border-border dark:border-signal/20 text-primary dark:text-signal',
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
      'text-foreground dark:text-muted-foreground flex items-center gap-3 text-xs font-black tracking-[0.2em] uppercase',
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
        'text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase',
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

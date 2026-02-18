'use client';

import { Wrench } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const maintenanceVariants = cva(
  'max-w-2xl mx-auto py-16 relative z-10 flex flex-col items-center text-center',
  {
    variants: {
      variant: {
        default: '',
        cyber: 'text-foreground font-mono',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Maintenance = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof maintenanceVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(maintenanceVariants({ variant }), className)} {...props} />
));
Maintenance.displayName = 'Maintenance';

const maintenanceIconVariants = cva('mb-12 relative inline-flex group', {
  variants: {
    variant: {
      default: 'text-primary',
      cyber: 'text-cyan-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const MaintenanceIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof maintenanceIconVariants> & { icon?: React.ReactNode }
>(({ className, variant, icon, ...props }, ref) => (
  <div ref={ref} className={cn(maintenanceIconVariants({ variant }), className)} {...props}>
    <div
      className={cn(
        'absolute inset-0 scale-150 rounded-full opacity-50 blur-3xl transition-opacity duration-1000 group-hover:opacity-100',
        variant === 'cyber' ? 'bg-primary/20 dark:bg-cyan-500/20' : 'bg-primary/20',
      )}
    />
    <div
      className={cn(
        'relative flex h-28 w-28 items-center justify-center rounded-[2.5rem] border shadow-2xl transition-all duration-500',
        variant === 'cyber' ? 'border-border/10 dark:border-cyan-500/30 bg-background dark:bg-black' : 'bg-card border-border',
      )}
    >
      {icon || <Wrench size={48} className="animate-[spin_12s_linear_infinite]" />}
    </div>
  </div>
));
MaintenanceIcon.displayName = 'MaintenanceIcon';

const MaintenanceTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('mb-8 text-5xl leading-none font-black tracking-tighter md:text-7xl', className)}
    {...props}
  />
));
MaintenanceTitle.displayName = 'MaintenanceTitle';

const MaintenanceMessage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto mb-12 max-w-lg space-y-8 text-xl leading-relaxed font-medium opacity-70',
        className,
      )}
      {...props}
    />
  ),
);
MaintenanceMessage.displayName = 'MaintenanceMessage';

const MaintenanceFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full space-y-8 border-t border-current/10 pt-8', className)}
      {...props}
    />
  ),
);
MaintenanceFooter.displayName = 'MaintenanceFooter';

export { Maintenance, MaintenanceFooter, MaintenanceIcon, MaintenanceMessage, MaintenanceTitle };

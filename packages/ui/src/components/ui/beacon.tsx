'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Compass } from '@aazucena/icons';

const beaconVariants = cva('pt-12 border-t border-current/10 w-full transition-all duration-500', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-foreground font-mono',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Beacon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof beaconVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(beaconVariants({ variant }), className)} {...props} />
));
Beacon.displayName = 'Beacon';

const BeaconHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode }
>(({ className, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-8 flex items-center justify-center gap-3', className)}
    {...props}
  >
    {icon || <Compass size={16} className="text-primary animate-[spin_10s_linear_infinite]" />}
    <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">
      {children || 'Navigation_Beacon'}
    </h3>
  </div>
));
BeaconHeader.displayName = 'BeaconHeader';

const BeaconGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-wrap justify-center gap-x-8 gap-y-4', className)}
      {...props}
    />
  ),
);
BeaconGrid.displayName = 'BeaconGrid';

const beaconLinkVariants = cva(
  'text-xs font-black uppercase tracking-widest transition-colors relative group py-1',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-primary',
        cyber: 'text-foreground0/60 hover:text-cyan-400 font-mono tracking-wider italic',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const BeaconLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof beaconLinkVariants>
>(({ className, variant, ...props }, ref) => (
  <a ref={ref} className={cn(beaconLinkVariants({ variant }), className)} {...props}>
    {props.children}
    <span
      className={cn(
        'absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full',
        variant === 'cyber' ? 'bg-cyan-400' : 'bg-primary',
      )}
    />
  </a>
));
BeaconLink.displayName = 'BeaconLink';

export { Beacon, BeaconHeader, BeaconGrid, BeaconLink, beaconVariants, beaconLinkVariants };

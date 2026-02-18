'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const deviceMockupVariants = cva('relative mx-auto', {
  variants: {
    variant: {
      default: 'border-foreground/20',
      glass: 'border-white/20',
      cyber: 'border-cyan-500/30',
    },
    device: {
      browser: '',
      phone: '',
      tablet: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { device: 'browser', size: 'sm', className: 'w-[480px]' },
    { device: 'browser', size: 'md', className: 'w-[640px]' },
    { device: 'browser', size: 'lg', className: 'w-[800px]' },
    { device: 'phone', size: 'sm', className: 'w-[240px]' },
    { device: 'phone', size: 'md', className: 'w-[280px]' },
    { device: 'phone', size: 'lg', className: 'w-[320px]' },
    { device: 'tablet', size: 'sm', className: 'w-[400px]' },
    { device: 'tablet', size: 'md', className: 'w-[512px]' },
    { device: 'tablet', size: 'lg', className: 'w-[640px]' },
  ],
  defaultVariants: {
    variant: 'default',
    device: 'browser',
    size: 'md',
  },
});

export interface DeviceMockupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deviceMockupVariants> {
  url?: string;
}

const DeviceMockup = React.forwardRef<HTMLDivElement, DeviceMockupProps>(
  ({ className, variant, device, size, url, children, ...props }, ref) => {
    const isBrowser = device === 'browser' || device === undefined;
    const isPhone = device === 'phone';

    return (
      <div
        ref={ref}
        className={cn(
          deviceMockupVariants({ variant, device, size }),
          'overflow-hidden rounded-xl border-2 bg-background shadow-xl',
          variant === 'cyber' && 'shadow-[0_0_30px_rgba(6,182,212,0.1)]',
          className,
        )}
        {...props}
      >
        {/* Title bar */}
        {isBrowser && (
          <div
            className={cn(
              'flex items-center gap-2 border-b px-3 py-2',
              variant === 'cyber' ? 'border-cyan-500/20 bg-black/60' : 'border-border bg-muted/50',
            )}
          >
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            {url && (
              <div
                className={cn(
                  'flex-1 rounded-md px-3 py-0.5 text-center text-[10px]',
                  variant === 'cyber'
                    ? 'bg-cyan-500/5 text-cyan-500/60 font-mono'
                    : 'bg-background/80 text-muted-foreground',
                )}
              >
                {url}
              </div>
            )}
          </div>
        )}
        {/* Notch */}
        {isPhone && (
          <div
            className={cn(
              'mx-auto mt-2 h-5 w-24 rounded-full',
              variant === 'cyber' ? 'bg-cyan-500/20' : 'bg-muted',
            )}
          />
        )}
        {/* Content */}
        <div className="relative overflow-auto">{children}</div>
        {/* Home indicator */}
        {isPhone && (
          <div
            className={cn(
              'mx-auto mb-1.5 mt-2 h-1 w-24 rounded-full',
              variant === 'cyber' ? 'bg-cyan-500/30' : 'bg-muted-foreground/30',
            )}
          />
        )}
      </div>
    );
  },
);
DeviceMockup.displayName = 'DeviceMockup';

export { DeviceMockup, deviceMockupVariants };

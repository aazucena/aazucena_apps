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
      laptop: '', // New device type
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
    // New laptop variants
    { device: 'laptop', size: 'sm', className: 'w-[800px] h-[450px]' }, // 16:9 aspect ratio
    { device: 'laptop', size: 'md', className: 'w-[1024px] h-[576px]' },
    { device: 'laptop', size: 'lg', className: 'w-[1280px] h-[720px]' },
  ],
  defaultVariants: {
    variant: 'default',
    device: 'browser',
    size: 'md',
  },
});

export interface DeviceMockupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof deviceMockupVariants> {
  url?: string;
}

const DeviceMockup = React.forwardRef<HTMLDivElement, DeviceMockupProps>(
  ({ className, variant, device, size, url, children, ...props }, ref) => {
    const isBrowser = device === 'browser' || device === undefined;
    const isPhone = device === 'phone';
    const isLaptop = device === 'laptop'; // New laptop check

    return (
      <div
        ref={ref}
        className={cn(
          deviceMockupVariants({ variant, device, size }),
          'bg-background overflow-hidden rounded-xl border-2 shadow-xl',
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
                    ? 'bg-cyan-500/5 font-mono text-cyan-500/60'
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
        <div className="relative overflow-auto flex-1">{children}</div> {/* Added flex-1 */}
        {/* Home indicator / Keyboard area */}
        {(isPhone || isLaptop) && (
          <div
            className={cn(
              'mx-auto mt-2 mb-1.5',
              isPhone && 'h-1 w-24 rounded-full',
              isLaptop && 'h-1/4 w-full rounded-b-xl border-t-2', // Keyboard area
              variant === 'cyber' ? 'bg-cyan-500/30 border-cyan-500/30' : 'bg-muted-foreground/30 border-border',
            )}
          >
            {isLaptop && (
              <div
                className={cn(
                  'h-full w-full rounded-b-xl p-4',
                  variant === 'cyber' ? 'bg-black/60' : 'bg-muted/50',
                )}
              >
                {/* Placeholder for keyboard/trackpad */}
                <div className="h-2/3 w-full rounded-md bg-foreground/10" />
                <div className="mt-2 h-1/6 w-1/3 rounded-full bg-foreground/5 mx-auto" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
DeviceMockup.displayName = 'DeviceMockup';

export { DeviceMockup, deviceMockupVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const deviceMockupVariants = cva('relative mx-auto', {
  variants: {
    variant: {
      default: 'border-rule',
      glass: 'border-rule bg-panel-glass',
      cyber: 'border-signal-line',
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
          'bg-panel rounded-card overflow-hidden border',
          className,
        )}
        {...props}
      >
        {/* Title bar */}
        {isBrowser && (
          <div
            className={cn(
              'flex items-center gap-2 border-b px-3 py-2',
              variant === 'cyber'
                ? 'border-signal-line bg-panel-raised'
                : 'border-rule bg-panel-raised',
            )}
          >
            <div className="flex gap-1.5">
              <span className="bg-alert size-2.5 rounded-full" />
              <span className="bg-warning size-2.5 rounded-full" />
              <span className="bg-success size-2.5 rounded-full" />
            </div>
            {url && (
              <div
                className={cn(
                  'rounded-control flex-1 px-3 py-0.5 text-center font-mono text-[10px]',
                  variant === 'cyber'
                    ? 'bg-signal-faint text-signal'
                    : 'bg-panel text-muted-foreground',
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
              variant === 'cyber' ? 'bg-signal-subtle' : 'bg-state',
            )}
          />
        )}
        {/* Content */}
        <div className="relative flex-1 overflow-auto">{children}</div> {/* Added flex-1 */}
        {/* Home indicator / Keyboard area */}
        {(isPhone || isLaptop) && (
          <div
            className={cn(
              'mx-auto mt-2 mb-1.5',
              isPhone && 'h-1 w-24 rounded-full',
              isLaptop && 'rounded-b-card h-1/4 w-full border-t', // Keyboard area
              variant === 'cyber' ? 'border-signal-line bg-signal-subtle' : 'bg-state border-rule',
            )}
          >
            {isLaptop && (
              <div className={cn('rounded-b-card h-full w-full p-4', 'bg-panel-raised')}>
                {/* Placeholder for keyboard/trackpad */}
                <div className="bg-state rounded-control h-2/3 w-full" />
                <div className="bg-foreground/5 mx-auto mt-2 h-1/6 w-1/3 rounded-full" />
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

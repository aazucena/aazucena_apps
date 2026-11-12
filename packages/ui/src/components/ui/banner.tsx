'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const bannerVariants = cva(
  'relative flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        glass: 'glass text-foreground',
        cyber:
          'bg-signal/10 border-b border-signal/30 text-signal font-mono text-xs tracking-wider',
        info: 'bg-signal/10 text-signal border-b border-signal/20',
        warning: 'bg-warning/10 text-warning border-b border-warning/20',
        destructive: 'bg-destructive/10 text-destructive border-b border-destructive/20',
        success: 'bg-success/10 text-success border-b border-success/20',
      },
      position: {
        top: 'sticky top-0 z-50',
        inline: 'rounded-control',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top',
    },
  },
);

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant, position, dismissible, onDismiss, children, ...props }, ref) => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="banner"
        className={cn(bannerVariants({ variant, position }), className)}
        {...props}
      >
        <div className="flex-1 text-center">{children}</div>
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
Banner.displayName = 'Banner';

export { Banner, bannerVariants };

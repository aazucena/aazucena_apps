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
        glass: 'glass-m text-foreground',
        cyber:
          'bg-cyan-500/10 border-b border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-wider',
        info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-b border-blue-500/20',
        warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-b border-amber-500/20',
        destructive: 'bg-destructive/10 text-destructive border-b border-destructive/20',
        success:
          'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-b border-emerald-500/20',
      },
      position: {
        top: 'sticky top-0 z-50',
        inline: 'rounded-lg',
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

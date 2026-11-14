'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const downloadTriggerVariants = cva(
  'inline-flex items-center gap-2 rounded-control border transition',
  {
    variants: {
      variant: {
        default: 'border-border bg-background hover:bg-muted',
        glass: 'glass hover:bg-state',
        cyber: 'border-signal/30 bg-panel hover:border-signal',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface DownloadTriggerProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    VariantProps<typeof downloadTriggerVariants> {
  href: string;
  fileName?: string;
  fileSize?: string;
  disabled?: boolean;
  onDownload?: () => void;
}

const DownloadTrigger = React.forwardRef<HTMLAnchorElement, DownloadTriggerProps>(
  (
    {
      className,
      variant = 'default',
      size,
      href,
      fileName,
      fileSize,
      disabled,
      onDownload,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        download={fileName ?? true}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onDownload?.();
        }}
        className={cn(
          downloadTriggerVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(v === 'cyber' ? 'text-signal' : 'text-muted-foreground')}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        <div className="flex flex-col">
          <span
            className={cn(
              'font-medium',
              v === 'cyber' ? 'text-signal font-mono' : 'text-foreground',
            )}
          >
            {fileName ?? 'Download'}
          </span>
          {fileSize && (
            <span
              className={cn(
                'text-[10px]',
                v === 'cyber' ? 'text-muted-foreground' : 'text-muted-foreground',
              )}
            >
              {fileSize}
            </span>
          )}
        </div>
      </a>
    );
  },
);
DownloadTrigger.displayName = 'DownloadTrigger';

export { DownloadTrigger, downloadTriggerVariants };

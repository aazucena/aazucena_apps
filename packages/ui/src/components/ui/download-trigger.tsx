'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const downloadTriggerVariants = cva(
  'inline-flex items-center gap-2 rounded-lg border transition-all',
  {
    variants: {
      variant: {
        default: 'border-border bg-background hover:bg-muted',
        glass: 'glass-m hover:bg-white/10',
        cyber: 'border-cyan-500/30 bg-black/50 hover:border-cyan-400',
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
          className={cn(v === 'cyber' ? 'text-cyan-400' : 'text-muted-foreground')}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        <div className="flex flex-col">
          <span
            className={cn(
              'font-medium',
              v === 'cyber' ? 'font-mono text-cyan-50' : 'text-foreground',
            )}
          >
            {fileName ?? 'Download'}
          </span>
          {fileSize && (
            <span
              className={cn(
                'text-[10px]',
                v === 'cyber' ? 'text-cyan-500/60' : 'text-muted-foreground',
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

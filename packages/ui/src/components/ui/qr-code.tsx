'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { QRCodeSVG } from 'qrcode.react';

const qrCodeVariants = cva('inline-flex flex-col items-center gap-2', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const wrapperStyles: Record<string, string> = {
  default: 'rounded-card border border-rule bg-white p-3',
  glass: 'rounded-card border border-rule bg-white p-3',
  cyber: 'rounded-card border border-signal-line bg-panel p-3 text-signal',
};

const sizeMap: Record<string, number> = {
  sm: 96,
  md: 128,
  lg: 192,
};

export interface QrCodeProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof qrCodeVariants> {
  value: string;
  label?: string;
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

const QrCode = React.forwardRef<HTMLDivElement, QrCodeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value,
      label,
      fgColor,
      bgColor,
      includeMargin = true,
      imageSettings,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'md';

    // Scanners need dark-on-light; cyber draws in the signal color via currentColor
    const defaultFg = v === 'cyber' ? 'currentColor' : '#000000';
    const defaultBg = v === 'cyber' ? 'transparent' : '#ffffff';

    return (
      <div ref={ref} className={cn(qrCodeVariants({ variant, size }), className)} {...props}>
        <div className={wrapperStyles[v]}>
          <QRCodeSVG
            value={value}
            size={sizeMap[s]}
            fgColor={fgColor ?? defaultFg}
            bgColor={bgColor ?? defaultBg}
            includeMargin={includeMargin}
            imageSettings={imageSettings}
            level="M"
          />
        </div>
        {label && (
          <span
            className={cn(
              'text-xs font-medium',
              v === 'cyber' ? 'text-signal font-mono' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);
QrCode.displayName = 'QrCode';

export { QrCode, qrCodeVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const watermarkVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-[0.02] select-none dark:opacity-[0.05] font-black tracking-tighter uppercase italic transition-all duration-500',
  {
    variants: {
      size: {
        sm: 'text-[10rem] md:text-[15rem]',
        md: 'text-[15rem] md:text-[20rem]',
        lg: 'text-[20rem] md:text-[25rem]',
        xl: 'text-[25rem] md:text-[30rem]',
        huge: 'text-[30rem] md:text-[40rem]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

export interface WatermarkProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof watermarkVariants> {
  text: string;
}

const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(
  ({ className, size, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(watermarkVariants({ size }), className)}
        {...props}
      >
        {text}
      </div>
    );
  },
);
Watermark.displayName = 'Watermark';

export { Watermark, watermarkVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { LOGO_MAIN, LOGO_ALT, BRAND_NAME } from '@aazucena/design-system';

const logoVariants = cva('inline-block shrink-0 transition-all duration-300', {
  variants: {
    variant: {
      main: 'text-primary',
      alt: 'text-foreground',
      white: 'text-foreground',
      cyber: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]',
    },
    size: {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      default: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      '2xl': 'w-24 h-24',
      full: 'w-full h-full',
    },
    hover: {
      true: 'hover:scale-110 hover:rotate-3',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'main',
    size: 'default',
    hover: false,
  },
});

export interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof logoVariants> {
  logoType?: 'main' | 'alt';
  title?: string;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, variant, size, hover, logoType = 'main', title = BRAND_NAME, ...props }, ref) => {
    const svgString = logoType === 'alt' ? LOGO_ALT : LOGO_MAIN;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={title}
        title={title}
        className={cn(logoVariants({ variant, size, hover }), className)}
        dangerouslySetInnerHTML={{ __html: svgString }}
        {...props}
      />
    );
  },
);
Logo.displayName = 'Logo';

export { Logo, logoVariants };

import React from 'react';
import { LOGO_MAIN, LOGO_ALT, BRAND_NAME } from '@aazucena/design-system';
import { cn } from '@aazucena/utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the logo.
   * 'main' - The standard pure brand mark.
   * 'alt' - The alternative brand mark with a border.
   */
  variant?: 'main' | 'alt';
  /**
   * Optional title for accessibility (defaults to BRAND_NAME).
   */
  title?: string;
}

/**
 * Logo Component
 * A theme-reactive wrapper for official brand marks.
 *
 * Sizing and coloring are controlled via CSS/Tailwind:
 * - Use 'w-*' and 'h-*' for dimensions.
 * - Use 'text-*' for color (SVGs use currentColor).
 *
 * @example
 * <Logo variant="main" className="w-12 h-12 text-primary" />
 */
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ variant = 'main', title = BRAND_NAME, className, ...props }, ref) => {
    const svgString = variant === 'alt' ? LOGO_ALT : LOGO_MAIN;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={title}
        title={title}
        className={cn('inline-block shrink-0 transition-colors', className)}
        dangerouslySetInnerHTML={{ __html: svgString }}
        {...props}
      />
    );
  },
);

Logo.displayName = 'Logo';

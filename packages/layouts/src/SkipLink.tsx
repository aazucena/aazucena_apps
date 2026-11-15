import React from 'react';
import { cn } from '@aazucena/utils';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The id of the element to jump to. Defaults to `main-content`. */
  targetId?: string;
}

/**
 * The first tab stop on a page: lets keyboard users jump past the navigation
 * to the main content (WCAG 2.4.1). It is hidden until it has focus.
 *
 * Render it before everything else, and give the target the same id plus
 * `tabIndex={-1}` so focus lands there. `DashboardLayout` does both.
 *
 * @example
 * ```tsx
 * <SkipLink />
 * <Header />
 * <main id="main-content" tabIndex={-1}>…</main>
 * ```
 */
export const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ targetId = 'main-content', className, children = 'Skip to main content', ...props }, ref) => (
    <a
      ref={ref}
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-2 focus:left-2 focus:z-(--z-skip-link)',
        'focus:rounded-control focus:bg-panel-raised focus:text-foreground focus:border-rule-strong focus:border focus:px-4 focus:py-2 focus:text-sm focus:font-medium',
        'focus:outline-signal focus:outline-2 focus:outline-offset-2 focus:outline-solid',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  ),
);
SkipLink.displayName = 'SkipLink';

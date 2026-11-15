import React from 'react';
import { cn } from '@aazucena/utils';
import { SkipLink } from './SkipLink';

export interface DashboardLayoutProps {
  /** Sidebar slot — consumer owns the sidebar component and its state */
  sidebar: React.ReactNode;
  /** Header slot — consumer owns the header component */
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  /** The id of the main region, and the target of the skip link. Defaults to `main-content`. */
  mainId?: string;
  /** Accessible name of the main region, for pages that render more than one. */
  mainLabel?: string;
  /** Render a "Skip to main content" link as the first tab stop. Defaults to true. */
  skipLink?: boolean;
}

const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-none',
};

const paddingMap: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Structural flex shell for dashboard-style layouts.
 *
 * Assembles a sidebar-left + header-top + scrollable-main architecture.
 * The consumer is responsible for providing the sidebar and header components
 * (including their internal state, icons, and navigation items).
 *
 * @example
 * ```tsx
 * <DashboardLayout sidebar={<Sidebar />} header={<Header />} contentMaxWidth="7xl">
 *   <PageContent />
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout = ({
  sidebar,
  header,
  children,
  className,
  contentMaxWidth = '7xl',
  contentPadding = 'lg',
  mainId = 'main-content',
  mainLabel,
  skipLink = true,
}: DashboardLayoutProps) => {
  return (
    <div className={cn('flex h-screen w-full overflow-hidden', className)}>
      {skipLink && <SkipLink targetId={mainId} />}
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {header}
        {/* tabIndex -1: the skip link can move focus here, and the region scrolls from the keyboard. */}
        <main
          id={mainId}
          tabIndex={-1}
          aria-label={mainLabel}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 focus-visible:outline-none"
        >
          <div
            className={cn(
              paddingMap[contentPadding],
              maxWidthMap[contentMaxWidth],
              'mx-auto w-full',
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

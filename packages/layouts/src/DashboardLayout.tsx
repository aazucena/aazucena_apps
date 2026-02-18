import React from 'react';
import { cn } from '@aazucena/utils';

export interface DashboardLayoutProps {
  /** Sidebar slot — consumer owns the sidebar component and its state */
  sidebar: React.ReactNode;
  /** Header slot — consumer owns the header component */
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
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
}: DashboardLayoutProps) => {
  return (
    <div className={cn('flex h-screen w-full overflow-hidden', className)}>
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30">
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

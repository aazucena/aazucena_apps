/**
 * ViewMoreCard Component
 * "View All Projects" CTA card for ProjectsSection carousel
 * Displayed on the last page of projects
 */

import type { JSX } from "react";

export interface ViewMoreCardProps {
  /** Link destination */
  href: string;
  /** Main heading text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Click handler that respects drag state */
  onClick: (_e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * ViewMoreCard
 *
 * Flat panel card that links to the full projects list page.
 * Designed to fill a project card slot on the last carousel page.
 *
 * @example
 * ```tsx
 * <ViewMoreCard
 *   href="/projects"
 *   title="View All Projects"
 *   subtitle="Explore my complete portfolio"
 *   onClick={handleLinkClick}
 * />
 * ```
 */
export function ViewMoreCard({
  href,
  title,
  subtitle,
  onClick,
}: ViewMoreCardProps): JSX.Element {
  return (
    <a
      href={href}
      className="bg-panel border-rule rounded-card hover:border-signal hover:bg-state focus-visible:outline-signal flex w-[min(85vw,320px)] cursor-pointer items-center justify-center border p-6 text-left no-underline transition-colors focus-visible:outline-1 md:w-[420px]"
      onClick={onClick}
    >
      <div className="text-center">
        <h3 className="text-foreground mb-2 text-3xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </a>
  );
}

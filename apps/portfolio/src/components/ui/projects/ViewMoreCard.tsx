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
 * Large gradient card that links to the full projects list page.
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
      className="block flex w-[min(85vw,320px)] cursor-pointer items-center justify-center rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 p-6 text-left no-underline backdrop-blur-sm transition-all duration-300 hover:from-cyan-400/30 hover:to-blue-500/30 md:w-[420px]"
      onClick={onClick}
    >
      <div className="text-center">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-gray-300">{subtitle}</p>
      </div>
    </a>
  );
}

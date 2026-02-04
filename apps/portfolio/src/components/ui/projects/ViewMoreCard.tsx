/**
 * ViewMoreCard Component
 * "View All Projects" CTA card for ProjectsSection carousel
 * Displayed on the last page of projects
 */

import type { JSX } from 'react';

export interface ViewMoreCardProps {
  /** Link destination */
  href: string;
  /** Main heading text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Click handler that respects drag state */
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  onClick
}: ViewMoreCardProps): JSX.Element {
  return (
    <a
      href={href}
      className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/30 text-left w-[420px] flex items-center justify-center cursor-pointer hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300 block no-underline"
      onClick={onClick}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{subtitle}</p>
      </div>
    </a>
  );
}

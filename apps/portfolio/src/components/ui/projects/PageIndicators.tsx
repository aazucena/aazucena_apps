/**
 * PageIndicators Component
 * Pagination dots for carousel/slider navigation
 * Used in ProjectsSection to show current page
 */

import type { JSX } from 'react';

export interface PageIndicatorsProps {
  /** Total number of pages */
  totalPages: number;
  /** Current active page (0-based) */
  currentPage: number;
  /** Callback when user clicks a page indicator */
  onPageClick: (page: number) => void;
}

/**
 * PageIndicators
 *
 * Displays a row of dots representing pages in a carousel.
 * - Active dot: elongated, cyan color
 * - Inactive dots: circular, semi-transparent
 * - All dots are clickable for direct navigation
 *
 * @example
 * ```tsx
 * <PageIndicators
 *   totalPages={5}
 *   currentPage={2}
 *   onPageClick={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export function PageIndicators({
  totalPages,
  currentPage,
  onPageClick
}: PageIndicatorsProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageClick(pageIndex)}
          className={`transition-all duration-300 rounded-full ${
            currentPage === pageIndex
              ? 'w-8 h-2 bg-cyan-400'
              : 'w-2 h-2 bg-white/30 hover:bg-white/50'
          }`}
          aria-label={`Go to page ${pageIndex + 1}`}
        />
      ))}
    </div>
  );
}

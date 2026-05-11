/**
 * PageIndicators Component
 * Pagination dots for carousel/slider navigation
 * Used in ProjectsSection to show current page
 */

import type { JSX } from "react";

export interface PageIndicatorsProps {
  /** Total number of pages */
  totalPages: number;
  /** Current active page (0-based) */
  currentPage: number;
  /** Callback when user clicks a page indicator */
  onPageClick: (_page: number) => void;
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
  onPageClick,
}: PageIndicatorsProps): JSX.Element {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageClick(pageIndex)}
          className={`rounded-full transition-all duration-300 ${
            currentPage === pageIndex
              ? "h-2 w-8 bg-cyan-400"
              : "h-2 w-2 bg-white/30 hover:bg-white/50"
          }`}
          aria-label={`Go to page ${pageIndex + 1}`}
        />
      ))}
    </div>
  );
}

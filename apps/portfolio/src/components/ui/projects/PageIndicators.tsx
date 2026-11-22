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
 * - Active dot: elongated, signal color
 * - Inactive dots: circular, rule-toned
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
    <div className="mt-6 flex items-center justify-center gap-0">
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageClick(pageIndex)}
          className="group focus-visible:outline-signal flex min-h-6 min-w-6 items-center justify-center focus-visible:outline-1 focus-visible:outline-offset-2"
          aria-current={currentPage === pageIndex ? "true" : undefined}
          aria-label={`Go to page ${pageIndex + 1}`}
        >
          <span
            aria-hidden="true"
            className={`rounded-full transition-[width,background-color] duration-(--motion-base) ${
              currentPage === pageIndex
                ? "bg-signal h-2 w-8"
                : "bg-rule-strong group-hover:bg-muted-foreground h-2 w-2"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

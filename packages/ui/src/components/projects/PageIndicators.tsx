/**
 * PageIndicators Component
 * Pagination dots for carousel/slider navigation
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface PageIndicatorsProps {
  /** Total number of pages */
  totalPages: number;
  /** Current active page (0-based) */
  currentPage: number;
  /** Callback when user clicks a page indicator */
  onPageClick: (page: number) => void;
  /** Additional className */
  className?: string;
}

/**
 * PageIndicators
 */
export function PageIndicators({
  totalPages,
  currentPage,
  onPageClick,
  className,
}: PageIndicatorsProps): JSX.Element {
  return (
    <div className={cn('mt-6 flex items-center justify-center gap-2', className)}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageClick(pageIndex)}
          className={cn(
            'rounded-full transition-all duration-300',
            currentPage === pageIndex
              ? 'h-2 w-8 bg-cyan-400'
              : 'h-2 w-2 bg-white/30 hover:bg-white/50',
          )}
          aria-label={`Go to page ${pageIndex + 1}`}
        />
      ))}
    </div>
  );
}

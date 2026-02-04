/**
 * useDragToSwipe Hook
 * Handles drag-to-swipe/pagination logic for touch and mouse interactions
 * Used in ProjectsSection for horizontal project carousel
 */

import { useEffect, useState } from 'react';

export interface UseDragToSwipeOptions {
  /** Total number of pages */
  totalPages: number;
  /** Minimum drag distance in pixels to trigger page change */
  minDragDistance?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
}

export interface UseDragToSwipeResult {
  /** Current page index (0-based) */
  currentPage: number;
  /** Whether user is currently dragging */
  isDragging: boolean;
  /** Whether user has moved during drag (prevents unwanted clicks) */
  hasMoved: boolean;
  /** Set the current page */
  setCurrentPage: (page: number) => void;
  /** Mouse down handler */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** Touch start handler */
  handleTouchStart: (e: React.TouchEvent) => void;
  /** Click handler that respects drag state */
  handleItemClick: (callback: () => void) => void;
  /** Link click handler that prevents navigation if dragged */
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * useDragToSwipe
 *
 * Provides drag-to-swipe functionality for carousels/sliders:
 * - Mouse drag support (desktop)
 * - Touch swipe support (mobile)
 * - Prevents clicks during drag (avoids unwanted navigation)
 * - Configurable swipe threshold
 *
 * @example
 * ```tsx
 * const { currentPage, isDragging, handleMouseDown, handleTouchStart } = useDragToSwipe({
 *   totalPages: 5,
 *   minDragDistance: 50
 * });
 *
 * <div
 *   onMouseDown={handleMouseDown}
 *   onTouchStart={handleTouchStart}
 *   className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
 * >
 *   ...
 * </div>
 * ```
 */
export function useDragToSwipe({
  totalPages,
  minDragDistance = 50,
  onPageChange,
}: UseDragToSwipeOptions): UseDragToSwipeResult {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setHasMoved(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0]!.clientX);
    setHasMoved(false);
  };

  const handleItemClick = (callback: () => void) => {
    // Only execute callback if user didn't drag
    if (!hasMoved) {
      callback();
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation if user dragged
    if (hasMoved) {
      e.preventDefault();
    }
    // Let browser handle navigation to href if not dragged
  };

  const updatePage = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleEnd = (clientX: number) => {
      const distance = dragStart - clientX;

      // Only navigate if user actually dragged (moved more than minDragDistance)
      if (hasMoved && Math.abs(distance) > minDragDistance) {
        if (distance > minDragDistance && currentPage < totalPages - 1) {
          updatePage(currentPage + 1);
        } else if (distance < -minDragDistance && currentPage > 0) {
          updatePage(currentPage - 1);
        }
      }

      setIsDragging(false);
      setDragStart(0);
      setHasMoved(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.abs(e.clientX - dragStart);
      if (distance > 5) {
        setHasMoved(true);
        e.preventDefault();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleEnd(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const distance = Math.abs(e.touches[0]!.clientX - dragStart);
      if (distance > 5) {
        setHasMoved(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => handleEnd(e.changedTouches[0]!.clientX);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, currentPage, totalPages, hasMoved, minDragDistance]);

  return {
    currentPage,
    isDragging,
    hasMoved,
    setCurrentPage: updatePage,
    handleMouseDown,
    handleTouchStart,
    handleItemClick,
    handleLinkClick,
  };
}

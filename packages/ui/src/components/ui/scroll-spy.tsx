'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';

export interface ScrollSpyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** CSS selector for the scrollable container. If not provided, defaults to the window. */
  containerSelector?: string;
  /** CSS selector for the headings to spy on (e.g., "h2, h3"). */
  headerSelector: string;
  /** Offset from the top of the container for activation (in pixels). */
  offset?: number;
  /** Callback function triggered when the active heading changes. */
  onActiveHeadingChange?: (id: string | null) => void;
  /**
   * Render prop that receives the active heading ID.
   * Alternatively, you can pass standard React nodes.
   */
  children?: React.ReactNode | ((activeId: string | null) => React.ReactNode);
}

/**
 * Custom hook for scroll spying logic.
 */
export function useScrollSpy({
  containerSelector,
  headerSelector,
  offset = 0,
  onActiveHeadingChange,
}: {
  containerSelector?: string;
  headerSelector: string;
  offset?: number;
  onActiveHeadingChange?: (id: string | null) => void;
}) {
  const [activeHeadingId, setActiveHeadingId] = React.useState<string | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    const container = containerSelector ? document.querySelector(containerSelector) : null;
    const root = container || null;

    const headings = Array.from(
      (container || document).querySelectorAll(headerSelector),
    ) as HTMLElement[];

    if (headings.length === 0) return;

    const callback: IntersectionObserverCallback = (entries) => {
      // IntersectionObserver can trigger multiple entries at once.
      // We want to find the one that is currently active based on our offset.
      const intersecting = entries.filter((e) => e.isIntersecting);

      if (intersecting.length > 0) {
        // We take the first one that is intersecting.
        // In a top-to-bottom scroll, this is usually the one that just entered the "band".
        const id = intersecting[intersecting.length - 1]!.target.id;
        if (id) {
          setActiveHeadingId(id);
          onActiveHeadingChange?.(id);
        }
      }
    };

    try {
      // We use a rootMargin that creates a thin line at the top (after the offset)
      // to detect which element is currently crossing that line.
      const topMargin = -offset;
      // We set bottom margin to -95% or similar to make the "active" zone very small at the top.
      const observer = new IntersectionObserver(callback, {
        root,
        rootMargin: `${topMargin}px 0px -95% 0px`,
        threshold: 0,
      });

      headings.forEach((heading) => {
        if (heading.id) {
          observer.observe(heading);
        }
      });

      observerRef.current = observer;
    } catch (error) {
      console.error('ScrollSpy: Failed to initialize IntersectionObserver', error);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerSelector, headerSelector, offset, onActiveHeadingChange]);

  return activeHeadingId;
}

/**
 * A component that tracks which heading is currently visible at the top of a scrollable container.
 */
const ScrollSpy = React.forwardRef<HTMLDivElement, ScrollSpyProps>(
  (
    {
      containerSelector,
      headerSelector,
      offset = 0,
      onActiveHeadingChange,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const activeId = useScrollSpy({
      containerSelector,
      headerSelector,
      offset,
      onActiveHeadingChange,
    });

    const content =
      typeof children === 'function'
        ? (children as (activeId: string | null) => React.ReactNode)(activeId)
        : children;

    return (
      <div ref={ref} className={cn('scroll-spy-container', className)} {...props}>
        {content}
      </div>
    );
  },
);

ScrollSpy.displayName = 'ScrollSpy';

export { ScrollSpy };

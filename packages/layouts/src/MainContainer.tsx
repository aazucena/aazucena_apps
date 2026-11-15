import React from 'react';
import { cn } from '@aazucena/utils';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Render as another element. Use `main` for the one main region of a page. */
  as?: React.ElementType;
  /** Forwarded to the element, e.g. `main-content` as a skip link target. */
  id?: string;
}

/**
 * Standard page wrapper handles max-width and horizontal centering.
 */
export const MainContainer = ({
  children,
  className,
  as: Component = 'div',
  id,
}: MainContainerProps) => {
  const Element = Component as any;
  return (
    <Element
      id={id}
      // A main region is a skip link target, so it must be able to take focus.
      tabIndex={Component === 'main' ? -1 : undefined}
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
    >
      {children}
    </Element>
  );
};

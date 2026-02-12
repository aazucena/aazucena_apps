import React from 'react';
import { cn } from '@aazucena/utils';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Standard page wrapper handles max-width and horizontal centering.
 */
export const MainContainer = ({
  children,
  className,
  as: Component = 'div',
}: MainContainerProps) => {
  return (
    <Component className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  );
};

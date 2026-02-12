import React from 'react';
import { cn } from '@aazucena/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

/**
 * The vertical engine. Handles section-level padding and semantic tags.
 */
export const Section = ({ children, className, id, as: Component = 'section' }: SectionProps) => {
  return (
    <Component id={id} className={cn('relative py-16 sm:py-24 lg:py-32', className)}>
      {children}
    </Component>
  );
};

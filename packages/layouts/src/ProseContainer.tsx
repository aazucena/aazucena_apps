import React from 'react';
import { cn } from '@aazucena/utils';

interface ProseContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Specialized wrapper for blog posts and legal pages.
 * Standardizes widths for optimal readability.
 */
export const ProseContainer = ({ children, className }: ProseContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8',
        'prose prose-zinc dark:prose-invert prose-lg',
        'prose-headings:font-heading prose-a:text-primary-500 hover:prose-a:text-primary-400',
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * SectionLayout Component
 * Reusable layout wrapper for all portfolio sections
 * Provides consistent container, header, and gradient subtitle styling
 */

import type { JSX, ReactNode, RefObject } from 'react';
import { cn } from '~/lib/utils';

export interface SectionLayoutProps {
  /** Section title (main heading) */
  title: string;
  /** Section subtitle (gradient text below title) */
  subtitle?: string | null;
  /** Content to render below the header */
  children: ReactNode;
  /** Inner content max-width variant */
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  /** Header level for the title (h1-h6) */
  headerLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Additional className for the outer container */
  className?: string;
  /** Additional className for the header wrapper div */
  headerClassName?: string;
  /** Additional className for the heading element itself */
  headingClassName?: string;
  /** Additional className for the title span */
  titleClassName?: string;
  /** Additional className for the subtitle span */
  subtitleClassName?: string;
  /** Ref for the outer container (for GSAP, etc.) */
  ref?: RefObject<HTMLDivElement | null>;
  /** Ref for the header container (for GSAP, etc.) */
  headerRef?: RefObject<HTMLHeadingElement | null>;
}

const contentWidthClasses = {
  narrow: 'max-w-3xl',   // AboutSection
  medium: 'max-w-5xl',   // Skills, Awards, etc.
  wide: 'max-w-6xl',     // Future use
  full: '',              // ProjectsSection (no constraint)
} as const;

export function SectionLayout({
  title,
  subtitle,
  children,
  contentWidth = 'medium',
  headerLevel = 'h2',
  className,
  headerClassName,
  headingClassName,
  titleClassName,
  subtitleClassName,
  ref,
  headerRef,
}: SectionLayoutProps): JSX.Element {
  const widthClass = contentWidthClasses[contentWidth];
  const Heading = headerLevel;

  return (
    <div ref={ref} className={cn('container mx-auto max-w-7xl', className)}>
      <div className={cn(widthClass, 'mx-auto text-center', headerClassName)}>
        <Heading ref={headerRef} className={cn('text-5xl md:text-6xl font-bold text-white mb-8 leading-tight', headingClassName)}>
          <span className={titleClassName}>
            {title}
          </span>
          {subtitle && (
            <span className={cn('block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent', subtitleClassName)}>
              {subtitle}
            </span>
          )}
        </Heading>

        {children}
      </div>
    </div>
  );
}

/**
 * Section Component
 * Reusable section wrapper
 * Provides consistent container, header, and gradient subtitle styling
 */

import type { JSX, ReactNode, RefObject } from 'react';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const sectionVariants = cva('mx-auto text-center', {
  variants: {
    contentWidth: {
      narrow: 'max-w-3xl', // AboutSection
      medium: 'max-w-5xl', // Skills, Awards, etc.
      wide: 'max-w-6xl', // Future use
      full: '', // ProjectsSection (no constraint)
    },
  },
  defaultVariants: {
    contentWidth: 'medium',
  },
});

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  id?: string;
  /** Section title (main heading) */
  title: string;
  /** Section subtitle (gradient text below title) */
  subtitle?: string | null;
  /** Content to render below the header */
  children: ReactNode;
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

export function Section({
  id,
  title,
  subtitle,
  children,
  contentWidth,
  headerLevel = 'h2',
  className,
  headerClassName,
  headingClassName,
  titleClassName,
  subtitleClassName,
  ref,
  headerRef,
}: SectionProps): JSX.Element {
  const Heading = headerLevel;

  return (
    <section id={id} ref={ref} className={cn('container mx-auto max-w-7xl', className)}>
      <div className={cn(sectionVariants({ contentWidth }), headerClassName)}>
        <Heading
          ref={headerRef}
          className={cn(
            'mb-8 text-5xl leading-tight font-bold text-white md:text-6xl',
            headingClassName,
          )}
        >
          <span className={titleClassName}>{title}</span>
          {subtitle && (
            <span
              className={cn(
                'mt-4 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl text-transparent md:text-4xl',
                subtitleClassName,
              )}
            >
              {subtitle}
            </span>
          )}
        </Heading>

        {children}
      </div>
    </section>
  );
}

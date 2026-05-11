import React from 'react';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
} from '@aazucena/ui';

export interface SectionLayoutProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  variant?: 'default' | 'glass' | 'cyber';
  alignment?: 'left' | 'center' | 'right';
  id?: string;
  className?: string;
  /** The heading level for the section title. Defaults to `h2`. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
}

/**
 * Convenience composite over `@aazucena/ui`'s Section system.
 *
 * Assembles `Section + SectionHeader + SectionTitle + SectionSubtitle + SectionContent`
 * in the common pattern. When `title` is absent, the `SectionHeader` is omitted entirely.
 *
 * @example
 * ```tsx
 * <SectionLayout title="Projects" subtitle="A selection of my work" variant="glass">
 *   <ProjectGrid />
 * </SectionLayout>
 * ```
 */
export const SectionLayout = ({
  title,
  subtitle,
  children,
  contentWidth = 'wide',
  variant = 'default',
  alignment = 'center',
  id,
  className,
  titleAs = 'h2',
}: SectionLayoutProps) => {
  return (
    <Section
      id={id}
      className={className}
      contentWidth={contentWidth}
      variant={variant}
      alignment={alignment}
    >
      {title != null && (
        <SectionHeader alignment={alignment}>
          <SectionTitle as={titleAs} variant={variant}>
            {title}
          </SectionTitle>
          {subtitle != null && <SectionSubtitle>{subtitle}</SectionSubtitle>}
        </SectionHeader>
      )}
      <SectionContent>{children}</SectionContent>
    </Section>
  );
};

/**
 * Template System Type Definitions
 *
 * This file defines the contract between the router ([slug].astro) and template components.
 * Each template receives props computed by the router (SEO, breadcrumbs, etc.) and focuses
 * solely on presentation.
 *
 * @module templates
 */

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  class?: string;
}

/**
 * Base props shared by all page templates.
 * The router computes SEO metadata, JSON-LD, and breadcrumbs,
 * then passes them to the selected template component.
 */
export interface BaseTemplateProps {
  // Core content
  title: string;
  content: string;

  // SEO (computed by router)
  seoTitle: string;
  seoDescription: string;
  jsonLd: Record<string, any>;

  // Navigation
  breadcrumbs: BreadcrumbItem[];

  // Layout customization
  watermarkText: string;
  watermarkSize?: 'small' | 'medium' | 'large' | 'huge';

  // Features
  showTableOfContents: boolean;
  tocSelector?: string;

  // Metadata
  slug: string;
}

/**
 * Props for the Legal template.
 * Used for privacy policy, terms of service, and other legal documents.
 *
 * Features:
 * - Revision badge with formatted date
 * - Back-to-home button
 * - Print-optimized styles
 *
 * @example
 * ```astro
 * <LegalTemplate
 *   title="Privacy Policy"
 *   content={markdownContent}
 *   lastUpdated="2025-01-24T00:00:00.000Z"
 *   {...seoProps}
 * />
 * ```
 */
export interface LegalTemplateProps extends BaseTemplateProps {
  /** ISO date string for last revision */
  lastUpdated: string;
}

/**
 * Props for the Editorial (default) template.
 * Used for general content pages, articles, and documentation.
 *
 * Features:
 * - Clean, minimal layout
 * - Optional table of contents
 * - Prose-styled content area
 *
 * @example
 * ```astro
 * <EditorialTemplate
 *   title="About Our Mission"
 *   content={markdownContent}
 *   showTableOfContents={true}
 *   {...seoProps}
 * />
 * ```
 */
export interface EditorialTemplateProps extends BaseTemplateProps {
  // No additional props currently needed
  // Future: could add author, publishDate, etc.
}

/**
 * Props for the Landing template (stub).
 * Designed for marketing pages, product launches, and campaigns.
 *
 * Features (planned):
 * - Hero section with CTA
 * - Feature highlights
 * - Social proof sections
 *
 * @example
 * ```astro
 * <LandingTemplate
 *   title="Launch Your Product"
 *   content={markdownContent}
 *   heroCta={{ text: "Get Started", href: "/signup" }}
 *   heroImage="/images/hero.jpg"
 *   {...seoProps}
 * />
 * ```
 */
export interface LandingTemplateProps extends BaseTemplateProps {
  /** Optional hero CTA button */
  heroCta?: { text: string; href: string };

  /** Optional hero background image */
  heroImage?: string;

  // Future: features list, testimonials, etc.
}

/**
 * Template component registry.
 * Maps CMS template names to component file names.
 *
 * When adding a new template:
 * 1. Add the template name to PageTemplateEnum in validators/enums.ts
 * 2. Create the .astro component file
 * 3. Add the mapping here
 * 4. Define the props interface above
 */
export const TEMPLATE_MAP = {
  legal: 'LegalTemplate',
  default: 'EditorialTemplate',
  landing: 'LandingTemplate',
} as const;

/**
 * Union type of valid template names from CMS.
 * Synced with PageTemplateEnum in validators/enums.ts.
 */
export type TemplateType = keyof typeof TEMPLATE_MAP;

/**
 * Type guard to check if a string is a valid template type.
 *
 * @param value - String to check
 * @returns True if value is a valid template type
 *
 * @example
 * ```ts
 * const template = page.template;
 * if (isTemplateType(template)) {
 *   const Component = templateComponents[template];
 * }
 * ```
 */
export function isTemplateType(value: string): value is TemplateType {
  return value in TEMPLATE_MAP;
}

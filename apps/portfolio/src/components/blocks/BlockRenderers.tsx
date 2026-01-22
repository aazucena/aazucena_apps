/**
 * Reusable BlocksRenderer Configuration
 *
 * Provides consistent styling for Strapi rich text blocks across all components.
 * Uses Tailwind CSS classes for typography and layout.
 *
 * @see https://docs.strapi.io/dev-docs/plugins/blocks-react-renderer
 */

import type { BlocksRenderer as BlocksRendererType } from '@strapi/blocks-react-renderer';

/**
 * Sanitizes URLs to prevent XSS attacks
 * Only allows http(s) and relative URLs
 * @param url - The URL to sanitize
 * @returns Safe URL or '#' fallback for blocked URLs
 */
function sanitizeUrl(url: string): string {
  if (!url) return '#';

  // Allow only http(s) and relative URLs (starting with /)
  const allowedSchemes = /^(https?:\/\/|\/)/i;

  if (!allowedSchemes.test(url)) {
    console.warn('[XSS Protection] Blocked suspicious URL:', url);
    return '#';
  }

  return url;
}

/**
 * Default block renderers with Tailwind styling
 * Supports both light and dark themes
 */
export const defaultBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  // Paragraphs
  paragraph: ({ children }) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed last:mb-0">
      {children}
    </p>
  ),

  // Headings
  heading: ({ children, level }) => {
    const headingClasses = {
      1: 'text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 mt-8',
      2: 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-7',
      3: 'text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-6',
      4: 'text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-5',
      5: 'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4',
      6: 'text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-3',
    };

    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const className = headingClasses[level as keyof typeof headingClasses];

    return <Tag className={className}>{children}</Tag>;
  },

  // Lists
  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const className = format === 'ordered'
      ? 'list-decimal list-outside ms-4 mb-4 space-y-2 text-gray-700 dark:text-gray-300'
      : 'list-disc list-outside ms-4 mb-4 space-y-2 text-gray-700 dark:text-gray-300';

    return <Tag className={className}>{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</li>
  ),

  // Links
  link: ({ children, url }) => {
    const sanitizedUrl = sanitizeUrl(url);
    const isExternal = sanitizedUrl.startsWith('http');

    return (
      <a
        href={sanitizedUrl}
        className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 underline decoration-blue-600/30 dark:decoration-cyan-400/30 hover:decoration-blue-800 dark:hover:decoration-cyan-300 transition-colors duration-200"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },

  // Quotes
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-600 dark:border-cyan-400 px-4 py-2 mb-4 italic text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // Code blocks
  code: ({ children }) => (
    <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-white/10 rounded-lg p-4 mb-4 overflow-x-auto">
      <code className="text-sm text-blue-700 dark:text-cyan-400 font-mono">{children}</code>
    </pre>
  ),

  // Images
  image: ({ image }) => (
    <figure className="mb-6">
      <img
        src={sanitizeUrl(image.url)}
        alt={image.alternativeText || ''}
        className="rounded-lg w-full h-auto"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Dark-only block renderers (for homepage immersive sections)
 * Always uses light text on dark backgrounds regardless of theme
 * Used in: AboutSection, ExperienceModal, and other homepage components
 */
export const darkBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  // Paragraphs
  paragraph: ({ children }) => (
    <p className="mb-4 text-gray-300 leading-relaxed last:mb-0">
      {children}
    </p>
  ),

  // Headings
  heading: ({ children, level }) => {
    const headingClasses = {
      1: 'text-4xl md:text-5xl font-bold text-white mb-6 mt-8',
      2: 'text-3xl md:text-4xl font-bold text-white mb-5 mt-7',
      3: 'text-2xl md:text-3xl font-semibold text-white mb-4 mt-6',
      4: 'text-xl md:text-2xl font-semibold text-white mb-3 mt-5',
      5: 'text-lg md:text-xl font-semibold text-white mb-2 mt-4',
      6: 'text-base md:text-lg font-semibold text-white mb-2 mt-3',
    };

    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const className = headingClasses[level as keyof typeof headingClasses];

    return <Tag className={className}>{children}</Tag>;
  },

  // Lists
  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const className = format === 'ordered'
      ? 'list-decimal list-outside ms-4 mb-4 space-y-2 text-gray-300'
      : 'list-disc list-outside ms-4 mb-4 space-y-2 text-gray-300';

    return <Tag className={className}>{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="text-gray-300 leading-relaxed">{children}</li>
  ),

  // Links
  link: ({ children, url }) => {
    const sanitizedUrl = sanitizeUrl(url);
    const isExternal = sanitizedUrl.startsWith('http');

    return (
      <a
        href={sanitizedUrl}
        className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors duration-200"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },

  // Quotes
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-cyan-400 px-4 py-2 mb-4 italic text-gray-300 bg-white/5 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // Code blocks
  code: ({ children }) => (
    <pre className="bg-gray-900 border border-white/10 rounded-lg p-4 mb-4 overflow-x-auto">
      <code className="text-sm text-cyan-400 font-mono">{children}</code>
    </pre>
  ),

  // Images
  image: ({ image }) => (
    <figure className="mb-6">
      <img
        src={sanitizeUrl(image.url)}
        alt={image.alternativeText || ''}
        className="rounded-lg w-full h-auto"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="text-sm text-gray-400 text-center mt-2 italic">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Highlight-specific renderers (for bullet points with checkmarks)
 * Used in About section "What I Bring to the Table"
 * Supports both light and dark themes
 */
export const highlightBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <div className="flex items-start gap-2 mb-3">
      <span className="text-blue-600 dark:text-cyan-400 mt-1 flex-shrink-0">✓</span>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </div>
  ),

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    return <Tag className="space-y-2">{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="flex items-start gap-2">
      <span className="text-blue-600 dark:text-cyan-400 mt-1 flex-shrink-0">✓</span>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </li>
  ),

  // Other blocks use default styling
  heading: defaultBlockRenderers.heading,
  link: defaultBlockRenderers.link,
  quote: defaultBlockRenderers.quote,
  code: defaultBlockRenderers.code,
  image: defaultBlockRenderers.image,
};

/**
 * Dark-only highlight renderers (for homepage immersive sections)
 * Always uses light text with checkmarks
 */
export const darkHighlightBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <div className="flex items-start gap-2 mb-3">
      <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
      <span className="text-gray-300">{children}</span>
    </div>
  ),

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    return <Tag className="space-y-2">{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
      <span className="text-gray-300">{children}</span>
    </li>
  ),

  // Other blocks use dark styling
  heading: darkBlockRenderers.heading,
  link: darkBlockRenderers.link,
  quote: darkBlockRenderers.quote,
  code: darkBlockRenderers.code,
  image: darkBlockRenderers.image,
};

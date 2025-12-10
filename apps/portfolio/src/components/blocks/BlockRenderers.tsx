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
 * Default block renderers with Tailwind styling
 * Optimized for dark theme portfolio design
 */
export const defaultBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
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
      ? 'list-decimal list-inside mb-4 space-y-2 text-gray-300'
      : 'list-disc list-inside mb-4 space-y-2 text-gray-300';

    return <Tag className={className}>{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="text-gray-300 leading-relaxed">{children}</li>
  ),

  // Links
  link: ({ children, url }) => (
    <a
      href={url}
      className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors duration-200"
      target={url.startsWith('http') ? '_blank' : undefined}
      rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // Quotes
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 mb-4 italic text-gray-300 bg-white/5 rounded-r-lg">
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
        src={image.url}
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
 * Compact block renderers for constrained spaces (cards, modals, etc.)
 * Smaller spacing and fonts
 */
export const compactBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <p className="mb-2 text-sm text-gray-300 leading-relaxed last:mb-0">
      {children}
    </p>
  ),

  heading: ({ children, level }) => {
    const headingClasses = {
      1: 'text-2xl font-bold text-white mb-3 mt-4',
      2: 'text-xl font-bold text-white mb-3 mt-4',
      3: 'text-lg font-semibold text-white mb-2 mt-3',
      4: 'text-base font-semibold text-white mb-2 mt-3',
      5: 'text-sm font-semibold text-white mb-2 mt-2',
      6: 'text-sm font-semibold text-white mb-1 mt-2',
    };

    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const className = headingClasses[level as keyof typeof headingClasses];

    return <Tag className={className}>{children}</Tag>;
  },

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const className = format === 'ordered'
      ? 'list-decimal list-inside mb-2 space-y-1 text-sm text-gray-300'
      : 'list-disc list-inside mb-2 space-y-1 text-sm text-gray-300';

    return <Tag className={className}>{children}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="text-sm text-gray-300 leading-relaxed">{children}</li>
  ),

  link: ({ children, url }) => (
    <a
      href={url}
      className="text-cyan-400 hover:text-cyan-300 underline text-sm"
      target={url.startsWith('http') ? '_blank' : undefined}
      rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  quote: ({ children }) => (
    <blockquote className="border-l-2 border-cyan-400 pl-3 py-1 mb-2 italic text-sm text-gray-300">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <pre className="bg-gray-900 border border-white/10 rounded p-2 mb-2 overflow-x-auto">
      <code className="text-xs text-cyan-400 font-mono">{children}</code>
    </pre>
  ),

  image: ({ image }) => (
    <figure className="mb-3">
      <img
        src={image.url}
        alt={image.alternativeText || ''}
        className="rounded w-full h-auto"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="text-xs text-gray-400 text-center mt-1 italic">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Highlight-specific renderers (for bullet points with checkmarks)
 * Used in About section "What I Bring to the Table"
 */
export const highlightBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
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

  // Other blocks use default styling
  heading: defaultBlockRenderers.heading,
  link: defaultBlockRenderers.link,
  quote: defaultBlockRenderers.quote,
  code: defaultBlockRenderers.code,
  image: defaultBlockRenderers.image,
};

/**
 * Reusable BlocksRenderer Configuration
 *
 * Provides consistent styling for Strapi rich text blocks across all components.
 */

import type { BlocksRenderer as BlocksRendererType } from '@strapi/blocks-react-renderer';
import { sanitizeUrl } from '@aazucena/utils';

/**
 * Default block renderers with Tailwind styling
 */
export const defaultBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <p className="mb-4 leading-relaxed text-gray-700 last:mb-0 dark:text-gray-300">
      {children as any}
    </p>
  ),

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

    return <Tag className={className}>{children as any}</Tag>;
  },

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const className =
      format === 'ordered'
        ? 'list-decimal list-outside ms-4 mb-4 space-y-2 text-gray-700 dark:text-gray-300'
        : 'list-disc list-outside ms-4 mb-4 space-y-2 text-gray-700 dark:text-gray-300';

    return <Tag className={className}>{children as any}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="leading-relaxed text-gray-700 dark:text-gray-300">{children as any}</li>
  ),

  link: ({ children, url }) => {
    const sanitizedUrl = sanitizeUrl(url);
    const isExternal = sanitizedUrl.startsWith('http');

    return (
      <a
        href={sanitizedUrl}
        className="text-blue-600 underline decoration-blue-600/30 transition-colors duration-200 hover:text-blue-800 hover:decoration-blue-800 dark:text-cyan-400 dark:decoration-cyan-400/30 dark:hover:text-cyan-300 dark:hover:decoration-cyan-300"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children as any}
      </a>
    );
  },

  quote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-4 border-blue-600 bg-gray-100 px-4 py-2 text-gray-700 italic dark:border-cyan-400 dark:bg-white/5 dark:text-gray-300">
      {children as any}
    </blockquote>
  ),

  code: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-gray-300 bg-gray-100 p-4 dark:border-white/10 dark:bg-gray-900">
      <code className="font-mono text-sm text-blue-700 dark:text-cyan-400">{children as any}</code>
    </pre>
  ),

  image: ({ image }) => (
    <figure className="mb-6">
      <img
        src={sanitizeUrl(image.url)}
        alt={image.alternativeText || ''}
        className="h-auto w-full rounded-lg"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic dark:text-gray-400">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Dark-only block renderers
 */
export const darkBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <p className="mb-4 leading-relaxed text-gray-300 last:mb-0">{children as any}</p>
  ),

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

    return <Tag className={className}>{children as any}</Tag>;
  },

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const className =
      format === 'ordered'
        ? 'list-decimal list-outside ms-4 mb-4 space-y-2 text-gray-300'
        : 'list-disc list-outside ms-4 mb-4 space-y-2 text-gray-300';

    return <Tag className={className}>{children as any}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="leading-relaxed text-gray-300">{children as any}</li>
  ),

  link: ({ children, url }) => {
    const sanitizedUrl = sanitizeUrl(url);
    const isExternal = sanitizedUrl.startsWith('http');

    return (
      <a
        href={sanitizedUrl}
        className="text-cyan-400 underline decoration-cyan-400/30 transition-colors duration-200 hover:text-cyan-300 hover:decoration-cyan-300"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children as any}
      </a>
    );
  },

  quote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-4 border-cyan-400 bg-white/5 px-4 py-2 text-gray-300 italic">
      {children as any}
    </blockquote>
  ),

  code: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-white/10 bg-gray-900 p-4">
      <code className="font-mono text-sm text-cyan-400">{children as any}</code>
    </pre>
  ),

  image: ({ image }) => (
    <figure className="mb-6">
      <img
        src={sanitizeUrl(image.url)}
        alt={image.alternativeText || ''}
        className="h-auto w-full rounded-lg"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-400 italic">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Highlight-specific renderers
 */
export const highlightBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <div className="mb-3 flex items-start gap-2">
      <span className="mt-1 flex-shrink-0 text-blue-600 dark:text-cyan-400">✓</span>
      <span className="text-gray-700 dark:text-gray-300">{children as any}</span>
    </div>
  ),

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    return <Tag className="space-y-2">{children as any}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="flex items-start gap-2">
      <span className="mt-1 flex-shrink-0 text-blue-600 dark:text-cyan-400">✓</span>
      <span className="text-gray-700 dark:text-gray-300">{children as any}</span>
    </li>
  ),

  heading: defaultBlockRenderers.heading,
  link: defaultBlockRenderers.link,
  quote: defaultBlockRenderers.quote,
  code: defaultBlockRenderers.code,
  image: defaultBlockRenderers.image,
};

/**
 * Dark-only highlight renderers
 */
export const darkHighlightBlockRenderers: Parameters<typeof BlocksRendererType>[0]['blocks'] = {
  paragraph: ({ children }) => (
    <div className="mb-3 flex items-start gap-2">
      <span className="mt-1 flex-shrink-0 text-cyan-400">✓</span>
      <span className="text-gray-300">{children as any}</span>
    </div>
  ),

  list: ({ children, format }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    return <Tag className="space-y-2">{children as any}</Tag>;
  },

  'list-item': ({ children }) => (
    <li className="flex items-start gap-2">
      <span className="mt-1 flex-shrink-0 text-cyan-400">✓</span>
      <span className="text-gray-300">{children as any}</span>
    </li>
  ),

  heading: darkBlockRenderers.heading,
  link: darkBlockRenderers.link,
  quote: darkBlockRenderers.quote,
  code: darkBlockRenderers.code,
  image: darkBlockRenderers.image,
};

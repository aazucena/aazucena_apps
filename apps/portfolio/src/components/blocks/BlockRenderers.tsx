/**
 * Reusable BlocksRenderer Configuration
 *
 * Provides consistent styling for Strapi rich text blocks across all components.
 * Uses Avra token classes; they follow the theme (the homepage binds its content
 * layer to the dark tokens, so the "dark" renderers share the same classes).
 *
 * @see https://docs.strapi.io/dev-docs/plugins/blocks-react-renderer
 */

import type { BlocksRenderer as BlocksRendererType } from "@strapi/blocks-react-renderer";

/**
 * Sanitizes URLs to prevent XSS attacks
 * Only allows http(s) and relative URLs
 * @param url - The URL to sanitize
 * @returns Safe URL or '#' fallback for blocked URLs
 */
function sanitizeUrl(url: string): string {
  if (!url) return "#";

  // Allow only http(s) and relative URLs (starting with /)
  const allowedSchemes = /^(https?:\/\/|\/)/i;

  if (!allowedSchemes.test(url)) {
    console.warn("[XSS Protection] Blocked suspicious URL:", url);
    return "#";
  }

  return url;
}

const HEADING_CLASSES = {
  1: "text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 mt-8",
  2: "text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-5 mt-7",
  3: "text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4 mt-6",
  4: "text-xl md:text-2xl font-semibold text-foreground mb-3 mt-5",
  5: "text-lg md:text-xl font-semibold text-foreground mb-2 mt-4",
  6: "text-base md:text-lg font-semibold text-foreground mb-2 mt-3",
} as const;

/**
 * Default block renderers on Avra tokens
 * Heading levels are rendered as authored (order preserved)
 */
export const defaultBlockRenderers: Parameters<
  typeof BlocksRendererType
>[0]["blocks"] = {
  // Paragraphs
  paragraph: ({ children }) => (
    <p className="text-foreground mb-4 leading-relaxed last:mb-0">{children}</p>
  ),

  // Headings
  heading: ({ children, level }) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return <Tag className={HEADING_CLASSES[level]}>{children}</Tag>;
  },

  // Lists
  list: ({ children, format }) => {
    const Tag = format === "ordered" ? "ol" : "ul";
    const className =
      format === "ordered"
        ? "list-decimal list-outside ms-4 mb-4 space-y-2 text-foreground"
        : "list-disc list-outside ms-4 mb-4 space-y-2 text-foreground";

    return <Tag className={className}>{children}</Tag>;
  },

  "list-item": ({ children }) => (
    <li className="text-foreground leading-relaxed">{children}</li>
  ),

  // Links: underlined so they are distinguishable by more than colour
  link: ({ children, url }) => {
    const sanitizedUrl = sanitizeUrl(url);
    const isExternal = sanitizedUrl.startsWith("http");

    return (
      <a
        href={sanitizedUrl}
        className="text-signal hover:text-foreground focus-visible:outline-signal underline underline-offset-2 transition-colors focus-visible:outline-1 focus-visible:outline-offset-2"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },

  // Quotes
  quote: ({ children }) => (
    <blockquote className="border-signal bg-state text-muted-foreground rounded-r-control mb-4 border-l-2 px-4 py-2 italic">
      {children}
    </blockquote>
  ),

  // Code blocks: keyboard-scrollable when they overflow
  code: ({ children }) => (
    <pre
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable pane must be keyboard-focusable
      tabIndex={0}
      role="region"
      aria-label="Code sample"
      className="border-rule bg-state rounded-control focus-visible:outline-signal mb-4 overflow-x-auto border p-4 focus-visible:outline-1"
    >
      <code className="text-foreground font-mono text-sm">{children}</code>
    </pre>
  ),

  // Images
  image: ({ image }) => (
    <figure className="mb-6">
      <img
        src={sanitizeUrl(image.url)}
        alt={image.alternativeText || ""}
        className="border-rule rounded-card h-auto w-full border"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="micro-label text-muted-foreground mt-2 text-center">
          {image.caption}
        </figcaption>
      )}
    </figure>
  ),
};

/**
 * Block renderers for homepage immersive sections (AboutSection and others).
 * The homepage content layer is bound to the dark tokens, so these are the default set.
 */
export const darkBlockRenderers: Parameters<
  typeof BlocksRendererType
>[0]["blocks"] = { ...defaultBlockRenderers };

/**
 * Highlight-specific renderers (for bullet points with checkmarks)
 * Used in About section "What I Bring to the Table"
 */
export const highlightBlockRenderers: Parameters<
  typeof BlocksRendererType
>[0]["blocks"] = {
  paragraph: ({ children }) => (
    <div className="mb-3 flex items-start gap-2">
      <span className="text-signal mt-1 shrink-0" aria-hidden="true">
        ✓
      </span>
      <span className="text-foreground">{children}</span>
    </div>
  ),

  list: ({ children, format }) => {
    const Tag = format === "ordered" ? "ol" : "ul";
    return <Tag className="space-y-2">{children}</Tag>;
  },

  "list-item": ({ children }) => (
    <li className="flex items-start gap-2">
      <span className="text-signal mt-1 shrink-0" aria-hidden="true">
        ✓
      </span>
      <span className="text-foreground">{children}</span>
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
 * Dark-only highlight renderers (homepage immersive sections)
 * Same classes as the highlight set: the homepage binds the dark tokens.
 */
export const darkHighlightBlockRenderers: Parameters<
  typeof BlocksRendererType
>[0]["blocks"] = { ...highlightBlockRenderers };

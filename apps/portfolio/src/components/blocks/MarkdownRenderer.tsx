/**
 * Markdown Renderer
 * Renders markdown using the `marked` library with Tailwind CSS styling
 */

import { marked } from "marked";
import type { Tokens } from "marked";
import type { JSX } from "react";
import { cn } from "~/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Configure marked with custom renderer using marked.use()
 * IMPORTANT: Use this.parser.parseInline() for nested tokens (strong, em, link, etc.)
 */
marked.use({
  renderer: {
    // Paragraphs
    paragraph(token: Tokens.Paragraph): string {
      // Parse inline tokens (bold, italic, links, etc.)
      const content = this.parser.parseInline(token.tokens);
      return `<p class="mb-4 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed last:mb-0">${content}</p>`;
    },

    // Headings
    heading(token: Tokens.Heading): string {
      const sizes: Record<number, string> = {
        1: "text-4xl md:text-5xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl",
        4: "text-xl md:text-2xl",
        5: "text-lg md:text-xl",
        6: "text-base md:text-lg",
      };
      const size = sizes[token.depth] || sizes[6];

      // Generate ID from heading text for anchor links (use raw text, not parsed HTML)
      const id = token.text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();

      // Parse inline tokens in headings
      const content = this.parser.parseInline(token.tokens);
      return `<h${token.depth} id="${id}" class="${size} font-bold text-gray-900 dark:text-white mb-4 mt-6 scroll-mt-24">${content}</h${token.depth}>`;
    },

    // Lists
    list(token: Tokens.List): string {
      const tag = token.ordered ? "ol" : "ul";
      const className = token.ordered
        ? "list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
        : "list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300";

      // Properly render list items with nested content
      const items = token.items
        .map((item: Tokens.ListItem) => {
          const content = this.parser.parse(item.tokens);
          return `<li class="text-gray-700 dark:text-gray-300 leading-relaxed">${content}</li>`;
        })
        .join("");

      return `<${tag} class="${className}">${items}</${tag}>`;
    },

    // Links
    link(token: Tokens.Link): string {
      const isExternal = token.href?.startsWith("http");
      const titleAttr = token.title ? `title="${token.title}"` : "";
      const targetAttr = isExternal
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";
      // Parse inline tokens within links (e.g., **bold text in link**)
      const content = this.parser.parseInline(token.tokens);
      return `<a href="${token.href}" ${titleAttr} ${targetAttr} class="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors duration-200">${content}</a>`;
    },

    // Blockquotes
    blockquote(token: Tokens.Blockquote): string {
      // Parse block-level tokens in blockquotes
      const content = this.parser.parse(token.tokens);
      return `<blockquote class="border-l-4 border-blue-600 dark:border-cyan-400 px-4 py-6 mb-4 italic text-gray-700 dark:text-gray-300 bg-cyan-900/10 dark:bg-cyan-900/20 rounded-r-lg [&_p]:!mt-0">${content}</blockquote>`;
    },

    // Code blocks
    code(token: Tokens.Code): string {
      return `<pre class="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-white/10 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm text-blue-700 dark:text-cyan-400 font-mono">${token.text}</code></pre>`;
    },

    // Inline code
    codespan(token: Tokens.Codespan): string {
      return `<code class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 rounded px-1.5 py-0.5 text-sm text-blue-700 dark:text-cyan-400 font-mono">${token.text}</code>`;
    },

    // Strong (bold) - FIXED: Now properly parses nested tokens
    strong(token: Tokens.Strong): string {
      const content = this.parser.parseInline(token.tokens);
      return `<strong class="font-semibold text-gray-900 dark:text-white">${content}</strong>`;
    },

    // Emphasis (italic) - FIXED: Now properly parses nested tokens
    em(token: Tokens.Em): string {
      const content = this.parser.parseInline(token.tokens);
      return `<em class="italic text-gray-800 dark:text-gray-200">${content}</em>`;
    },

    // Horizontal rule
    hr(): string {
      return `<hr class="border-t border-black/20 dark:border-white/20 my-6" />`;
    },
  },
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
});

/**
 * Parse and render markdown content with Tailwind styling
 */
export function MarkdownRenderer({
  content,
  className: _className,
}: MarkdownRendererProps): JSX.Element {
  if (!content) return <></>;

  const html = marked.parse(content) as string;

  return (
    <div
      className={cn("markdown-content", _className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

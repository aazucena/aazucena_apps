/**
 * Markdown Renderer for Analytics Dashboard
 * Ported from portfolio with engineering-focused styling
 */

import { marked } from 'marked';
import type { Tokens } from 'marked';
import type { JSX } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

marked.use({
  renderer: {
    paragraph(token: Tokens.Paragraph): string {
      const content = this.parser.parseInline(token.tokens);
      return `<p class="mb-4 text-foreground text-sm leading-relaxed last:mb-0">${content}</p>`;
    },

    heading(token: Tokens.Heading): string {
      const sizes: Record<number, string> = {
        1: 'text-2xl font-light tracking-tight mb-4 mt-6',
        2: 'text-xl font-light tracking-tight mb-3 mt-5',
        3: 'text-lg font-bold mb-2 mt-4',
        4: 'text-base font-bold mb-2 mt-3',
        5: 'text-sm font-bold mb-1 mt-2',
        6: 'text-xs font-bold mb-1 mt-2',
      };
      const size = sizes[token.depth] || sizes[6];
      const content = this.parser.parseInline(token.tokens);
      return `<h${token.depth} class="${size} text-foreground">${content}</h${token.depth}>`;
    },

    list(token: Tokens.List): string {
      const tag = token.ordered ? 'ol' : 'ul';
      const className = token.ordered
        ? 'list-decimal list-inside mb-4 space-y-1.5 text-sm'
        : 'list-disc list-inside mb-4 space-y-1.5 text-sm';

      const items = token.items
        .map((item: Tokens.ListItem) => {
          const content = this.parser.parse(item.tokens);
          return `<li class="text-foreground leading-relaxed">${content}</li>`;
        })
        .join('');

      return `<${tag} class="${className}">${items}</${tag}>`;
    },

    link(token: Tokens.Link): string {
      const isExternal = token.href?.startsWith('http');
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      const content = this.parser.parseInline(token.tokens);
      return `<a href="${token.href}" ${targetAttr} class="text-signal underline hover:no-underline">${content}</a>`;
    },

    blockquote(token: Tokens.Blockquote): string {
      const content = this.parser.parse(token.tokens);
      return `<blockquote class="border-l-2 border-signal pl-4 py-1 mb-4 text-muted-foreground bg-state [&_p]:!mt-0">${content}</blockquote>`;
    },

    code(token: Tokens.Code): string {
      return `<pre class="bg-background border border-rule rounded-card p-4 mb-4 overflow-x-auto scrollbar-thin"><code class="text-[11px] text-foreground font-mono">${token.text}</code></pre>`;
    },

    codespan(token: Tokens.Codespan): string {
      return `<code class="bg-state border border-rule rounded-control px-1.5 py-0.5 text-[11px] text-signal font-mono">${token.text}</code>`;
    },

    strong(token: Tokens.Strong): string {
      const content = this.parser.parseInline(token.tokens);
      return `<strong class="font-medium text-foreground">${content}</strong>`;
    },

    em(token: Tokens.Em): string {
      const content = this.parser.parseInline(token.tokens);
      return `<em class="italic text-foreground">${content}</em>`;
    },

    hr(): string {
      return `<hr class="border-t border-rule my-6" />`;
    },
  },
  gfm: true,
  breaks: true,
});

export function MarkdownRenderer({ content, className }: MarkdownRendererProps): JSX.Element {
  if (!content) return <></>;

  const html = marked.parse(content) as string;

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

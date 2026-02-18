'use client';

import * as React from 'react';
import { marked, type Tokens } from 'marked';
import { cn } from '@aazucena/utils';

export interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

marked.use({
  renderer: {
    paragraph(token: Tokens.Paragraph): string {
      const content = this.parser.parseInline(token.tokens);
      return `<p class="mb-4 leading-relaxed last:mb-0">${content}</p>`;
    },
    heading(token: Tokens.Heading): string {
      const sizes: Record<number, string> = {
        1: 'text-4xl md:text-5xl',
        2: 'text-3xl md:text-4xl',
        3: 'text-2xl md:text-3xl',
        4: 'text-xl md:text-2xl',
        5: 'text-lg md:text-xl',
        6: 'text-base md:text-lg',
      };
      const size = sizes[token.depth] || sizes[6];
      const id = token.text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      const content = this.parser.parseInline(token.tokens);
      return `<h${token.depth} id="${id}" class="${size} font-bold text-foreground mb-4 mt-6 scroll-mt-24">${content}</h${token.depth}>`;
    },
    list(token: Tokens.List): string {
      const tag = token.ordered ? 'ol' : 'ul';
      const className = token.ordered
        ? 'list-decimal list-inside mb-4 space-y-2 text-muted-foreground'
        : 'list-disc list-inside mb-4 space-y-2 text-muted-foreground';
      const items = token.items
        .map((item: Tokens.ListItem) => {
          const content = this.parser.parse(item.tokens);
          return `<li class="leading-relaxed">${content}</li>`;
        })
        .join('');
      return `<${tag} class="${className}">${items}</${tag}>`;
    },
    link(token: Tokens.Link): string {
      const isExternal = token.href?.startsWith('http');
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      const content = this.parser.parseInline(token.tokens);
      return `<a href="${token.href}" ${targetAttr} class="text-primary hover:underline underline-offset-4 transition-colors">${content}</a>`;
    },
    blockquote(token: Tokens.Blockquote): string {
      const content = this.parser.parse(token.tokens);
      return `<blockquote class="border-l-4 border-primary px-4 py-6 mb-4 italic text-muted-foreground bg-primary/5 rounded-r-lg [&_p]:!mt-0">${content}</blockquote>`;
    },
    code(token: Tokens.Code): string {
      return `<pre class="bg-muted border border-border rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm font-mono">${token.text}</code></pre>`;
    },
    codespan(token: Tokens.Codespan): string {
      return `<code class="bg-muted border border-border rounded px-1.5 py-0.5 text-sm font-mono">${token.text}</code>`;
    },
    strong(token: Tokens.Strong): string {
      return `<strong class="font-semibold text-foreground">${this.parser.parseInline(token.tokens)}</strong>`;
    },
    em(token: Tokens.Em): string {
      return `<em class="italic opacity-90">${this.parser.parseInline(token.tokens)}</em>`;
    },
    hr(): string {
      return `<hr class="border-t border-border my-6" />`;
    },
  },
  gfm: true,
  breaks: true,
});

const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
  ({ content, className, ...props }, ref) => {
    const html = React.useMemo(() => {
      if (!content) return '';
      return marked.parse(content) as string;
    }, [content]);

    if (!content) return null;

    return (
      <div
        ref={ref}
        className={cn('markdown-content w-full text-base', className)}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  },
);
MarkdownRenderer.displayName = 'MarkdownRenderer';

export { MarkdownRenderer };

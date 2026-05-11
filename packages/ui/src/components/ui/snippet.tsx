'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const snippetVariants = cva(
  'inline-flex items-center gap-2 rounded-lg border font-mono transition-all',
  {
    variants: {
      variant: {
        default: 'bg-muted/50 border-border text-foreground',
        glass: 'glass-m border-white/10 text-foreground',
        cyber: 'bg-black/50 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      },
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface SnippetProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof snippetVariants> {
  children: string;
  symbol?: string;
  copyable?: boolean;
  timeout?: number;
}

const Snippet = React.forwardRef<HTMLDivElement, SnippetProps>(
  (
    { className, variant, size, children, symbol = '$', copyable = true, timeout = 2000, ...props },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    };

    return (
      <div ref={ref} className={cn(snippetVariants({ variant, size }), className)} {...props}>
        {symbol && <span className="text-muted-foreground select-none">{symbol}</span>}
        <code className="flex-1 select-all">{children}</code>
        {copyable && (
          <button
            type="button"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5 transition-colors"
          >
            {copied ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  },
);
Snippet.displayName = 'Snippet';

export { Snippet, snippetVariants };

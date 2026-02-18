'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, getHighlighter } from '@aazucena/utils';
import { Check, Copy } from '@aazucena/icons';

const codeBlockVariants = cva('relative w-full overflow-hidden rounded-lg', {
  variants: {
    variant: {
      default: 'border border-border bg-muted/30',
      glass: 'glass border border-white/10 bg-white/5 backdrop-blur-md',
      cyber: 'border border-cyan-500/20 bg-black shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface CodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fileName?: string;
  copyable?: boolean;
  theme?: string;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      className,
      variant = 'default',
      code,
      language = 'typescript',
      showLineNumbers = true,
      highlightLines = [],
      fileName,
      copyable = true,
      theme,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const [copied, setCopied] = React.useState(false);
    const [highlightedCode, setHighlightedCode] = React.useState<string | null>(null);

    const defaultTheme = v === 'cyber' ? 'nord' : 'github-dark';
    const activeTheme = theme || defaultTheme;

    React.useEffect(() => {
      let isMounted = true;
      const highlight = async () => {
        try {
          const highlighter = await getHighlighter();
          const html = highlighter.codeToHtml(code, {
            lang: language,
            theme: activeTheme,
          });
          if (isMounted) setHighlightedCode(html);
        } catch (error) {
          console.error('Shiki highlighting failed:', error);
          if (isMounted) setHighlightedCode(null);
        }
      };
      highlight();
      return () => {
        isMounted = false;
      };
    }, [code, language, activeTheme]);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div ref={ref} className={cn(codeBlockVariants({ variant }), className)} {...props}>
        {/* Header */}
        {(fileName || language || copyable) && (
          <div
            className={cn(
              'flex items-center justify-between border-b px-4 py-2',
              v === 'cyber' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-border bg-muted/50',
            )}
          >
            <div className="flex items-center gap-3">
              {fileName && (
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-widest',
                    v === 'cyber' ? 'text-cyan-400' : 'text-foreground',
                  )}
                >
                  {fileName}
                </span>
              )}
              {language && (
                <span
                  className={cn(
                    'rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter',
                    v === 'cyber'
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
                      : 'border-border bg-muted text-muted-foreground',
                  )}
                >
                  {language}
                </span>
              )}
            </div>
            {copyable && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase transition-all active:scale-95',
                  v === 'cyber'
                    ? 'text-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-400'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {copied ? (
                  <>
                    <Check size={12} strokeWidth={3} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} strokeWidth={2.5} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Code Content */}
        <div className="relative group/code">
          {highlightedCode ? (
            <div
              className={cn(
                'shiki-container overflow-x-auto p-4 text-sm leading-relaxed [&>pre]:!bg-transparent [&>pre]:!m-0',
                showLineNumbers && 'line-numbers',
              )}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          ) : (
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code className="font-mono">{code}</code>
            </pre>
          )}
        </div>
      </div>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, getHighlighter } from '@aazucena/utils';
import { Check, Copy, X } from '@aazucena/icons';
import type { CodeOptionsMultipleThemes } from 'shiki';
import { motion, AnimatePresence } from 'framer-motion';

export type CodeBlockDualTheme = CodeOptionsMultipleThemes['themes'];

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

export interface CodeBlockHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  language?: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  copyError?: boolean;
  variant?: VariantProps<typeof codeBlockVariants>['variant'];
}

export const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, fileName, language, copyable, onCopy, copied, copyError, variant = 'default', children, ...props }, ref) => {
    const v = variant ?? 'default';
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between border-b px-4 py-2 rounded-lg rounded-b-none',
          v === 'cyber' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border border-border bg-muted/50',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {fileName && (
            <span
              className={cn(
                'text-[10px] font-bold tracking-widest uppercase',
                v === 'cyber' ? 'text-cyan-400' : 'text-foreground',
              )}
            >
              {fileName}
            </span>
          )}
          {language && (
            <span
              className={cn(
                'rounded-md border px-1.5 py-0.5 text-[9px] font-black tracking-tighter uppercase',
                v === 'cyber'
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
                  : 'border-border bg-muted text-muted-foreground',
              )}
            >
              {language}
            </span>
          )}
          {children}
        </div>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase transition-all active:scale-95 min-w-[64px] justify-center',
              v === 'cyber'
                ? 'text-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-400'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              copied && 'text-emerald-500',
              copyError && 'text-rose-500'
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={12} strokeWidth={3} />
                  <span>Done</span>
                </motion.div>
              ) : copyError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <X size={12} strokeWidth={3} />
                  <span>Fail</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy size={12} strokeWidth={2.5} />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    );
  }
);
CodeBlockHeader.displayName = 'CodeBlockHeader';

export interface CodeBlockProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fileName?: string;
  copyable?: boolean;
  theme?: CodeBlockDualTheme;
  header?: React.ReactNode;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      className,
      variant = 'default',
      code,
      language = 'typescript',
      showLineNumbers = true,
      highlightLines: _highlightLines = [],
      fileName,
      copyable = true,
      theme,
      header,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [highlightedCode, setHighlightedCode] = React.useState<string | null>(null);

    const getDualThemeBYVariant = (variant: VariantProps<typeof codeBlockVariants>['variant']): CodeBlockDualTheme =>  {
      switch(variant) {
        case 'cyber':
          return { light: 'nord', dark: 'nord' };
        case 'glass':
          return { light: 'slack-ochin', dark: 'slack-dark' };
        default:
          return { light: 'github-light', dark: 'github-dark' };
      }
    };

    const activeTheme = theme || getDualThemeBYVariant(variant);

    React.useEffect(() => {
      let isMounted = true;
      const highlight = async () => {
        try {
          const highlighter = await getHighlighter();
          const html = highlighter.codeToHtml(code, {
            lang: language,
            themes: activeTheme,
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
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    };

    const hasHeader = React.useMemo(() => fileName || language || copyable, [fileName, language, copyable]);

    return (
      <div ref={ref} className={cn(codeBlockVariants({ variant }), className, hasHeader && 'rounded-t-none')} {...props}>
        {/* Header */}
        {header !== undefined ? header : hasHeader && (
          <CodeBlockHeader
            fileName={fileName}
            language={language}
            copyable={copyable}
            onCopy={handleCopy}
            copied={copied}
            variant={variant}
          />
        )}

        {/* Code Content */}
        <div className="group/code relative">
          {highlightedCode ? (
            <div
              className={cn(
                'shiki-container overflow-x-auto p-4 text-sm leading-relaxed [&>pre]:!m-0 [&>pre]:!bg-transparent',
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

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const clipboardVariants = cva(
  'inline-flex items-center gap-2 rounded-md text-sm font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground border border-border',
        glass: 'glass-m text-foreground',
        cyber: 'bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 font-mono text-xs',
        minimal: 'text-muted-foreground hover:text-foreground',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface ClipboardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onCopy'>,
    VariantProps<typeof clipboardVariants> {
  value: string;
  label?: string;
  timeout?: number;
  onCopy?: (value: string) => void;
}

const Clipboard = React.forwardRef<HTMLDivElement, ClipboardProps>(
  ({ className, variant, size, value, label, timeout = 2000, onCopy, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.(value);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        // Fallback for non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        onCopy?.(value);
        setTimeout(() => setCopied(false), timeout);
      }
    };

    return (
      <div ref={ref} className={cn(clipboardVariants({ variant, size }), className)} {...props}>
        {label && <span className="truncate opacity-70">{label}</span>}
        <code className="truncate">{value}</code>
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          onClick={handleCopy}
          className={cn(
            'ml-auto shrink-0 rounded p-1 transition-colors',
            copied ? 'text-emerald-500' : 'opacity-60 hover:opacity-100',
          )}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    );
  },
);
Clipboard.displayName = 'Clipboard';

export { Clipboard, clipboardVariants };

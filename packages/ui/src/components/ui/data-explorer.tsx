'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Activity, Database } from '@aazucena/icons';
import { MarkdownRenderer } from './markdown-renderer';

const dataExplorerVariants = cva('w-full transition-all duration-300 font-mono text-xs', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground dark:text-white/90',
      cyber: 'text-cyan-600 dark:text-cyan-50/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface DataExplorerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dataExplorerVariants> {
  data: any;
  depth?: number;
  maxDepth?: number;
  initialExpanded?: boolean;
}

const DataExplorer = React.forwardRef<HTMLDivElement, DataExplorerProps>(
  (
    {
      className,
      variant,
      data,
      depth = 0,
      maxDepth = 10,
      initialExpanded: _initialExpanded = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(dataExplorerVariants({ variant }), className)} {...props}>
        <RecursiveRenderer
          data={data}
          variant={variant || 'default'}
          level={depth}
          maxDepth={maxDepth}
        />
      </div>
    );
  },
);
DataExplorer.displayName = 'DataExplorer';

/**
 * Internal Recursive Renderer
 */
const RecursiveRenderer = ({
  data,
  variant,
  level,
  keyName,
  maxDepth,
}: {
  data: any;
  variant: 'default' | 'glass' | 'cyber';
  level: number;
  keyName?: string;
  maxDepth: number;
}) => {
  if (level > maxDepth) return <span className="italic opacity-40">...Max Depth</span>;

  // 1. PRIMITIVES
  if (data === null) return <span className="text-rose-500/50 italic">null</span>;

  if (typeof data === 'boolean') {
    return (
      <span
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-bold',
          keyName === 'is_valid' && data === false
            ? 'text-foreground animate-pulse bg-rose-500'
            : keyName === 'is_valid' && data === true
              ? 'text-foreground bg-emerald-500'
              : 'text-amber-500',
        )}
      >
        {data.toString().toUpperCase()}
      </span>
    );
  }

  if (typeof data === 'number') {
    return (
      <span className={cn(variant === 'cyber' ? 'text-cyan-400' : 'text-emerald-500')}>{data}</span>
    );
  }

  if (typeof data === 'string') {
    // Specialized string logic (Markdown, Knowledge Source, Audit Discrepancies)
    const isKnowledgeSource = data.includes('[KNOWLEDGE_SOURCE]') || data.startsWith('---');
    const isMarkdown =
      keyName?.toLowerCase().includes('reasoning') ||
      keyName?.toLowerCase() === 'content' ||
      keyName?.toLowerCase() === 'thought' ||
      (level === 0 && data.length > 50) ||
      isKnowledgeSource;

    const isInvalid =
      data.toUpperCase().startsWith('INVALID') || data.toUpperCase().includes('ERROR');

    if (isMarkdown) {
      return (
        <div
          className={cn(
            'my-2 rounded-r-xl border-l-2 py-3 pl-4 transition-colors',
            isInvalid
              ? 'border-destructive/50 bg-destructive/10'
              : isKnowledgeSource
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : variant === 'cyber'
                  ? 'border-cyan-500/30 bg-cyan-500/5'
                  : 'glass bg-primary-100 border-primary/30',
            'w-full',
          )}
        >
          {isInvalid && (
            <div className="mb-2 flex items-center gap-2 text-[9px] font-black tracking-tighter text-rose-500 uppercase">
              <Activity size={12} /> Audit_Discrepancy_Detected
            </div>
          )}
          {isKnowledgeSource && (
            <div className="mb-2 flex items-center gap-2 text-[9px] font-black tracking-tighter text-emerald-500 uppercase">
              <Database size={12} /> Knowledge_Source_Signal
            </div>
          )}
          <MarkdownRenderer
            content={data}
            className={cn(
              'prose-sm prose-zinc dark:prose-invert prose-p:mb-3 last:prose-p:mb-0 text-[13px] leading-relaxed',
              isInvalid
                ? 'text-destructive dark:text-red-200'
                : isKnowledgeSource
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : 'text-zinc-950 dark:text-zinc-100',
            )}
          />
        </div>
      );
    }
    return (
      <span
        className={cn(
          'leading-relaxed break-words',
          isInvalid ? 'font-bold text-rose-500' : 'text-zinc-900/80 dark:text-white/80',
        )}
      >
        "{data}"
      </span>
    );
  }

  // 2. ARRAYS
  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="opacity-40">[]</span>;
    return (
      <div className="mt-1 flex flex-col gap-1">
        {data.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="shrink-0 text-[10px] text-current opacity-30">[{i}]</span>
            <RecursiveRenderer
              data={item}
              variant={variant}
              level={level + 1}
              maxDepth={maxDepth}
            />
          </div>
        ))}
      </div>
    );
  }

  // 3. OBJECTS
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="opacity-40">{}</span>;

    const hasFailedAudit = data['is_valid'] === false;

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5 transition-all',
          level > 0 && 'ml-1 border-l border-current/10 py-1 pl-4',
          hasFailedAudit &&
            'my-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 shadow-lg',
        )}
      >
        {hasFailedAudit && (
          <div className="mb-2 flex animate-pulse items-center gap-2 text-[10px] font-black tracking-widest text-rose-600 uppercase dark:text-rose-400">
            <Activity size={14} /> Critical_Audit_Failure
          </div>
        )}
        {keys.map((key) => (
          <div key={key} className="flex flex-col items-start sm:flex-row sm:gap-2">
            <span
              className={cn(
                'mt-0.5 shrink-0 text-[9px] font-black tracking-tighter uppercase',
                key === 'is_valid' && data[key] === false
                  ? 'text-rose-500'
                  : variant === 'cyber'
                    ? 'text-foreground0'
                    : 'text-primary',
              )}
            >
              {key}:
            </span>
            <div className="min-w-0 flex-1">
              <RecursiveRenderer
                data={data[key]}
                variant={variant}
                level={level + 1}
                keyName={key}
                maxDepth={maxDepth}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export { DataExplorer, dataExplorerVariants };

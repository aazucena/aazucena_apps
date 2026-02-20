'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const diffVariants = cva('w-full overflow-hidden rounded-lg font-mono text-sm', {
  variants: {
    variant: {
      default: 'border border-border bg-muted/20',
      glass: 'glass',
      cyber: 'border border-cyan-500/20 bg-black',
    },
  },
  defaultVariants: { variant: 'default' },
});

type DiffLine = { type: 'add' | 'remove' | 'equal'; content: string };

function computeDiff(original: string, modified: string): DiffLine[] {
  const oldLines = original.split('\n');
  const newLines = modified.split('\n');
  const result: DiffLine[] = [];
  let oi = 0;
  let ni = 0;

  while (oi < oldLines.length || ni < newLines.length) {
    if (oi < oldLines.length && ni < newLines.length && oldLines[oi] === newLines[ni]) {
      result.push({ type: 'equal', content: oldLines[oi]! });
      oi++;
      ni++;
    } else if (
      ni < newLines.length &&
      (oi >= oldLines.length || !oldLines.includes(newLines[ni]!, oi))
    ) {
      result.push({ type: 'add', content: newLines[ni]! });
      ni++;
    } else if (oi < oldLines.length) {
      result.push({ type: 'remove', content: oldLines[oi]! });
      oi++;
    }
  }
  return result;
}

export interface DiffProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof diffVariants> {
  original: string;
  modified: string;
  showLineNumbers?: boolean;
}

const Diff = React.forwardRef<HTMLDivElement, DiffProps>(
  (
    { className, variant = 'default', original, modified, showLineNumbers = true, ...props },
    ref,
  ) => {
    const v = variant ?? 'default';
    const lines = computeDiff(original, modified);
    let addNum = 0;
    let removeNum = 0;

    const lineColors: Record<string, Record<string, string>> = {
      default: {
        add: 'bg-green-500/10 text-green-700 dark:text-green-400',
        remove: 'bg-red-500/10 text-red-700 dark:text-red-400',
        equal: 'text-foreground',
      },
      glass: {
        add: 'bg-green-500/10 text-green-300',
        remove: 'bg-red-500/10 text-red-300',
        equal: 'text-foreground/80',
      },
      cyber: {
        add: 'bg-green-500/10 text-green-400',
        remove: 'bg-red-500/10 text-red-400',
        equal: 'text-cyan-50/60',
      },
    };

    const gutterColors: Record<string, string> = {
      default: 'text-muted-foreground/40',
      glass: 'text-white/20',
      cyber: 'text-cyan-500/20',
    };

    return (
      <div ref={ref} className={cn(diffVariants({ variant }), className)} {...props}>
        <pre className="overflow-x-auto p-0">
          {lines.map((line, i) => {
            if (line.type === 'add') addNum++;
            else if (line.type !== 'remove') addNum++;
            if (line.type === 'remove') removeNum++;
            else if (line.type !== 'add') removeNum++;

            const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';

            return (
              <div key={i} className={cn('flex px-4 py-0.5 leading-6', lineColors[v]?.[line.type])}>
                {showLineNumbers && (
                  <span
                    className={cn('mr-2 inline-block w-8 text-right select-none', gutterColors[v])}
                  >
                    {line.type !== 'add' ? removeNum : ''}
                  </span>
                )}
                {showLineNumbers && (
                  <span
                    className={cn('mr-4 inline-block w-8 text-right select-none', gutterColors[v])}
                  >
                    {line.type !== 'remove' ? addNum : ''}
                  </span>
                )}
                <span className="mr-2 opacity-60 select-none">{prefix}</span>
                <span className="flex-1">{line.content || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
    );
  },
);
Diff.displayName = 'Diff';

export { Diff, diffVariants };

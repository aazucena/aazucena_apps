'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Terminal } from '@aazucena/icons';

const stackTraceVariants = cva(
  'relative w-full overflow-hidden rounded-control border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        glass: 'glass border-rule bg-state text-foreground',
        cyber: 'bg-background border-signal/20 text-signal font-mono',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const frameVariants = cva('flex flex-col py-1.5 px-4 text-xs transition-colors', {
  variants: {
    isHighlighted: {
      true: '',
      false: '',
    },
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  compoundVariants: [
    {
      isHighlighted: true,
      variant: 'default',
      className: 'bg-warning/10 border-l-2 border-warning',
    },
    {
      isHighlighted: true,
      variant: 'cyber',
      className: 'bg-signal/10 border-l-2 border-signal text-signal',
    },
    {
      isHighlighted: true,
      variant: 'glass',
      className: 'bg-state border-l-2 border-rule text-foreground font-bold',
    },
  ],
  defaultVariants: {
    isHighlighted: false,
    variant: 'default',
  },
});

export interface StackFrame {
  functionName?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  isNative?: boolean;
  raw?: string;
}

export interface StackTraceProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof stackTraceVariants> {
  /** Raw stack trace string */
  trace: string;
  /** Title for the stack trace window */
  title?: string;
  /** Index of the frame to highlight */
  highlightFrame?: number;
  /** Optional language for display context */
  language?: string;
}

// --- Utils ---

/**
 * Basic parser for stack traces.
 * Supports V8 (Chrome/Node) and simple file:line:col formats.
 */
const parseStackTrace = (trace: string): StackFrame[] => {
  const frames: StackFrame[] = [];
  const lines = trace.split('\n');

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('Error:')) return;

    // Pattern: at functionName (path/to/file.js:10:5)
    const v8FullMatch = line.match(/^at\s+(.+)\s+\((.+):(\d+):(\d+)\)$/);
    // Pattern: at path/to/file.js:10:5
    const v8PathOnlyMatch = line.match(/^at\s+(.+):(\d+):(\d+)$/);
    // Pattern: path/to/file.js:10:5
    const simpleMatch = line.match(/^(.+):(\d+):(\d+)$/);
    // Pattern: at functionName (<anonymous>)
    const anonymousMatch = line.match(/^at\s+(.+)\s+\(<anonymous>\)$/);

    if (v8FullMatch) {
      frames.push({
        functionName: v8FullMatch[1],
        fileName: v8FullMatch[2],
        lineNumber: parseInt(v8FullMatch[3]!),
        columnNumber: parseInt(v8FullMatch[4]!),
        raw: line,
      });
    } else if (v8PathOnlyMatch) {
      frames.push({
        fileName: v8PathOnlyMatch[1],
        lineNumber: parseInt(v8PathOnlyMatch[2]!),
        columnNumber: parseInt(v8PathOnlyMatch[3]!),
        raw: line,
      });
    } else if (simpleMatch) {
      frames.push({
        fileName: simpleMatch[1],
        lineNumber: parseInt(simpleMatch[2]!),
        columnNumber: parseInt(simpleMatch[3]!),
        raw: line,
      });
    } else if (anonymousMatch) {
      frames.push({
        functionName: anonymousMatch[1],
        isNative: true,
        raw: line,
      });
    } else {
      frames.push({ raw: line });
    }
  });

  return frames;
};

// --- Component ---

/**
 * A specialized component for displaying and parsing stack traces.
 * Features customizable themes (default, glass, cyber) and frame highlighting.
 */
const StackTrace = React.forwardRef<HTMLDivElement, StackTraceProps>(
  (
    { className, variant = 'default', trace, title = 'Stack Trace', highlightFrame, ...props },
    ref,
  ) => {
    const frames = React.useMemo(() => parseStackTrace(trace), [trace]);

    return (
      <div ref={ref} className={cn(stackTraceVariants({ variant }), className)} {...props}>
        {/* Header */}
        <div
          className={cn(
            'flex items-center gap-2 border-b px-4 py-2 text-[10px] font-bold tracking-widest uppercase',
            variant === 'cyber'
              ? 'border-signal/20 bg-signal/5 text-signal'
              : 'border-border bg-muted/50 text-muted-foreground',
            variant === 'glass' && 'border-rule bg-state text-foreground',
          )}
        >
          <Terminal size={14} />
          <span>{title}</span>
          <div className="ml-auto flex gap-1.5 opacity-50">
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-auto py-2">
          {frames.length === 0 ? (
            <div className="p-4 text-center text-xs italic opacity-50">No frames detected</div>
          ) : (
            frames.map((frame, index) => (
              <div
                key={index}
                className={cn(frameVariants({ isHighlighted: index === highlightFrame, variant }))}
              >
                <div className="flex items-baseline gap-2">
                  <span className="w-4 text-right opacity-40 select-none">{index}</span>
                  <span
                    className={cn(
                      'font-medium',
                      variant === 'cyber' ? 'text-signal' : 'text-foreground',
                      variant === 'glass' && 'text-foreground',
                    )}
                  >
                    {frame.functionName || (frame.fileName ? '<anonymous>' : '')}
                  </span>
                  {frame.isNative && (
                    <span className="text-[10px] italic opacity-40">[native]</span>
                  )}
                </div>
                {frame.fileName && (
                  <div className="mt-0.5 ml-6 flex items-center gap-1 text-[10px] opacity-60">
                    <span className="max-w-[300px] truncate">{frame.fileName}</span>
                    {frame.lineNumber !== undefined && (
                      <span
                        className={cn(
                          'bg-muted rounded px-1 py-0.5 font-bold',
                          variant === 'cyber' && 'bg-signal/20 text-signal',
                          variant === 'glass' && 'bg-panel-raised text-foreground',
                        )}
                      >
                        {frame.lineNumber}:{frame.columnNumber}
                      </span>
                    )}
                  </div>
                )}
                {!frame.functionName && !frame.fileName && frame.raw && (
                  <div className="ml-6 italic opacity-60">{frame.raw}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex justify-between border-t px-4 py-1.5 font-mono text-[8px] opacity-30',
            variant === 'cyber' ? 'border-signal/20' : 'border-border',
          )}
        >
          <span>FRAMES: {frames.length}</span>
          <span>DEBUG_MODE: ACTIVE</span>
        </div>
      </div>
    );
  },
);
StackTrace.displayName = 'StackTrace';

export { StackTrace, stackTraceVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Terminal } from '@aazucena/icons';

const stackTraceVariants = cva(
  'relative w-full overflow-hidden rounded-lg border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        glass: 'glass border-white/10 bg-white/5 backdrop-blur-md text-white',
        cyber:
          'bg-black border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-cyan-400 font-mono',
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
      className: 'bg-yellow-500/10 border-l-2 border-yellow-500',
    },
    {
      isHighlighted: true,
      variant: 'cyber',
      className: 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-300',
    },
    {
      isHighlighted: true,
      variant: 'glass',
      className: 'bg-white/10 border-l-2 border-white text-white font-bold',
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
              ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400'
              : 'border-border bg-muted/50 text-muted-foreground',
            variant === 'glass' && 'border-white/10 bg-white/10 text-white',
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
                      variant === 'cyber' ? 'text-cyan-300' : 'text-foreground',
                      variant === 'glass' && 'text-white',
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
                          variant === 'cyber' && 'bg-cyan-500/20 text-cyan-400',
                          variant === 'glass' && 'bg-white/20 text-white',
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
            variant === 'cyber' ? 'border-cyan-500/20' : 'border-border',
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

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Terminal as TerminalIcon, Copy, Check } from '@aazucena/icons';

const terminalVariants = cva(
  'w-full flex flex-col rounded-card border overflow-hidden transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'bg-muted border-border text-foreground',
        cyber:
          'glass bg-signal-faint border-signal/30 text-foreground dark:bg-background dark:text-signal',
        glass: 'glass text-foreground',
      },
    },
    defaultVariants: {
      variant: 'cyber',
    },
  },
);

const Terminal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof terminalVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(terminalVariants({ variant }), className)} {...props} />
));
Terminal.displayName = 'Terminal';

const TerminalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showButtons?: boolean }
>(({ className, showButtons = true, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-b border-current/10 bg-current/5 px-4 py-3',
      className,
    )}
    {...props}
  >
    <div className="flex items-center gap-3">
      {showButtons && (
        <div className="flex gap-1.5">
          <div className="bg-alert/50 h-2.5 w-2.5 rounded-full" />
          <div className="bg-warning/50 h-2.5 w-2.5 rounded-full" />
          <div className="bg-success/50 h-2.5 w-2.5 rounded-full" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <TerminalIcon size={14} className="opacity-40" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
          {children || 'System_Terminal'}
        </span>
      </div>
    </div>
  </div>
));
TerminalHeader.displayName = 'TerminalHeader';

const TerminalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'custom-scrollbar overflow-auto p-4 font-mono text-[11px] leading-relaxed',
        className,
      )}
      {...props}
    />
  ),
);
TerminalBody.displayName = 'TerminalBody';

const TerminalLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { number?: number }
>(({ className, number, children, ...props }, ref) => (
  <div ref={ref} className={cn('group flex gap-4', className)} {...props}>
    {number !== undefined && (
      <span className="w-4 shrink-0 text-right opacity-20 select-none">{number}</span>
    )}
    <div className="flex-1 whitespace-pre-wrap">{children}</div>
  </div>
));
TerminalLine.displayName = 'TerminalLine';

const TerminalAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex items-center gap-1.5 rounded bg-current/5 px-2 py-1 text-[9px] font-black tracking-widest uppercase transition-colors hover:bg-current/10',
      className,
    )}
    {...props}
  >
    {active ? <Check size={10} /> : <Copy size={10} />}
    {children || (active ? 'Copied' : 'Copy')}
  </button>
));
TerminalAction.displayName = 'TerminalAction';

export { Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalAction, terminalVariants };

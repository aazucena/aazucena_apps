import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StateNoteProps {
  /** `empty` is quiet muted text; `fault` is a failed fetch: coral, with the ▲ marker, announced to screen readers. */
  kind: 'empty' | 'fault';
  children: ReactNode;
}

/** One note for a panel that has nothing to show, or whose data failed to load. */
export function StateNote({ kind, children }: StateNoteProps) {
  const fault = kind === 'fault';
  return (
    <p
      role={fault ? 'alert' : undefined}
      className={cn('micro-label p-6 text-center', fault ? 'text-alert' : 'text-muted-foreground')}
    >
      {fault && <span aria-hidden>▲ </span>}
      {children}
    </p>
  );
}

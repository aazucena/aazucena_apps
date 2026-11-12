import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Panel: the instrument surface of Avra 0.2. Flat panel tone, 6px radius, no shadow.
 * The framed header strip carries a micro-caps label and a status indicator.
 * Coral is reserved for `status="alert"` and always ships with a ▲ marker.
 */
export type PanelStatus = 'idle' | 'live' | 'alert';

const panelVariants = cva('flex flex-col rounded-card text-card-foreground', {
  variants: {
    variant: {
      default: 'bg-panel',
      glass: 'glass',
      cyber: 'border border-signal/40 bg-panel shadow-[inset_0_0_12px_var(--signal-faint)]',
    },
    status: {
      idle: '',
      live: '',
      alert: 'border-l-2 border-l-alert',
    },
  },
  defaultVariants: { variant: 'default', status: 'live' },
});

const statusCopy: Record<PanelStatus, { text: string; tone: string; dot: string }> = {
  idle: { text: 'IDLE', tone: 'text-muted-foreground', dot: 'bg-rule-strong' },
  live: { text: 'LIVE', tone: 'text-signal', dot: 'bg-signal motion-safe:animate-pulse' },
  alert: { text: '▲ ALERT', tone: 'text-alert', dot: 'bg-alert' },
};

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Micro-caps label in the copy voice, e.g. `TRAFFIC // 30D`. */
  label: string;
  status?: PanelStatus;
}

const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ className, label, status = 'live', children, ...props }, ref) => {
    const s = statusCopy[status];
    return (
      <div
        ref={ref}
        data-slot="panel-header"
        className={cn(
          'h-panel-header border-rule px-panel flex items-center justify-between gap-3 border-b',
          className,
        )}
        {...props}
      >
        <span className="micro-label text-muted-foreground truncate">{label}</span>
        {children ?? (
          <span className={cn('micro-label flex items-center gap-1.5', s.tone)}>
            <span aria-hidden className={cn('size-1.5 rounded-full', s.dot)} />
            {s.text}
          </span>
        )}
      </div>
    );
  },
);
PanelHeader.displayName = 'PanelHeader';

const PanelBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="panel-body"
      className={cn('p-panel flex flex-col gap-2', className)}
      {...props}
    />
  ),
);
PanelBody.displayName = 'PanelBody';

export interface PanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof panelVariants> {
  /** When set, renders a `PanelHeader` and wraps children in a `PanelBody`. */
  label?: string;
  status?: PanelStatus;
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, status = 'live', label, children, ...props }, ref) => (
    <div
      ref={ref}
      role={label ? 'region' : undefined}
      data-slot="panel"
      data-status={status}
      aria-label={label}
      className={cn(panelVariants({ variant, status }), className)}
      {...props}
    >
      {label ? (
        <>
          <PanelHeader label={label} status={status} />
          <PanelBody>{children}</PanelBody>
        </>
      ) : (
        children
      )}
    </div>
  ),
);
Panel.displayName = 'Panel';

export { Panel, PanelHeader, PanelBody, panelVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const orgChartVariants = cva('w-full overflow-auto transition-all', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

const nodeCardStyles: Record<string, string> = {
  default: 'border-border bg-background hover:bg-accent',
  glass: 'glass border-rule hover:border-rule',
  cyber: 'border-signal/30 bg-scrim hover:bg-signal/10',
};

const lineColor: Record<string, string> = {
  default: 'bg-border',
  glass: 'bg-panel-raised',
  cyber: 'bg-signal/30',
};

export interface OrgNode {
  id: string;
  label: string;
  title?: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface OrgChartProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof orgChartVariants> {
  data: OrgNode;
  onNodeClick?: (node: OrgNode) => void;
  horizontal?: boolean;
}

function OrgNodeComponent({
  node,
  variant,
  horizontal,
  onNodeClick,
}: {
  node: OrgNode;
  variant: string;
  horizontal: boolean;
  onNodeClick?: (node: OrgNode) => void;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const initials = node.label
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn('flex', horizontal ? 'flex-row items-center' : 'flex-col items-center')}>
      <div className="relative flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            onNodeClick?.(node);
            if (hasChildren) setCollapsed(!collapsed);
          }}
          className={cn(
            'rounded-control flex items-center gap-2 border px-3 py-2 transition-all',
            nodeCardStyles[variant],
          )}
        >
          {node.avatar ? (
            <img
              src={node.avatar}
              alt={node.label}
              className={cn(
                'size-8 rounded-full object-cover',
                variant === 'cyber' && 'border-signal/50 border',
              )}
            />
          ) : (
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-medium',
                variant === 'cyber' ? 'bg-signal/20 text-signal' : 'bg-muted text-muted-foreground',
              )}
            >
              {initials}
            </div>
          )}
          <div className="text-left">
            <div
              className={cn(
                'text-sm leading-tight font-medium',
                variant === 'cyber' && 'text-signal',
              )}
            >
              {node.label}
            </div>
            {node.title && (
              <div
                className={cn(
                  'text-xs leading-tight',
                  variant === 'cyber' ? 'text-signal/60' : 'text-muted-foreground',
                )}
              >
                {node.title}
              </div>
            )}
          </div>
          {hasChildren && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                'shrink-0 transition-transform',
                collapsed && (horizontal ? '-rotate-90' : 'rotate-180'),
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </button>
      </div>

      {hasChildren && !collapsed && (
        <>
          {/* Connector line from parent */}
          <div className={cn(lineColor[variant], horizontal ? 'h-px w-6' : 'h-6 w-px')} />

          {/* Children container */}
          <div className={cn('relative flex gap-0', horizontal ? 'flex-col' : 'flex-row')}>
            {/* Horizontal connector across children */}
            {node.children!.length > 1 && (
              <div
                className={cn(
                  'absolute',
                  lineColor[variant],
                  horizontal ? 'top-0 bottom-0 left-0 w-px' : 'top-0 right-0 left-0 h-px',
                )}
                style={
                  horizontal
                    ? {
                        top: `${100 / (node.children!.length * 2)}%`,
                        bottom: `${100 / (node.children!.length * 2)}%`,
                      }
                    : {
                        left: `${100 / (node.children!.length * 2)}%`,
                        right: `${100 / (node.children!.length * 2)}%`,
                      }
                }
              />
            )}

            {node.children!.map((child) => (
              <div
                key={child.id}
                className={cn(
                  'flex',
                  horizontal ? 'flex-row items-center' : 'flex-col items-center',
                )}
              >
                <div className={cn(lineColor[variant], horizontal ? 'h-px w-6' : 'h-6 w-px')} />
                <OrgNodeComponent
                  node={child}
                  variant={variant}
                  horizontal={horizontal}
                  onNodeClick={onNodeClick}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const OrgChart = React.forwardRef<HTMLDivElement, OrgChartProps>(
  ({ className, variant = 'default', data, onNodeClick, horizontal = false, ...props }, ref) => {
    const v = variant ?? 'default';

    return (
      <div ref={ref} className={cn(orgChartVariants({ variant }), className)} {...props}>
        <div className={cn('inline-flex', horizontal ? 'flex-row' : 'flex-col items-center')}>
          <OrgNodeComponent
            node={data}
            variant={v}
            horizontal={horizontal}
            onNodeClick={onNodeClick}
          />
        </div>
      </div>
    );
  },
);
OrgChart.displayName = 'OrgChart';

export { OrgChart, orgChartVariants };
export type { OrgNode as OrgChartNode };

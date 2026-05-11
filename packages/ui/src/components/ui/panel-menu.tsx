'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const panelMenuVariants = cva('w-full rounded-lg border transition-all', {
  variants: {
    variant: {
      default: 'border-border bg-background',
      glass: 'glass-m border-white/10',
      cyber: 'border-cyan-500/30 bg-black/50 font-mono shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface PanelMenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: PanelMenuItem[];
}

export interface PanelMenuProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelMenuVariants> {
  items: PanelMenuItem[];
}

function PanelMenuItemComponent({
  item,
  depth,
  variant,
}: {
  item: PanelMenuItem;
  depth: number;
  variant: string;
}) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const content = (
    <button
      type="button"
      onClick={() => (hasChildren ? setOpen(!open) : undefined)}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
        variant === 'cyber' ? 'text-cyan-50 hover:bg-cyan-500/10' : 'hover:bg-accent',
      )}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
    >
      {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
      <span className="flex-1 truncate text-left">{item.label}</span>
      {hasChildren && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn('shrink-0 transition-transform duration-200', open && 'rotate-90')}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </button>
  );

  if (item.href && !hasChildren) {
    return (
      <a href={item.href} className="block">
        {content}
      </a>
    );
  }

  return (
    <div>
      {content}
      {hasChildren && open && (
        <div
          className={cn(
            'border-t',
            variant === 'cyber' ? 'border-cyan-500/10' : 'border-border/50',
          )}
        >
          {item.children!.map((child) => (
            <PanelMenuItemComponent
              key={child.label}
              item={child}
              depth={depth + 1}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const PanelMenu = React.forwardRef<HTMLDivElement, PanelMenuProps>(
  ({ className, variant = 'default', items, ...props }, ref) => {
    const v = variant ?? 'default';

    return (
      <div ref={ref} className={cn(panelMenuVariants({ variant }), className)} {...props}>
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              i > 0 && 'border-t',
              v === 'cyber' ? 'border-cyan-500/20' : 'border-border',
            )}
          >
            <PanelMenuItemComponent item={item} depth={0} variant={v} />
          </div>
        ))}
      </div>
    );
  },
);
PanelMenu.displayName = 'PanelMenu';

export { PanelMenu, panelMenuVariants };

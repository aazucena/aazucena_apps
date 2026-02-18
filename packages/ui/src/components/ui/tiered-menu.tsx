'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const tieredMenuVariants = cva('relative inline-block', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface TieredMenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  command?: string;
  separator?: boolean;
  disabled?: boolean;
  children?: TieredMenuItem[];
}

export interface TieredMenuProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tieredMenuVariants> {
  items: TieredMenuItem[];
  trigger?: React.ReactNode;
}

function TieredMenuPanel({
  items,
  variant,
  depth,
}: {
  items: TieredMenuItem[];
  variant: string;
  depth: number;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        'min-w-[12rem] rounded-md border p-1 shadow-lg',
        variant === 'cyber'
          ? 'border-cyan-500/30 bg-black/95 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          : variant === 'glass'
            ? 'glass border-white/10'
            : 'border-border bg-popover',
        depth > 0 && 'absolute top-0 left-full ml-1',
      )}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={`sep-${index}`}
              className={cn('my-1 h-px', variant === 'cyber' ? 'bg-cyan-500/20' : 'bg-border')}
            />
          );
        }

        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <a
              href={item.href ?? '#'}
              onClick={(e) => {
                if (!item.href) e.preventDefault();
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                item.disabled && 'pointer-events-none opacity-50',
                activeIndex === index
                  ? variant === 'cyber'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-accent text-accent-foreground'
                  : variant === 'cyber'
                    ? 'text-cyan-50'
                    : '',
              )}
            >
              {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.command && (
                <span
                  className={cn(
                    'ml-auto text-xs',
                    variant === 'cyber' ? 'text-cyan-400/50' : 'text-muted-foreground',
                  )}
                >
                  {item.command}
                </span>
              )}
              {hasChildren && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </a>
            {hasChildren && activeIndex === index && (
              <TieredMenuPanel items={item.children!} variant={variant} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const TieredMenu = React.forwardRef<HTMLDivElement, TieredMenuProps>(
  ({ className, variant = 'default', items, trigger, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const v = variant ?? 'default';

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      if (open) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(tieredMenuVariants({ variant }), className)}
        {...props}
      >
        <div onClick={() => setOpen(!open)}>
          {trigger ?? children ?? (
            <button
              type="button"
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition-colors',
                v === 'cyber'
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                  : 'border-border hover:bg-accent',
              )}
            >
              Menu
            </button>
          )}
        </div>
        {open && (
          <div className="absolute z-50 mt-1">
            <TieredMenuPanel items={items} variant={v} depth={0} />
          </div>
        )}
      </div>
    );
  },
);
TieredMenu.displayName = 'TieredMenu';

export { TieredMenu, tieredMenuVariants };

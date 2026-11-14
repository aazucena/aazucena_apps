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

const menuItems = (panel: HTMLElement | null) =>
  panel
    ? Array.from(
        panel.querySelectorAll<HTMLElement>(
          ':scope > div > [role="menuitem"]:not([aria-disabled="true"])',
        ),
      )
    : [];

/**
 * One level of the menu (WAI-ARIA APG menu pattern). Arrow Up/Down, Home and
 * End move between items; Arrow Right, Enter or Space open a submenu and Arrow
 * Left or Escape close it and return focus to its parent item.
 */
function TieredMenuPanel({
  items,
  variant,
  depth,
  label,
  onClose,
}: {
  items: TieredMenuItem[];
  variant: string;
  depth: number;
  label?: string;
  /** Closes this panel. `all` closes the whole menu (Escape at the top level, Tab). */
  onClose: (all?: boolean) => void;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // A panel that opens takes focus, so the arrow keys work straight away.
  React.useEffect(() => {
    menuItems(panelRef.current)[0]?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = menuItems(panelRef.current);
    const current = list.indexOf(document.activeElement as HTMLElement);
    if (current === -1) return; // focus is in a submenu, which handles its own keys
    const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        focusAt(current + 1);
        break;
      case 'ArrowUp':
        focusAt(current - 1);
        break;
      case 'Home':
        focusAt(0);
        break;
      case 'End':
        focusAt(list.length - 1);
        break;
      case 'ArrowRight':
      case 'Enter':
      case ' ': {
        const index = Number(list[current]!.dataset.index);
        if (!items[index]?.children?.length) {
          if (e.key === 'ArrowRight') break;
          return; // Enter and Space activate a leaf item natively
        }
        setActiveIndex(index);
        break;
      }
      case 'ArrowLeft':
        if (depth === 0) return;
        onClose();
        break;
      case 'Escape':
        onClose(depth === 0);
        break;
      case 'Tab':
        onClose(true);
        return;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label={label}
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-control min-w-[12rem] border p-1',
        variant === 'cyber'
          ? 'border-signal/30 bg-panel'
          : variant === 'glass'
            ? 'glass border-rule'
            : 'border-border bg-popover',
        depth > 0 && 'absolute top-0 left-full ml-1',
      )}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={`sep-${index}`}
              role="separator"
              className={cn('my-1 h-px', variant === 'cyber' ? 'bg-signal/20' : 'bg-border')}
            />
          );
        }

        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.label}
            className="relative"
            role="none"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <a
              href={item.href ?? '#'}
              role="menuitem"
              tabIndex={-1}
              data-index={index}
              aria-disabled={item.disabled || undefined}
              aria-haspopup={hasChildren ? 'menu' : undefined}
              aria-expanded={hasChildren ? activeIndex === index : undefined}
              onClick={(e) => {
                if (!item.href) e.preventDefault();
                if (hasChildren) setActiveIndex(index);
              }}
              className={cn(
                'focus-visible:bg-state focus-visible:outline-signal flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-solid',
                item.disabled && 'pointer-events-none opacity-50',
                activeIndex === index
                  ? variant === 'cyber'
                    ? 'bg-signal/10 text-signal'
                    : 'bg-accent text-accent-foreground'
                  : variant === 'cyber'
                    ? 'text-signal'
                    : '',
              )}
            >
              {item.icon && (
                <span aria-hidden="true" className="shrink-0 [&_svg]:size-4">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.command && (
                <span
                  className={cn(
                    'ml-auto text-xs',
                    variant === 'cyber' ? 'text-muted-foreground' : 'text-muted-foreground',
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
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </a>
            {hasChildren && activeIndex === index && (
              <TieredMenuPanel
                items={item.children!}
                variant={variant}
                depth={depth + 1}
                label={item.label}
                onClose={(all) => {
                  if (all) return onClose(true);
                  setActiveIndex(null);
                  panelRef.current
                    ?.querySelector<HTMLElement>(`:scope > div > [data-index="${index}"]`)
                    ?.focus();
                }}
              />
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
    const triggerRef = React.useRef<HTMLDivElement>(null);
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
        <div ref={triggerRef} onClick={() => setOpen(!open)}>
          {trigger ?? children ?? (
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              className={cn(
                'rounded-control border px-3 py-1.5 text-sm transition-colors',
                v === 'cyber'
                  ? 'border-signal/30 text-signal hover:bg-signal/10'
                  : 'border-border hover:bg-state',
              )}
            >
              Menu
            </button>
          )}
        </div>
        {open && (
          <div className="absolute z-(--z-dropdown) mt-1">
            <TieredMenuPanel
              items={items}
              variant={v}
              depth={0}
              onClose={() => {
                setOpen(false);
                triggerRef.current
                  ?.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
                  ?.focus();
              }}
            />
          </div>
        )}
      </div>
    );
  },
);
TieredMenu.displayName = 'TieredMenu';

export { TieredMenu, tieredMenuVariants };

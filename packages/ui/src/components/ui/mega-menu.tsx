'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const megaMenuVariants = cva('relative', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface MegaMenuLink {
  label: string;
  href?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface MegaMenuItem {
  label: string;
  href?: string;
  children?: MegaMenuLink[];
  columns?: number;
}

export interface MegaMenuProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof megaMenuVariants> {
  items: MegaMenuItem[];
}

const Chevron = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const focusRing =
  'focus-visible:outline-signal focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid';

/**
 * Disclosure navigation (WAI-ARIA APG): an item with children is a button that
 * shows its panel on hover, click, Enter or Space. Arrow Down moves into the
 * panel, Escape closes it and returns focus, and tabbing away closes it. A
 * parent that also has an `href` stays a link and gets a separate toggle button.
 */
const MegaMenu = React.forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ className, variant = 'default', items, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const enterPanel = React.useRef(false);
    const baseId = React.useId();
    const v = variant ?? 'default';

    React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

    const handleEnter = (index: number) => {
      clearTimeout(timeoutRef.current);
      setActiveIndex(index);
    };

    const handleLeave = () => {
      timeoutRef.current = setTimeout(() => setActiveIndex(null), 150);
    };

    const toggleFor = (index: number) =>
      rootRef.current?.querySelector<HTMLElement>(`[data-mega-toggle="${index}"]`);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && activeIndex !== null) {
        e.preventDefault();
        toggleFor(activeIndex)?.focus();
        setActiveIndex(null);
      }
    };

    const handleToggleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      enterPanel.current = true;
      if (activeIndex === index) focusFirstLink(index);
      else setActiveIndex(index);
    };

    const focusFirstLink = (index: number) => {
      enterPanel.current = false;
      rootRef.current?.querySelector<HTMLElement>(`[id="${baseId}-panel-${index}"] a`)?.focus();
    };

    // Arrow Down on a closed item opens the panel first; focus moves in once it exists.
    React.useEffect(() => {
      if (enterPanel.current && activeIndex !== null) focusFirstLink(activeIndex);
    });

    const itemClass = (index: number) =>
      cn(
        'rounded-control inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
        focusRing,
        activeIndex === index
          ? v === 'cyber'
            ? 'bg-signal/20 text-signal'
            : 'bg-accent text-accent-foreground'
          : v === 'cyber'
            ? 'text-signal hover:bg-signal/10'
            : 'text-foreground hover:bg-state',
      );

    const panelClass = cn(
      'rounded-control absolute top-full left-0 z-(--z-dropdown) mt-1 w-full min-w-[32rem] border p-4',
      v === 'cyber'
        ? 'border-signal/30 bg-panel'
        : v === 'glass'
          ? 'glass border-rule'
          : 'border-border bg-popover',
    );

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(megaMenuVariants({ variant }), className)}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActiveIndex(null);
        }}
        {...props}
      >
        <nav
          className={cn(
            'rounded-control flex items-center gap-1 border px-2 py-1',
            v === 'cyber'
              ? 'border-signal/30 bg-panel'
              : v === 'glass'
                ? 'glass border-rule'
                : 'border-border bg-background',
          )}
        >
          {items.map((item, index) => {
            const hasChildren = !!item.children?.length;
            const open = activeIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const toggleProps = {
              type: 'button' as const,
              'aria-expanded': open,
              'aria-controls': open ? panelId : undefined,
              'data-mega-toggle': index,
              onClick: () => setActiveIndex(open ? null : index),
              onKeyDown: handleToggleKeyDown(index),
            };

            return (
              <div
                key={item.label}
                className="flex items-center"
                onMouseEnter={() => (hasChildren ? handleEnter(index) : undefined)}
                onMouseLeave={handleLeave}
              >
                {!hasChildren ? (
                  <a href={item.href ?? '#'} className={itemClass(index)}>
                    {item.label}
                  </a>
                ) : item.href ? (
                  <>
                    <a href={item.href} className={itemClass(index)}>
                      {item.label}
                    </a>
                    <button
                      {...toggleProps}
                      aria-label={`${item.label} submenu`}
                      className={cn(itemClass(index), 'min-h-6 min-w-6 justify-center px-1.5')}
                    >
                      <Chevron />
                    </button>
                  </>
                ) : (
                  <button {...toggleProps} className={itemClass(index)}>
                    {item.label}
                    <Chevron />
                  </button>
                )}

                {hasChildren && open && (
                  <div
                    id={panelId}
                    onMouseEnter={() => clearTimeout(timeoutRef.current)}
                    className={panelClass}
                  >
                    <ul
                      className="grid gap-3"
                      aria-label={item.label}
                      style={{
                        gridTemplateColumns: `repeat(${item.columns ?? Math.min(item.children!.length, 3)}, 1fr)`,
                      }}
                    >
                      {item.children!.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href ?? '#'}
                            className={cn(
                              'group rounded-control flex items-start gap-3 p-3 transition-colors',
                              focusRing,
                              v === 'cyber' ? 'hover:bg-signal/10' : 'hover:bg-state',
                            )}
                          >
                            {link.icon && (
                              <span
                                aria-hidden="true"
                                className={cn(
                                  'mt-0.5 shrink-0 [&_svg]:size-5',
                                  v === 'cyber'
                                    ? 'text-signal'
                                    : 'text-muted-foreground group-hover:text-foreground',
                                )}
                              >
                                {link.icon}
                              </span>
                            )}
                            <span className="block">
                              <span
                                className={cn(
                                  'block text-sm font-medium',
                                  v === 'cyber' ? 'text-signal' : '',
                                )}
                              >
                                {link.label}
                              </span>
                              {link.description && (
                                <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                                  {link.description}
                                </span>
                              )}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    );
  },
);
MegaMenu.displayName = 'MegaMenu';

export { MegaMenu, megaMenuVariants };

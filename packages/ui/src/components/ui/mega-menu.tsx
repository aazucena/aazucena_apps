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

const MegaMenu = React.forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ className, variant = 'default', items, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const v = variant ?? 'default';

    const handleEnter = (index: number) => {
      clearTimeout(timeoutRef.current);
      setActiveIndex(index);
    };

    const handleLeave = () => {
      timeoutRef.current = setTimeout(() => setActiveIndex(null), 150);
    };

    return (
      <div ref={ref} className={cn(megaMenuVariants({ variant }), className)} {...props}>
        <nav
          className={cn(
            'rounded-control flex items-center gap-1 border px-2 py-1',
            v === 'cyber'
              ? 'border-signal/30 bg-scrim'
              : v === 'glass'
                ? 'glass border-rule'
                : 'border-border bg-background',
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => (item.children?.length ? handleEnter(index) : undefined)}
              onMouseLeave={handleLeave}
            >
              <a
                href={item.href ?? '#'}
                className={cn(
                  'rounded-control inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
                  activeIndex === index
                    ? v === 'cyber'
                      ? 'bg-signal/20 text-signal'
                      : 'bg-accent text-accent-foreground'
                    : v === 'cyber'
                      ? 'text-signal hover:bg-signal/10'
                      : 'text-foreground hover:bg-accent',
                )}
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
              </a>
            </div>
          ))}
        </nav>

        {activeIndex !== null &&
          items[activeIndex]?.children &&
          items[activeIndex]!.children!.length > 0 && (
            <div
              onMouseEnter={() => clearTimeout(timeoutRef.current)}
              onMouseLeave={handleLeave}
              className={cn(
                'rounded-control absolute left-0 z-50 mt-1 w-full min-w-[32rem] border p-4',
                v === 'cyber'
                  ? 'border-signal/30 bg-scrim'
                  : v === 'glass'
                    ? 'glass border-rule'
                    : 'border-border bg-popover',
              )}
            >
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${items[activeIndex]!.columns ?? Math.min(items[activeIndex]!.children!.length, 3)}, 1fr)`,
                }}
              >
                {items[activeIndex]!.children!.map((link) => (
                  <a
                    key={link.label}
                    href={link.href ?? '#'}
                    className={cn(
                      'group rounded-control flex items-start gap-3 p-3 transition-colors',
                      v === 'cyber' ? 'hover:bg-signal/10' : 'hover:bg-accent',
                    )}
                  >
                    {link.icon && (
                      <span
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
                    <div>
                      <div
                        className={cn('text-sm font-medium', v === 'cyber' ? 'text-signal' : '')}
                      >
                        {link.label}
                      </div>
                      {link.description && (
                        <p
                          className={cn(
                            'mt-0.5 text-xs leading-relaxed',
                            v === 'cyber' ? 'text-signal/60' : 'text-muted-foreground',
                          )}
                        >
                          {link.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  },
);
MegaMenu.displayName = 'MegaMenu';

export { MegaMenu, megaMenuVariants };

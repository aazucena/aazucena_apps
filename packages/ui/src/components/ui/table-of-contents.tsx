'use client';

import { List } from '@aazucena/icons';
import { cn, toTitleCase } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const tocVariants = cva('fixed z-40 hidden xl:block transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border border-border shadow-sm rounded-2xl p-4',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 text-foreground rounded-2xl p-4 shadow-xl',
      cyber:
        'bg-background/80 dark:bg-black/80 border border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-2xl p-4',
    },
    position: {
      'top-right': 'top-32 right-8 w-56',
      'top-left': 'top-32 left-8 w-56',
    },
  },
  defaultVariants: {
    variant: 'glass',
    position: 'top-right',
  },
});

const tocItemVariants = cva(
  'block w-full break-words rounded-xl px-3 py-1.5 text-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        glass: 'text-foreground/60 hover:bg-white/10 hover:text-white',
        cyber:
          'text-foreground/60 hover:bg-cyan-500/10 hover:text-cyan-400 font-black uppercase tracking-widest italic text-[10px]',
      },
      isActive: {
        true: '',
        false: '',
      },
      isNested: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        isActive: true,
        isNested: false,
        className: 'bg-primary text-primary-foreground shadow-lg font-bold',
      },
      {
        variant: 'glass',
        isActive: true,
        isNested: false,
        className: 'bg-white/20 text-foreground font-bold shadow-lg',
      },
      {
        variant: 'cyber',
        isActive: true,
        isNested: false,
        className: 'bg-cyan-500/20 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      },
      {
        variant: 'default',
        isActive: true,
        isNested: true,
        className: 'bg-primary/30 text-primary-foreground font-semibold',
      },
      {
        variant: 'glass',
        isActive: true,
        isNested: true,
        className: 'bg-white/10 text-foreground font-semibold',
      },
      {
        variant: 'cyber',
        isActive: true,
        isNested: true,
        className: 'bg-cyan-500/10 text-cyan-400 font-semibold',
      },
    ],
    defaultVariants: {
      variant: 'default',
      isActive: false,
      isNested: false,
    },
  },
);

interface ToCItem {
  id: string;
  label: string;
  depth: number;
}

interface ToCTreeItem extends ToCItem {
  children: ToCItem[];
}

export interface TableOfContentsProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof tocVariants> {
  containerSelector?: string;
  headerSelector?: string;
  excludeSelector?: string;
}

const TableOfContents = React.forwardRef<HTMLElement, TableOfContentsProps>(
  (
    {
      className,
      variant,
      position,
      containerSelector = 'main',
      headerSelector = 'h2, h3',
      excludeSelector = '[data-toc-exclude]',
      ...props
    },
    ref,
  ) => {
    const [activeId, setActiveId] = React.useState<string>('');
    const [sections, setSections] = React.useState<ToCItem[]>([]);
    const [_expandedIds, _setExpandedIds] = React.useState<Set<string>>(new Set());

    // Build tree structure
    const tree = React.useMemo(() => {
      const result: ToCTreeItem[] = [];
      let currentParent: ToCTreeItem | null = null;

      sections.forEach((section) => {
        if (section.depth === 2) {
          currentParent = { ...section, children: [] };
          result.push(currentParent);
        } else if (section.depth === 3 && currentParent) {
          currentParent.children.push(section);
        }
      });
      return result;
    }, [sections]);

    React.useEffect(() => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const elements = Array.from(container.querySelectorAll(headerSelector)).filter(
        (el) => !excludeSelector || !el.closest(excludeSelector),
      );
      const scannedSections: ToCItem[] = [];

      elements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        if (!htmlElement.id) {
          const text = htmlElement.innerText || '';
          htmlElement.id =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '') || `section-${index}`;
        }
        const label = htmlElement.dataset.tocLabel || htmlElement.innerText;
        if (!label.trim()) return;

        scannedSections.push({
          id: htmlElement.id,
          label,
          depth: parseInt(htmlElement.tagName.substring(1), 10),
        });
      });

      setSections(scannedSections);

      const visibleIds = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleIds.add(entry.target.id);
            } else {
              visibleIds.delete(entry.target.id);
            }
          });
          const topmost = scannedSections.find(({ id }) => visibleIds.has(id));
          if (topmost) setActiveId(topmost.id);
        },
        { rootMargin: '0px 0px -66% 0px', threshold: 0 },
      );

      scannedSections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, [containerSelector, headerSelector, excludeSelector]);

    if (sections.length === 0) return null;

    return (
      <nav ref={ref} className={cn(tocVariants({ variant, position }), className)} {...props}>
        <div className="mb-4 ml-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">
          <List size={14} />
          Contents
        </div>

        <ul className="space-y-1">
          {tree.map((node) => {
            const isActive = activeId === node.id || node.children.some((c) => c.id === activeId);
            return (
              <li key={node.id} className="space-y-1">
                <a href={`#${node.id}`} className={cn(tocItemVariants({ variant, isActive }))}>
                  {toTitleCase(node.label)}
                </a>
                {node.children.length > 0 && isActive && (
                  <ul className="mt-1 ml-3 space-y-0.5 border-l border-current/20 pl-2">
                    {node.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          className={cn(
                            tocItemVariants({
                              variant,
                              isActive: activeId === child.id,
                              isNested: true,
                            }),
                            'py-1 text-xs',
                          )}
                        >
                          {toTitleCase(child.label)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);
TableOfContents.displayName = 'TableOfContents';

export { TableOfContents, tocVariants };

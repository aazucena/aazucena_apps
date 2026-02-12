/**
 * TableOfContents.tsx
 * Floating table of contents that dynamically scans the document headers.
 * Automatically highlights the active section.
 */

import { useEffect, useState, useMemo } from 'react';
import { cn } from '@aazucena/utils';
import { List, ChevronDown } from '@aazucena/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { toTitleCase } from '@aazucena/utils';
import type { JSX } from 'react';

interface ToCItem {
  id: string;
  label: string;
  depth: number;
}

interface ToCTreeItem extends ToCItem {
  children: ToCItem[];
}

export interface TableOfContentsProps {
  /**
   * CSS selector for the container to scan for headers.
   * Defaults to 'main'.
   */
  containerSelector?: string;
  /**
   * CSS selector for the headers to include.
   * Defaults to 'h2, h3'.
   */
  headerSelector?: string;
  /**
   * Additional className
   */
  className?: string;
}

export function TableOfContents({
  containerSelector = 'main',
  headerSelector = 'h2, h3',
  className,
}: TableOfContentsProps): JSX.Element | null {
  const [activeId, setActiveId] = useState<string>('');
  const [sections, setSections] = useState<ToCItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Build tree structure: Group H3s under their preceding H2
  const tree = useMemo(() => {
    const result: ToCTreeItem[] = [];
    let currentParent: ToCTreeItem | null = null;

    sections.forEach((section) => {
      if (section.depth === 2) {
        currentParent = { ...section, children: [] };
        result.push(currentParent);
      } else if (section.depth === 3 && currentParent) {
        currentParent.children.push(section);
      } else if (section.depth === 1) {
        // Fallback for h1 if included
        currentParent = { ...section, children: [] };
        result.push(currentParent);
      }
    });
    return result;
  }, [sections]);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Scan for headers
    const elements = Array.from(container.querySelectorAll(headerSelector));
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

    if (JSON.stringify(sections) !== JSON.stringify(scannedSections)) {
      setSections(scannedSections);
    }

    if (scannedSections.length === 0) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.find((e) => e.isIntersecting);
      if (intersecting) {
        setActiveId(intersecting.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0,
    });

    scannedSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerSelector, headerSelector, sections]);

  // Auto-expand parent if a child is active
  useEffect(() => {
    if (!activeId) return;

    const parent = tree.find(
      (node) => node.id === activeId || node.children.some((child) => child.id === activeId),
    );

    if (parent && !expandedIds.has(parent.id)) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(parent.id);
        return next;
      });
    }
  }, [activeId, tree, expandedIds]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'animate-fade-in fixed top-32 right-8 z-40 hidden w-56 xl:block print:hidden',
        className,
      )}
    >
      <div className="custom-scrollbar max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mb-4 ml-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
          <List size={14} />
          Contents
        </div>

        <ul className="space-y-1">
          {tree.map((node) => {
            const isExpanded = expandedIds.has(node.id);
            const hasChildren = node.children.length > 0;
            const isParentActive = activeId === node.id;
            const isChildActive = node.children.some((c) => c.id === activeId);

            return (
              <li key={node.id} className="space-y-1">
                <div className="group flex items-center gap-1">
                  <a
                    href={`#${node.id}`}
                    onClick={(e) => handleClick(e, node.id)}
                    className={cn(
                      'flex-1 truncate rounded-xl px-3 py-1.5 text-sm transition-all duration-300',
                      isParentActive
                        ? 'translate-x-1 bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20'
                        : isChildActive
                          ? 'font-bold text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200',
                    )}
                    title={toTitleCase(node.label)}
                  >
                    {toTitleCase(node.label)}
                  </a>

                  {hasChildren && (
                    <button
                      onClick={(e) => toggleExpand(e, node.id)}
                      className={cn(
                        'rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
                        isExpanded ? 'text-blue-500' : 'text-gray-400',
                      )}
                    >
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-300',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && hasChildren && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="ml-4 space-y-1 overflow-hidden border-l border-gray-100 pl-2 dark:border-gray-700/50"
                    >
                      {node.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={(e) => handleClick(e, child.id)}
                            className={cn(
                              'block truncate rounded-lg px-3 py-1.5 text-xs transition-all duration-200',
                              activeId === child.id
                                ? 'bg-blue-50 font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800/50 dark:hover:text-gray-300',
                            )}
                            title={toTitleCase(child.label)}
                          >
                            {toTitleCase(child.label)}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

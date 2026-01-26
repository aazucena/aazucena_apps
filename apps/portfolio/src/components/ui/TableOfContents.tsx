/**
 * TableOfContents.tsx
 * Floating table of contents that dynamically scans the document headers.
 * Automatically highlights the active section.
 */

import { useEffect, useState, useMemo } from 'react';
import { cn } from '~/lib/utils';
import { List, ChevronDown } from '@mynaui/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toTitleCase } from '~/lib/utils/text';
import type { JSX } from 'react';

interface ToCItem {
  id: string;
  label: string;
  depth: number;
}

interface ToCTreeItem extends ToCItem {
  children: ToCItem[];
}

interface TableOfContentsProps {
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
}

export function TableOfContents({
  containerSelector = 'main',
  headerSelector = 'h2, h3'
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
        htmlElement.id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || `section-${index}`;
      }

      const label = htmlElement.dataset.tocLabel || htmlElement.innerText;
      if (!label.trim()) return;

      scannedSections.push({
        id: htmlElement.id,
        label,
        depth: parseInt(htmlElement.tagName.substring(1), 10)
      });
    });

    setSections(scannedSections);

    if (scannedSections.length === 0) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.find(e => e.isIntersecting);
      if (intersecting) {
        setActiveId(intersecting.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0
    });

    scannedSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerSelector, headerSelector]);

  // Auto-expand parent if a child is active
  useEffect(() => {
    if (!activeId) return;
    
    const parent = tree.find(node => 
      node.id === activeId || node.children.some(child => child.id === activeId)
    );

    if (parent && !expandedIds.has(parent.id)) {
      setExpandedIds(prev => new Set(prev).add(parent.id));
    }
  }, [activeId, tree]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds(prev => {
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
    <nav className="hidden xl:block fixed right-8 top-32 w-56 z-40 print:hidden animate-fade-in">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">
          <List size={14} />
          Contents
        </div>
        
        <ul className="space-y-1">
          {tree.map((node) => {
            const isExpanded = expandedIds.has(node.id);
            const hasChildren = node.children.length > 0;
            const isParentActive = activeId === node.id;
            const isChildActive = node.children.some(c => c.id === activeId);

            return (
              <li key={node.id} className="space-y-1">
                <div className="group flex items-center gap-1">
                  <a
                    href={`#${node.id}`}
                    onClick={(e) => handleClick(e, node.id)}
                    className={cn(
                      "flex-1 text-sm py-1.5 px-3 rounded-xl transition-all duration-300 truncate",
                      isParentActive
                        ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 translate-x-1"
                        : isChildActive
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    )}
                    title={toTitleCase(node.label)}
                  >
                    {toTitleCase(node.label)}
                  </a>
                  
                  {hasChildren && (
                    <button
                      onClick={(e) => toggleExpand(e, node.id)}
                      className={cn(
                        "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                        isExpanded ? "text-blue-500" : "text-gray-400"
                      )}
                    >
                      <ChevronDown 
                        size={14} 
                        className={cn("transition-transform duration-300", isExpanded && "rotate-180")} 
                      />
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && hasChildren && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden ml-4 border-l border-gray-100 dark:border-gray-700/50 pl-2 space-y-1"
                    >
                      {node.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={(e) => handleClick(e, child.id)}
                            className={cn(
                              "block text-xs py-1.5 px-3 rounded-lg transition-all duration-200 truncate",
                              activeId === child.id
                                ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
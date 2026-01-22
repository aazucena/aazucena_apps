/**
 * TableOfContents.tsx
 * Floating table of contents that dynamically scans the document headers.
 * Automatically highlights the active section.
 */

import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';
import { List } from '@mynaui/icons-react';
import type { JSX } from 'react';

interface ToCItem {
  id: string;
  label: string;
  depth: number;
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

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Scan for headers
    const elements = Array.from(container.querySelectorAll(headerSelector));
    const scannedSections: ToCItem[] = [];

    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;

      // 1. Ensure ID exists
      if (!htmlElement.id) {
        // Generate a slugified ID if missing
        const text = htmlElement.innerText || '';
        htmlElement.id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || `section-${index}`;
      }

      // 2. Determine Label (data attribute > innerText)
      const label = htmlElement.dataset.tocLabel || htmlElement.innerText;

      // Skip empty labels
      if (!label.trim()) return;

      scannedSections.push({
        id: htmlElement.id,
        label,
        depth: parseInt(htmlElement.tagName.substring(1), 10)
      });
    });

    setSections(scannedSections);

    if (scannedSections.length === 0) return;

    // 3. Set up IntersectionObserver
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting entry
      const intersecting = entries.find(e => e.isIntersecting);
      if (intersecting) {
        setActiveId(intersecting.target.id);
      } else {
        // Fallback: If scrolling up, find the one just above the viewport
        // This logic can be complex; simplified to just track intersections for now.
        // A common pattern is to track all visible and pick the top one.
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-100px 0px -66% 0px', // Trigger when element is near top
      threshold: 0
    });

    scannedSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerSelector, headerSelector]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky headers if any
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
    <nav className="hidden xl:block fixed right-8 top-32 w-48 z-40 print:hidden animate-fade-in">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          <List size={14} />
          Contents
        </div>
        <ul className="space-y-1">
          {sections.map(({ id, label, depth }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "block text-sm py-1 px-2 rounded-md transition-all duration-200 truncate",
                  activeId === id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium translate-x-1"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                  // Indent h3s
                  depth === 3 && "ml-3 border-l border-gray-200 dark:border-gray-700"
                )}
                title={label}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
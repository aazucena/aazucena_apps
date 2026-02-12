import { ArrowLeft, ArrowRight } from '@aazucena/icons';
import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface DetailNavItem {
  slug: string;
  title: string;
}

export interface DetailNavigationProps {
  prevItem?: DetailNavItem | null;
  nextItem?: DetailNavItem | null;
  basePath: string; // e.g., '/blog', '/experiences', '/projects'
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function DetailNavigation({
  prevItem,
  nextItem,
  basePath,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: DetailNavigationProps): JSX.Element | null {
  if (!nextItem && !prevItem) return null;

  const normalizedBasePath = basePath.replace(/\/$/, '');

  return (
    <nav
      className={cn('mt-20 border-t border-gray-100 pt-12 dark:border-gray-900', className)}
      aria-label="Pagination"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {prevItem ? (
          <a
            href={`${normalizedBasePath}/${prevItem.slug}`}
            className="group space-y-2 rounded-[2rem] border border-gray-100 p-8 text-left transition-all hover:border-blue-500/20 dark:border-gray-800"
          >
            <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.3em] text-gray-400 uppercase">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              {prevLabel}
            </div>
            <div className="line-clamp-2 text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
              {prevItem.title}
            </div>
          </a>
        ) : (
          <div aria-hidden="true" />
        )}

        {nextItem && (
          <a
            href={`${normalizedBasePath}/${nextItem.slug}`}
            className="group space-y-2 rounded-[2rem] border border-gray-100 p-8 text-right transition-all hover:border-blue-500/20 dark:border-gray-800"
          >
            <div className="flex items-center justify-end gap-2 text-[9px] font-black tracking-[0.3em] text-gray-400 uppercase">
              {nextLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
            <div className="line-clamp-2 text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
              {nextItem.title}
            </div>
          </a>
        )}
      </div>
    </nav>
  );
}

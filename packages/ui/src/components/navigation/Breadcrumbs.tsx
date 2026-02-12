import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  className?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps): JSX.Element {
  return (
    <nav
      className={cn(
        'mb-12 flex text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase dark:text-gray-500 print:hidden',
        className,
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} className="transition-colors hover:text-blue-600">
                {item.label}
              </a>
            ) : (
              <span className={cn('max-w-[150px] truncate text-blue-600', item.className)}>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

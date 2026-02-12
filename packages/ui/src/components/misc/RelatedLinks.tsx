/**
 * RelatedLinks.tsx
 * Displays a list of related links (WebLink objects) with icons.
 */

import { ExternalLink } from '@aazucena/icons';
import { getIconComponent } from '@aazucena/icons';
import type { WebLink } from '@aazucena/types';
import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface RelatedLinksProps {
  links?: WebLink[];
  title?: string;
  className?: string;
}

export function RelatedLinks({
  links,
  title = 'Related Links',
  className = '',
}: RelatedLinksProps): JSX.Element | null {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className,
      )}
    >
      <h2 className="mb-4 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link, index) => {
          // Determine icon: Use CMS icon if provided, otherwise fallback to ExternalLink
          // link.icon might be an object with name property based on strapi-plugin-icons-field or a string
          const iconName = typeof link.icon === 'object' ? (link.icon as any)?.name : link.icon;
          const Icon = iconName ? getIconComponent(iconName) : ExternalLink;

          return (
            <li key={index}>
              <a
                href={link.url}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-100 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-700/50"
              >
                <span className="mt-0.5 text-blue-600 transition-transform group-hover:scale-110 dark:text-blue-400">
                  {typeof Icon === 'string' ? (
                    <span dangerouslySetInnerHTML={{ __html: Icon }} />
                  ) : (
                    <Icon size={18} />
                  )}
                </span>
                <div>
                  <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {link.text}
                  </div>
                  {link.description && (
                    <div className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {link.description}
                    </div>
                  )}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

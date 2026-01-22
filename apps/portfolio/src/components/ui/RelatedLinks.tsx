/**
 * RelatedLinks.tsx
 * Displays a list of related links (WebLink objects) with icons.
 */

import { ExternalLink } from '@mynaui/icons-react';
import { getIconComponent } from '~/lib/utils/icons';
import type { WebLink } from '~/lib/validators/web-link';
import type { JSX } from 'react';

interface RelatedLinksProps {
  links?: WebLink[];
  title?: string;
  className?: string;
}

export function RelatedLinks({ links, title = 'Related Links', className = '' }: RelatedLinksProps): JSX.Element | null {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link, index) => {
          // Determine icon: Use CMS icon if provided, otherwise fallback to ExternalLink
          const Icon = link.icon?.name ? getIconComponent(link.icon.name) : ExternalLink;
          
          return (
            <li key={index}>
              <a
                href={link.url}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
              >
                <span className="mt-0.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {typeof Icon === 'string' ? (
                    <span dangerouslySetInnerHTML={{ __html: Icon }} />
                  ) : (
                    <Icon size={18} />
                  )}
                </span>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.text}
                  </div>
                  {link.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
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

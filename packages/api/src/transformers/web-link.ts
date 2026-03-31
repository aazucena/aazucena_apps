/**
 * Transformer for shared.web-link component
 * Converts Strapi API response to clean WebLink type
 */

import type { WebLink } from '../validators/web-link';

/**
 * Transform a single web link from Strapi format to clean structure
 */
export function transformWebLink(rawLink: any): WebLink {
  return {
    id: rawLink.id,
    text: rawLink.text || '',
    url: rawLink.url || '',
    openInNewTab: rawLink.openInNewTab ?? true,
    icon: rawLink.icon
      ? {
          name: rawLink.icon.name,
          family: rawLink.icon.family,
        }
      : null,
    description: rawLink.description || null,
  };
}

/**
 * Transform an array of web links
 */
export function transformWebLinks(rawLinks: unknown[] | null | undefined): WebLink[] {
  if (!Array.isArray(rawLinks)) {
    return [];
  }

  return rawLinks.map(transformWebLink);
}

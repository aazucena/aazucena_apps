import type { StrapiPage } from '../validators/page';

export interface Page {
  slug: string;
  title: string;
  content: string; // Richtext content (Blocks format)
  template: 'legal' | 'default' | 'landing';
  lastUpdated: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  showTableOfContents: boolean;
  footerVariant: 'default' | 'minimal';
}

export function transformPage(data: StrapiPage): Page {
  return {
    slug: data.slug,
    title: data.title,
    content: data.content,
    template: data.template,
    lastUpdated: new Date(data.lastUpdated),
    seo: data.seo,
    showTableOfContents: data.showTableOfContents,
    footerVariant: data.footerVariant,
  };
}

/**
 * Default fallback page (404 scenario)
 */
export const DEFAULT_PAGE: Page = {
  slug: 'not-found',
  title: 'Page Not Found',
  content: 'The requested page could not be found.',
  template: 'default',
  lastUpdated: new Date(),
  showTableOfContents: false,
  footerVariant: 'minimal',
};

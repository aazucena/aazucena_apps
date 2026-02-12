import type { StrapiPage } from '../validators/page.js';
import { transformSeo } from '@aazucena/utils';
import type { Page } from '@aazucena/types';

export const DEFAULT_PAGE: Page = {
  id: 0,
  slug: '',
  title: '',
  content: [],
  template: 'default',
  lastUpdated: new Date().toISOString(),
  showTableOfContents: true,
  footerVariant: 'minimal',
};

export function transformPage(data: StrapiPage): Page {
  if (!data) return DEFAULT_PAGE;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    template: data.template,
    lastUpdated: data.lastUpdated,
    seo: transformSeo(data.seo),
    showTableOfContents: !!data.showTableOfContents,
    footerVariant: data.footerVariant,
  };
}

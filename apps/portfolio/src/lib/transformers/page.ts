import type { StrapiPage } from '../validators/page';
import { transformSeo } from './utils';

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: any;
  template: string;
  lastUpdated: string;
  seo?: ReturnType<typeof transformSeo>;
  showTableOfContents: boolean;
  footerVariant: string;
}

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

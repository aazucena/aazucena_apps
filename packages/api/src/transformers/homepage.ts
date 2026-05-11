import type { StrapiHomepage } from '../validators/homepage';
import { transformSeo } from '@aazucena/utils';
import type { HomepageData } from '@aazucena/types';

export const DEFAULT_HOMEPAGE: HomepageData = {
  title: 'Welcome',
  sections: [],
};

export function transformHomepage(data: StrapiHomepage): HomepageData {
  if (!data) return DEFAULT_HOMEPAGE;

  const rawData = data as any;

  return {
    title: rawData.title || 'Welcome',
    sections: (rawData.sections || []).filter((s: any) => !!s.enabled),
    seo: transformSeo(rawData.seo),
  };
}

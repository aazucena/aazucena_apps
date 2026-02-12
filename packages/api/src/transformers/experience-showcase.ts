import type { StrapiExperienceShowcase } from '../validators/experience-showcase.js';
import { transformPageHeader } from '@aazucena/utils';
import type { ExperienceShowcaseConfig } from '@aazucena/types';

export const DEFAULT_EXPERIENCE_SHOWCASE: ExperienceShowcaseConfig = {
  searchPlaceholder: 'Search experiences...',
  listPagePath: 'experiences',
};

export function transformExperienceShowcase(
  data: StrapiExperienceShowcase,
): ExperienceShowcaseConfig {
  if (!data) return DEFAULT_EXPERIENCE_SHOWCASE;

  return {
    header: transformPageHeader(data.header),
    searchPlaceholder: data.searchPlaceholder,
    listPagePath: data.listPagePath || DEFAULT_EXPERIENCE_SHOWCASE.listPagePath,
  };
}

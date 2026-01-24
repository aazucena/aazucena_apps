import type { StrapiExperienceShowcase } from '../validators/experience-showcase';
import { transformPageHeader } from './utils';

export interface ExperienceShowcaseConfig {
  header?: ReturnType<typeof transformPageHeader>;
  searchPlaceholder: string;
}

export const DEFAULT_EXPERIENCE_SHOWCASE: ExperienceShowcaseConfig = {
  searchPlaceholder: 'Search experiences...',
};

export function transformExperienceShowcase(data: StrapiExperienceShowcase): ExperienceShowcaseConfig {
  if (!data) return DEFAULT_EXPERIENCE_SHOWCASE;

  return {
    header: transformPageHeader(data.header),
    searchPlaceholder: data.searchPlaceholder,
  };
}
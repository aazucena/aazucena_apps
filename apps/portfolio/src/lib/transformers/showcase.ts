import type { StrapiShowcase } from '~/lib/validators/showcase';

export interface ShowcaseConfig {
  ui: {
    dragHintText: string;
    viewMoreButtonLabel: string;
    viewMoreButtonSubtitle: string;
  };
  display: {
    maxProjectsDisplayed: number;
    projectsPerPage: number;
  };
  navigation: {
    projectsListPagePath: string;
  };
}

/**
 * Transform Strapi project showcase config to frontend format
 */
export function transformShowcase(strapiConfig: StrapiShowcase): ShowcaseConfig {
  return {
    ui: {
      dragHintText: strapiConfig.dragHintText,
      viewMoreButtonLabel: strapiConfig.viewMoreButtonLabel,
      viewMoreButtonSubtitle: strapiConfig.viewMoreButtonSubtitle,
    },
    display: {
      maxProjectsDisplayed: strapiConfig.maxProjectsDisplayed,
      projectsPerPage: strapiConfig.projectsPerPage,
    },
    navigation: {
      projectsListPagePath: strapiConfig.projectsListPagePath ?? '/projects',
    },
  };
}

/**
 * Default fallback project showcase configuration
 * NOTE: Keep in sync with CMS schema.json defaults
 */
export const DEFAULT_SHOWCASE_CONFIG: ShowcaseConfig = {
  ui: {
    dragHintText: 'Drag to explore more projects',
    viewMoreButtonLabel: 'View More',
    viewMoreButtonSubtitle: 'Explore all projects',
  },
  display: {
    maxProjectsDisplayed: 7,
    projectsPerPage: 4,
  },
  navigation: {
    projectsListPagePath: '/projects',
  },
};

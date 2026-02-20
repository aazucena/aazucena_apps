import type { StrapiBlogConfig } from "~/lib/validators/blog-config";

export interface BlogConfigData {
  postsPerPage: number;
  permalink: string;
  paths: {
    main: string;
    category: string;
    tag: string;
  };
  relatedPosts: {
    enabled: boolean;
    count: number;
  };
  display: {
    postsCount: number;
    gridColumns: 1 | 2 | 3 | 4;
    showTags: boolean;
    showDate: boolean;
    showReadTime: boolean;
  };
  viewAllButton: {
    text: string;
    ariaLabel: string;
    show: boolean;
  };
}

/**
 * Transform Strapi blog config to frontend format
 */
export function transformBlogConfig(
  strapiConfig: StrapiBlogConfig,
): BlogConfigData {
  return {
    postsPerPage: strapiConfig.postsPerPage,
    permalink: strapiConfig.permalink,
    paths: {
      main: strapiConfig.mainPath,
      category: strapiConfig.categoryPath,
      tag: strapiConfig.tagPath,
    },
    relatedPosts: {
      enabled: strapiConfig.relatedPostsEnabled,
      count: strapiConfig.relatedPostsCount ?? 4,
    },
    display: {
      postsCount: strapiConfig.displayPostsCount,
      gridColumns: strapiConfig.gridColumns as 1 | 2 | 3 | 4,
      showTags: strapiConfig.showTags,
      showDate: strapiConfig.showDate,
      showReadTime: strapiConfig.showReadTime,
    },
    viewAllButton: {
      text: strapiConfig.viewAllButtonText,
      ariaLabel: strapiConfig.viewAllButtonAriaLabel,
      show: strapiConfig.showViewAllButton,
    },
  };
}

/**
 * Default fallback blog configuration
 */
export const DEFAULT_BLOG_CONFIG: BlogConfigData = {
  postsPerPage: 6,
  permalink: "/%slug%",
  paths: {
    main: "blog",
    category: "category",
    tag: "tag",
  },
  relatedPosts: {
    enabled: true,
    count: 4,
  },
  display: {
    postsCount: 6,
    gridColumns: 3,
    showTags: true,
    showDate: true,
    showReadTime: true,
  },
  viewAllButton: {
    text: "View All Articles",
    ariaLabel: "View all blog articles",
    show: true,
  },
};

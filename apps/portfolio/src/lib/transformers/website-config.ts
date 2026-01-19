import type { StrapiWebsiteConfig } from '~/lib/validators/website-config';

export interface WebsiteConfigData {
  siteName: string;
  siteUrl: string;
  siteTagline?: string;
  baseUrl: string;
  siteLogo?: any;
  favicon?: any;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaImage?: any;
    keywords?: string;
    metaRobots: string;
    metaViewport: string;
    canonicalURL?: string;
    structuredData?: any;
    twitterCard: string;
    openGraph?: {
      ogTitle: string;
      ogDescription: string;
      ogImage?: any;
      ogUrl?: string;
      ogType: string;
    };
  };
  metaTitleTemplate: string;
  openGraphSiteName?: string;
  twitterHandle?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerificationId?: string;
  trailingSlash: boolean;
  cleanUrls: boolean;
}

/**
 * Transform Strapi website config to frontend format
 */
export function transformWebsiteConfig(strapiConfig: StrapiWebsiteConfig): WebsiteConfigData {
  return {
    siteName: strapiConfig.siteName,
    siteUrl: strapiConfig.siteUrl,
    siteTagline: strapiConfig.siteTagline ?? undefined,
    baseUrl: strapiConfig.baseUrl ?? '/',
    siteLogo: strapiConfig.siteLogo,
    favicon: strapiConfig.favicon,
    seo: {
      metaTitle: strapiConfig.defaultSEO.metaTitle,
      metaDescription: strapiConfig.defaultSEO.metaDescription,
      metaImage: strapiConfig.defaultSEO.metaImage,
      keywords: strapiConfig.defaultSEO.keywords ?? undefined,
      metaRobots: strapiConfig.defaultSEO.metaRobots ?? 'index, follow',
      metaViewport: strapiConfig.defaultSEO.metaViewport ?? 'width=device-width, initial-scale=1.0',
      canonicalURL: strapiConfig.defaultSEO.canonicalURL ?? undefined,
      structuredData: strapiConfig.defaultSEO.structuredData,
      twitterCard: strapiConfig.defaultSEO.twitterCard ?? 'summary_large_image',
      openGraph: strapiConfig.defaultSEO.openGraph
        ? {
            ogTitle: strapiConfig.defaultSEO.openGraph.ogTitle,
            ogDescription: strapiConfig.defaultSEO.openGraph.ogDescription,
            ogImage: strapiConfig.defaultSEO.openGraph.ogImage,
            ogUrl: strapiConfig.defaultSEO.openGraph.ogUrl,
            ogType: strapiConfig.defaultSEO.openGraph.ogType ?? 'website',
          }
        : undefined,
    },
    metaTitleTemplate: strapiConfig.metaTitleTemplate ?? '%s — {siteName}',
    openGraphSiteName: strapiConfig.openGraphSiteName ?? undefined,
    twitterHandle: strapiConfig.twitterHandle ?? undefined,
    robotsIndex: strapiConfig.robotsIndex ?? true,
    robotsFollow: strapiConfig.robotsFollow ?? true,
    googleSiteVerificationId: strapiConfig.googleSiteVerificationId ?? undefined,
    trailingSlash: strapiConfig.trailingSlash ?? false,
    cleanUrls: strapiConfig.cleanUrls ?? true,
  };
}

/**
 * Default fallback website configuration
 */
export const DEFAULT_WEBSITE_CONFIG: WebsiteConfigData = {
  siteName: 'Aldrin Azucena',
  siteUrl: 'https://aldrinazucena.com',
  siteTagline: 'Full Stack Software Developer',
  baseUrl: '/',
  seo: {
    metaTitle: 'Aldrin Azucena - Full Stack Software Developer',
    metaDescription: 'Full-stack professional who transforms ideas into market-ready products with expertise in React, Astro, Node.js, and modern web technologies.',
    metaRobots: 'index, follow',
    metaViewport: 'width=device-width, initial-scale=1.0',
    twitterCard: 'summary_large_image',
  },
  metaTitleTemplate: '%s — Aldrin Azucena',
  robotsIndex: true,
  robotsFollow: true,
  trailingSlash: false,
  cleanUrls: true,
};

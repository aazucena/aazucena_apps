import type { StrapiWebsiteConfig } from '../validators/website-config';
import { transformSeo, getMediaUrl } from '@aazucena/utils';
import type { WebsiteConfig } from '@aazucena/types';

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  siteName: 'Aldrin Azucena',
  siteUrl: 'https://aazucena.com',
  baseUrl: '/',
  defaultSEO: {
    title: 'Aldrin Azucena',
    description: 'Full Stack Software Developer',
    keywords: undefined,
    image: undefined,
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    canonical: undefined,
    twitterCard: 'summary_large_image',
    openGraph: undefined,
    structuredData: undefined,
  },
  metaTitleTemplate: '%s — {siteName}',
  robotsIndex: true,
  robotsFollow: true,
  // Footer defaults
  footerBrandDescription:
    'Architecting high-performance digital systems with a focus on logic, scale, and human-centric design.',
  footerLocationTagline: 'Engineered with precision in Canada',
  footerBuiltWithLabel: 'Built with',
  techStack: [
    { name: 'Astro', iconTitle: 'Astro', sort: 0 },
    { name: 'React', iconTitle: 'React', sort: 1 },
    { name: 'Tailwind CSS', iconTitle: 'Tailwind CSS', sort: 2 },
    { name: 'Vite', iconTitle: 'Vite', sort: 3 },
  ],
};

export function transformWebsiteConfig(data: StrapiWebsiteConfig): WebsiteConfig {
  if (!data) return DEFAULT_WEBSITE_CONFIG;

  return {
    siteName: data.siteName,
    siteUrl: data.siteUrl,
    siteTagline: data.siteTagline || undefined,
    baseUrl: data.baseUrl,
    siteLogoUrl: getMediaUrl(data.siteLogo),
    faviconUrl: getMediaUrl(data.favicon),
    defaultSEO: transformSeo(data.defaultSEO) || DEFAULT_WEBSITE_CONFIG.defaultSEO,
    metaTitleTemplate: data.metaTitleTemplate,
    openGraphSiteName: data.openGraphSiteName || undefined,
    twitterHandle: data.twitterHandle || undefined,
    robotsIndex: !!data.robotsIndex,
    robotsFollow: !!data.robotsFollow,
    googleSiteVerificationId: data.googleSiteVerificationId || undefined,
    // Footer configuration
    footerBrandDescription:
      data.footerBrandDescription || DEFAULT_WEBSITE_CONFIG.footerBrandDescription,
    footerLocationTagline:
      data.footerLocationTagline || DEFAULT_WEBSITE_CONFIG.footerLocationTagline,
    footerBuiltWithLabel: data.footerBuiltWithLabel || DEFAULT_WEBSITE_CONFIG.footerBuiltWithLabel,
    techStack:
      data.techStack && data.techStack.length > 0
        ? data.techStack
            .sort((a, b) => (a.sort || 0) - (b.sort || 0))
            .map((item) => ({
              name: item.name,
              iconTitle: item.iconTitle,
              iconUrl: item.iconUrl || undefined,
              sort: item.sort || 0,
            }))
        : DEFAULT_WEBSITE_CONFIG.techStack,
  };
}

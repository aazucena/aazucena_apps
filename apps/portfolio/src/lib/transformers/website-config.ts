import type { StrapiWebsiteConfig } from '../validators/website-config';
import { transformSeo, getMediaUrl } from './utils';

export interface WebsiteConfig {
  siteName: string;
  siteUrl: string;
  siteTagline?: string;
  baseUrl: string;
  siteLogoUrl?: string;
  faviconUrl?: string;
  defaultSEO: ReturnType<typeof transformSeo>;
  metaTitleTemplate: string;
  openGraphSiteName?: string;
  twitterHandle?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerificationId?: string;
}

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
    defaultSEO: transformSeo(data.defaultSEO),
    metaTitleTemplate: data.metaTitleTemplate,
    openGraphSiteName: data.openGraphSiteName || undefined,
    twitterHandle: data.twitterHandle || undefined,
    robotsIndex: !!data.robotsIndex,
    robotsFollow: !!data.robotsFollow,
    googleSiteVerificationId: data.googleSiteVerificationId || undefined,
  };
}

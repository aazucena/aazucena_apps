// Type definitions
export interface SiteMetadata {
  siteName: string;
  siteUrl: string;
  baseUrl: string;
  metaTitleTemplate: string;
  defaultSEO: {
    title: string;
    description: string;
    keywords?: string;
    robots: string;
    viewport: string;
    canonical?: string;
    twitterCard: string;
  };
  social: {
    twitter?: string;
  };
  faviconUrl?: string;
  siteLogoUrl?: string;
  googleSiteVerificationId?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface ThemeConfig {
  mode: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
  colors: {
    light: { primary: string; secondary: string; accent: string };
    dark: { primary: string; secondary: string; accent: string };
  };
  fonts: {
    sans: string;
    serif: string;
    heading: string;
    code: string;
  };
}

export interface SiteConfig {
  metadata: SiteMetadata;
  theme: ThemeConfig;
}

// Main configuration constant
export const SITE_CONFIG: SiteConfig = {
  metadata: {
    siteName: 'Aldrin Azucena',
    siteUrl: 'https://aazucena.com',
    baseUrl: '/',
    metaTitleTemplate: '%s — {siteName}',
    defaultSEO: {
      title: 'Aldrin Azucena',
      description: 'Full Stack Software Developer',
      keywords: undefined,
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      canonical: undefined,
      twitterCard: 'summary_large_image',
    },
    social: {
      twitter: '@azucena',
    },
    googleSiteVerificationId: process.env.GOOGLE_SITE_VERIFICATION_ID,
    robotsIndex: true,
    robotsFollow: true,
  },
  theme: {
    mode: 'system',
    colors: {
      light: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
      dark: { primary: '#60a5fa', secondary: '#a78bfa', accent: '#22d3ee' },
    },
    fonts: {
      sans: 'Fira Sans',
      serif: 'Fira Sans',
      heading: 'Fira Sans',
      code: 'Fira Code',
    },
  },
};

// Helper functions
export function formatPageTitle(title?: string): string {
  if (!title) return SITE_CONFIG.metadata.defaultSEO.title;
  return SITE_CONFIG.metadata.metaTitleTemplate
    .replace('%s', title)
    .replace('{siteName}', SITE_CONFIG.metadata.siteName);
}

export function getAbsoluteUrl(path: string): string {
  const url = SITE_CONFIG.metadata.siteUrl.endsWith('/')
    ? SITE_CONFIG.metadata.siteUrl.slice(0, -1)
    : SITE_CONFIG.metadata.siteUrl;
  return `${url}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const SITE_CONFIG = {
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
    googleSiteVerificationId: undefined, // Will be set from env in apps
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
} as const;

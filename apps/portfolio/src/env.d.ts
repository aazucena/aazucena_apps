/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL: string;
  readonly STRAPI_TOKEN: string;
  readonly STRAPI_ENDPOINT: string;
  readonly INTEL_ENGINE_URL: string | undefined;
  readonly INTEL_ENGINE_API_KEY: string | undefined;
  readonly MAINTENANCE_MODE: string | undefined;
  readonly PREVIEW_TOKEN: string | undefined;
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  readonly RECAPTCHA_SECRET_KEY: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN: string;
  readonly PUBLIC_PLAUSIBLE_API_HOST: string;
  readonly PUBLIC_SENTRY_DSN: string;
  readonly PUBLIC_SENTRY_PROJECT: string;
  readonly PUBLIC_SENTRY_ORG: string;
  readonly SENTRY_AUTH_TOKEN: string;
}

interface _ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "~/config/site" {
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
    mode: "system" | "light" | "dark";
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

  export const SITE_CONFIG: SiteConfig;
  export function formatPageTitle(_title?: string): string;
  export function getAbsoluteUrl(_path: string): string;
}

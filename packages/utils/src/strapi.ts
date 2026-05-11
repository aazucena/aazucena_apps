import type {
  TransformedImage,
  TransformedOpenGraph,
  TransformedSeo,
  TransformedTag,
  TransformedStat,
  TransformedCtaButton,
  SocialLink,
  StreamingLink,
  TransformedWebLink,
  TransformedPageHeader,
} from '@aazucena/types';

const STRAPI_URL =
  (typeof process !== 'undefined' ? process.env.STRAPI_URL : undefined) || 'http://localhost:1337';

/**
 * Get full URL for Strapi media
 */
export function getMediaUrl(media?: any | null): string | undefined {
  if (!media || !media.url) return undefined;
  if (media.url.startsWith('http://') || media.url.startsWith('https://')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

/**
 * Transform shared.page-header
 */
export function transformPageHeader(header?: any | null): TransformedPageHeader | undefined {
  if (!header) return undefined;
  return {
    title: header.title,
    description: header.description || undefined,
    watermark: header.watermark || undefined,
    accentColor: header.accentColor || undefined,
  };
}

/**
 * Transform ui.image-element
 */
export function transformImage(element?: any | null): TransformedImage | undefined {
  if (!element) return undefined;
  return {
    url: getMediaUrl(element.src),
    alt: element.altText,
    width: element.src?.width,
    height: element.src?.height,
  };
}

/**
 * Transform shared.open-graph
 */
export function transformOpenGraph(og?: any | null): TransformedOpenGraph | undefined {
  if (!og) return undefined;
  return {
    title: og.ogTitle,
    description: og.ogDescription,
    image: getMediaUrl(og.ogImage),
    url: og.ogUrl || undefined,
    type: og.ogType,
  };
}

/**
 * Transform shared.seo
 */
export function transformSeo(seo?: any | null): TransformedSeo | undefined {
  if (!seo) return undefined;
  return {
    title: seo.metaTitle || undefined,
    description: seo.metaDescription || undefined,
    keywords: seo.keywords || undefined,
    image: getMediaUrl(seo.metaImage),
    robots: seo.metaRobots || 'index, follow',
    viewport: seo.metaViewport || 'width=device-width, initial-scale=1.0',
    canonical: seo.canonicalURL || undefined,
    twitterCard: seo.twitterCard || 'summary_large_image',
    openGraph: transformOpenGraph(seo.openGraph),
    structuredData: seo.structuredData || undefined,
  };
}

/**
 * Transform ui.tag
 */
export function transformTag(tag: any): TransformedTag {
  return {
    label: tag.label,
    color: tag.color,
  };
}

/**
 * Transform content.stats
 */
export function transformStats(stat: any): TransformedStat {
  return {
    label: stat.label,
    value: stat.value,
    description: stat.description || undefined,
    icon: stat.icon || undefined,
    sort: stat.sort || 0,
  };
}

/**
 * Transform ui.cta-button
 */
export function transformCtaButton(button: any): TransformedCtaButton {
  return {
    label: button.label,
    url: button.url,
    variant: button.variant || 'primary',
    size: button.size || 'md',
    openInNewTab: !!button.openInNewTab,
    icon: button.icon || undefined,
  };
}

/**
 * Transform shared.social-links
 */
export function transformSocialLink(link: any): SocialLink {
  return {
    platform: link.platform,
    url: link.url,
    icon: link.icon || undefined,
    text: link.text || undefined,
    description: link.description || undefined,
    openInNewTab: !!link.openInNewTab,
  };
}

/**
 * Transform shared.streaming-link
 */
export function transformStreamingLink(link: any): StreamingLink {
  return {
    platform: link.platform,
    url: link.url,
    isPrimary: !!link.isPrimary,
  };
}

/**
 * Transform shared.web-link
 */
export function transformWebLink(link: any): TransformedWebLink {
  return {
    text: link.text,
    url: link.url,
    openInNewTab: !!link.openInNewTab,
    icon: link.icon || undefined,
    description: link.description || undefined,
  };
}

/**
 * Utility: Extract clean data from Strapi v5 response
 */
export function getStrapiData<T>(response: unknown): T | null {
  if (!response) return null;

  const r = response as Record<string, unknown>;
  if (r.data && typeof r.data === 'object') {
    return r.data as T;
  }

  return response as T;
}

/**
 * Recursively sanitizes data by replacing null values with safe defaults.
 * Useful for Strapi v5 responses which can be null-heavy.
 */
export function sanitizeStrapiData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  const d = data as any;
  if (d.data !== undefined) return { ...d, data: sanitizeStrapiData(d.data) };

  if (Array.isArray(data)) return data.map(sanitizeStrapiData);
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        if (key === 'sort') sanitized[key] = 0;
        else if (key === 'metaRobots') sanitized[key] = 'index, follow';
        else if (key === 'metaViewport') sanitized[key] = 'width=device-width, initial-scale=1.0';
        else if (key === 'availabilityStatus') sanitized[key] = 'Open to Opportunities';
        else if (key === 'timezone') sanitized[key] = 'America/Edmonton';
        else if (key === 'relatedLinks') sanitized[key] = [];
        else sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeStrapiData(value);
      }
    }
    return sanitized;
  }
  return data;
}

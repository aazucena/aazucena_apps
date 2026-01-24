import type { 
  StrapiMedia, 
  ImageElement, 
  Seo, 
  OpenGraph, 
  Tag, 
  Stats, 
  CTAButton,
  SocialLink,
  StreamingLink,
  WebLink,
  PageHeader
} from '../validators/components';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';

/**
 * Get full URL for Strapi media
 */
export function getMediaUrl(media?: StrapiMedia | null): string | undefined {
  if (!media || !media.url) return undefined;
  if (media.url.startsWith('http://') || media.url.startsWith('https://')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

/**
 * Transform shared.page-header
 */
export function transformPageHeader(header?: PageHeader | null) {
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
export function transformImage(element?: ImageElement | null) {
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
export function transformOpenGraph(og?: OpenGraph | null) {
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
export function transformSeo(seo?: Seo | null) {
  if (!seo) return undefined;
  return {
    title: seo.metaTitle || undefined,
    description: seo.metaDescription || undefined,
    keywords: seo.keywords || undefined,
    image: getMediaUrl(seo.metaImage),
    robots: seo.metaRobots,
    viewport: seo.metaViewport,
    canonical: seo.canonicalURL || undefined,
    twitterCard: seo.twitterCard,
    openGraph: transformOpenGraph(seo.openGraph),
    structuredData: seo.structuredData || undefined,
  };
}

/**
 * Transform ui.tag
 */
export function transformTag(tag: Tag) {
  return {
    label: tag.label,
    color: tag.color,
  };
}

/**
 * Transform content.stats
 */
export function transformStats(stat: Stats) {
  return {
    label: stat.label,
    value: stat.value,
    description: stat.description || undefined,
    icon: stat.icon || undefined,
    sort: stat.sort,
  };
}

/**
 * Transform ui.cta-button
 */
export function transformCtaButton(button: CTAButton) {
  return {
    label: button.label,
    url: button.url,
    variant: button.variant,
    size: button.size,
    openInNewTab: button.openInNewTab,
    icon: button.icon || undefined,
  };
}

/**
 * Transform shared.social-links
 */
export function transformSocialLink(link: SocialLink) {
  return {
    platform: link.platform,
    url: link.url,
    icon: link.icon || undefined,
    text: link.text || undefined,
    description: link.description || undefined,
    openInNewTab: link.openInNewTab,
  };
}

/**
 * Transform shared.streaming-link
 */
export function transformStreamingLink(link: StreamingLink) {
  return {
    platform: link.platform,
    url: link.url,
    isPrimary: link.isPrimary,
  };
}

/**
 * Transform shared.web-link
 */
export function transformWebLink(link: WebLink) {
  return {
    text: link.text,
    url: link.url,
    openInNewTab: link.openInNewTab,
    icon: link.icon || undefined,
    description: link.description || undefined,
  };
}
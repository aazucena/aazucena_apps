import type { StrapiHomepage } from '~/lib/validators/homepage';

export interface HomepageSection {
  id: number;
  name: string;
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  icon?: string;
  sort?: number;
  enabled?: boolean; // From Strapi schema (filtered during transform but available if needed)
}

export interface HomepageSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalURL?: string;
  metaRobots?: string;
}

export interface HomepageData {
  title: string; // NEW: Homepage title
  sections: HomepageSection[];
  seo?: HomepageSEO; // NEW: SEO metadata
}

/**
 * Transform Strapi homepage to frontend format
 */
export function transformHomepage(strapiHomepage: StrapiHomepage): HomepageData {
  const enabledSections = strapiHomepage.sections
    .filter(section => section.enabled !== false) // Default to true
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((section, index) => ({
      id: section.id,
      name: section.name,
      title: section.title,
      subtitle: section.subtitle ?? undefined,
      buttonLabel: section.buttonLabel ?? undefined,
      icon: section.icon,
      sort: section.sort || index,
      enabled: section.enabled,
    }));

  // Transform SEO data if available
  const seo: HomepageSEO | undefined = strapiHomepage.seo
    ? {
        metaTitle: strapiHomepage.seo.metaTitle,
        metaDescription: strapiHomepage.seo.metaDescription,
        keywords: strapiHomepage.seo.keywords,
        canonicalURL: strapiHomepage.seo.canonicalURL,
        metaRobots: strapiHomepage.seo.metaRobots,
      }
    : undefined;

  return {
    title: strapiHomepage.title,
    sections: enabledSections,
    seo,
  };
}

/**
 * Default fallback homepage data
 */
export const DEFAULT_HOMEPAGE: HomepageData = {
  title: 'Welcome',
  sections: [
    {
      id: 1,
      name: 'hero',
      title: 'Welcome',
      subtitle: 'Full-Stack Software Developer',
    },
    {
      id: 2,
      name: 'about',
      title: 'About',
      subtitle: 'Learn more about me',
    },
    {
      id: 3,
      name: 'projects',
      title: 'Projects',
      subtitle: 'Featured work',
    },
    {
      id: 4,
      name: 'skills',
      title: 'Skills',
      subtitle: 'Technical expertise',
    },
    {
      id: 5,
      name: 'experience',
      title: 'Experience',
      subtitle: 'Professional journey',
    },
    {
      id: 6,
      name: 'testimonials',
      title: 'Testimonials',
      subtitle: 'Client feedback',
    },
    {
      id: 7,
      name: 'blog',
      title: 'Blog',
      subtitle: 'Latest posts',
    },
    {
      id: 8,
      name: 'contact',
      title: 'Contact',
      subtitle: 'Get in touch',
    },
  ],
};

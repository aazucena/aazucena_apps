import type { StrapiPortfolio } from '~/lib/validators/portfolio';
import type { ProfileData } from '~/components/animations/sections/data/about';

export type PortfolioContent = ProfileData;
/**
 * Transform Strapi portfolio to ProfileData format
 */
export function transformPortfolio(strapiPortfolio: StrapiPortfolio): PortfolioContent {
  // Extract education (use first one if multiple)
  const education = strapiPortfolio.education?.[0] || {
    degree: 'Bachelor of Science',
    institution: 'University',
    year: '2020',
  };

  const educationData = {
    degree: education.degree,
    institution: education.institution,
    year: (education as any).endDate?.split('-')[0] || '2020',
  };

  const resume = strapiPortfolio.resumeFile?.url;
  const profileImage = strapiPortfolio.profileImage?.src?.url;


  // Portfolio schema is basic - use defaults for missing fields
  // These should come from the About single type instead
  return {
    name: strapiPortfolio.fullName,
    title: strapiPortfolio.occupation,
    tagline: 'Building Products That Drive Impact', // Default - should come from About
    flipWords: ['ideas', 'concepts', 'visions', 'dreams'], // Default - should come from About
    bio: strapiPortfolio.bio, // NEW: Pass raw markdown bio
    descriptions: [
      {
        type: 'paragraph',
        children: [{
          type: 'text',
          text: 'Full-stack professional who transforms ideas into market-ready products.',
        }],
      },
    ],
    highlights: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Full-Stack Development & Architecture' }],
      },
    ], // Default - should come from About
    stats: [], // Default - should come from About
    education: educationData as any,
    resume,
    profileImage,
    // NEW: Contact fields from CMS
    email: strapiPortfolio.email,
    emailDescription: strapiPortfolio.emailDescription ?? undefined,
    phone: strapiPortfolio.phone ?? undefined,
    preferredContactMethod: strapiPortfolio.preferredContactMethod,
    yearsOfExperience: strapiPortfolio.yearsOfExperience ?? undefined,
    location: strapiPortfolio.location ?? undefined,
    // Social links from CMS (shared.social-links component)
    socialLinks: strapiPortfolio.socialLinks as any,
  };
}

/**
 * Default fallback profile data
 */
export const DEFAULT_PORTFOLIO: PortfolioContent = {
  name: 'Aldrin Azucena',
  title: 'Full Stack Software Developer',
  tagline: 'Building Products That Drive Impact',
  flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
  descriptions: [
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'Full-stack professional who transforms ideas into market-ready products.',
      }],
    },
  ],
  highlights: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Full-Stack Development & Architecture' }],
    },
  ],
  stats: [],
  education: {
    degree: 'Bachelor of Science',
    institution: 'University',
    year: '2020',
  },
};

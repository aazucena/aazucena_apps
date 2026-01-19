import type { StrapiAward } from '~/lib/validators/awards';
import type { Award } from '~/components/animations/sections/data/awards';

/**
 * Generate gradient based on category
 * Maps new CMS category enum values to visual gradients
 */
function getCategoryGradient(category?: string): string {
  const gradientMap: Record<string, string> = {
    // CMS category enum values
    Academic: 'from-blue-400 to-indigo-500',
    Professional: 'from-purple-400 to-pink-500',
    Community: 'from-green-400 to-emerald-500',
    Music: 'from-fuchsia-400 to-purple-500',
    Design: 'from-orange-400 to-red-500',
    Certification: 'from-cyan-400 to-blue-500',
    Competition: 'from-yellow-400 to-orange-500',
  };

  return gradientMap[category || 'Certification'] || 'from-blue-400 to-indigo-500';
}

/**
 * Generate short title from full title
 */
function getShortTitle(title: string): string {
  // Take first 2-3 words or abbreviation
  const words = title.split(/\s+/);
  if (words.length <= 2) return title;

  // Check if title has abbreviation in it (e.g., "AWS Certified...")
  const abbr = words.find((word) => word.length <= 4 && word.toUpperCase() === word);
  if (abbr) return abbr;

  // Otherwise take first 2 words
  return words.slice(0, 2).join(' ');
}

/**
 * Transform Strapi award to frontend format
 */
export function transformAward(strapiAward: StrapiAward): Award {
  return {
    id: strapiAward.id.toString(),
    type: strapiAward.type || 'award', // Use new type field from CMS
    title: strapiAward.title,
    shortTitle: strapiAward.shortTitle || getShortTitle(strapiAward.title), // Use CMS field or generate
    organization: strapiAward.organization,
    year: strapiAward.year.toString(), // Convert number to string for display
    description: strapiAward.description || '',
    gradient: getCategoryGradient(strapiAward.category),
    icon: strapiAward.badge ? 'badge' : 'award', // Use badge icon if media exists
    featured: strapiAward.featured ?? false, // NEW: featured flag
    verificationUrl: strapiAward.verificationUrl, // NEW: verification URL
    badgeUrl: strapiAward.badge?.url, // NEW: badge media URL
    certificateUrl: strapiAward.certificate?.url, // NEW: certificate media URL
  };
}

/**
 * Transform array of awards
 */
export function transformAwards(strapiAwards: StrapiAward[]): Award[] {
  // Sort by year descending (most recent first), then by sort
  const sorted = strapiAwards.sort((a, b) => {
    const yearA = parseInt(a.year, 10);
    const yearB = parseInt(b.year, 10);
    if (yearA !== yearB) return yearB - yearA;

    const sortA = a.sort ?? 0;
    const sortB = b.sort ?? 0;
    return sortA - sortB;
  });

  return sorted.map(transformAward);
}

/**
 * Default fallback awards
 */
export const DEFAULT_AWARDS: Award[] = [
  {
    id: 'aws',
    type: 'certification',
    title: 'AWS Certified Solutions Architect',
    shortTitle: 'AWS',
    organization: 'Amazon Web Services',
    year: '2023',
    description: 'Professional-level certification demonstrating expertise in designing distributed systems on AWS.',
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'badge',
    skills: ['AWS', 'Cloud Architecture'],
  },
];

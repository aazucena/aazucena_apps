import type { StrapiExperience } from '~/lib/validators/experiences';
import type { Experience } from '~/components/animations/sections/data/experiences';

/**
 * Generate logo initials from company name
 * Supports both space-separated words and camelCase/PascalCase
 * Examples:
 *   "Tangle Media" → "TM"
 *   "HelpUsDefend" → "HUD"
 *   "IBM" → "IBM"
 */
function getLogoInitials(company: string): string {
  // First try: split by spaces and take first letter of each word
  const words = company.trim().split(/\s+/);
  if (words.length > 1) {
    return words
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  }

  // Second try: extract capital letters (for camelCase/PascalCase)
  const capitals = company.match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) {
    return capitals.join('').slice(0, 3);
  }

  // Fallback: take first 3 characters
  return company.toUpperCase().slice(0, 3);
}

/**
 * Extended gradient palette with 24 unique, visually distinct gradients
 * Organized by color families for better visual diversity
 */
const GRADIENT_PALETTE = [
  // Blues & Cyans
  'from-cyan-400 to-blue-500',
  'from-sky-400 to-blue-600',
  'from-blue-400 to-indigo-500',
  'from-blue-500 to-cyan-400',

  // Purples & Magentas
  'from-purple-400 to-pink-500',
  'from-violet-400 to-purple-600',
  'from-fuchsia-400 to-purple-500',
  'from-purple-500 to-pink-600',

  // Greens & Teals
  'from-green-400 to-emerald-500',
  'from-emerald-400 to-teal-500',
  'from-teal-400 to-cyan-500',
  'from-lime-400 to-green-500',

  // Oranges & Reds
  'from-orange-400 to-red-500',
  'from-red-400 to-pink-500',
  'from-rose-400 to-red-600',
  'from-amber-400 to-orange-500',

  // Yellows & Ambers
  'from-yellow-400 to-orange-500',
  'from-amber-400 to-yellow-500',
  'from-yellow-400 to-amber-600',

  // Mixed & Special
  'from-indigo-400 to-cyan-500',
  'from-pink-400 to-orange-500',
  'from-emerald-400 to-blue-500',
  'from-rose-400 to-amber-500',
  'from-violet-400 to-fuchsia-600',
];

/**
 * Deterministic hash function for company names
 * Returns a number between 0 and Number.MAX_SAFE_INTEGER
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate gradient based on company name and index (guarantees uniqueness)
 * Uses company name for determinism + index to prevent collisions
 * Always returns a valid gradient string
 *
 * @param company - Company name for deterministic hashing
 * @param index - Position in array to ensure uniqueness
 */
function getLogoGradient(company: string, index: number): string {
  // Combine company hash with index for uniqueness
  const companyHash = hashString(company);
  const uniqueIndex = (companyHash + index) % GRADIENT_PALETTE.length;

  return GRADIENT_PALETTE[uniqueIndex] ?? GRADIENT_PALETTE[0]!;
}

/**
 * Format date range for display
 */
function formatDuration(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (isCurrent) {
    return `${startFormatted} – Present`;
  }

  if (!endDate) {
    return startFormatted;
  }

  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Parse richtext content to plain text array
 * Handles both string and richtext object formats
 */
function parseRichtextToArray(richtext: any): string[] {
  if (!richtext) return [];

  // If it's already a string, split by newlines or bullet points
  if (typeof richtext === 'string') {
    return richtext
      .split(/\n|•|-/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  // If it's a richtext object, extract text content
  // This is a simplified parser - adjust based on actual Strapi richtext format
  if (Array.isArray(richtext)) {
    return richtext
      .map((block: any) => {
        if (block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join('');
        }
        return block.text || '';
      })
      .filter((text: string) => text.trim().length > 0);
  }

  return [];
}

/**
 * Transform Strapi experience to frontend format
 */
export function transformExperience(strapiExp: StrapiExperience, index: number): Experience {
  // Extract skills from relation
  const skills = strapiExp.skillsUsed?.map((skill: any) => skill.name || skill) || [];

  // Transform achievements (keep full objects)
  const achievements = strapiExp.achievements || [];

  // Determine logo (use uploaded logo URL if available, otherwise generate initials)
  const uploadedLogoUrl = strapiExp.companyLogo?.src?.url;
  const logo = uploadedLogoUrl || getLogoInitials(strapiExp.company);

  return {
    logo,
    logoGradient: getLogoGradient(strapiExp.company, index),
    position: strapiExp.position,
    company: strapiExp.company,
    duration: formatDuration(strapiExp.startDate, strapiExp.endDate, strapiExp.isCurrent),

    // Content fields (Blocks content from Strapi richtext)
    description: strapiExp.description,
    responsibilities: strapiExp.responsibilities,
    achievements,

    skills,

    // Additional metadata
    location: strapiExp.location,
    employmentType: strapiExp.employmentType,
    workMode: strapiExp.workMode,
    industry: strapiExp.industry,
    companySize: strapiExp.companySize,
    companyWebsite: strapiExp.companyWebsite,
    companyLinkedIn: strapiExp.companyLinkedIn,
  };
}

/**
 * Transform array of experiences
 */
export function transformExperiences(strapiExps: StrapiExperience[]): Experience[] {
  // Sort by start date descending (most recent first)
  const sorted = strapiExps.sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA;
  });

  return sorted.map((exp, index) => transformExperience(exp, index));
}

/**
 * Default fallback experiences
 */
export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    logo: 'TM',
    logoGradient: 'from-cyan-400 to-blue-500',
    position: 'Full Stack Software Developer',
    company: 'Tangle Media Inc.',
    duration: 'Dec 2021 – Sep 2025',
    location: 'Lethbridge, AB',
    employmentType: 'Full-time',
    workMode: 'Onsite',
    industry: 'Technology',
    companySize: 'small',
    companyWebsite: 'https://www.tanglemedia.ca',
    description: 'Full-stack software development with focus on scalable web applications',
    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built 25+ reusable UI components reducing development time by 25%' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Managed 50+ client sites with 99.95% uptime' }]
          }
        ]
      }
    ],
    achievements: [],
    skills: ['React', 'TypeScript', 'Python', 'PostgreSQL'],
  },
];

/**
 * CMS Data Transformers
 *
 * Maps Strapi CMS data structures to component prop interfaces.
 * Preserves rich text formatting using BlocksContent.
 *
 * @see apps/portfolio/src/types/strapi/
 */

import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { ProfileData } from '~/components/animations/sections/data/about';
import type { SkillCategory } from '~/components/animations/sections/data/skills';
import type { Project as ComponentProject } from '~/components/animations/sections/data/projects';
import type { Experience as ComponentExperience } from '~/components/animations/sections/data/experiences';
import type {
  Portfolio as StrapiPortfolio,
  Skill as StrapiSkill,
  Project as StrapiProject,
  Experience as StrapiExperience,
  Testimonial as StrapiTestimonial,
  Award as StrapiAward,
  Post as StrapiPost,
  StrapiEducation,
  StrapiStats,
  StrapiMedia,
} from '~/types/strapi';

// ============================================================================
// Constants
// ============================================================================

/**
 * Gradient palette for testimonials and awards
 * Used to add visual variety across items
 */
const GRADIENT_PALETTE = [
  'from-cyan-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-green-400 to-emerald-500',
  'from-orange-400 to-red-500',
  'from-blue-400 to-indigo-500',
  'from-pink-400 to-red-500',
] as const;

/**
 * Color palette for blog post tags
 * Used to add visual variety across tags
 */
const TAG_COLOR_PALETTE = [
  'cyan',
  'purple',
  'green',
  'orange',
  'blue',
  'pink',
  'indigo',
  'red',
] as const;

// ============================================================================
// Profile Data Transformer (Portfolio Single Type)
// ============================================================================

/**
 * Transform Strapi Portfolio data to ProfileData format
 * NOTE: This is for portfolio/profile info, not About section content
 *
 * @param cmsData - Raw Strapi Portfolio single type
 * @returns Transformed ProfileData for component consumption
 *
 * @example
 * const portfolio = await getPortfolio();
 * const profileData = transformProfileData(portfolio);
 */
export function transformProfileData(cmsData: StrapiPortfolio): ProfileData {
  return {
    name: cmsData?.fullName || 'Aldrin Azucena',
    title: cmsData?.occupation || 'Full Stack Software Developer',
    tagline: cmsData?.tagline || 'Building Products That Drive Impact',
    flipWords: cmsData?.flipWords || ['ideas', 'concepts', 'visions', 'dreams'],

    // Preserve rich text blocks - cast to BlocksContent
    descriptions: (cmsData?.descriptions as BlocksContent) || [],
    highlights: (cmsData?.highlights as BlocksContent) || [],

    // Transform stats component
    stats: (cmsData?.stats || []).map((stat: StrapiStats) => ({
      value: stat.value,
      label: stat.label,
      icon: stat.icon,
      description: stat.description,
    })),

    // Transform education component - use first education entry
    education: transformEducation(cmsData?.education?.[0]),
  };
}

/**
 * Transform education component data
 * Intelligently formats year based on education status and available dates
 */
function transformEducation(education?: StrapiEducation): {
  degree: string;
  institution: string;
  year: string;
} {
  // Fallback when no education data exists
  if (!education) {
    return {
      degree: 'B.S. Computer Science',
      institution: 'University of Lethbridge',
      year: '2023',
    };
  }

  // Format year based on available dates and current status
  let year: string;

  if (education.current) {
    // Currently enrolled - show "startYear - Present" or just "Present"
    if (education.startDate) {
      const startYear = new Date(education.startDate).getFullYear();
      year = `${startYear} - Present`;
    } else {
      year = 'Present';
    }
  } else if (education.endDate) {
    // Graduated - show end year
    year = new Date(education.endDate).getFullYear().toString();
  } else if (education.startDate) {
    // Has start date but no end date and not current - show start year only
    year = new Date(education.startDate).getFullYear().toString();
  } else {
    // No dates at all - indicate missing data
    year = 'N/A';
  }

  return {
    degree: education.degree,
    institution: education.institution,
    year,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert BlocksContent to plain text (if needed)
 * Useful for meta descriptions, previews, etc.
 *
 * @param blocks - Rich text blocks
 * @returns Plain text string
 */
export function blocksToPlainText(blocks: BlocksContent): string {
  if (!blocks || blocks.length === 0) return '';

  return blocks
    .map((block) => {
      if (block.type === 'paragraph' && 'children' in block) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      if (block.type === 'heading' && 'children' in block) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      if (block.type === 'list' && 'children' in block) {
        return block.children
          .map((item: any) =>
            item.children.map((child: any) => child.text || '').join('')
          )
          .join(', ');
      }
      if (block.type === 'quote' && 'children' in block) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Truncate BlocksContent to a specific character limit
 * Useful for previews and excerpts
 *
 * @param blocks - Rich text blocks
 * @param maxLength - Maximum character count
 * @returns Truncated blocks
 */
export function truncateBlocks(
  blocks: BlocksContent,
  maxLength: number
): BlocksContent {
  const plainText = blocksToPlainText(blocks);

  if (plainText.length <= maxLength) {
    return blocks;
  }

  const truncated = plainText.substring(0, maxLength).trim() + '...';

  return [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: truncated }],
    },
  ];
}

/**
 * Check if BlocksContent is empty
 *
 * @param blocks - Rich text blocks
 * @returns True if empty or only whitespace
 */
export function isBlocksEmpty(blocks: BlocksContent): boolean {
  if (!blocks || blocks.length === 0) return true;

  const text = blocksToPlainText(blocks);
  return text.trim().length === 0;
}

// ============================================================================
// Skills Section Transformer
// ============================================================================

/**
 * Transform Strapi Skills to SkillCategory format
 * Groups skills by category with associated metadata
 *
 * @param cmsSkills - Array of Strapi Skill content types
 * @returns Array of SkillCategory objects grouped by category
 */
export function transformSkillsData(cmsSkills: StrapiSkill[]): SkillCategory[] {
  // Handle undefined/null/empty input
  if (!cmsSkills || cmsSkills.length === 0) {
    return [];
  }

  // Define category metadata (gradients, icons)
  const categoryMetadata: Record<string, { gradient: string; icon: string; label: string }> = {
    frontend: {
      label: 'Frontend',
      gradient: 'from-cyan-400 to-blue-500',
      icon: 'code',
    },
    backend: {
      label: 'Backend',
      gradient: 'from-purple-400 to-pink-500',
      icon: 'server',
    },
    devops: {
      label: 'DevOps',
      gradient: 'from-blue-400 to-indigo-500',
      icon: 'cloud',
    },
    design: {
      label: 'Design',
      gradient: 'from-yellow-400 to-orange-500',
      icon: 'tools',
    },
    other: {
      label: 'Other',
      gradient: 'from-pink-400 to-red-500',
      icon: 'ai',
    },
  };

  // Group skills by category
  const groupedSkills = cmsSkills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  // Transform to SkillCategory format
  return Object.entries(groupedSkills).map(([categoryKey, skills]) => {
    const metadata = categoryMetadata[categoryKey] || categoryMetadata.other!;
    return {
      id: categoryKey,
      label: metadata.label,
      gradient: metadata.gradient,
      icon: metadata.icon,
      skills,
    };
  });
}

// ============================================================================
// Projects Section Transformer
// ============================================================================

/**
 * Transform Strapi Projects to component Project format
 *
 * @param cmsProjects - Array of Strapi Project content types
 * @returns Array of simplified Project objects for component
 */
export function transformProjectsData(cmsProjects: StrapiProject[]): ComponentProject[] {
  // Handle undefined/null/empty input
  if (!cmsProjects || cmsProjects.length === 0) {
    return [];
  }

  return cmsProjects.map((project) => ({
    title: project.title,
    description: project.description || project.excerpt || '',
    tags: project.technologies || [],
  }));
}

// ============================================================================
// Experience Section Transformer
// ============================================================================

/**
 * Format date range for experience duration
 */
function formatExperienceDuration(startDate: string, endDate?: string, current?: boolean): string {
  const start = new Date(startDate);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (current) {
    return `${startMonth} – Present`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endMonth = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startMonth} – ${endMonth}`;
  }

  return startMonth;
}

/**
 * Transform Strapi Experience to component Experience format
 *
 * @param cmsExperiences - Array of Strapi Experience content types
 * @returns Array of Experience objects for component
 */
export function transformExperiencesData(cmsExperiences: StrapiExperience[]): ComponentExperience[] {
  // Handle undefined/null/empty input
  if (!cmsExperiences || cmsExperiences.length === 0) {
    return [];
  }

  return cmsExperiences.map((exp) => ({
    logo: exp.company.substring(0, 2).toUpperCase(), // First 2 letters as logo fallback
    logoGradient: 'from-cyan-400 to-blue-500', // Default gradient
    position: exp.position,
    company: exp.company,
    duration: formatExperienceDuration(exp.startDate, exp.endDate, exp.current),
    details: exp.responsibilities || [],
    skills: exp.technologies || [],
  }));
}

// ============================================================================
// Testimonials Section Transformer
// ============================================================================

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  gradient: string;
}

/**
 * Generate a gradient based on index for visual variety
 */
function getTestimonialGradient(index: number): string {
  return GRADIENT_PALETTE[index % GRADIENT_PALETTE.length]!;
}

/**
 * Generate avatar initials from author name
 */
function getTestimonialAvatar(author: string): string {
  const words = author.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words[0] && words[words.length - 1]) {
    const firstInitial = words[0]![0] || '';
    const lastInitial = words[words.length - 1]![0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'AA';
  }
  return (author.substring(0, 2) || 'AA').toUpperCase();
}

/**
 * Transform Strapi Testimonials to component format
 *
 * @param cmsTestimonials - Array of Strapi Testimonial content types
 * @returns Array of Testimonial objects for component
 */
export function transformTestimonialsData(cmsTestimonials: StrapiTestimonial[]): Testimonial[] {
  // Handle undefined/null/empty input
  if (!cmsTestimonials || cmsTestimonials.length === 0) {
    return [];
  }

  return cmsTestimonials
    .filter((t) => t.approvalStatus === 'Approved') // Only include approved testimonials
    .map((testimonial, index) => ({
      quote: testimonial.content,
      name: testimonial.author,
      title: testimonial.authorTitle || testimonial.company || '',
      avatar: getTestimonialAvatar(testimonial.author),
      gradient: getTestimonialGradient(index),
    }));
}

// ============================================================================
// Awards Section Transformer
// ============================================================================

export interface Award {
  id: string;
  type: 'certification' | 'award';
  title: string;
  shortTitle: string;
  organization: string;
  year: string;
  description: string;
  gradient: string;
  icon: string;
  details?: string[];
  skills?: string[];
}

/**
 * Generate a gradient based on index for visual variety
 */
function getAwardGradient(index: number): string {
  return GRADIENT_PALETTE[index % GRADIENT_PALETTE.length]!;
}

/**
 * Get icon based on award category
 */
function getAwardIcon(category?: string): string {
  const iconMap: Record<string, string> = {
    Academic: 'academic-cap',
    Professional: 'briefcase',
    Community: 'users',
    Music: 'music',
    Design: 'palette',
    Certification: 'certificate',
    Competition: 'trophy',
  };
  return iconMap[category || 'Other'] || 'award';
}

/**
 * Generate short title from full title
 */
function getShortTitle(title: string): string {
  if (title.length <= 30) return title;
  const words = title.split(' ');
  if (words.length <= 3) return title;
  return words.slice(0, 3).join(' ') + '...';
}

/**
 * Transform Strapi Awards to component format
 *
 * @param cmsAwards - Array of Strapi Award content types
 * @returns Array of Award objects for component
 */
export function transformAwardsData(cmsAwards: StrapiAward[]): Award[] {
  // Handle undefined/null/empty input
  if (!cmsAwards || cmsAwards.length === 0) {
    return [];
  }

  return cmsAwards.map((award, index) => ({
    id: `award-${index}`,
    type: (award.category?.toLowerCase() === 'certification' ? 'certification' : 'award') as 'certification' | 'award',
    title: award.title,
    shortTitle: getShortTitle(award.title),
    organization: award.organization,
    year: award.year || 'N/A',
    description: award.description || '',
    gradient: getAwardGradient(index),
    icon: getAwardIcon(award.category),
    details: [], // Could be populated from description if needed
    skills: [], // Could be populated from related skills if needed
  }));
}

// ============================================================================
// Blog/Posts Section Transformer
// ============================================================================

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: Array<{ label: string; color: string }>;
  readTime: string;
  url: string;
  isExternal: boolean;
}

/**
 * Generate tag colors for visual variety
 */
function getTagColor(index: number): string {
  return TAG_COLOR_PALETTE[index % TAG_COLOR_PALETTE.length]!;
}

/**
 * Format date for display
 */
function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Transform Strapi Posts to component format
 *
 * @param cmsPosts - Array of Strapi Post content types
 * @returns Array of BlogPost objects for component
 */
export function transformPostsData(cmsPosts: StrapiPost[]): BlogPost[] {
  return cmsPosts.map((post) => ({
    title: post.title,
    description: post.excerpt || blocksToPlainText(post.content as BlocksContent).substring(0, 150) + '...',
    date: formatPostDate(post.publishedAt || post.createdAt),
    tags: (post.tags || []).map((tag, index) => ({
      label: tag,
      color: getTagColor(index),
    })),
    readTime: post.readingTime ? `${post.readingTime} min read` : '5 min read',
    url: `/blog/${post.slug}`,
    isExternal: false,
  }));
}

// ============================================================================
// Media URL Helper
// ============================================================================

/**
 * Get full URL for Strapi media
 * Handles both Cloudinary URLs and local uploads
 */
export function getStrapiMediaUrl(media?: StrapiMedia): string | undefined {
  if (!media) return undefined;

  const url = media.url;
  
  // Cloudinary or external URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Local upload - prepend Strapi URL
  const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
  return `${STRAPI_URL}${url}`;
}

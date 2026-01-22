/**
 * Profile Data
 * Personal/portfolio information from Portfolio single type
 * NOTE: This is different from AboutData (About section content)
 */

import type { BlocksContent } from '@strapi/blocks-react-renderer';

/**
 * Social Link - matches Strapi shared.social-links component
 * Used for social media links in SocialMenu and footer
 */
export interface SocialLink {
  id?: number;
  platform:
  | 'GitHub'
  | 'LinkedIn'
  | 'Twitter'
  | 'YouTube'
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Discord'
  | 'Twitch'
  | 'Mastodon';
  url: string;
  icon?: string | null; // Strapi returns null for empty fields
  text?: string | null; // Display name override (e.g., "My GitHub")
  description?: string | null; // Custom description (e.g., "Check out my projects")
  openInNewTab?: boolean | null; // Strapi returns null for empty fields
}

export interface Education {
  type: 'high-school' |
  'diploma' |
  'associate' |
  'bachelor' |
  'master' |
  'doctorate' |
  'certificate' |
  'bootcamp' |
  'online-course';
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  graduationDate?: string;
  current: boolean;
  location?: string;
  gpa?: number;
  description?: string;
  honors?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  flipWords: string[];
  descriptions: BlocksContent;
  bio?: string; // NEW: Raw markdown bio from Portfolio single type
  highlights: BlocksContent;
  stats: Array<{ value: string; label: string; icon?: string; description?: string }>;
  education: Education[];
  resume?: string;
  profileImage?: string;
  // New CMS contact fields
  email?: string;
  emailDescription?: string; // Custom description for email in social menu
  phone?: string;
  preferredContactMethod?: string[];
  yearsOfExperience?: number;
  location?: string;
  // Social links from CMS (shared.social-links component)
  socialLinks?: SocialLink[];
}

/**
 * Static fallback profile data in BlocksContent format
 * Used when CMS is unavailable
 */
export const profileData: ProfileData = {
  name: 'Aldrin Azucena',
  title: 'Full Stack Software Developer',
  tagline: 'Building Products That Drive Impact',
  flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
  descriptions: [
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'I\'m a full-stack professional who transforms ideas into market-ready products. From rapid MVP development to enterprise-scale systems, I build high-performance SaaS, web, and mobile applications that deliver measurable business impact.'
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'With expertise spanning TypeScript, Python, PHP, and Java, I leverage AI-powered workflows to create smarter, scalable solutions. I specialize in legacy system modernization, complex database migrations, and delivering secure, compliant applications that users love.'
      }]
    }
  ],
  highlights: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Full-Stack Development & Architecture' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'MVP to Enterprise Scaling' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'AI-Integrated Applications' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Secure & Compliant Engineering' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Legacy System Modernization' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Clear Communication & Collaboration' }]
    }
  ],
  stats: [
    { value: '4+', label: 'Years Experience' },
    { value: '30+', label: 'Databases Migrated' },
    { value: '50+', label: 'Client Sites Managed' }
  ],
  education: [
    {
      type: 'bachelor',
      field: 'Computer Science',
      degree: 'Bachelor of Science',
      institution: 'University of Lethbridge',
      startDate: '09-09-2019',
      graduationDate: '04-21-2023',
      current: false,
    }
  ]
};

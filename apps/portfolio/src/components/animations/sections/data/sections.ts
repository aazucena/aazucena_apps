/**
 * Section Configuration
 * Section names and metadata
 */

export const TOTAL_SECTIONS = 8;

export const SECTION_NAMES = [
  'hero',
  'about',
  'projects',
  'experience',
  'skills',
  'testimonials',
  'blog',
  'awards'
] as const;

export type SectionName = typeof SECTION_NAMES[number];

export interface SectionMetadata {
  id: number;
  name: SectionName;
  title: string;
  subtitle?: string;
}

export const sectionMetadata: SectionMetadata[] = [
  {
    id: 0,
    name: 'hero',
    title: 'Aldrin Azucena',
    subtitle: 'Full Stack Software Developer'
  },
  {
    id: 1,
    name: 'about',
    title: 'About Me',
    subtitle: 'Building Products That Drive Impact'
  },
  {
    id: 2,
    name: 'projects',
    title: 'Featured Projects',
    subtitle: 'Real Solutions, Real Impact'
  },
  {
    id: 3,
    name: 'experience',
    title: 'Experience',
    subtitle: 'Building Excellence Over Time'
  },
  {
    id: 4,
    name: 'skills',
    title: 'Skills & Technologies',
    subtitle: 'Tools I Use to Build Great Products'
  },
  {
    id: 5,
    name: 'testimonials',
    title: 'Testimonials',
    subtitle: 'What People Say'
  },
  {
    id: 6,
    name: 'blog',
    title: 'Blog',
    subtitle: 'Thoughts & Insights'
  },
  {
    id: 7,
    name: 'awards',
    title: 'Awards & Certifications',
    subtitle: 'Recognition & Achievements'
  }
];

/**
 * Experience Data
 * Professional work experience and achievements
 */

import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { WebLink } from '~/lib/validators/web-link';

export interface Achievement {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  badge?: any;
  date?: string;
  sort?: number;
}

export interface SkillWithCategory {
  name: string;
  category: string;
}

export interface Experience {
  slug: string; // URL-friendly slug for dynamic routes
  logo: string;
  logoGradient: string;
  position: string;
  company: string;
  duration: string; // Formatted duration string for display

  // Raw date fields from CMS (for journey visualizations)
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  isCurrent: boolean;

  // Content fields (from Strapi)
  description: string; // richtext (markdown/HTML string)
  responsibilities: BlocksContent; // blocks (JSON)
  achievements: Achievement[];

  skills: SkillWithCategory[];

  // New relations (Phase 0.5)
  projects?: Array<{
    id: number;
    documentId?: string;
    title: string;
    slug: string;
    shortDescription?: string;
  }>;
  relatedLinks?: WebLink[];

  // Additional metadata
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship' | 'Co-op';
  workMode?: 'Onsite' | 'Hybrid' | 'Remote';
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'midsize' | 'large' | 'enterprise' | 'global';
  companyWebsite?: string | null;
  companyLinkedIn?: string | null;
}

export const experiences: Experience[] = [
  {
    slug: 'full-stack-software-developer-tangle-media',
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
    description: 'Full-stack software development with focus on scalable web applications and database management',
    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built 25+ reusable UI components reducing development time by 25% and UI-related bugs by 15%' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Migrated 30+ databases (5TB+) with zero data loss using custom Python scripts and validation frameworks' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Managed 50+ client sites with 99.95% uptime through proactive monitoring and rapid incident response' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Developed 15+ multilingual accessible websites achieving Lighthouse scores above 95 and WCAG compliance' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Created 15+ admin dashboards reducing content publishing time from 30 minutes to under 10 minutes' }]
          }
        ]
      }
    ],
    achievements: [],
    skills: ['React', 'TypeScript', 'Python', 'WordPress', 'MySQL', 'PostgreSQL', 'Accessibility', 'Performance Optimization', 'UI/UX Design', 'Database Migration']
  },
  {
    slug: 'software-developer-intern-helpusdefend',
    logo: 'HD',
    logoGradient: 'from-purple-400 to-pink-500',
    position: 'Software Developer Intern',
    company: 'HelpUsDefend',
    duration: 'May 2021 – Jan 2022',
    location: 'Calgary, AB',
    employmentType: 'Internship',
    workMode: 'Remote',
    industry: 'Technology',
    companySize: 'startup',
    description: 'Mobile app development internship with focus on AI/ML integration and legacy code refactoring',
    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built proof-of-concept Flutter mobile app with TensorFlow Lite AI camera integration achieving 95% accuracy' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Reduced technical debt by 25% through comprehensive refactoring of legacy codebase' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Implemented automated testing suite improving code coverage from 40% to 75%' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Collaborated with cross-functional teams in an Agile environment to deliver features on schedule' }]
          }
        ]
      }
    ],
    achievements: [],
    skills: ['Flutter', 'Dart', 'TensorFlow Lite', 'AI/ML', 'Mobile Development', 'Automated Testing', 'Agile', 'Code Refactoring']
  },
  {
    slug: 'web-developer-intern-interfaith-food-bank',
    logo: 'IFB',
    logoGradient: 'from-green-400 to-emerald-500',
    position: 'Web Developer Intern',
    company: 'Interfaith Food Bank',
    duration: 'Feb 2019 – Aug 2020',
    location: 'Calgary, AB',
    employmentType: 'Internship',
    workMode: 'Onsite',
    industry: 'Non-Profit',
    companySize: 'medium',
    companyWebsite: 'https://www.interfaithfoodbank.ca',
    description: 'Web development internship for non-profit organization building volunteer management system',
    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Launched volunteer management tool serving 1,000+ active users with real-time scheduling capabilities' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Increased volunteer sign-ups by 35% through intuitive UX design and streamlined registration process' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built responsive web application using React and Node.js with PostgreSQL database' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Implemented user authentication and authorization system ensuring data security and privacy' }]
          }
        ]
      }
    ],
    achievements: [],
    skills: ['React', 'Node.js', 'PostgreSQL', 'Authentication', 'UX Design', 'Responsive Design', 'Real-time Systems', 'REST APIs']
  }
];

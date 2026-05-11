/**
 * [Types] : Domain_Entities
 * Shared models for the Aldrin Azucena ecosystem.
 */

export interface Domain_Skill {
  id: string;
  name: string;
  category:
    | 'Frontend'
    | 'Backend'
    | 'Database'
    | 'DevOps'
    | 'Design'
    | 'Tools'
    | 'Music Production';
  proficiency: 'learning' | 'competent' | 'proficient' | 'expert';
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
}

export interface Domain_Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  projectType: string;
  repositoryUrl?: string;
  liveDemoUrl?: string;
  status: 'Planned' | 'In Progress' | 'Released' | 'Maintenance' | 'Completed';
  tags: string[];
}

export interface Domain_Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies: string[];
}

export interface Domain_BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: unknown;
  publishedAt: string;
  readingTime: string;
  tags: string[];
}

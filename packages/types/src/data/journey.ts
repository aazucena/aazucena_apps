/**
 * [Types] : Journey_Page_Visualization_Interfaces
 */

export interface SkillsOverTime {
  year: number;
  categories: {
    [category: string]: number;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  size: number;
}

export interface SkillLink {
  source: string;
  target: string;
  value: number;
}

export interface SkillsNetworkData {
  nodes: SkillNode[];
  links: SkillLink[];
}

export interface SkillDetails {
  name: string;
  category: string;
  yearsUsed: number[];
  totalProjects: number;
  totalExperiences: number;
  relatedSkills: string[];
  firstUsed: Date;
  lastUsed: Date;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
}

export interface CareerStat {
  totalYears: number;
  totalCompanies: number;
  totalTechnologies: number;
  currentRole: string | null;
}

export interface GrowthData {
  fastestGrowingCategory: string;
  mostUsedTechnology: string;
  learningVelocity: number;
  topDomain: string;
}

export interface SankeyNode {
  id: string;
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface HeatmapCell {
  date: Date;
  count: number;
  category?: string;
  categoryDistribution?: Record<string, number>;
}

export interface StreamGraphStep {
  date: Date;
  [category: string]: unknown;
}

export interface TimelineNode {
  date: Date;
  endDate: Date;
  type: 'experience' | 'education';
  company?: string;
  position?: string;
  logo?: string;
  logoGradient?: string;
  slug?: string;
  skills?: unknown[];
  institution?: string;
  degree?: string;
  field?: string;
  educationType?: string;
  honors?: string | null;
  gpa?: number | null;
  duration: number;
  isCurrent: boolean;
  title: string;
  subtitle: string;
}

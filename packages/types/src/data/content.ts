/**
 * [Types] : Transformed_Portfolio_Data_Interfaces
 */

import type { ComponentType } from 'react';
import type { IconComponent } from '../icons';

// --- Shared Utility Shapes ---

export interface TransformedImage {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface TransformedOpenGraph {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type: string;
}

export interface TransformedSeo {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  robots: string;
  viewport: string;
  canonical?: string;
  twitterCard: string;
  openGraph?: TransformedOpenGraph;
  structuredData?: unknown;
}

export interface TransformedTag {
  label: string;
  color: string;
}

export interface TransformedStat {
  label: string;
  value: string;
  description?: string;
  icon?: unknown;
  sort: number;
}

export interface TransformedWebLink {
  text: string;
  url: string;
  openInNewTab: boolean;
  icon?: unknown;
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  class?: string;
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

export type IntegrityStatus = 'OPERATIONAL' | 'DEGRADED' | 'UNKNOWN' | 'LOADING';

export interface TransformedCtaButton {
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  openInNewTab: boolean;
  icon?: unknown;
}

// --- Content Entities ---

export interface SocialLink {
  platform: string;
  url: string;
  icon?: unknown;
  text?: string;
  description?: string;
  openInNewTab: boolean;
}

export interface NarrativeItem {
  title: string;
  description: string;
  icon?: unknown;
  variant?: string;
}

export interface FocusArea {
  title: string;
  experience: string;
  description: string;
  variant?: string;
}

export interface WorkflowItem {
  name: string;
  detail: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface WorkingStyleItem {
  title: string;
  subtitle: string;
  description: string;
  icon?: unknown;
  variant?: string;
}

export interface NavigationItem {
  id?: number;
  title: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'WRAPPER';
  path: string | null;
  externalPath?: string | null;
  slug?: string;
  external?: boolean;
  uiRouterKey?: string;
  menuAttached?: boolean;
  order?: number;
  related?: unknown;
  audience?: unknown[];
  // Custom fields nested by the navigation plugin
  additionalFields?: {
    label?: string; // Display text that overrides title
    icon?: string;
    buttonStyle?: 'primary' | 'secondary' | 'outline';
    description?: string;
    cssClass?: string;
  };
  items?: NavigationItem[];

  // Flattened fields (added by transformer)
  label?: string;
  icon?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  description?: string;
  cssClass?: string;
}

export interface StreamingLink {
  platform: string;
  url: string;
  isPrimary: boolean;
}

export type WebLink = TransformedWebLink;

export interface Achievement {
  id?: number;
  title: string;
  description: string;
  icon?: unknown;
  badge?: TransformedImage;
  date?: string;
  sort: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: unknown;
  display: string;
  projectType?: string;
  projectStatus?: string;
  sort: number;
  coverImage?: TransformedImage;
  screenshots?: TransformedImage[];
  demoVideoUrl?: string;
  tags: TransformedTag[];
  techStack: { name: string; category: string }[];
  metrics: TransformedStat[];
  relatedLinks: TransformedWebLink[];
  experience?: {
    position: string;
    company: string;
    slug: string;
  };
  repositoryUrl?: string;
  liveDemoUrl?: string;
  seo?: TransformedSeo;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: number;
  slug: string;
  company: string;
  position: string;
  companyLogo?: TransformedImage;
  industry?: string;
  companySize?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: unknown;
  responsibilities?: unknown;
  employmentType?: string;
  workMode?: string;
  companyWebsite?: string;
  companyLinkedIn?: string;
  skills: { name: string; category: string }[];
  achievements: Achievement[];
  relatedLinks: TransformedWebLink[];
  projects: { title: string; slug: string; shortDescription?: string }[];
}

export interface Education {
  id: number;
  slug: string;
  type: string;
  degree: string;
  field: string;
  institution: string;
  institutionLogoUrl?: string;
  startDate: string;
  graduationDate?: string;
  current: boolean;
  location?: string;
  gpa?: number;
  honors?: string;
  description?: string;
  achievements: Achievement[];
  skills: { name: string; category: string }[];
  relatedLinks: TransformedWebLink[];
}

export interface Skill {
  name: string;
  category: string;
  proficiency: string;
  display: string;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  documentationUrl?: string;
  lastUsed?: string;
  sort?: number;
}

export interface SkillCategoryInfo {
  id: number;
  name: string;
  label: string;
  icon?: IconComponent;
  gradient?: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  documentId?: string;
  label: string;
  display: string;
  gradient: string;
  icon?: unknown;
  skills: Skill[];
}

export interface Award {
  id: string;
  type: 'certification' | 'award';
  title: string;
  shortTitle: string;
  organization: string;
  issuer?: string;
  date?: string;
  year: number;
  credentialId?: string;
  description?: unknown;
  category?: string;
  verificationUrl?: string;
  badgeUrl?: string;
  certificateUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: unknown;
  coverImage?: TransformedImage;
  status?: string;
  sort: number;
  featured: boolean;
  url: string;
  isExternal: boolean;
  tags: TransformedTag[];
  seo?: TransformedSeo;
  relatedLinks: TransformedWebLink[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  gradient: string;
}

export interface SkillWithCategory {
  name: string;
  category: string;
}

// --- Configuration Shapes ---

export interface TransformedPageHeader {
  title: string;
  description?: string;
  watermark?: string;
  accentColor?: string;
}

export interface ContactFormConfig {
  header?: TransformedPageHeader;
  formTitle: string;
  submitButtonLabel: string;
  successMessage: string;
}

export interface HeroData {
  flipWords: string[];
  taglineTemplate: string;
  primaryButtonText?: string;
  showDropdown: boolean;
  secondaryButtonText?: string;
  showSecondaryButton: boolean;
}

export interface AboutData {
  tagline: string;
  descriptions: unknown;
  highlights: unknown;
  stats: TransformedStat[];
  learnMoreCards: {
    title: string;
    variant?: string;
    description?: string;
    icon?: unknown;
    button: TransformedCtaButton;
  }[];
  focusAreas: unknown[];
  roots: unknown[];
  interests: unknown[];
  coreValues: unknown[];
  workflow: unknown[];
  languages: unknown[];
  workingStyle: WorkingStyleItem[];
}

export interface Section {
  id?: number;
  enabled: boolean;
  name: string;
  title: string;
  subtitle?: string | null;
  buttonLabel?: string | null;
  icon?: unknown;
  sort: number;
}

export interface HomepageData {
  title: string;
  sections: Section[];
  seo?: TransformedSeo;
}

export interface TechStackItem {
  name: string;
  iconTitle: string;
  iconUrl?: string;
  sort: number;
}

export interface WebsiteConfig {
  siteName: string;
  siteUrl: string;
  siteTagline?: string;
  baseUrl: string;
  siteLogoUrl?: string;
  faviconUrl?: string;
  defaultSEO: TransformedSeo;
  metaTitleTemplate: string;
  openGraphSiteName?: string;
  twitterHandle?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerificationId?: string;
  footerBrandDescription?: string;
  footerLocationTagline?: string;
  footerBuiltWithLabel: string;
  techStack: unknown[];
}

export interface PhaseItem {
  id?: number;
  enabled: boolean;
  name: string;
  badge?: string | null;
  title: string;
  description: string;
  items?: NarrativeItem[];
}

export interface JourneyPageConfig {
  header?: TransformedPageHeader;
  phases: PhaseItem[];
  callToAction?: {
    title: string;
    description?: string;
    buttons: TransformedCtaButton[];
  };
}

export interface ProjectShowcaseConfig {
  header?: unknown;
  searchPlaceholder: string;
  dragHintText: string;
  viewMoreButtonLabel: string;
  viewMoreButtonSubtitle: string;
  maxProjectsDisplayed: number;
  projectsPerPage: number;
  listPagePath?: string;
}

export interface ExperienceShowcaseConfig {
  header?: unknown;
  searchPlaceholder: string;
  listPagePath: string;
}

export interface SkillShowcaseConfig {
  header?: unknown;
  highlyUsedThreshold: number;
  searchPlaceholder: string;
  emptyMessage: string;
}

export interface BlogConfigData {
  postsPerPage: number;
  permalink: string;
  paths: {
    main: string;
    category: string;
    tag: string;
  };
  relatedPosts: {
    enabled: boolean;
    count: number;
  };
  display: {
    postsCount: number;
    gridColumns: 1 | 2 | 3 | 4;
    showTags: boolean;
    showDate: boolean;
    showReadTime: boolean;
  };
  viewAllButton: {
    text: string;
    ariaLabel: string;
    show: boolean;
  };
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: unknown;
  template: string;
  lastUpdated: string;
  seo?: TransformedSeo;
  showTableOfContents: boolean;
  footerVariant: string;
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: unknown;
  heroSubtitle: string;
  reachOutLabel: string;
}

export interface PortfolioData {
  fullName: string;
  occupation: string;
  profileImage?: TransformedImage;
  resumeUrl?: string;
  bio?: unknown;
  email: string;
  emailDescription?: string;
  phone?: string;
  availabilityStatus: string;
  timezone: string;
  socialLinks: SocialLink[];
  yearsOfExperience?: number;
  location?: string;
}

export interface ThemeData {
  mode: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
  colors: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  fonts: {
    sans: string;
    serif: string;
    heading: string;
    code: string;
  };
}

export type PortfolioContent = PortfolioData;

/**
 * Registry mapping section names to their components
 */
export type SectionComponent<P = unknown> = ComponentType<P>;

export interface SectionRegistry {
  [key: string]: SectionComponent;
}

export interface AnimationConfigData {
  enabled: boolean;
  heavyAnimations: boolean;
  defaultPerformanceTier: 'low' | 'medium' | 'high' | 'auto';
  particleCounts: {
    low: number;
    medium: number;
    high: number;
  };
  timing: {
    flipText: number;
    sectionTransition: number;
  };
}

import type { PreloaderConfig } from './preloader';

export interface LayoutDataResponse {
  siteConfig: unknown; // We can use more specific type if needed, but SITE_CONFIG is complex
  websiteConfig: WebsiteConfig;
  preloaderConfig: PreloaderConfig;
  maintenance: MaintenanceConfig;
}

// Complete Homepage Aggregate
export interface AggregateHomepageData {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  experiences: Experience[];
  blog: BlogConfigData;
  posts: BlogPost[];
  testimonials: Testimonial[];
  awards: Award[];
  skills: SkillCategory[];
  projectShowcase: ProjectShowcaseConfig;
  experienceShowcase: ExperienceShowcaseConfig;
  skillShowcase: SkillShowcaseConfig;
}

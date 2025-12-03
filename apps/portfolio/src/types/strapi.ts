/**
 * Strapi CMS Type Definitions
 *
 * Type definitions for Strapi v5 content types
 * Based on schemas in apps/cms/src/api/
 *
 * @see docs/strapi/
 */

// ============================================================================
// Base Types
// ============================================================================

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

export interface StrapiBaseAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  localizations?: any[];
}

// ============================================================================
// Component Types
// ============================================================================

export interface StrapiSEO {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  canonicalURL?: string;
  metaRobots?: string;
  openGraph?: StrapiOpenGraph;
}

export interface StrapiOpenGraph {
  id: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiMedia;
  ogType?: string;
  ogUrl?: string;
}

export interface StrapiSocialLinks {
  id: number;
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  soundcloud?: string;
  spotify?: string;
}

export interface StrapiAudioMetadata {
  id: number;
  duration?: number;
  bpm?: number;
  key?: string;
  enharmonicKey?: string;
  timeSignature?: string;
  scale?: string;
  waveformData?: any;
}

export interface StrapiCTAButton {
  id: number;
  text: string;
  url?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  openInNewTab?: boolean;
}

export interface StrapiStats {
  id: number;
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

export interface StrapiAchievement {
  id: number;
  title: string;
  description?: string;
  date?: string;
  icon?: string;
  badge?: StrapiMedia;
}

export interface StrapiEducation {
  id: number;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  grade?: string;
}

export interface StrapiImageElement {
  id: number;
  image: StrapiMedia;
  altText?: string;
  caption?: string;
}

// ============================================================================
// Single Types
// ============================================================================

export interface Hero extends StrapiBaseAttributes {
  title: string;
  subtitle: string;
  flipWords: string[];
  taglineTemplate: string;
  primaryButtonText?: string;
  showDropdown?: boolean;
  dropdownOptions?: any;
  secondaryButtonText?: string;
  showSecondaryButton?: boolean;
}

export interface About extends StrapiBaseAttributes {
  tagline: string;
  descriptions: any; // Blocks content
  highlights: any; // Blocks content
  stats?: StrapiStats[];
  learnMoreCards?: any; // Blocks content
}

export interface Portfolio extends StrapiBaseAttributes {
  fullName: string;
  occupation: string;
  flipWords: string[];
  heroTaglineTemplate: string;
  heroCTAPrimaryText?: string;
  heroShowDropdown?: boolean;
  heroDropdownOptions?: any;
  heroCTASecondaryText?: string;
  heroShowSecondaryButton?: boolean;
  tagline: string;
  descriptions: any;
  highlights: any;
  stats?: StrapiStats[];
  learnMoreCards?: any;
  profileImage?: StrapiImageElement;
  resumeFile?: StrapiMedia;
  bio?: string;
  socialLinks?: StrapiSocialLinks[];
  yearsOfExperience?: number;
  location?: string;
  education?: StrapiEducation[];
  bioEmbedding?: any;
  bioEmbeddingModel?: string;
  bioEmbeddingGeneratedAt?: string;
}

export interface WebsiteConfiguration extends StrapiBaseAttributes {
  siteName: string;
  siteUrl: string;
  siteTagline?: string;
  baseUrl?: string;
  siteLogo?: StrapiMedia;
  favicon?: StrapiMedia;
  defaultSEO: StrapiSEO;
  metaTitleTemplate?: string;
  openGraphSiteName?: string;
  twitterHandle?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  googleSiteVerificationId?: string;
  trailingSlash?: boolean;
  cleanUrls?: boolean;
}

export interface Theme extends StrapiBaseAttributes {
  mode: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  secondaryColorDark: string;
  accentColor: string;
  accentColorDark: string;
  fontSans?: string;
  fontSerif?: string;
  fontHeading?: string;
  fontCode?: string;
}

export interface Homepage extends StrapiBaseAttributes {
  heroSection: boolean;
  aboutSection: boolean;
  experienceSection: boolean;
  skillsSection: boolean;
  testimonialsSection: boolean;
  blogSection: boolean;
  awardsSection: boolean;
}

export interface AnimationSystem extends StrapiBaseAttributes {
  enabled: boolean;
  heavyAnimations: boolean;
  defaultPerformanceTier: 'low' | 'medium' | 'high' | 'auto';
  particleCountLow?: number;
  particleCountMedium?: number;
  particleCountHigh?: number;
  timingFlipText?: number;
  timingSectionTransition?: number;
}

export interface Maintenance extends StrapiBaseAttributes {
  enabled: boolean;
  message: string;
}

export interface Analytics extends StrapiBaseAttributes {
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId?: string;
  vercelAnalyticsEnabled: boolean;
  vercelSpeedInsightsEnabled: boolean;
  plausibleEnabled: boolean;
  plausibleDomain?: string;
  sentryEnabled: boolean;
  sentryDSN?: string;
}

export interface BlogConfiguration extends StrapiBaseAttributes {
  enabled: boolean;
  postsPerPage: number;
  permalink: string;
  mainPath: string;
  categoryPath: string;
  tagPath: string;
  relatedPostsEnabled: boolean;
  relatedPostsCount?: number;
}

// ============================================================================
// Collection Types
// ============================================================================

export interface Skill extends StrapiBaseAttributes {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  proficiency: number; // 1-100
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  featured?: boolean;
  order?: number;
}

export interface MusicGenre extends StrapiBaseAttributes {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface Post extends StrapiBaseAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  content: any; // Blocks/Richtext
  coverImage?: StrapiMedia;
  author?: string;
  tags?: string[];
  categories?: string[];
  featured?: boolean;
  readingTime?: number;
  views?: number;
  seo?: StrapiSEO;
  contentEmbedding?: any;
  contentEmbeddingModel?: string;
  contentEmbeddingGeneratedAt?: string;
}

export interface Project extends StrapiBaseAttributes {
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  coverImage?: StrapiMedia;
  gallery?: StrapiMedia[];
  technologies?: string[];
  category?: 'web' | 'mobile' | 'desktop' | 'game' | 'other';
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'archived';
  seo?: StrapiSEO;
  descriptionEmbedding?: any;
  descriptionEmbeddingModel?: string;
  descriptionEmbeddingGeneratedAt?: string;
}

export interface Experience extends StrapiBaseAttributes {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: StrapiAchievement[];
  technologies?: string[];
  companyLogo?: StrapiMedia;
  companyUrl?: string;
  order?: number;
}

export interface Testimonial extends StrapiBaseAttributes {
  name: string;
  position?: string;
  company?: string;
  testimonialText: string;
  rating?: number; // 1-5
  featured?: boolean;
  avatar?: StrapiMedia;
  companyLogo?: StrapiMedia;
  relationship?: 'client' | 'colleague' | 'manager' | 'other';
  projectRelated?: Project;
  approved?: boolean;
  aiSentiment?: 'positive' | 'neutral' | 'negative';
  aiSummary?: string;
  contentEmbedding?: any;
  contentEmbeddingModel?: string;
  contentEmbeddingGeneratedAt?: string;
}

export interface Award extends StrapiBaseAttributes {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  category?: 'certification' | 'award' | 'achievement' | 'recognition';
  credentialUrl?: string;
  credentialId?: string;
  badge?: StrapiMedia;
  expiryDate?: string;
  skills?: Skill[];
  order?: number;
}

export interface Composition extends StrapiBaseAttributes {
  title: string;
  slug: string;
  description?: string;
  audioFile?: StrapiMedia;
  coverArt?: StrapiMedia;
  genres?: MusicGenre[];
  releaseDate?: string;
  featured?: boolean;
  audioMetadata?: StrapiAudioMetadata;
  waveformImage?: StrapiMedia;
  lyrics?: string;
  credits?: string;
  playCount?: number;
  order?: number;
}

export interface FormSubmission extends StrapiBaseAttributes {
  formType: 'Contact' | 'Feedback' | 'Testimonial' | 'BugReport' | 'FeatureRequest' | 'Collaboration' | 'Referral' | 'MusicFeedback';
  rawMessage?: string;
  email?: string;
  name?: string;
  subject?: string;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: string;

  // AI processing
  aiIntent?: string;
  aiSentiment?: 'positive' | 'neutral' | 'negative';
  aiSummary?: string;
  aiTags?: string[];
  aiConfidence?: number;
  langSmithTraceId?: string;

  // Status tracking
  status?: 'pending' | 'reviewed' | 'resolved' | 'archived';
  assignedTo?: string;
  responseText?: string;
  respondedAt?: string;

  // Embeddings
  messageEmbedding?: any;
  messageEmbeddingModel?: string;
  messageEmbeddingGeneratedAt?: string;
  summaryEmbedding?: any;
  summaryEmbeddingModel?: string;
  summaryEmbeddingGeneratedAt?: string;

  // Form-specific fields (discriminated by formType)
  // Testimonial
  rating?: number;
  testimonialText?: string;

  // Bug Report
  bugSeverity?: 'low' | 'medium' | 'high' | 'critical';
  bugStepsToReproduce?: string;
  bugExpectedBehavior?: string;
  bugActualBehavior?: string;
  githubIssueUrl?: string;

  // Feature Request
  featureDescription?: string;
  featureUseCase?: string;
  featureVotes?: number;

  // Music Feedback
  compositionRelated?: Composition;
  trackTimestamp?: string;
  feedbackType?: 'general' | 'mixing' | 'composition' | 'performance' | 'production';
}

export interface EasterEggCompletion extends StrapiBaseAttributes {
  easterEggId: string;
  username: string;
  completedAt: string;
  ipAddress?: string;
  timeToComplete?: number; // seconds
  hintsUsed?: number;
  score?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export type StrapiSingleTypeResponse<T> = {
  data: T & { id: number; documentId: string };
};

export type StrapiCollectionResponse<T> = {
  data: Array<T & { id: number; documentId: string }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

// ============================================================================
// Helper Types for Populated Relations
// ============================================================================

export type PopulatedProject = Project & {
  technologies?: Skill[];
};

export type PopulatedTestimonial = Testimonial & {
  projectRelated?: Project;
};

export type PopulatedComposition = Composition & {
  genres?: MusicGenre[];
};

export type PopulatedFormSubmission = FormSubmission & {
  compositionRelated?: Composition;
};

export type PopulatedExperience = Experience & {
  technologies?: Skill[];
};
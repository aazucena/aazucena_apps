/**
 * [Types] : Raw_Strapi_API_Response_Interfaces
 * Based on apps/portfolio/src/lib/validators/
 */

// --- Primitives & Common ---

export interface StrapiMedia {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: unknown | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiImageElement {
  id?: number;
  src?: StrapiMedia | null;
  altText: string;
}

export interface StrapiSEO {
  id?: number;
  metaTitle: string;
  metaDescription: string;
  metaImage?: StrapiMedia | null;
  openGraph?: StrapiOpenGraph | null;
  keywords?: string | null;
  metaRobots?: string;
  metaViewport?: string;
  canonicalURL?: string | null;
  structuredData?: unknown | null;
  twitterCard?: string;
}

export interface StrapiOpenGraph {
  id?: number;
  ogTitle: string;
  ogDescription: string;
  ogImage?: StrapiMedia | null;
  ogUrl?: string | null;
  ogType?: string;
}

export interface StrapiTag {
  id?: number;
  label: string;
  color?: string;
}

export interface StrapiStats {
  id?: number;
  label: string;
  value: string;
  description?: string | null;
  icon?: unknown | null;
  sort?: number;
}

export interface StrapiCTAButton {
  id?: number;
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | string;
  size: 'sm' | 'md' | 'lg' | string;
  openInNewTab: boolean;
  icon?: unknown | null;
}

export interface StrapiWebLink {
  id?: number;
  text: string;
  url: string;
  openInNewTab?: boolean;
  icon?: unknown | null;
  description?: string | null;
}

export interface StrapiAchievement {
  id?: number;
  title: string;
  description: string;
  icon?: unknown | null;
  badge?: StrapiMedia | null;
  date?: string | null;
  sort?: number;
}

// --- Collections ---

export interface StrapiProject {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: unknown;
  display: string;
  coverImage?: StrapiImageElement | null;
  screenshots?: StrapiImageElement[] | null;
  demoVideo?: unknown | null;
  gallery?: StrapiMedia[] | null;
  repositoryUrl?: string | null;
  liveDemoUrl?: string | null;
  projectType?: string | null;
  sort?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  projectStatus?: string | null;
  tags?: StrapiTag[] | null;
  techStack?: unknown[] | null;
  metrics?: StrapiStats[] | null;
  seo?: StrapiSEO | null;
  relatedLinks?: StrapiWebLink[] | null;
  experience?: unknown | null;
  education?: unknown | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
}

export interface StrapiExperience {
  id: number;
  documentId?: string;
  slug: string;
  company: string;
  position: string;
  companyLogo?: StrapiImageElement | null;
  industry?: string | null;
  companySize?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean | null;
  description?: unknown;
  responsibilities?: unknown | null;
  employmentType?: string | null;
  workMode?: string | null;
  companyWebsite?: string | null;
  companyLinkedIn?: string | null;
  skillsUsed?: unknown[] | null;
  achievements?: StrapiAchievement[] | null;
  projects?: unknown[] | null;
  relatedLinks?: StrapiWebLink[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
}

export interface StrapiEducation {
  id: number;
  documentId?: string;
  type: string;
  degree: string;
  field: string;
  slug: string;
  institution: string;
  institutionLogo?: StrapiMedia | null;
  institutionWebsite?: string | null;
  startDate: string;
  graduationDate?: string | null;
  current?: boolean;
  location?: string | null;
  gpa?: number | null;
  gpaScale?: number;
  description?: string | null;
  honors?: string | null;
  thesis?: string | null;
  thesisDescription?: string | null;
  sort?: number;
  achievements?: StrapiAchievement[];
  courses?: string[];
  skills?: unknown[];
  extracurriculars?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  featured?: boolean;
  display?: string;
  relatedLinks?: StrapiWebLink[];
  projects?: unknown[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface StrapiSkill {
  id?: number | null;
  documentId?: string | null;
  name: string;
  display: string;
  category: unknown;
  proficiency: string;
  icon?: string | null;
  description?: string | null;
  yearsOfExperience?: number | null;
  documentationUrl?: string | null;
  sort?: number | null;
  lastUsed?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  experiences?: unknown[] | null;
  projects?: unknown[] | null;
  education?: unknown[] | null;
}

export interface StrapiSkillCategory {
  id: number;
  documentId: string;
  name: string;
  label: string;
  icon: string | null;
  display: string;
  variant: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface StrapiPost {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description: unknown;
  coverImage?: StrapiImageElement | null;
  status?: string | null;
  sort?: number | null;
  featured?: boolean;
  url: string;
  isExternal?: boolean;
  tags?: StrapiTag[] | null;
  seo?: StrapiSEO | null;
  relatedLinks?: StrapiWebLink[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface StrapiTestimonial {
  id: number;
  documentId?: string;
  author: string;
  authorTitle: string | null;
  company: string | null;
  content: string;
  avatar: StrapiImageElement | null;
  rating: number;
  featured: boolean;
  relationship: string | null;
  approvalStatus: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  authorEmail: string | null;
  authorLinkedIn: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiAward {
  id: number;
  documentId?: string;
  type: string;
  title: string;
  shortTitle: string | null;
  organization: string;
  issuer: string | null;
  year: number;
  credentialId: string | null;
  description: unknown | null;
  category: string | null;
  verificationUrl: string | null;
  badge: StrapiMedia | null;
  certificate: StrapiMedia | null;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Single Types ---

export interface StrapiPortfolio {
  id: number;
  documentId?: string;
  fullName: string;
  occupation: string;
  profileImage: StrapiImageElement | null;
  resumeFile: unknown | null;
  bio: unknown | null;
  email: string;
  emailDescription: string | null;
  phone: string | null;
  preferredContactMethod: string[] | null;
  socialLinks: unknown[] | null;
  yearsOfExperience: number | null;
  location: string | null;
  availabilityStatus: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiAbout {
  id: number;
  documentId?: string;
  tagline: string;
  descriptions: unknown;
  highlights: unknown;
  stats: StrapiStats[] | null;
  learnMoreCards: unknown[] | null;
  focusAreas: unknown[] | null;
  roots: unknown[] | null;
  interests: unknown[] | null;
  coreValues: unknown[] | null;
  workflow: unknown[] | null;
  languages: unknown[] | null;
  workingStyle: unknown[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiHero {
  id: number;
  documentId?: string;
  flipWords: string[];
  taglineTemplate: string;
  primaryButtonText: string | null;
  showDropdown: boolean;
  secondaryButtonText: string | null;
  showSecondaryButton: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiHomepage {
  id: number;
  documentId?: string;
  title: string;
  sections: unknown[];
  seo: StrapiSEO | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrapiWebsiteConfig {
  id: number;
  documentId?: string;
  siteName: string;
  siteUrl: string;
  siteTagline: string | null;
  baseUrl: string;
  siteLogo: StrapiMedia | null;
  favicon: StrapiMedia | null;
  defaultSEO: StrapiSEO;
  metaTitleTemplate: string;
  openGraphSiteName: string | null;
  twitterHandle: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerificationId: string | null;
  footerBrandDescription: string | null;
  footerLocationTagline: string | null;
  footerBuiltWithLabel: string;
  techStack: unknown[] | null;
  createdAt?: string;
  updatedAt?: string;
}

// --- Configuration Types ---

export interface StrapiLoadingStep {
  id?: number;
  stepId: number;
  name: string;
  description: string;
  icon: string;
  weight: number;
  enabled: boolean;
}

export interface StrapiThemeOverrides {
  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    success?: string;
    successForeground?: string;
    error?: string;
    errorForeground?: string;
    background?: string;
    backgroundGradient?: string;
    cardBackground?: string;
    overlayBackground?: string;
    foreground?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    border?: string;
  };
  effects?: {
    backdropBlur?: string;
    cardBlur?: string;
    shadow?: string;
    glowColor?: string;
    borderRadius?: {
      card?: string;
      button?: string;
      badge?: string;
      progress?: string;
    };
    animationSpeed?: number;
    animationEasing?: string;
  };
  typography?: {
    titleSize?: string;
    titleWeight?: string;
    subtitleSize?: string;
    fontFamily?: string;
  };
  customClass?: string;
}

export interface StrapiPreloaderConfig {
  id?: number;
  documentId?: string;
  enabled: boolean;
  variant: 'interactive' | 'simple';
  theme: 'default' | 'hoyoverse' | 'cyberpunk' | 'minimal' | 'glass' | 'dark' | 'light' | 'nature';
  title: string;
  subtitle?: string;
  readyTitle: string;
  readySubtitle: string;
  readyFooterNote?: string;
  continueButton: StrapiCTAButton;
  minDisplayTime: number;
  maxDisplayTime: number;
  animationDuration: number;
  autoStart: boolean;
  enableSkip: boolean;
  showOnce: boolean;
  lazyLoad: boolean;
  preloadAssets: boolean;
  enableAnimations: boolean;
  transitionType: 'fade' | 'slide' | 'scale' | 'none';
  showCard: boolean;
  loadingSteps: StrapiLoadingStep[];
  primaryColor?: string;
  secondaryColor?: string;
  themeOverrides?: StrapiThemeOverrides;
  ariaLabel: string;
  ariaLive: 'off' | 'polite' | 'assertive';
  skipButtonAriaLabel: string;
  customClassName?: string;
  overlayClassName?: string;
  cardClassName?: string;
  debug: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
}

// --- API Helper Types ---

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

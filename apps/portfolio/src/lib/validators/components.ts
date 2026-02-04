import { z } from 'zod';
import { 
  ColorVariantEnum, 
  GradientVariantEnum, 
  CardLinkVariantEnum, 
  ButtonVariantEnum, 
  ButtonSizeEnum,
  RobotsModeEnum,
  TwitterCardEnum,
  MusicalKeyEnum,
  MusicalScaleEnum,
  OpenGraphTypeEnum,
  SocialPlatformEnum,
  StreamingPlatformEnum
} from './enums';

/**
 * Shared component validators for architectural consistency across the portfolio.
 * Aligned with Strapi v5 component schemas.
 */

// --- Base Utility Schemas ---

/**
 * Validator for Strapi Media fields (Images, Files, etc.)
 */
export const StrapiMediaSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  name: z.string(),
  alternativeText: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  formats: z.any().nullable().optional(),
  hash: z.string(),
  ext: z.string(),
  mime: z.string(),
  size: z.number(),
  url: z.string(),
  previewUrl: z.string().nullable().optional(),
  provider: z.string(),
  provider_metadata: z.any().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// --- UI & Visual Components ---

/**
 * Image element component schema (ui.image-element)
 */
export const ImageElementSchema = z.object({
  id: z.number().optional(),
  src: StrapiMediaSchema.nullable().optional(),
  altText: z.string().max(150),
});

/**
 * Tag component schema (ui.tag)
 */
export const TagSchema = z.object({
  id: z.number().optional(),
  label: z.string().max(30),
  color: ColorVariantEnum.default('cyan'),
});

/**
 * Stats/Metrics component schema (content.stats)
 */
export const StatsSchema = z.object({
  id: z.number().optional(),
  label: z.string().max(50),
  value: z.string().max(20),
  description: z.string().max(100).nullable().optional(),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  sort: z.number().default(0),
});

/**
 * CTA Button component schema (ui.cta-button)
 */
export const CTAButtonSchema = z.object({
  id: z.number().optional(),
  label: z.string().max(50),
  url: z.string().max(255),
  variant: ButtonVariantEnum.default('primary'),
  size: ButtonSizeEnum.default('md'),
  openInNewTab: z.boolean().default(true),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
});

/**
 * Card Link component schema (ui.card-link)
 */
export const CardLinkSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  variant: CardLinkVariantEnum.optional().nullable(),
  description: z.string().max(255).nullable().optional(),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  button: CTAButtonSchema,
});

/**
 * CTA Section component schema (ui.cta-section)
 */
export const CtaSectionSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  buttons: z.array(CTAButtonSchema).min(1).max(3),
});

/**
 * Loading Step component schema (ui.loading-step)
 */
export const LoadingStepSchema = z.object({
  id: z.number().optional(),
  stepId: z.number().min(1).max(20),
  name: z.string().max(50),
  description: z.string().max(100),
  icon: z.any(), // required icons-field
  weight: z.number().min(5).max(50).default(20),
  enabled: z.boolean().default(true),
});

// --- Content & Structural Components ---

/**
 * Web Link component schema (shared.web-link)
 */
export const WebLinkSchema = z.object({
  id: z.number().optional(),
  text: z.string().max(200),
  url: z.string().url().max(255),
  openInNewTab: z.boolean().default(true),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  description: z.string().nullable().optional(),
});

export const WebLinkArraySchema = z.array(WebLinkSchema);

/**
 * Achievement component schema (content.achievement)
 */
export const AchievementSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  description: z.string().max(300),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  badge: StrapiMediaSchema.nullable().optional(),
  date: z.string().nullable().optional(), // date string
  sort: z.number().default(0),
});

/**
 * Section component schema (content.section)
 */
export const SectionSchema = z.object({
  id: z.number().optional(),
  enabled: z.boolean().default(true),
  name: z.string().max(100),
  title: z.string().max(255),
  subtitle: z.string().max(255).nullable().optional(),
  buttonLabel: z.string().max(255).nullable().optional(),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  sort: z.number().default(0),
});

// --- Narrative & Journey Components ---

/**
 * Narrative Item component schema (content.narrative-item)
 */
export const NarrativeItemSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  variant: ColorVariantEnum.default('blue'),
});

/**
 * Phase Item component schema (content.phase-item)
 */
export const PhaseItemSchema = z.object({
  id: z.number().optional(),
  enabled: z.boolean().default(true),
  name: z.string(),
  badge: z.string().nullable().optional(),
  title: z.string(),
  description: z.string(),
  items: z.array(NarrativeItemSchema).optional(),
});

/**
 * Focus Area component schema (content.focus-area)
 */
export const FocusAreaSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  experience: z.string(),
  description: z.string(),
  variant: GradientVariantEnum.default('blue-cyan'),
});

/**
 * Workflow Item component schema (content.workflow-item)
 */
export const WorkflowItemSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  detail: z.string(),
});

/**
 * Language Item component schema (content.language-item)
 */
export const LanguageItemSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  level: z.string(),
});

/**
 * Working Style Item component schema (content.working-style-item)
 */
export const WorkingStyleItemSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  subtitle: z.string().max(100),
  description: z.string().max(500),
  icon: z.any().nullable().optional(), // plugin::icons-field.icon
  variant: GradientVariantEnum.default('blue-cyan'),
});

// --- Meta & Special Components ---

/**
 * Audio Metadata component schema (media.audio-metadata)
 */
export const AudioMetadataSchema = z.object({
  id: z.number().optional(),
  bpm: z.number().min(20).max(300).nullable().optional(),
  timeSignature: z.string().max(10).default('4/4'),
  musicalKey: MusicalKeyEnum.nullable().optional(),
  scale: MusicalScaleEnum.nullable().optional(),
  instrumental: z.boolean().default(true),
  duration: z.number().min(1),
  waveformData: z.any().nullable().optional(),
});

/**
 * Open Graph component schema (shared.open-graph)
 */
export const OpenGraphSchema = z.object({
  id: z.number().optional(),
  ogTitle: z.string().max(70),
  ogDescription: z.string().max(200),
  ogImage: StrapiMediaSchema.nullable().optional(),
  ogUrl: z.string().max(500).nullable().optional(),
  ogType: OpenGraphTypeEnum.default('website'),
});

/**
 * SEO component schema (shared.seo)
 */
export const SeoSchema = z.object({
  id: z.number().optional(),
  metaTitle: z.string().max(60),
  metaDescription: z.string().min(50).max(160),
  metaImage: StrapiMediaSchema.nullable().optional(),
  openGraph: OpenGraphSchema.nullable().optional(),
  keywords: z.string().max(500).nullable().optional(),
  metaRobots: RobotsModeEnum.default('index, follow'),
  metaViewport: z.string().max(200).default('width=device-width, initial-scale=1.0'),
  canonicalURL: z.string().max(500).nullable().optional(),
  structuredData: z.any().nullable().optional(),
  twitterCard: TwitterCardEnum.default('summary_large_image'),
});

/**
 * Page Header component schema (shared.page-header)
 */
export const PageHeaderSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  watermark: z.string().nullable().optional(),
  accentColor: z.string().nullable().optional(), // color-picker hex
});

/**
 * Social Link component schema (shared.social-links)
 */
export const SocialLinkSchema = z.object({
  id: z.number().optional(),
  platform: SocialPlatformEnum,
  url: z.string().max(500),
  icon: z.any().nullable().optional(), // icons-field
  text: z.string().max(100).nullable().optional(),
  description: z.string().max(200).nullable().optional(),
  openInNewTab: z.boolean().default(true),
});

/**
 * Streaming Link component schema (shared.streaming-link)
 */
export const StreamingLinkSchema = z.object({
  id: z.number().optional(),
  platform: StreamingPlatformEnum,
  url: z.string().max(500),
  isPrimary: z.boolean().default(false),
});

/**
 * Skill with Category - used across experiences, education, projects
 * Represents a technical skill with its category classification
 */
export const SkillWithCategorySchema = z.object({
  name: z.string(),
  category: z.string(),
});

// --- Type Exports ---

export type Stats = z.infer<typeof StatsSchema>;
export type CardLink = z.infer<typeof CardLinkSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type WebLink = z.infer<typeof WebLinkSchema>;
export type LoadingStep = z.infer<typeof LoadingStepSchema>;
export type CTAButton = z.infer<typeof CTAButtonSchema>;
export type ImageElement = z.infer<typeof ImageElementSchema>;
export type StrapiMedia = z.infer<typeof StrapiMediaSchema>;
export type Seo = z.infer<typeof SeoSchema>;
export type OpenGraph = z.infer<typeof OpenGraphSchema>;
export type PageHeader = z.infer<typeof PageHeaderSchema>;
export type NarrativeItem = z.infer<typeof NarrativeItemSchema>;
export type PhaseItem = z.infer<typeof PhaseItemSchema>;
export type FocusArea = z.infer<typeof FocusAreaSchema>;
export type WorkflowItem = z.infer<typeof WorkflowItemSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type WorkingStyleItem = z.infer<typeof WorkingStyleItemSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type StreamingLink = z.infer<typeof StreamingLinkSchema>;
export type SkillWithCategory = z.infer<typeof SkillWithCategorySchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Section = z.infer<typeof SectionSchema>;

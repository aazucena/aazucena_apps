import { z } from 'zod';

/**
 * System Dictionary: Centralized Enums for the Portfolio Monorepo.
 * These match the enumeration values defined in Strapi CMS exactly.
 */

// --- Design & UI Enums ---

export const ColorVariantEnum = z.enum([
  'cyan',
  'blue',
  'purple',
  'pink',
  'green',
  'teal',
  'orange',
  'red',
  'gray',
]);

export const GradientVariantEnum = z.enum([
  'blue-cyan',
  'purple-indigo',
  'emerald-teal',
  'orange-red',
  'pink-purple',
]);

export const CardLinkVariantEnum = z.enum([
  'cyan-blue',
  'purple-pink',
  'green-teal',
  'orange-red',
  'indigo-violet',
]);

export const ButtonVariantEnum = z.enum(['primary', 'secondary', 'outline', 'ghost']);

export const ButtonSizeEnum = z.enum(['sm', 'md', 'lg']);

export const FooterVariantEnum = z.enum(['default', 'minimal']);

export const ThemeModeEnum = z.enum(['system', 'light', 'dark', 'light:only', 'dark:only']);

// --- Content Domain Enums ---

export const PostStatusEnum = z.enum(['Planned', 'In Progress', 'Completed', 'On Hold']);

export const ProjectStatusEnum = z.enum([
  'Planned',
  'In Progress',
  'Released',
  'Maintenance',
  'On Hold',
  'Completed',
  'Archived',
]);

export const ProjectDisplayEnum = z.enum(['hidden', 'unlisted', 'standard', 'featured', 'home']);

export const ProjectTypeEnum = z.enum([
  'Web App',
  'Mobile App',
  'Desktop App',
  'Library',
  'API',
  'CLI Tool',
  'Game',
  'Music Production',
  'Hardware/Embedded',
]);

export const EmploymentTypeEnum = z.enum([
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Co-op',
]);

export const WorkModeEnum = z.enum(['Onsite', 'Hybrid', 'Remote']);

export const EducationTypeEnum = z.enum([
  'high-school',
  'diploma',
  'associate',
  'bachelor',
  'master',
  'doctorate',
  'certificate',
  'bootcamp',
  'online-course',
]);

export const EducationDisplayEnum = z.enum(['hidden', 'standard', 'featured']);

export const AvailabilityStatusEnum = z.enum([
  'Open to Opportunities',
  'Busy / Working on Projects',
  'On Break / Personal Time',
  'Looking for Collaborations',
  'Unavailable',
]);

export const IndustryEnum = z.enum([
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Entertainment',
  'Retail',
  'Manufacturing',
  'Government',
  'Non-Profit',
  'Startup',
  'Food & Beverage',
  'Oil & Gas',
  'Media',
]);

export const CompanySizeEnum = z.enum([
  'startup',
  'small',
  'medium',
  'midsize',
  'large',
  'enterprise',
  'global',
]);

export const SentimentEnum = z.enum([
  'Very Positive',
  'Positive',
  'Neutral',
  'Negative',
  'Very Negative',
]);

export const RelationshipEnum = z.enum([
  'Client',
  'Colleague',
  'Manager',
  'Direct Report',
  'Mentor',
  'Mentee',
  'Collaborator',
]);

export const ApprovalStatusEnum = z.enum(['Pending', 'Approved', 'Rejected']);

export const PageTemplateEnum = z.enum(['legal', 'default', 'landing']);

export const SkillDisplayEnum = z.enum(['hidden', 'standard', 'featured', 'core']);

export const SkillProficiencyEnum = z.enum(['learning', 'competent', 'proficient', 'expert']);

export const CategoryDisplayEnum = z.enum(['hidden', 'visible']);

export const SkillCategoryVariantEnum = z.enum([
  'cyan-blue',
  'purple-pink',
  'green-emerald',
  'blue-indigo',
  'yellow-orange',
  'pink-red',
  'teal-cyan',
  'orange-red',
  'violet-purple',
  'indigo-violet',
]);

export const AwardTypeEnum = z.enum(['certification', 'award']);

export const AwardCategoryEnum = z.enum([
  'Academic',
  'Professional',
  'Community',
  'Music',
  'Design',
  'Certification',
  'Competition',
  'Other',
]);

// --- Form & Challenge Enums ---

export const FormTypeEnum = z.enum([
  'Contact',
  'Feedback',
  'Testimonial',
  'Bug Report',
  'Feature Request',
  'Collaboration',
  'Referral',
  'Music Feedback',
]);

export const SubmissionStatusEnum = z.enum(['New', 'In Progress', 'Resolved', 'Closed', 'Spam']);

export const ChallengeTypeEnum = z.enum([
  'Hidden Keyword',
  'Secret Page',
  'Konami Code',
  'Scroll Pattern',
  'Time Based',
  'Interactive Element',
]);

export const RewardTypeEnum = z.enum([
  'Badge',
  'Confetti',
  'Secret Content',
  'Downloadable',
  'Certificate',
  'Leaderboard Entry',
]);

// --- Animation & Technical Enums ---

export const PerformanceTierEnum = z.enum(['low', 'medium', 'high', 'auto']);

export const PreloaderThemeEnum = z.enum([
  'default',
  'hoyoverse',
  'cyberpunk',
  'minimal',
  'glass',
  'dark',
  'light',
  'nature',
]);

export const PreloaderVariantEnum = z.enum(['interactive', 'simple']);

export const AriaLiveEnum = z.enum(['off', 'polite', 'assertive']);

export const TransitionTypeEnum = z.enum(['fade', 'slide', 'scale', 'none']);

// --- SEO & Meta Enums ---

export const RobotsModeEnum = z.enum([
  'index, follow',
  'noindex, follow',
  'index, nofollow',
  'noindex, nofollow',
]);

export const TwitterCardEnum = z.enum(['summary', 'summary_large_image', 'app', 'player']);

export const OpenGraphTypeEnum = z.enum(['website', 'article', 'profile']);

// --- Media & Music Enums ---

export const SocialPlatformEnum = z.enum([
  'GitHub',
  'LinkedIn',
  'Twitter',
  'YouTube',
  'Instagram',
  'Facebook',
  'TikTok',
  'Discord',
  'Twitch',
  'Mastodon',
]);

export const StreamingPlatformEnum = z.enum([
  'Spotify',
  'SoundCloud',
  'YouTube',
  'Apple Music',
  'Bandcamp',
  'Tidal',
]);

export const MusicalKeyEnum = z.enum([
  'C',
  'C#/D♭',
  'D',
  'D#/E♭',
  'E',
  'F',
  'F#/G♭',
  'G',
  'G#/A♭',
  'A',
  'A#/B♭',
  'B',
]);

export const MusicalScaleEnum = z.enum([
  'major',
  'minor',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
  'pentatonic_major',
  'pentatonic_minor',
  'blues',
  'harmonic_minor',
  'melodic_minor',
]);

// --- Type Extractions ---

export type ColorVariant = z.infer<typeof ColorVariantEnum>;
export type GradientVariant = z.infer<typeof GradientVariantEnum>;
export type CardLinkVariant = z.infer<typeof CardLinkVariantEnum>;
export type ButtonVariant = z.infer<typeof ButtonVariantEnum>;
export type ButtonSize = z.infer<typeof ButtonSizeEnum>;
export type ThemeMode = z.infer<typeof ThemeModeEnum>;
export type PostStatus = z.infer<typeof PostStatusEnum>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectDisplay = z.infer<typeof ProjectDisplayEnum>;
export type ProjectType = z.infer<typeof ProjectTypeEnum>;
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;
export type WorkMode = z.infer<typeof WorkModeEnum>;
export type EducationType = z.infer<typeof EducationTypeEnum>;
export type EducationDisplay = z.infer<typeof EducationDisplayEnum>;
export type AvailabilityStatus = z.infer<typeof AvailabilityStatusEnum>;
export type Sentiment = z.infer<typeof SentimentEnum>;
export type ApprovalStatus = z.infer<typeof ApprovalStatusEnum>;
export type Relationship = z.infer<typeof RelationshipEnum>;
export type PageTemplate = z.infer<typeof PageTemplateEnum>;
export type SkillDisplay = z.infer<typeof SkillDisplayEnum>;
export type SkillProficiency = z.infer<typeof SkillProficiencyEnum>;
export type CategoryDisplay = z.infer<typeof CategoryDisplayEnum>;
export type PerformanceTier = z.infer<typeof PerformanceTierEnum>;
export type PreloaderTheme = z.infer<typeof PreloaderThemeEnum>;
export type PreloaderVariant = z.infer<typeof PreloaderVariantEnum>;
export type TransitionType = z.infer<typeof TransitionTypeEnum>;
export type RobotsMode = z.infer<typeof RobotsModeEnum>;
export type TwitterCard = z.infer<typeof TwitterCardEnum>;
export type OpenGraphType = z.infer<typeof OpenGraphTypeEnum>;
export type SocialPlatform = z.infer<typeof SocialPlatformEnum>;
export type StreamingPlatform = z.infer<typeof StreamingPlatformEnum>;
export type MusicalKey = z.infer<typeof MusicalKeyEnum>;
export type MusicalScale = z.infer<typeof MusicalScaleEnum>;
export type FooterVariant = z.infer<typeof FooterVariantEnum>;
export type FormType = z.infer<typeof FormTypeEnum>;
export type SubmissionStatus = z.infer<typeof SubmissionStatusEnum>;
export type ChallengeType = z.infer<typeof ChallengeTypeEnum>;
export type RewardType = z.infer<typeof RewardTypeEnum>;

// --- Services Enums ---

export const ServiceCategoryEnum = z.enum([
  'engineering',
  'consulting',
  'design',
  'ai',
  'analytics',
  'tutoring',
  'devops',
  'creative',
  'research',
]);

export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;

// --- AI & Intelligence Enums ---

export const PromptTypeEnum = z.enum([
  'intent_analyst',
  'assistant',
  'expert',
  'tool',
  'evaluation',
]);

export type PromptType = z.infer<typeof PromptTypeEnum>;

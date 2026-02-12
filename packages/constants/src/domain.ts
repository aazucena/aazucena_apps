import type { SystemStatus, AtmosphericPhase } from '@aazucena/types';

/**
 * ATMOSPHERIC_LAYERS: Content data for atmospheric phases.
 */
export const ATMOSPHERIC_LAYERS: Record<
  AtmosphericPhase,
  { title: string; description: string; altitude: string }
> = {
  exosphere: {
    title: 'Exosphere',
    description:
      "The outermost layer of Earth's atmosphere, extending into space. Where satellites orbit and the atmosphere merges with the vacuum of space.",
    altitude: '700 km - 10,000 km',
  },
  thermosphere: {
    title: 'Thermosphere',
    description:
      'Home to the aurora borealis and aurora australis. The International Space Station orbits in this layer where temperatures can reach 2,500°C.',
    altitude: '80 km - 700 km',
  },
  mesosphere: {
    title: 'Mesosphere',
    description:
      'The coldest layer of the atmosphere where meteors burn up. This is where we see shooting stars streak across the night sky.',
    altitude: '50 km - 80 km',
  },
  stratosphere: {
    title: 'Stratosphere',
    description:
      'Contains the ozone layer that protects us from harmful UV radiation. Commercial airplanes fly in the lower stratosphere.',
    altitude: '12 km - 50 km',
  },
  troposphere: {
    title: 'Troposphere',
    description:
      "The layer we live in! Where all weather occurs and where we find mountains, clouds, and most of Earth's air.",
    altitude: '0 km - 12 km',
  },
};

/**
 * SYSTEM_STATUS_METADATA: Visual mapping for system health.
 */
export const SYSTEM_STATUS_METADATA: Record<SystemStatus, { label: string; colorClass: string }> = {
  OPERATIONAL: {
    label: 'System: Nominal',
    colorClass: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10',
  },
  DEGRADED: {
    label: 'System: Degraded',
    colorClass: 'text-amber-500 bg-amber-500/5 border-amber-500/10',
  },
  UNKNOWN: {
    label: 'System: Offline',
    colorClass: 'text-zinc-500 bg-zinc-500/5 border-zinc-500/10',
  },
  LOADING: {
    label: 'System: Auditing',
    colorClass: 'text-blue-500 bg-blue-500/5 border-blue-500/10 animate-pulse',
  },
};

/**
 * SKILL_CATEGORY_METADATA: Icon and color mapping for skill categories.
 */
export const SKILL_CATEGORY_METADATA: Record<string, { iconId: string; gradientClass: string }> = {
  Frontend: { iconId: 'Layout', gradientClass: 'from-blue-400 to-cyan-400' },
  Backend: { iconId: 'Servers', gradientClass: 'from-green-400 to-emerald-500' },
  Database: {
    iconId: 'Database',
    gradientClass: 'from-yellow-400 to-orange-500',
  },
  Cloud: { iconId: 'Cloud', gradientClass: 'from-purple-400 to-pink-500' },
  Tools: { iconId: 'Wrench', gradientClass: 'from-gray-400 to-gray-600' },
  Design: { iconId: 'Paint', gradientClass: 'from-pink-400 to-rose-500' },
  Testing: { iconId: 'LayersOne', gradientClass: 'from-red-400 to-red-600' },
  Core: { iconId: 'Grid', gradientClass: 'from-blue-400 to-indigo-500' },
  Other: { iconId: 'Terminal', gradientClass: 'from-indigo-400 to-violet-500' },
};

/**
 * SOCIAL_PLATFORM_METADATA: Descriptive mapping for social platforms.
 */
export const SOCIAL_PLATFORM_METADATA: Record<string, string> = {
  GitHub: 'View my repositories',
  LinkedIn: 'Connect professionally',
  Twitter: 'Follow me on Twitter',
  YouTube: 'Watch my videos',
  Instagram: 'Follow on Instagram',
  Facebook: 'Connect on Facebook',
  TikTok: 'Follow on TikTok',
  Discord: 'Join my Discord',
  Twitch: 'Watch my streams',
  Mastodon: 'Follow on Mastodon',
  Email: 'Send me a message',
};

/**
 * TELEMETRY_EVENT_METADATA: Visual configuration for system logs.
 */
export const TELEMETRY_EVENT_METADATA: Record<
  string,
  {
    iconId: string;
    colorClass: string;
    dotVariant: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  }
> = {
  'Page View': {
    iconId: 'Eye',
    colorClass: 'text-cyan-400',
    dotVariant: 'primary',
  },
  'Music Play': {
    iconId: 'Music',
    colorClass: 'text-purple-400',
    dotVariant: 'default',
  },
  Interaction: {
    iconId: 'MousePointer',
    colorClass: 'text-primary-400',
    dotVariant: 'success',
  },
  'Form Submit': {
    iconId: 'Envelope',
    colorClass: 'text-orange-400',
    dotVariant: 'warning',
  },
  Error: {
    iconId: 'DangerTriangle',
    colorClass: 'text-rose-400',
    dotVariant: 'danger',
  },
};

/**
 * LEARN_MORE_VARIANTS: Gradient and color definitions for LearnMore cards.
 */
export const LEARN_MORE_VARIANTS: Record<string, { card: string; icon: string; button: string }> = {
  'cyan-blue': {
    card: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 border-cyan-400/30',
    icon: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    button: 'text-cyan-400',
  },
  'emerald-teal': {
    card: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-400/20 hover:to-teal-500/20 border-emerald-400/30',
    icon: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    button: 'text-emerald-400',
  },
  'purple-pink': {
    card: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-400/20 hover:to-pink-500/20 border-purple-400/30',
    icon: 'bg-gradient-to-br from-purple-400 to-pink-500',
    button: 'text-purple-400',
  },
  'orange-red': {
    card: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-400/20 hover:to-red-500/20 border-orange-400/30',
    icon: 'bg-gradient-to-br from-orange-400 to-red-500',
    button: 'text-orange-400',
  },
  'indigo-purple': {
    card: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-400/20 hover:to-purple-500/20 border-indigo-400/30',
    icon: 'bg-gradient-to-br from-indigo-400 to-purple-500',
    button: 'text-indigo-400',
  },
};

/**
 * WORKING_STYLE_FALLBACKS: Default content for working style items.
 */
export const WORKING_STYLE_FALLBACKS = [
  {
    title: 'Collaborative Architect',
    subtitle: 'Teamwork & Communication',
    description:
      'I believe the best code comes from diverse perspectives. I prioritize clear documentation and constructive code reviews to elevate the whole team.',
    iconId: 'Users',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Pragmatic Problem Solver',
    subtitle: 'Strategy & Execution',
    description:
      'I focus on shipping value. I balance technical excellence with business requirements, ensuring we solve the right problems at the right time.',
    iconId: 'Zap',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  },
  {
    title: 'Continuous Mentor',
    subtitle: 'Growth & Culture',
    description:
      'Sharing knowledge is as important as writing code. I actively participate in mentorship and knowledge-sharing sessions to foster technical growth.',
    iconId: 'Message',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
];

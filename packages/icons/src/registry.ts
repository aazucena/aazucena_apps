import * as Icons from '@mynaui/icons-react';
import {
  Briefcase,
  ClockCircle,
  Code,
  FileText,
  User,
  Shield,
  Rss,
  Map,
  GitBranch,
  Send,
} from '@mynaui/icons-react';
import {
  AstroIcon,
  ReactIcon,
  TailwindIcon,
  ViteIcon,
  RssIcon,
  BrandIcon,
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  DiscordIcon,
  TwitchIcon,
  MastodonIcon,
  EmailIcon,
  DownloadIcon,
  ImageIcon,
  VectorIcon,
  ScrollDownIcon,
  EmptyIcon,
  AwardBadgeIcon,
  ViewportsIcon,
} from './custom/index.js';
import type { IconComponent } from '@aazucena/types';

/**
 * Maps icon name string to @mynaui/icons-react component
 * Also handles SVG strings from strapi-plugin-icons-field
 */
export function getIconComponent(iconName: string | null | undefined): IconComponent {
  // Handle null/undefined/empty icon names - return fallback
  if (!iconName || iconName.trim() === '') {
    return Icons.Code as IconComponent;
  }

  // Check if iconName is an SVG string (from strapi-plugin-icons-field)
  if (iconName.startsWith('<svg')) {
    return iconName;
  }

  // Map icon names to components
  const iconMap: Record<string, IconComponent> = {
    // Custom Icons
    Astro: AstroIcon as IconComponent,
    React: ReactIcon as IconComponent,
    Tailwind: TailwindIcon as IconComponent,
    Vite: ViteIcon as IconComponent,
    Rss: RssIcon as IconComponent,
    BrandLogo: BrandIcon as IconComponent,
    ScrollDown: ScrollDownIcon as IconComponent,
    Empty: EmptyIcon as IconComponent,
    AwardBadge: AwardBadgeIcon as IconComponent,
    Download: Icons.Download as IconComponent,
    DownloadAlt: DownloadIcon as IconComponent,
    Vector: VectorIcon as IconComponent,
    Viewports: ViewportsIcon as IconComponent,

    // Official Social Logos
    GitHub: GitHubIcon as IconComponent,
    LinkedIn: LinkedInIcon as IconComponent,
    Twitter: TwitterIcon as IconComponent,
    X: TwitterIcon as IconComponent,
    YouTube: YoutubeIcon as IconComponent,
    Instagram: InstagramIcon as IconComponent,
    Facebook: FacebookIcon as IconComponent,
    TikTok: TiktokIcon as IconComponent,
    Discord: DiscordIcon as IconComponent,
    Twitch: TwitchIcon as IconComponent,
    Mastodon: MastodonIcon as IconComponent,
    Email: EmailIcon as IconComponent,

    // Library Icons
    Code: Icons.Code as IconComponent,
    Terminal: Icons.Terminal as IconComponent,
    BrandGithub: Icons.BrandGithub as IconComponent,
    Git: Icons.BrandGithub as IconComponent,
    Database: Icons.Database as IconComponent,
    Server: Icons.Servers as IconComponent,
    Cloud: Icons.Cloud as IconComponent,
    Globe: Icons.Globe as IconComponent,
    Link: Icons.Link as IconComponent,
    Wifi: Icons.Wifi as IconComponent,
    Layout: Icons.Layout as IconComponent,
    Wrench: Icons.Wrench as IconComponent,
    CogFour: Icons.CogFour as IconComponent,
    Settings: Icons.CogFour as IconComponent,
    Zap: Icons.Zap as IconComponent,
    Bolt: Icons.Zap as IconComponent,
    Rocket: Icons.Rocket as IconComponent,
    ArrowRight: Icons.ArrowRight as IconComponent,
    Image: ImageIcon as IconComponent,
    Music: Icons.Music as IconComponent,
    Video: Icons.Video as IconComponent,
    Users: Icons.Users as IconComponent,
    User: Icons.User as IconComponent,
    CheckCircle: Icons.CheckCircle as IconComponent,
    Shield: Icons.Shield as IconComponent,
    DeviceMobile: Icons.Mobile as IconComponent,
    Chip: Icons.Chip as IconComponent,
    Headphones: Icons.Headphones as IconComponent,
    Microphone: Icons.Microphone as IconComponent,
  };

  return (
    iconMap[iconName] || (Icons as unknown as Record<string, IconComponent>)[iconName] || Icons.Code
  );
}

/**
 * Checks if an icon name is valid and exists in the icon map
 */
export function isValidIconName(iconName: string): boolean {
  const customIcons = [
    'Astro',
    'React',
    'Tailwind',
    'Vite',
    'Rss',
    'BrandLogo',
    'ScrollDown',
    'Empty',
    'GitHub',
    'LinkedIn',
    'Twitter',
    'X',
    'YouTube',
    'Instagram',
    'Facebook',
    'TikTok',
    'Discord',
    'Twitch',
    'Mastodon',
    'Email',
  ];
  return iconName in Icons || iconName.startsWith('<svg') || customIcons.includes(iconName);
}

/**
 * Navigation-specific icon mapping
 */
export const navigationIcons = {
  briefcase: Briefcase,
  'clock-circle': ClockCircle,
  code: Code,
  'file-text': FileText,
  user: User,
  shield: Shield,
  rss: Rss,
  map: Map,
  'git-branch': GitBranch,
  send: Send,
};

/**
 * Get navigation icon component by name
 */
export function getNavigationIcon(iconName?: string) {
  if (!iconName) return null;
  return (
    (navigationIcons as unknown as Record<string, import('react').ElementType>)[iconName] || null
  );
}

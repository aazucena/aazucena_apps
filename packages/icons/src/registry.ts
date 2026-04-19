import * as MynaIcons from '@mynaui/icons-react';
import * as SimpleIcons from '@icons-pack/react-simple-icons';
import * as CustomIcons from './custom/index';
import type { IconComponent } from '@aazucena/types';

// Fallback icon when a name cannot be resolved
const FallbackIcon = MynaIcons.Code as IconComponent;

// Aliases: map legacy / convenience names to the correct export name in one of the namespaces.
// Only add an entry here when the desired name differs from the actual export name.
const ALIASES: Record<string, IconComponent> = {
  // Custom-icon aliases (CMS sends these names; map to the actual custom component)
  BrandLogo: CustomIcons.Brand as IconComponent,
  GitHubAlt: CustomIcons.GitHub as IconComponent,
  LinkedIn: CustomIcons.LinkedIn as IconComponent,
  Twitter: CustomIcons.Twitter as IconComponent,
  X: CustomIcons.Twitter as IconComponent,
  YouTube: CustomIcons.Youtube as IconComponent,
  Instagram: CustomIcons.Instagram as IconComponent,
  Facebook: CustomIcons.Facebook as IconComponent,
  TikTok: CustomIcons.Tiktok as IconComponent,
  Discord: CustomIcons.Discord as IconComponent,
  Twitch: CustomIcons.Twitch as IconComponent,
  Mastodon: CustomIcons.Mastodon as IconComponent,
  EmailAlt: CustomIcons.Email as IconComponent,
  DownloadAlt: CustomIcons.Download as IconComponent,

  // MynaUI aliases (short / conventional names → actual mynaui export names)
  Git: MynaIcons.GitCircle as IconComponent,
  Server: MynaIcons.Servers as IconComponent,
  Settings: MynaIcons.CogFour as IconComponent,
  Bolt: MynaIcons.Zap as IconComponent,
  DeviceMobile: MynaIcons.Mobile as IconComponent,
  Chip: MynaIcons.Microchip as IconComponent,
};

/**
 * Resolves an icon name string to its React component.
 *
 * Resolution order:
 *   1. Inline SVG strings (from strapi-plugin-icons-field) — returned as-is
 *   2. Explicit aliases (legacy names, cross-namespace renames)
 *   3. Custom icons  (@aazucena/icons/custom — overrides library names where needed)
 *   4. MynaUI icons  (@mynaui/icons-react — any icon by its exact export name)
 *   5. SimpleIcons   (@icons-pack/react-simple-icons — Si-prefixed brand logos)
 *   6. Fallback: Code icon
 */
export function getIconComponent(iconName: string | null | undefined): IconComponent {
  if (!iconName?.trim()) return FallbackIcon;

  // 1. SVG string (from Strapi icons field)
  if (iconName.startsWith('<svg')) return iconName as unknown as IconComponent;

  // 2. Explicit aliases
  if (iconName in ALIASES) return ALIASES[iconName]!;

  // 3. Custom icons (brand logos, hand-crafted SVGs — checked before mynaui so custom wins)
  const custom = (CustomIcons as Record<string, unknown>)[iconName];
  if (typeof custom === 'function') return custom as IconComponent;

  // 4. MynaUI (any stroke-style icon by its exact export name, e.g. "Lamp", "Heart", "Compass")
  const myna = (MynaIcons as Record<string, unknown>)[iconName];
  if (typeof myna === 'function') return myna as IconComponent;

  // 5. SimpleIcons (Si-prefixed brand logos, e.g. "SiGithub", "SiVercel")
  const si = (SimpleIcons as Record<string, unknown>)[iconName];
  if (typeof si === 'function') return si as IconComponent;

  return FallbackIcon;
}

/**
 * Checks if an icon name resolves to a known component.
 */
export function isValidIconName(iconName: string): boolean {
  if (!iconName) return false;
  if (iconName.startsWith('<svg')) return true;
  if (iconName in ALIASES) return true;
  if (typeof (CustomIcons as Record<string, unknown>)[iconName] === 'function') return true;
  if (typeof (MynaIcons as Record<string, unknown>)[iconName] === 'function') return true;
  if (typeof (SimpleIcons as Record<string, unknown>)[iconName] === 'function') return true;
  return false;
}

/**
 * Navigation-specific icon mapping (kebab-case names used by the CMS navigation plugin).
 * Uses getIconComponent so any valid icon name works automatically.
 */
export function getNavigationIcon(iconName?: string): import('react').ElementType | null {
  if (!iconName) return null;
  const component = getIconComponent(iconName);
  return component !== FallbackIcon ? (component as import('react').ElementType) : null;
}

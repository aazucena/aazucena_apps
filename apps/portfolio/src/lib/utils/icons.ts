import * as Icons from '@mynaui/icons-react';
import type { IconComponent } from '~/types/icons';

/**
 * Maps icon name string to @mynaui/icons-react component
 * Also handles SVG strings from strapi-plugin-icons-field
 *
 * @param iconName - Icon name (e.g., "Code", "Database") or SVG string
 * @returns React icon component or SVG string
 *
 * @example
 * // With icon name
 * const icon = getIconComponent("Code");
 * <IconRenderer icon={icon} />
 *
 * @example
 * // With SVG string (from CMS)
 * const icon = getIconComponent("<svg>...</svg>");
 * <IconRenderer icon={icon} />
 */
export function getIconComponent(
  iconName: string | null | undefined
): IconComponent {
  // Handle null/undefined/empty icon names - return fallback
  if (!iconName || iconName.trim() === '') {
    if (import.meta.env.DEV) {
      console.warn('[Icons] Icon name is empty or null, using default Code icon');
    }
    return Icons.Code as IconComponent;
  }

  // Check if iconName is an SVG string (from strapi-plugin-icons-field)
  if (iconName.startsWith('<svg')) {
    // Return the raw SVG string - IconRenderer will handle it
    return iconName;
  }

  // Map icon names to @mynaui/icons-react exports
  // This handles common naming variations and provides fallbacks
  const iconMap: Record<string, keyof typeof Icons> = {
    // Development & Code
    'Code': 'Code',
    'Terminal': 'Terminal',
    'BrandGithub': 'BrandGithub',
    'Git': 'BrandGithub', // Alias

    // Data & Storage
    'Database': 'Database',
    'Server': 'Servers',
    'Cloud': 'Cloud',

    // Web & Network
    'Globe': 'Globe',
    'Link': 'Link',
    'Wifi': 'Wifi',

    // UI & Design
    // 'Palette': 'Palette',
    // 'PaintBrush': 'PaintBrush',
    'Layout': 'Layout',

    // Tools & Settings
    // 'Tools': 'Tools',
    'Wrench': 'Wrench',
    'CogFour': 'CogFour',
    'Settings': 'CogFour', // Alias

    // Actions & Navigation
    'Zap': 'Zap',
    'Bolt': 'Zap', // Alias
    'Rocket': 'Rocket',
    'ArrowRight': 'ArrowRight',

    // Media & Content
    'Image': 'Image',
    'Music': 'Music',
    'Video': 'Video',

    // People & Communication
    'Users': 'Users',
    'User': 'User',
    // 'Mail': 'Mail',

    // Status & Feedback
    'CheckCircle': 'CheckCircle',
    'Shield': 'Shield',
    // 'Alert': 'AlertTriangle',

    // Mobile & Devices
    'DeviceMobile': 'Mobile',
    // 'Devices': 'Devices',

    // Hardware & Electronics
    'Chip': 'Chip',
    // 'Cpu': 'Cpu',
    // 'CircuitBoard': 'Circuit',

    // Audio & Music
    // 'Waveform': 'WaveSquare',
    'Headphones': 'Headphones',
    'Microphone': 'Microphone',
  };

  // Check if icon exists in map
  if (!iconMap[iconName]) {
    if (import.meta.env.DEV) {
      console.warn(
        `[Icons] Unknown icon: "${iconName}", falling back to Code icon. Available icons: ${Object.keys(iconMap).slice(0, 10).join(', ')}...`
      );
    }
  }

  // Get mapped icon name or fallback to 'Code'
  const mappedName = iconMap[iconName] || 'Code';

  // Return the icon component
  return Icons[mappedName] as IconComponent;
}

/**
 * Checks if an icon name is valid and exists in the icon map
 * @param iconName - Icon name to validate
 * @returns True if icon exists, false otherwise
 */
export function isValidIconName(iconName: string): boolean {
  return iconName in Icons || iconName.startsWith('<svg');
}

/**
 * Gets the display name of an icon for debugging
 * @param icon - Icon component or string
 * @returns Display name for logging
 */
export function getIconDisplayName(icon: IconComponent): string {
  if (typeof icon === 'string') {
    return icon.startsWith('<svg') ? 'SVG String' : icon;
  }

  const IconComp = icon as React.ComponentType;
  return IconComp.displayName || IconComp.name || 'Unknown Icon';
}

/**
 * [Utils] : Icon_Mapping_Orchestration
 * Centralizes MynaUI icon mapping and SVG handling.
 */

import * as Icons from '@mynaui/icons-react';

/**
 * Maps icon name string to @mynaui/icons-react component
 * Also handles SVG strings from CMS
 */
export function getIconComponent(iconName: string | null | undefined): unknown {
  if (!iconName || iconName.trim() === '') return Icons.Code;
  if (iconName.startsWith('<svg')) return iconName;

  const iconMap: Record<string, keyof typeof Icons> = {
    Code: 'Code',
    Terminal: 'Terminal',
    BrandGithub: 'BrandGithub',
    Database: 'Database',
    Server: 'Servers',
    Globe: 'Globe',
    Zap: 'Zap',
    Rocket: 'Rocket',
    Music: 'Music',
    User: 'User',
    Shield: 'Shield',
    Chip: 'Chip',
    Settings: 'CogFour',
  };

  const mappedName = iconMap[iconName] || ('Code' as keyof typeof Icons);
  return (Icons as any)[mappedName] || Icons.Code;
}

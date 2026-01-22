import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

/**
 * Shared icon type used throughout the application
 * Can be a React component from @mynaui/icons-react or an SVG string from CMS
 */
export type IconComponent = React.ComponentType<IconProps> | string;

/**
 * Icon data from CMS or static configuration
 */
export interface IconData {
  /** Icon name or SVG string */
  icon: string | IconComponent;
  /** Icon label for accessibility */
  label?: string;
  /** Icon color override */
  color?: string;
  /** Icon size override */
  size?: number;
}

/**
 * Common icon props used across components
 */
export interface CommonIconProps {
  className?: string;
  style?: React.CSSProperties;
  stroke?: string | number;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

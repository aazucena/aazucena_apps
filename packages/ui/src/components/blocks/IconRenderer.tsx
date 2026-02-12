import React, { memo } from 'react';
import SVG from 'react-inlinesvg';
import { devLog } from '@aazucena/utils';
import type { MynaIconsProps as IconProps } from '@aazucena/icons';
import type { IconComponent } from '@aazucena/types';

/**
 * Props for the IconRenderer component
 */
export interface IconRendererProps {
  /** Icon to render - can be a React component or SVG string */
  icon: IconComponent | null | undefined;
  /** CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Icon size (width and height) */
  size?: number | string;
  /** Stroke width for SVG icons */
  stroke?: string | number;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Whether the icon is decorative (hides from screen readers) */
  'aria-hidden'?: boolean;
  /** Fallback component to render if icon fails to load */
  fallback?: React.ReactNode;
  /** Callback when icon fails to load */
  onError?: (error: Error) => void;
}

/**
 * Global IconRenderer component
 *
 * Handles rendering icons from multiple sources:
 * - React components (e.g., @aazucena/icons)
 * - SVG strings (e.g., from CMS)
 * - Null/undefined (renders nothing or fallback)
 */
export const IconRenderer = memo(function IconRenderer({
  icon,
  className = '',
  style,
  size,
  stroke,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  fallback = null,
  onError,
}: IconRendererProps) {
  // Handle null/undefined icons
  if (!icon) {
    devLog.warn('[IconRenderer] No icon provided');
    return <>{fallback}</>;
  }

  // Compute size styles
  const sizeStyles = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : {};

  const combinedStyles = {
    ...sizeStyles,
    ...style,
  };

  // Handle SVG strings
  if (typeof icon === 'string') {
    // Validate SVG string
    if (!icon.trim().startsWith('<svg')) {
      const error = new Error(`Invalid SVG string: must start with '<svg'`);

      devLog.error('[IconRenderer]', error.message, { icon });

      onError?.(error);
      return <>{fallback}</>;
    }

    let dataUrl = '';
    try {
      // Encode SVG string to base64 for inline rendering
      const encodedSVG = btoa(unescape(encodeURIComponent(icon)));
      dataUrl = `data:image/svg+xml;base64,${encodedSVG}`;
    } catch (error) {
      devLog.error('[IconRenderer] Failed to encode SVG string', error);

      onError?.(error as Error);
      return <>{fallback}</>;
    }

    return (
      <SVG
        src={dataUrl}
        className={className}
        style={combinedStyles}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        onError={(error: Error) => {
          devLog.error('[IconRenderer] Failed to render SVG string', error);
          onError?.(error);
        }}
      />
    );
  }

  // Handle React components
  const Icon = icon as React.ComponentType<IconProps>;

  return (
    <Icon
      className={className}
      style={combinedStyles}
      stroke={stroke as string | number}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
});

/**
 * Utility: Check if a value is a valid icon
 */
export function isValidIcon(icon: unknown): icon is IconComponent {
  return typeof icon === 'function' || (typeof icon === 'string' && icon.trim().startsWith('<svg'));
}

/**
 * Utility: Get icon display name for debugging
 */
export function getIconDisplayName(icon: IconComponent): string {
  if (typeof icon === 'string') {
    return 'SVG String';
  }

  const IconComponent = icon as React.ComponentType<IconProps>;
  return IconComponent.displayName || IconComponent.name || 'Unknown Icon';
}

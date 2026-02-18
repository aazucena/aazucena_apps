'use client';

import type { MynaIconsProps as IconProps } from '@aazucena/icons';
import type { IconComponent } from '@aazucena/types';
import { cn, getIconComponent } from '@aazucena/utils';
import React, { memo } from 'react';
import SVG from 'react-inlinesvg';

export interface IconRendererProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onError' | 'onCopy' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
  icon: IconComponent | string | null | undefined;
  size?: number | string;
  stroke?: string | number;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export const IconRenderer = memo(function IconRenderer({
  icon: rawIcon,
  className,
  style,
  size,
  stroke,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  fallback = null,
  onError,
  ...props
}: IconRendererProps) {
  if (!rawIcon) {
    return <>{fallback}</>;
  }

  // Handle string IDs by converting them to components first
  const icon = typeof rawIcon === 'string' && !rawIcon.trim().startsWith('<svg') 
    ? getIconComponent(rawIcon) 
    : rawIcon;

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

  if (typeof icon === 'string') {
    if (!icon.trim().startsWith('<svg')) {
      const error = new Error(`Invalid SVG string: ${icon.substring(0, 20)}...`);
      onError?.(error);
      return <>{fallback}</>;
    }

    let dataUrl = '';
    try {
      const encodedSVG = btoa(unescape(encodeURIComponent(icon)));
      dataUrl = `data:image/svg+xml;base64,${encodedSVG}`;
    } catch (error) {
      onError?.(error as Error);
      return <>{fallback}</>;
    }

    // Extract properties that cause type conflicts with SVG component
    const { onCopyCapture, onPointerEnterCapture, onPointerLeaveCapture, ...safeProps } =
      props as any;

    return (
      <SVG
        src={dataUrl}
        className={cn('shrink-0', className)}
        style={combinedStyles}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        onError={(error: Error) => onError?.(error)}
        {...safeProps}
      />
    );
  }

  const Icon = icon as React.ComponentType<IconProps>;

  if (!Icon) {
    return <>{fallback}</>;
  }

  return (
    <Icon
      className={cn('shrink-0', className)}
      style={combinedStyles}
      stroke={stroke as string | number}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...(props as any)}
    />
  );
});

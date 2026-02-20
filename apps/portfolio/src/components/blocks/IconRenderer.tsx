import { memo } from "react";
import SVG from "react-inlinesvg";
import type { MynaIconsProps as IconProps } from "@mynaui/icons-react";

/**
 * IconComponent type - can be a React component or an SVG string
 */
export type IconComponent = React.ComponentType<IconProps> | string;

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
  "aria-label"?: string;
  /** Whether the icon is decorative (hides from screen readers) */
  "aria-hidden"?: boolean;
  /** Fallback component to render if icon fails to load */
  fallback?: React.ReactNode;
  /** Callback when icon fails to load */
  onError?: (error: Error) => void;
}

/**
 * Global IconRenderer component
 *
 * Handles rendering icons from multiple sources:
 * - React components (e.g., @mynaui/icons-react)
 * - SVG strings (e.g., from CMS)
 * - Null/undefined (renders nothing or fallback)
 *
 * @example
 * // With React component
 * import { Code } from '@mynaui/icons-react';
 * <IconRenderer icon={Code} className="w-6 h-6" stroke="2" />
 *
 * @example
 * // With SVG string
 * <IconRenderer
 *   icon="<svg>...</svg>"
 *   className="w-6 h-6"
 *   aria-label="Custom icon"
 * />
 *
 * @example
 * // With fallback
 * <IconRenderer
 *   icon={maybeIcon}
 *   fallback={<div>No icon</div>}
 * />
 */
export const IconRenderer = memo(function IconRenderer({
  icon,
  className = "",
  style,
  size,
  stroke,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  fallback = null,
  onError,
}: IconRendererProps) {
  // Handle null/undefined icons
  if (!icon) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[IconRenderer] No icon provided");
    }
    return <>{fallback}</>;
  }

  // Compute size styles
  const sizeStyles = size
    ? {
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
      }
    : {};

  const combinedStyles = {
    ...sizeStyles,
    ...style,
  };

  // Handle SVG strings
  if (typeof icon === "string") {
    // Validate SVG string
    if (!icon.trim().startsWith("<svg")) {
      const error = new Error(`Invalid SVG string: must start with '<svg'`);

      if (process.env.NODE_ENV === "development") {
        console.error("[IconRenderer]", error.message, { icon });
      }

      onError?.(error);
      return <>{fallback}</>;
    }

    try {
      // Encode SVG string to base64 for inline rendering
      // Using TextEncoder for better modern support
      const encodedSVG = btoa(
        new TextEncoder()
          .encode(icon)
          .reduce((data, byte) => data + String.fromCharCode(byte), ""),
      );
      const dataUrl = `data:image/svg+xml;base64,${encodedSVG}`;

      return (
        <SVG
          src={dataUrl}
          className={className}
          style={combinedStyles}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden}
          onError={(_error) => {
            if (process.env.NODE_ENV === "development") {
              console.error(
                "[IconRenderer] Failed to render SVG string",
                _error,
              );
            }
            onError?.(_error as Error);
          }}
        />
      );
    } catch (_error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[IconRenderer] Failed to encode SVG string", _error);
      }

      onError?.(_error as Error);
      return <>{fallback}</>;
    }
  }

  // Handle React components
  try {
    const IconComponent = icon as React.ComponentType<IconProps>;

    return (
      <IconComponent
        className={className}
        style={combinedStyles}
        stroke={stroke}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  } catch (_error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[IconRenderer] Failed to render icon component", _error);
    }

    onError?.(_error as Error);
    return <>{fallback}</>;
  }
});

/**
 * Utility: Check if a value is a valid icon
 */
export function isValidIcon(icon: unknown): icon is IconComponent {
  return (
    typeof icon === "function" ||
    (typeof icon === "string" && icon.trim().startsWith("<svg"))
  );
}

/**
 * Utility: Get icon display name for debugging
 */
export function getIconDisplayName(icon: IconComponent): string {
  if (typeof icon === "string") {
    return "SVG String";
  }

  const IconComponent = icon as React.ComponentType<IconProps>;
  return IconComponent.displayName || IconComponent.name || "Unknown Icon";
}

/**
 * Toolbar Component (Generic)
 * A flexible, reusable toolbar container for buttons and controls
 */

import type { JSX, ReactNode } from 'react';
import { cn } from '@aazucena/utils';

export type ToolbarPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarProps {
  /** Toolbar content (buttons, inputs, etc.) */
  children: ReactNode;

  /** Position on screen (default: 'top-right') */
  position?: ToolbarPosition;

  /** Button layout direction (default: 'horizontal') */
  orientation?: ToolbarOrientation;

  /** Custom spacing between items (default: 'gap-4') */
  spacing?: string;

  /** Background style (default: 'bg-black/30 backdrop-blur-md') */
  background?: string;

  /** Border style (default: 'border border-white/20') */
  border?: string;

  /** Border radius (default: 'rounded-full') */
  borderRadius?: string;

  /** Padding (default: 'px-4 py-3') */
  padding?: string;

  /** Z-index (default: 'z-50') */
  zIndex?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Get positioning classes based on toolbar position
 */
function getPositionClasses(position: ToolbarPosition): string {
  switch (position) {
    case 'top-left':
      return 'top-8 left-8';
    case 'top-right':
      return 'top-8 right-8';
    case 'top-center':
      return 'top-8 left-1/2 -translate-x-1/2';
    case 'bottom-left':
      return 'bottom-8 left-8';
    case 'bottom-right':
      return 'bottom-8 right-8';
    case 'bottom-center':
      return 'bottom-8 left-1/2 -translate-x-1/2';
    default:
      return 'top-8 right-8';
  }
}

/**
 * Generic Toolbar component
 * Provides a flexible container for toolbar content with configurable positioning and styling
 */
export function Toolbar({
  children,
  position = 'top-right',
  orientation = 'horizontal',
  spacing = 'gap-4',
  background = 'bg-black/30 backdrop-blur-md',
  border = 'border border-white/20',
  borderRadius = 'rounded-full',
  padding = 'px-4 py-3',
  zIndex = 'z-50',
  className = '',
}: ToolbarProps): JSX.Element {
  const positionClasses = getPositionClasses(position);
  const flexDirection = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div
      className={cn(
        'fixed flex',
        positionClasses,
        zIndex,
        flexDirection,
        spacing,
        background,
        border,
        borderRadius,
        padding,
        className,
      )}
    >
      {children}
    </div>
  );
}

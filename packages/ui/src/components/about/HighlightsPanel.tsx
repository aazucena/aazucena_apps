/**
 * HighlightsPanel Component
 * Displays key highlights/strengths in a glass-morphism panel
 */

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface HighlightsPanelProps {
  /** Panel heading */
  title?: string;
  /** Strapi blocks content for highlights (rendered with checkmarks) */
  highlights: unknown; // Strapi blocks type
  /** Optional custom block renderers */
  blocks?: unknown;
  /** Additional className */
  className?: string;
}

/**
 * HighlightsPanel
 *
 * Displays highlights in a styled panel:
 * - Glass-morphism background
 * - Custom heading
 * - 2-column grid on desktop
 */
export function HighlightsPanel({
  title = 'What I Bring to the Table',
  highlights,
  blocks,
  className,
}: HighlightsPanelProps): JSX.Element {
  return (
    <div
      className={cn(
        'mt-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm',
        className,
      )}
    >
      <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
      <div className="grid grid-cols-1 gap-3 text-left text-base md:grid-cols-2">
        <BlocksRenderer content={highlights as any} blocks={blocks as any} />
      </div>
    </div>
  );
}

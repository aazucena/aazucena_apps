/**
 * HighlightsPanel Component
 * Displays key highlights/strengths in a glass-morphism panel
 * Used in AboutSection to showcase "What I Bring to the Table"
 */

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { JSX } from 'react';
import { darkHighlightBlockRenderers } from '~/components/blocks/BlockRenderers';

export interface HighlightsPanelProps {
  /** Panel heading */
  title?: string;
  /** Strapi blocks content for highlights (rendered with checkmarks) */
  highlights: any; // Strapi blocks type
}

/**
 * HighlightsPanel
 *
 * Displays highlights in a styled panel:
 * - Glass-morphism background
 * - Custom heading
 * - 2-column grid on desktop
 * - Uses darkHighlightBlockRenderers for checkmark styling
 *
 * @example
 * ```tsx
 * <HighlightsPanel
 *   title="What I Bring to the Table"
 *   highlights={about.highlights}
 * />
 * ```
 */
export function HighlightsPanel({
  title = 'What I Bring to the Table',
  highlights
}: HighlightsPanelProps): JSX.Element {
  return (
    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base text-left">
        <BlocksRenderer
          content={highlights}
          blocks={darkHighlightBlockRenderers}
        />
      </div>
    </div>
  );
}

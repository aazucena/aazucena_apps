/**
 * HighlightsPanel Component
 * Displays key highlights/strengths in a glass-morphism panel
 * Used in AboutSection to showcase "What I Bring to the Table"
 */

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { JSX } from "react";
import { darkHighlightBlockRenderers } from "~/components/blocks/BlockRenderers";

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
  title = "What I Bring to the Table",
  highlights,
}: HighlightsPanelProps): JSX.Element {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
      <div className="grid grid-cols-1 gap-3 text-left text-base md:grid-cols-2">
        <BlocksRenderer
          content={highlights}
          blocks={darkHighlightBlockRenderers}
        />
      </div>
    </div>
  );
}

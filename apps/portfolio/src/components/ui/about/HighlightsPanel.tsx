/**
 * HighlightsPanel Component
 * Displays key highlights/strengths in a flat Avra panel
 * Used in AboutSection to showcase "What I Bring to the Table"
 */

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { JSX } from "react";
import { Panel } from "@aazucena/ui";
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
 * - Flat panel surface with a label strip
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
    // Border and full height to match the Bio panel beside it
    <Panel label={title.toUpperCase()} className="border-rule h-full border">
      <div className="short:gap-2 short:text-sm grid grid-cols-1 gap-3 text-left text-base md:grid-cols-2">
        <BlocksRenderer
          content={highlights}
          blocks={darkHighlightBlockRenderers}
        />
      </div>
    </Panel>
  );
}

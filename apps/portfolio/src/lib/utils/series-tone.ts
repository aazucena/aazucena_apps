/**
 * Flat series colours for tiles that need telling apart (project initials, service icons).
 * Both return a CSS `var()` string, so the colour follows the vibe and can be set as a fill.
 * Text on these fills uses `text-background`, the ink tone.
 */
import { cmsTone } from "./cms-tone";

const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
];

/** A stable series colour for a name: the same project always gets the same tile. */
export function seriesTone(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SERIES[Math.abs(hash) % SERIES.length]!;
}

/** The hue each service category carried before, run through the shared hue-to-tone map. */
const CATEGORY_HUE: Record<string, string> = {
  engineering: "cyan",
  consulting: "purple",
  design: "pink",
  ai: "violet",
  analytics: "emerald",
  tutoring: "amber",
  devops: "slate",
  creative: "fuchsia",
  research: "sky",
};

/** A service category's colour; unknown categories and slate fall back to the signal colour. */
export function categoryTone(category: string): string {
  return cmsTone(CATEGORY_HUE[category]) ?? "var(--signal)";
}

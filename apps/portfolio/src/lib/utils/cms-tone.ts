/**
 * Maps a colour name from the CMS (variant, gradient or tag colour) to an Avra chart colour.
 * Gradients like "blue-cyan" use their first hue. Cool hues give the signal colour, the rest
 * the series colours. Red hues, unknown and empty values give null so callers keep their neutral
 * look; no hue ever maps to alert, which is reserved for alerts.
 */
const HUE_TONE: Record<string, string> = {
  blue: "var(--signal)",
  cyan: "var(--signal)",
  sky: "var(--signal)",
  indigo: "var(--signal)",
  emerald: "var(--series-2)",
  green: "var(--series-2)",
  teal: "var(--series-2)",
  lime: "var(--series-2)",
  purple: "var(--series-3)",
  violet: "var(--series-3)",
  fuchsia: "var(--series-3)",
  pink: "var(--series-3)",
  amber: "var(--series-4)",
  yellow: "var(--series-4)",
  orange: "var(--series-4)",
};

export function cmsTone(value?: string | null): string | null {
  if (!value) return null;
  const hue = value.trim().toLowerCase().split(/[-\s]/)[0] ?? "";
  return Object.hasOwn(HUE_TONE, hue) ? HUE_TONE[hue]! : null;
}

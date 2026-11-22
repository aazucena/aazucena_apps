import type { Experience } from "@aazucena/types";

// A number with an optional currency sign or unit: "$2M", "40%", "3x", "1,200+"
const METRIC = /([$+]?\d[\d.,]*(?:%|\+|x|k|M|B)?)/;

/** First metric found in the achievements, shown as the card's key outcome. */
export function getTopMetric(
  experience: Pick<Experience, "achievements">,
): { value: string; label: string } | null {
  const metric = (experience.achievements || []).find((a) =>
    METRIC.test(a.title),
  );
  if (!metric) return null;
  const match = metric.title.match(METRIC);
  return match
    ? { value: match[0], label: metric.title.replace(match[0], "").trim() }
    : null;
}

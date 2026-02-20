import type { StrapiSkillShowcase } from "../validators/skill-showcase";
import { transformPageHeader } from "./utils";

export interface SkillShowcaseConfig {
  header?: ReturnType<typeof transformPageHeader>;
  highlyUsedThreshold: number;
  searchPlaceholder: string;
  emptyMessage: string;
}

export const DEFAULT_SKILL_SHOWCASE: SkillShowcaseConfig = {
  highlyUsedThreshold: 3,
  searchPlaceholder: "Search technologies...",
  emptyMessage: "No results found.",
};

export function transformSkillShowcase(
  data: StrapiSkillShowcase,
): SkillShowcaseConfig {
  if (!data) return DEFAULT_SKILL_SHOWCASE;

  return {
    header: transformPageHeader(data.header),
    highlyUsedThreshold: data.highlyUsedThreshold,
    searchPlaceholder: data.searchPlaceholder,
    emptyMessage: data.emptyMessage,
  };
}

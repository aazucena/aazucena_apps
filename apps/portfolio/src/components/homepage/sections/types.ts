import type { HomepageSection } from "~/lib/transformers/homepage";

export interface SectionProps extends HomepageSection {
  // Sections create their own container refs internally
  // No need to pass refs from parent
}
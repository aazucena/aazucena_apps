import type { Section } from "@aazucena/types";

export interface SectionProps extends Section {
  // Sections create their own container refs internally
  // No need to pass refs from parent
}

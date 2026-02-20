/**
 * useSectionRefs Hook
 * Creates and manages refs for all section content divs
 */

import React, { useRef, type RefObject } from "react";
import type { HomepageSection } from "~/lib/transformers/homepage";

export type SectionRef = RefObject<HTMLDivElement | null>;

export function useSectionRefs(sections: HomepageSection[]) {
  const count = sections.length;
  const refs = useRef<SectionRef[]>([]);
  refs.current = Array.from(
    { length: count },
    (_, i) => refs.current[i] || React.createRef(),
  );
  return refs.current;
}

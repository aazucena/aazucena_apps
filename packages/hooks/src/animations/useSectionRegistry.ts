import { useMemo } from 'react';
import type { HomepageData } from '@aazucena/types';

/**
 * A section component - generic to support different prop types
 * Defaults to `any` since dynamic lookup prevents compile-time type checking
 */
export type SectionComponent<P = any> = React.FC<P>;

/**
 * Registry mapping section names to their components
 */
export interface SectionRegistry {
  [key: string]: SectionComponent;
}

/**
 * Hook to build a section registry based on CMS data
 *
 * Creates a registry mapping section names to React components.
 * Only includes sections that exist in the base registry or custom registry.
 *
 * @param data - Homepage data containing sections configuration
 * @param baseRegistry - The base section components registry
 * @param customRegistry - Optional custom section components to extend base registry
 * @returns Registry object mapping section names to components
 */
export function useSectionRegistry(
  data: HomepageData,
  baseRegistry: SectionRegistry,
  customRegistry?: SectionRegistry,
): SectionRegistry {
  return useMemo(() => {
    const sections = data.sections ?? [];

    // If no sections provided, return base registry
    if (sections.length === 0) {
      return { ...baseRegistry };
    }

    const registry: SectionRegistry = {};

    for (const section of sections) {
      const name = section.name;

      // Check if section exists in base registry
      const baseComponent = baseRegistry[name];
      if (baseComponent) {
        registry[name] = baseComponent;
        continue;
      }

      // Check if section exists in custom registry
      if (customRegistry) {
        const customComponent = customRegistry[name];
        if (customComponent) {
          registry[name] = customComponent;
        }
      }
    }

    return registry;
  }, [data.sections, baseRegistry, customRegistry]);
}

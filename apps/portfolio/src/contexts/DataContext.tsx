import { createContext, useMemo, type ReactNode } from "react";
import type { HomepageData } from "@aazucena/types";
import type { PortfolioContent } from "@aazucena/types";
import type { PortfolioData } from "~/types";
import {
  useSectionRegistry,
  type SectionRegistry,
} from "~/hooks/useSectionRegistry";

export interface DataContextValue {
  data: PortfolioData;
  content: HomepageData;
  portfolio: PortfolioContent;
  registry: SectionRegistry;
}

export const DataContext = createContext<DataContextValue | null>(null);

interface DataProviderProps {
  children: ReactNode;
  data: PortfolioData;
  content: HomepageData;
  portfolio: PortfolioContent;
}

/**
 * DataProvider component
 *
 * Provides homepage data, portfolio data, and section registry to all child components.
 * Filters sections to only include those with both a component (in registry) and data.
 * Sorts sections by their sort field (or 0 if not specified).
 */
export function DataProvider({
  children,
  data,
  portfolio,
  content,
}: DataProviderProps) {
  const registry = useSectionRegistry(content);

  // Filter and sort sections
  // Only include sections that have both component AND data (fail-safe)
  const activeSections = useMemo(() => {
    return content.sections
      .filter(({ name }) => name in registry && name in data)
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  }, [content.sections, registry, data]);

  const value = useMemo(
    () => ({
      data,
      portfolio,
      content: {
        ...content,
        sections: activeSections,
      },
      registry,
    }),
    [data, portfolio, content, registry, activeSections],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Add display name for React Fast Refresh
DataProvider.displayName = "DataProvider";

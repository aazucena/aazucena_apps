/**
 * useCommandSearch Hook
 * Provides high-performance command searching via FlexSearch.
 * Purely logic-driven: accepts actions as an argument.
 */

import { useEffect, useRef } from 'react';
import { Index } from 'flexsearch';

// 'NAVIGATION' | 'SYSTEM' | 'AI' | 'INTEL' | string
export interface CommandAction<C extends string> {
  id: string;
  name: string;
  category: C;
  icon: any;
  href?: string;
  onSelect?: () => void;
  keywords: string;
}

/**
 * useCommandSearch - A generic search engine for command actions.
 * @param actions - The list of actions to index and search.
 */
export function useCommandSearch<C extends string>(actions: CommandAction<C>[]) {
  const indexRef = useRef<Index | null>(null);

  useEffect(() => {
    // Initialize FlexSearch index
    const index = new Index({
      tokenize: 'forward',
      cache: true,
    });

    // Index all actions
    actions.forEach((action) => {
      index.add(action.id, `${action.name} ${action.keywords} ${action.category}`);
    });

    indexRef.current = index;
  }, [actions]);

  const search = (query: string) => {
    if (!query || !indexRef.current) return actions;

    const results = indexRef.current.search(query, { suggest: true });
    // FlexSearch returns IDs, we map them back to actions
    return actions.filter((action) => results.includes(action.id));
  };

  return {
    search,
  };
}

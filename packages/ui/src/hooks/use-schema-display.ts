'use client';

import * as React from 'react';
import type { SchemaProperty } from '../components/ui/schema-display.js';

export interface UseSchemaDisplayReturn {
  isExpanded: (name: string, isObject: boolean) => boolean;
  toggleExpanded: (name: string) => void;
}

export function useSchemaDisplay(
  schema: SchemaProperty,
  defaultExpanded: boolean,
): UseSchemaDisplayReturn {
  const [expandedStates, setExpandedStates] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!defaultExpanded) return;
    const newStates: Record<string, boolean> = {};
    const collectExpanded = (node: SchemaProperty) => {
      if (node.type === 'object' && node.properties) {
        newStates[node.name] = true;
        node.properties.forEach(collectExpanded);
      }
      if (node.type === 'array' && node.items) {
        collectExpanded(node.items);
      }
    };
    collectExpanded(schema);
    setExpandedStates((prev) => ({ ...prev, ...newStates }));
  }, [schema, defaultExpanded]);

  const isExpanded = React.useCallback(
    (name: string, isObject: boolean) =>
      expandedStates[name] !== undefined ? expandedStates[name]! : isObject && defaultExpanded,
    [expandedStates, defaultExpanded],
  );

  const toggleExpanded = React.useCallback((name: string) => {
    setExpandedStates((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return { isExpanded, toggleExpanded };
}

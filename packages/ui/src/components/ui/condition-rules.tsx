'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ConditionRulesGroup, type ConditionGroup } from './condition-rules-group.js';
import type { ConditionField, ConditionOperator } from './condition-rules-node.js';

export * from './condition-rules-node.js';
export * from './condition-rules-group.js';

const conditionRulesVariants = cva('rounded-md border p-4 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      glass: 'glass border-border/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

const DEFAULT_OPERATORS: ConditionOperator[] = [
  { "key": "eq", "label": "Equals", "fields": 1, "allowedTypes": ["*"] },
  { "key": "neq", "label": "Not equal", "fields": 1, "allowedTypes": ["*"] },
  { "key": "lt", "label": "Less than", "fields": 1, "allowedTypes": ["number", "date"] },
  { "key": "lte", "label": "Less than or equal", "fields": 1, "allowedTypes": ["number", "date"] },
  { "key": "gt", "label": "Greater than", "fields": 1, "allowedTypes": ["number", "date"] },
  { "key": "gte", "label": "Greater than or equal", "fields": 1, "allowedTypes": ["number", "date"] },
  { "key": "in", "label": "In (list)", "fields": 1, "allowedTypes": ["string", "number", "select"] },
  { "key": "nin", "label": "Not in (list)", "fields": 1, "allowedTypes": ["string", "number", "select"] },
  { "key": "null", "label": "Is null", "fields": 0, "allowedTypes": ["*"] },
  { "key": "nnull", "label": "Not null", "fields": 0, "allowedTypes": ["*"] },
  { "key": "contains", "label": "Contains", "fields": 1, "allowedTypes": ["string"] },
  { "key": "ncontains", "label": "No contain", "fields": 1, "allowedTypes": ["string"] },
  { "key": "icontains", "label": "Contains (i)", "fields": 1, "allowedTypes": ["string"] },
  { "key": "nicontains", "label": "No contain (i)", "fields": 1, "allowedTypes": ["string"] },
  { "key": "starts_with", "label": "Starts with", "fields": 1, "allowedTypes": ["string"] },
  { "key": "istarts_with", "label": "Starts with (i)", "fields": 1, "allowedTypes": ["string"] },
  { "key": "nstarts_with", "label": "No start", "fields": 1, "allowedTypes": ["string"] },
  { "key": "nistarts_with", "label": "No start (i)", "fields": 1, "allowedTypes": ["string"] },
  { "key": "ends_with", "label": "Ends with", "fields": 1, "allowedTypes": ["string"] },
  { "key": "iends_with", "label": "Ends with (i)", "fields": 1, "allowedTypes": ["string"] },
  { "key": "nends_with", "label": "No end", "fields": 1, "allowedTypes": ["string"] },
  { "key": "niends_with", "label": "No end (i)", "fields": 1, "allowedTypes": ["string"] },
  // { "key": "between", "label": "Between", "fields": 2, "allowedTypes": ["number", "date"] },
  // { "key": "nbetween", "label": "Not between", "fields": 2, "allowedTypes": ["number", "date"] },
  { "key": "empty", "label": "Empty", "fields": 0, "allowedTypes": ["string"] },
  { "key": "nempty", "label": "Not empty", "fields": 0, "allowedTypes": ["string"] },
  { "key": "intersects", "label": "Intersects", "fields": 1, "allowedTypes": ["*"] },
  { "key": "nintersects", "label": "No intersect", "fields": 1, "allowedTypes": ["*"] },
  // { "key": "intersects_bbox", "label": "Bbox", "fields": 2 },
  // { "key": "nintersects_bbox", "label": "No bbox", "fields": 2 },
  { "key": "regex", "label": "Regex", "fields": 1, "allowedTypes": ["string"] },
  { "key": "some", "label": "Some", "fields": 1, "allowedTypes": ["*"] },
  { "key": "none", "label": "None", "fields": 1, "allowedTypes": ["*"] }
];

export interface ConditionRulesProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof conditionRulesVariants> {
  value?: ConditionGroup;
  onChange?: (value: ConditionGroup) => void;
  fields: ConditionField[];
  operators?: ConditionOperator[];
  maxDepth?: number;
}

const ConditionRules = React.forwardRef<HTMLDivElement, ConditionRulesProps>(
  (
    {
      className,
      variant,
      value,
      onChange,
      fields,
      operators = DEFAULT_OPERATORS,
      maxDepth = 3,
      ...props
    },
    ref,
  ) => {
    const group = value ?? { logic: 'and' as const, conditions: [] };

    return (
      <div ref={ref} className={cn(conditionRulesVariants({ variant }), className)} {...props}>
        <ConditionRulesGroup
          group={group}
          fields={fields}
          operators={operators}
          onChange={(g) => onChange?.(g)}
          depth={0}
          maxDepth={maxDepth}
          variant={variant ?? undefined}
        />
      </div>
    );
  },
);
ConditionRules.displayName = 'ConditionRules';

export { ConditionRules, conditionRulesVariants };

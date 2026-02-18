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
  { key: 'eq', label: 'equals' },
  { key: 'neq', label: 'not equals' },
  { key: 'gt', label: 'greater than' },
  { key: 'lt', label: 'less than' },
  { key: 'gte', label: 'greater or equal' },
  { key: 'lte', label: 'less or equal' },
  { key: 'contains', label: 'contains' },
  { key: 'starts_with', label: 'starts with' },
  { key: 'ends_with', label: 'ends with' },
  { key: 'is_null', label: 'is null' },
  { key: 'is_not_null', label: 'is not null' },
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

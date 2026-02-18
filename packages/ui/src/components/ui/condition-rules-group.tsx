'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import {
  ConditionRulesNode,
  type ConditionRule,
  type ConditionField,
  type ConditionOperator,
} from './condition-rules-node.js';

export interface ConditionGroup {
  logic: 'and' | 'or';
  conditions: (ConditionRule | ConditionGroup)[];
}

export interface ConditionRulesGroupProps {
  group: ConditionGroup;
  fields: ConditionField[];
  operators: ConditionOperator[];
  onChange: (group: ConditionGroup) => void;
  onRemove?: () => void;
  depth: number;
  maxDepth: number;
  variant?: string;
}

const isGroup = (c: ConditionRule | ConditionGroup): c is ConditionGroup =>
  'logic' in c && 'conditions' in c;

const ConditionRulesGroup = React.forwardRef<HTMLDivElement, ConditionRulesGroupProps>(
  ({ group, fields, operators, onChange, onRemove, depth, maxDepth, variant }, ref) => {
    const updateCondition = (index: number, updated: ConditionRule | ConditionGroup) => {
      const next = [...group.conditions];
      next[index] = updated;
      onChange({ ...group, conditions: next });
    };

    const removeCondition = (index: number) => {
      onChange({ ...group, conditions: group.conditions.filter((_, i) => i !== index) });
    };

    const addRule = () => {
      onChange({
        ...group,
        conditions: [...group.conditions, { field: '', operator: 'eq', value: '' }],
      });
    };

    const addGroup = () => {
      onChange({
        ...group,
        conditions: [
          ...group.conditions,
          { logic: 'and', conditions: [{ field: '', operator: 'eq', value: '' }] },
        ],
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border-l-2 pl-3',
          depth === 0 && 'border-l-0 pl-0',
          depth > 0 && variant === 'cyber' && 'border-cyan-500/30',
          depth > 0 && variant !== 'cyber' && 'border-primary/30',
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...group, logic: group.logic === 'and' ? 'or' : 'and' })}
            className={cn(
              'rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase transition-colors',
              group.logic === 'and'
                ? 'bg-primary/10 text-primary'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            )}
          >
            {group.logic}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive rounded p-1"
              aria-label="Remove group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-1">
          {group.conditions.map((cond, i) =>
            isGroup(cond) ? (
              <ConditionRulesGroup
                key={i}
                group={cond}
                fields={fields}
                operators={operators}
                onChange={(g) => updateCondition(i, g)}
                onRemove={() => removeCondition(i)}
                depth={depth + 1}
                maxDepth={maxDepth}
                variant={variant}
              />
            ) : (
              <ConditionRulesNode
                key={i}
                rule={cond}
                fields={fields}
                operators={operators}
                onChange={(r) => updateCondition(i, r)}
                onRemove={() => removeCondition(i)}
                variant={variant}
              />
            ),
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={addRule}
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-2 py-1 text-xs font-medium transition-colors"
          >
            + Rule
          </button>
          {depth < maxDepth && (
            <button
              type="button"
              onClick={addGroup}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-2 py-1 text-xs font-medium transition-colors"
            >
              + Group
            </button>
          )}
        </div>
      </div>
    );
  },
);
ConditionRulesGroup.displayName = 'ConditionRulesGroup';

export { ConditionRulesGroup };

'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { X, Trash } from '@aazucena/icons';
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
      const nextConditions = group.conditions.filter((_, i) => i !== index);
      if (depth === 0 && nextConditions.length === 0) {
        onChange({
          ...group,
          conditions: [{ field: fields[0]?.key || '', operator: 'eq', value: '' }],
        });
      } else {
        onChange({ ...group, conditions: nextConditions });
      }
    };

    const addRule = () => {
      onChange({
        ...group,
        conditions: [...group.conditions, { field: fields[0]?.key || '', operator: 'eq', value: '' }],
      });
    };

    const addGroup = () => {
      onChange({
        ...group,
        conditions: [
          ...group.conditions,
          {
            logic: 'and',
            conditions: [{ field: fields[0]?.key || '', operator: 'eq', value: '' }],
          },
        ],
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border-l-2 py-2 px-3 transition-all',
          depth === 0 && 'border-l-0 pl-0',
          depth > 0 && (variant === 'cyber' ? 'bg-cyan-500/5 border-cyan-500/30' : group.logic === 'or' ? `bg-secondary/10 border-secondary/50` : 'bg-primary/10 border-primary/50'),
          depth > 1 && (variant === 'cyber' ? 'bg-cyan-500/10' : group.logic === 'or' ? `bg-secondary/50` : 'bg-primary/50' ),
        )}
      >
        <div className="mb-3 flex justify-between items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1 shadow-sm transition-all hover:border-muted-foreground/30">
            <button
              type="button"
              onClick={() => onChange({ ...group, logic: 'and' })}
              className={cn(
                'rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-all',
                group.logic === 'and'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
              )}
            >
              And
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...group, logic: 'or' })}
              className={cn(
                'rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-all',
                group.logic === 'or'
                  ? 'bg-secondary-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
              )}
            >
              Or
            </button>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-destructive/80 hover:text-destructive flex h-8 w-8 items-center justify-center rounded-md border border-destructive/20 bg-background shadow-sm transition-all hover:border-destructive/40 hover:bg-destructive/10"
              aria-label="Remove group"
              title="Delete Group"
            >
              <Trash size="16" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {group.conditions.length === 0 && (
            <div className="text-muted-foreground/50 py-4 text-center text-xs italic">
              Empty group - add a rule or remove it
            </div>
          )}
          {group.conditions.map((cond, i) => {
            const isLast = group.conditions.length === 1;
            const isEmptyGroup = isGroup(cond) && cond.conditions.length === 0;
            const canRemove = !isLast || depth > 0 || isEmptyGroup;

            return isGroup(cond) ? (
              <ConditionRulesGroup
                key={i}
                group={cond}
                fields={fields}
                operators={operators}
                onChange={(g) => updateCondition(i, g)}
                onRemove={canRemove ? () => removeCondition(i) : undefined}
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
                onRemove={canRemove ? () => removeCondition(i) : undefined}
                variant={variant}
              />
            );
          })}
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={addRule}
            className="bg-background hover:bg-accent hover:text-accent-foreground flex h-8 items-center gap-1.5 rounded-md border border-input px-3 py-1 text-xs font-medium shadow-sm transition-colors"
          >
            <span className="text-lg leading-none">+</span> Rule
          </button>
          {depth < maxDepth && (
            <button
              type="button"
              onClick={addGroup}
              className="bg-background hover:bg-accent hover:text-accent-foreground flex h-8 items-center gap-1.5 rounded-md border border-input px-3 py-1 text-xs font-medium shadow-sm transition-colors"
            >
              <span className="text-lg leading-none">+</span> Group
            </button>
          )}
        </div>
      </div>
    );
  },
);
ConditionRulesGroup.displayName = 'ConditionRulesGroup';

export { ConditionRulesGroup };

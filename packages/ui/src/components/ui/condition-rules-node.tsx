'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';

export interface ConditionField {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'select';
  options?: { label: string; value: string }[];
}

export interface ConditionOperator {
  key: string;
  label: string;
}

export interface ConditionRule {
  field: string;
  operator: string;
  value: unknown;
}

export interface ConditionRulesNodeProps {
  rule: ConditionRule;
  fields: ConditionField[];
  operators: ConditionOperator[];
  onChange: (rule: ConditionRule) => void;
  onRemove: () => void;
  variant?: string;
}

const selectClass =
  'h-8 rounded-md border bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring';

const ConditionRulesNode = React.forwardRef<HTMLDivElement, ConditionRulesNodeProps>(
  ({ rule, fields, operators, onChange, onRemove, variant }, ref) => {
    const field = fields.find((f) => f.key === rule.field);

    return (
      <div
        ref={ref}
        className={cn(
          'group hover:bg-accent/30 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
          variant === 'cyber' && 'hover:bg-cyan-500/5',
        )}
      >
        <select
          className={cn(selectClass, 'min-w-[120px]')}
          value={rule.field}
          onChange={(e) => onChange({ ...rule, field: e.target.value })}
        >
          <option value="">Select field...</option>
          {fields.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={rule.operator}
          onChange={(e) => onChange({ ...rule, operator: e.target.value })}
        >
          {operators.map((op) => (
            <option key={op.key} value={op.key}>
              {op.label}
            </option>
          ))}
        </select>

        {field?.type === 'select' && field.options ? (
          <select
            className={cn(selectClass, 'flex-1')}
            value={String(rule.value ?? '')}
            onChange={(e) => onChange({ ...rule, value: e.target.value })}
          >
            <option value="">Select...</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field?.type === 'boolean' ? (
          <select
            className={selectClass}
            value={String(rule.value ?? '')}
            onChange={(e) => onChange({ ...rule, value: e.target.value === 'true' })}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input
            type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
            className={cn(selectClass, 'flex-1')}
            value={String(rule.value ?? '')}
            onChange={(e) =>
              onChange({
                ...rule,
                value: field?.type === 'number' ? Number(e.target.value) : e.target.value,
              })
            }
            placeholder="Value..."
          />
        )}

        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Remove rule"
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
      </div>
    );
  },
);
ConditionRulesNode.displayName = 'ConditionRulesNode';

export { ConditionRulesNode };

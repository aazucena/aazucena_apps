'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { X } from '@aazucena/icons';

export type ConditionalFieldType = 'string' | 'number' | 'boolean' | 'date' | 'select';

export interface ConditionField {
  key: string;
  label: string;
  type?: ConditionalFieldType;
  options?: { label: string; value: string }[];
}

export interface ConditionOperator {
  key: string;
  label: string;
  allowedTypes?: (ConditionalFieldType | '*')[];
  fields: 0 | 1 | 2;
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
  onRemove?: () => void;
  variant?: string;
}

const fieldClass =
  'h-8 rounded-md border bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring transition-all hover:bg-muted/50';

const ConditionRulesNode = React.forwardRef<HTMLDivElement, ConditionRulesNodeProps>(
  ({ rule, fields, operators, onChange, onRemove, variant }, ref) => {
    const field = fields.find((f) => f.key === rule.field);
    const availableOperators = React.useMemo(() => {
      return operators.filter(
        (o) =>
          o.allowedTypes &&
          (o.allowedTypes.includes(field?.type || '*') || o.allowedTypes.includes('*')),
      );
    }, [operators, field]);

    const activeOperator = React.useMemo(() => {
      return operators.find((o) => o.key === rule.operator) || availableOperators[0];
    }, [operators, rule.operator, availableOperators]);

    return (
      <div
        ref={ref}
        className={cn(
          'group hover:bg-accent/40 flex items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-200',
          variant === 'cyber' && 'hover:bg-cyan-500/5',
        )}
      >
        <select
          className={cn(fieldClass, 'min-w-[120px]')}
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
          className={cn(fieldClass, 'min-w-[100px]')}
          value={rule.operator}
          onChange={(e) => {
            onChange({ ...rule, operator: e.target.value });
          }}
        >
          {availableOperators.map((op) => (
            <option key={op.key} value={op.key}>
              {op.label}
            </option>
          ))}
        </select>

        {field && activeOperator && activeOperator.fields > 0 && (
          <ConditionRulesField field={field} rule={rule} onChange={onChange} />
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-destructive/80 hover:text-destructive border-destructive/20 bg-background hover:border-destructive/40 hover:bg-destructive/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border shadow-sm transition-all"
            aria-label="Remove rule"
          >
            <X size="16" />
          </button>
        )}
      </div>
    );
  },
);
ConditionRulesNode.displayName = 'ConditionRulesNode';

export interface ConditionRulesFieldProps {
  rule: ConditionRule;
  field: ConditionField;
  onChange: (rule: ConditionRule) => void;
}
const ConditionRulesField = React.forwardRef<HTMLInputElement, ConditionRulesFieldProps>(
  ({ rule, field, onChange }, _ref) => {
    return (
      <>
        {field?.type === 'select' && field.options ? (
          <select
            className={cn(fieldClass, 'flex-1')}
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
            className={fieldClass}
            value={String(rule.value ?? '')}
            onChange={(e) => onChange({ ...rule, value: e.target.value === 'true' })}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input
            type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
            className={cn(fieldClass, 'flex-1')}
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
      </>
    );
  },
);
ConditionRulesField.displayName = 'ConditionRulesField';

export { ConditionRulesNode, ConditionRulesField };

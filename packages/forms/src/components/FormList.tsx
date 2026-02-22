'use client';

import * as React from 'react';
import { type AnyFieldApi, type FormApi } from '@tanstack/react-form';
import { FormField } from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Plus, Trash } from '@aazucena/icons';
import { cn } from '@aazucena/utils';

/**
 * ## Engineering Standards
 * - **List Pattern:** Declarative orchestrator for dynamic field arrays.
 * - **UX:** Integrated 'Add' and 'Remove' triggers with standard design system icons.
 * - **Consistency:** Enforces a unified layout for list-based form data.
 */

export interface FormListProps<TData, TName extends string> {
  form: any;
  name: TName;
  label: string;
  /**
   * The default value to use when adding a new item.
   */
  defaultValue: any;
  /**
   * Render function for each item in the list.
   * @param name The indexed name of the current item (e.g., 'items[0]')
   * @param index The current index
   * @param remove Helper function to remove this item
   */
  children: (name: string, index: number, remove: () => void) => React.ReactNode;
  /**
   * Label for the 'Add' button.
   * @default 'Add Item'
   */
  addLabel?: string;
  className?: string;
  maxItems?: number;
}

/**
 * FormList
 * Handles the boilerplate of managing dynamic field arrays in TanStack Form.
 */
export function FormList<TData, TName extends string>({
  form,
  name,
  label,
  defaultValue,
  children,
  addLabel = 'Add Item',
  className,
  maxItems,
}: FormListProps<TData, TName>) {
  return (
    <FormField form={form} name={name}>
      {(field: any) => {
        const values = (field.state.value as any[]) || [];
        const canAdd = !maxItems || values.length < maxItems;

        return (
          <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
                {label} ({values.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                disabled={!canAdd}
                onClick={() => field.pushValue(defaultValue)}
              >
                <Plus size="14" /> {addLabel}
              </Button>
            </div>

            <div className="space-y-3">
              {values.map((_, i) => (
                <div key={i} className="group relative rounded-xl border bg-muted/5 p-4 transition-all hover:bg-muted/10">
                  <div className="absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 rounded-full shadow-lg"
                      onClick={() => field.removeValue(i)}
                    >
                      <Trash size="12" />
                    </Button>
                  </div>
                  {children(`${name}[${i}]`, i, () => field.removeValue(i))}
                </div>
              ))}

              {values.length === 0 && (
                <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20">
                  <p className="text-xs italic text-muted-foreground/50">
                    No items added to {label.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </FormField>
  );
}

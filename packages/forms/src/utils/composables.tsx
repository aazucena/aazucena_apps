'use client';

import * as React from 'react';
import { useForm, type FormApi, type FormOptions } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import {
  FormInstanceContext,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@aazucena/ui';
import { FormGateContext } from '../components/FormGate.js';

/**
 * ## Engineering Standards
 * - **Composables Pattern:** Factory functions for creating typed form hooks and contexts.
 * - **Consistency:** Ensures all forms use the Zod validator adapter by default.
 * - **Integration:** Seamlessly connects TanStack Form logic with @aazucena/ui components.
 */

// --- CONTEXTS ---

const FormScopeContext = React.createContext<string | null>(null);

// --- HOOKS ---

/**
 * useFormInstance
 * A generic hook to retrieve the current form instance from context.
 */
export function useFormInstance<TData = any>() {
  const context = React.useContext(FormInstanceContext);
  if (!context) {
    throw new Error('useFormInstance must be used within a Form provider');
  }
  return context as FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>;
}

/**
 * createFormHook
 * Creates a pre-configured version of the useForm hook with shared defaults.
 */
export function createFormHook<TData>(
  defaultOptions: Partial<
    FormOptions<TData, any, any, any, any, any, any, any, any, any, any>
  > = {},
) {
  return (
    options?: Partial<FormOptions<TData, any, any, any, any, any, any, any, any, any, any>>,
  ) => {
    return useForm({
      validatorAdapter: zodValidator(),
      ...defaultOptions,
      ...options,
    } as any);
  };
}

/**
 * createFormHookContexts
 * Creates a specialized FormProvider and useFormInstance hook for a specific data type.
 */
export function createFormHookContexts<TData>() {
  const Context = React.createContext<FormApi<
    TData,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > | null>(null);

  const FormProvider = ({
    form,
    children,
  }: {
    form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>;
    children: React.ReactNode;
  }) => {
    return (
      <Context.Provider value={form}>
        <FormInstanceContext.Provider value={form}>{children}</FormInstanceContext.Provider>
      </Context.Provider>
    );
  };

  const useTypedFormInstance = () => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error('useFormInstance must be used within its corresponding FormProvider');
    }
    return context;
  };

  return {
    FormProvider,
    useFormInstance: useTypedFormInstance,
  };
}

/**
 * useFormRevert
 * Provides state and functions to revert/undo form changes.
 */
export function useFormRevert() {
  const form = useFormInstance();
  return {
    canUndo: form.state.isDirty,
    undo: () => {
      if (window.confirm('Discard all unsaved changes?')) {
        form.reset();
      }
    },
  };
}

/**
 * useFormStoreSync
 * Synchronizes form values into a Nanostore atom for cross-framework accessibility.
 */
export function useFormStoreSync<TData>(
  form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>,
  store: { set: (val: TData) => void },
) {
  React.useEffect(() => {
    const unsubscribe = form.store.subscribe(() => {
      store.set(form.state.values);
    });
    return () => unsubscribe();
  }, [form, store]);
}

/**
 * useFormReduxSync
 * Synchronizes form values into a Redux store via an action dispatcher.
 */
export function useFormReduxSync<TData>(
  form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>,
  dispatch: (action: any) => void,
  actionCreator: (values: TData) => any,
) {
  React.useEffect(() => {
    const unsubscribe = form.store.subscribe(() => {
      dispatch(actionCreator(form.state.values));
    });
    return () => unsubscribe();
  }, [form, dispatch, actionCreator]);
}

/**
 * useFieldDependency
 * Programmatically updates a target field when a source field changes.
 */
export function useFieldDependency<TSource, TTarget>(
  sourceName: string,
  targetName: string,
  effectFn: (
    sourceValue: TSource,
    form: FormApi<any, any, any, any, any, any, any, any, any, any, any, any>,
  ) => void,
) {
  const form = useFormInstance();

  React.useEffect(() => {
    const unsubscribe = form.store.subscribe(() => {
      const sourceValue = form.getFieldValue(sourceName as any);
      effectFn(sourceValue, form);
    });
    return () => unsubscribe();
  }, [form, sourceName, targetName, effectFn]);
}

// --- COMPONENTS ---

/**
 * createControlledField
 * A HOC factory that turns any UI primitive into a TanStack-controlled form component.
 * Supports path scoping via FormScope and auth gating via FormGate.
 */
export function createControlledField<
  TProps extends { value: any; onChange: any; onBlur?: any; disabled?: boolean },
>(Component: React.ComponentType<TProps>) {
  return function ControlledField({
    name,
    label,
    description,
    required,
    validators,
    disabled,
    ...props
  }: {
    name: string;
    label: string;
    description?: string;
    required?: boolean;
    validators?: any;
    disabled?: boolean;
  } & Omit<TProps, 'value' | 'onChange' | 'onBlur' | 'disabled'>) {
    const scope = React.useContext(FormScopeContext);
    const isGated = React.useContext(FormGateContext);
    const fullName = scope ? `${scope}.${name}` : name;

    return (
      <FormField name={fullName} validators={validators}>
        {(field: any) => (
          <FormItem>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <Component
                {...(props as any)}
                value={field.state.value}
                onBlur={field.handleBlur}
                disabled={disabled || isGated}
                onChange={(e: any) => {
                  const val = e?.target ? e.target.value : e;
                  field.handleChange(val);
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      </FormField>
    );
  };
}

/**
 * FormScope
 * Provides a path prefix context for child fields, simplifying nested form structures.
 */
export function FormScope({ path, children }: { path: string; children: React.ReactNode }) {
  const parentScope = React.useContext(FormScopeContext);
  const currentScope = parentScope ? `${parentScope}.${path}` : path;

  return <FormScopeContext.Provider value={currentScope}>{children}</FormScopeContext.Provider>;
}

/**
 * useFormInitialSync
 * Synchronizes external data (e.g. from TanStack Query) into the form state,
 * but only if the form is pristine (has not been edited by the user).
 */
export function useFormInitialSync<TData>(
  form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>,
  data: TData | undefined,
  enabled = true,
) {
  React.useEffect(() => {
    if (!enabled || !data) return;

    if (!form.state.isDirty) {
      form.setFieldValue('' as any, data as any);
    }
  }, [form, data, enabled]);
}

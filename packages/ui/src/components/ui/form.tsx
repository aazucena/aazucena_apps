'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { useForm, useField, type AnyFieldApi, type FormApi } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';
import { Label } from './label';

/**
 * ## Engineering Standards
 * - **Adapter Pattern:** Bridges TanStack Form logic with Shadcn visual components.
 * - **Reactivity:** Uses TanStack's granular field-level subscriptions.
 * - **Visuals:** Full support for 'default', 'glass', and 'cyber' variants.
 */

// --- CONTEXTS ---

const FormInstanceContext = React.createContext<any>(null);

type FormContextValue = {
  variant?: 'default' | 'glass' | 'cyber';
};

const FormContext = React.createContext<FormContextValue>({ variant: 'default' });

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

type FormFieldContextValue = {
  name: string;
  field: AnyFieldApi;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

// --- COMPONENTS ---

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  variant?: 'default' | 'glass' | 'cyber';
  form?: any;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, variant = 'default', form, ...props }, ref) => {
    const content = (
      <FormContext.Provider value={{ variant }}>
        <form ref={ref} className={cn('space-y-6', className)} {...props} />
      </FormContext.Provider>
    );

    if (form) {
      return <FormInstanceContext.Provider value={form}>{content}</FormInstanceContext.Provider>;
    }

    return content;
  },
);
Form.displayName = 'Form';

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { variant } = React.useContext(FormContext);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;
  const { field } = fieldContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    variant,
    // TanStack Field State
    state: field.state,
    error: field.state.meta.errors?.[0],
    isTouched: field.state.meta.isTouched,
    isValidating: field.state.meta.isValidating,
  };
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, required, ...props }, ref) => {
  const { error, formItemId, variant } = useFormField();

  return (
    <div className="flex items-center gap-1">
      <Label
        ref={ref}
        variant={variant as any}
        className={cn(error && 'text-destructive', className)}
        htmlFor={formItemId}
        {...props}
      />
      {required && (
        <span
          className={cn(
            'text-xs leading-none font-bold',
            error ? 'text-destructive' : variant === 'cyber' ? 'text-cyan-400' : 'text-primary',
          )}
        >
          *
        </span>
      )}
    </div>
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId, variant } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        'text-muted-foreground text-[0.8rem]',
        variant === 'cyber' && 'font-mono text-[9px] text-cyan-500/40 uppercase',
        className,
      )}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId, variant } = useFormField();
  const body = error ? String(error) : children;

  return (
    <AnimatePresence mode="wait">
      {body && (
        <motion.p
          ref={ref as any}
          id={formMessageId}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'text-destructive text-[0.8rem] font-medium',
            variant === 'cyber' && 'font-mono text-[9px] text-red-400 uppercase',
            className,
          )}
          {...(props as any)}
        >
          {body}
        </motion.p>
      )}
    </AnimatePresence>
  );
});
FormMessage.displayName = 'FormMessage';

/**
 * FormField is a bridge component that connects TanStack Form's Field API
 * to our Shadcn-style form components.
 */
export function FormField<TData, TName extends string>({
  form,
  name,
  children,
  ...props
}: {
  form?: any;
  name: TName;
  children: (field: AnyFieldApi) => React.ReactNode;
} & any) {
  const contextForm = React.useContext(FormInstanceContext);
  const activeForm = form || contextForm;

  if (!activeForm) {
    throw new Error(
      'FormField must be used within a Form component or provided with a form instance.',
    );
  }

  return (
    <activeForm.Field name={name} {...props}>
      {(field: AnyFieldApi) => (
        <FormFieldContext.Provider value={{ name, field }}>
          {children(field)}
        </FormFieldContext.Provider>
      )}
    </activeForm.Field>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormInstanceContext,
  zodValidator,
};

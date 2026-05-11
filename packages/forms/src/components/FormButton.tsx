'use client';

import * as React from 'react';
import { SubmitButton } from '@aazucena/ui';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Adapter Pattern:** Bridges TanStack Form state with the standard SubmitButton.
 * - **Consistency:** Reuses the UI package's 'SubmitButton' primitive.
 * - **Performance:** Granular subscription prevents parent re-renders.
 */

export interface FormButtonProps extends React.ComponentProps<typeof SubmitButton> {
  /**
   * If true, the button will be disabled if the form is invalid.
   * @default true
   */
  disableIfInvalid?: boolean;
}

/**
 * FormButton
 * A TanStack-aware adapter for the standard UI SubmitButton.
 * Automatically handles loading and disabled states based on the active form instance.
 */
export function FormButton({
  children,
  disableIfInvalid = true,
  disabled,
  loading,
  ...props
}: FormButtonProps) {
  const form = useFormInstance() as any;

  return (
    <form.Subscribe
      selector={(state: any) => [state.canSubmit, state.isSubmitting, state.isValidating]}
    >
      {([canSubmit, isSubmitting, isValidating]: [boolean, boolean, boolean]) => (
        <SubmitButton
          {...props}
          loading={loading || isSubmitting || isValidating}
          disabled={disabled || isSubmitting || (disableIfInvalid && !canSubmit)}
        >
          {children}
        </SubmitButton>
      )}
    </form.Subscribe>
  );
}

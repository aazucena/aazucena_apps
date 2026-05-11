'use client';

import * as React from 'react';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Access Control Pattern:** Declarative field gating based on arbitrary conditions (e.g. Auth).
 * - **UX:** Ensures visual and functional consistency for restricted fields.
 * - **Integration:** Leverages TanStack Form's ability to handle disabled states.
 */

export interface FormGateProps {
  /**
   * Condition to determine if the fields should be editable.
   * If false, all child fields will be disabled.
   */
  canEdit: boolean;
  children: React.ReactNode;
}

/**
 * FormGate
 * A structural component that manages the editable state of a group of fields.
 * Wraps children in a context that is respected by ControlledFields.
 */
export function FormGate({ canEdit, children }: FormGateProps) {
  // We use a simple context to pass down the disabled state
  // Our createControlledField factory will be updated to consume this.
  return (
    <FormGateContext.Provider value={!canEdit}>
      <fieldset disabled={!canEdit} className="border-none p-0 m-0 contents">
        {children}
      </fieldset>
    </FormGateContext.Provider>
  );
}

export const FormGateContext = React.createContext<boolean>(false);

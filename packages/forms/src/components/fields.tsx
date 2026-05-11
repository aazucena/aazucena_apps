'use client';

import { Input, Textarea, Checkbox, Switch } from '@aazucena/ui';
import { createControlledField } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Factory Pattern:** Standardized field components generated via HOC factory.
 * - **Consistency:** Ensures all UI primitives interact with TanStack Form identically.
 */

export const ControlledInput = createControlledField(Input);
export const ControlledTextarea = createControlledField(Textarea);
export const ControlledCheckbox = createControlledField(Checkbox);
export const ControlledSwitch = createControlledField(Switch);

'use client';

/**
 * Template-friendly field wrappers.
 *
 * `createControlledField` uses a HOC generic whose `TProps` is inferred as the
 * minimum constraint (`{ value; onChange; ... }`) rather than the full Input
 * props. These re-exports cast to a relaxed type so templates can pass native
 * HTML attributes (type, placeholder, autoComplete, min, max, etc.) without
 * TypeScript false positives. Runtime behaviour is identical — the underlying
 * component handles all forwarded props.
 */
import type React from 'react';
import {
  ControlledInput as _ControlledInput,
  ControlledTextarea as _ControlledTextarea,
  ControlledCheckbox as _ControlledCheckbox,
  ControlledSwitch as _ControlledSwitch,
} from '../components/fields';

type TemplateFieldProps = {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  validators?: any;
  disabled?: boolean;
  [key: string]: any;
};

export const ControlledInput = _ControlledInput as React.ComponentType<TemplateFieldProps>;
export const ControlledTextarea = _ControlledTextarea as React.ComponentType<TemplateFieldProps>;
export const ControlledCheckbox = _ControlledCheckbox as React.ComponentType<TemplateFieldProps>;
export const ControlledSwitch = _ControlledSwitch as React.ComponentType<TemplateFieldProps>;

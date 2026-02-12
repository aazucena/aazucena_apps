/**
 * Component Prop and Event Types
 */

import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

export type Theme = 'light' | 'dark' | 'system';

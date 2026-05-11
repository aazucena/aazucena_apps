import type { ElementType } from 'react';

/**
 * [Types] : Navigation_Interfaces
 * Shared between Header, Sidebar, and CommandPalette.
 */

export interface NavItem {
  name: string;
  href: string;
  icon: ElementType | string;
}

export interface NavMode {
  id: string;
  label: string;
  icon: ElementType | string;
}

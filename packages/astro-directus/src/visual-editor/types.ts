import type { PrimaryKey } from "@directus/types";

export interface EditConfig {
  collection: string;
  item: PrimaryKey | null;
  mode?: 'drawer' | 'modal' | 'popover';
  fields?: string[] | string;
}

export interface SavedData {
  collection: string;
  item: PrimaryKey | null;
  key: string;
  payload: Record<string, any>;
}

export interface SaveConfig {
  directusUrl: string;
  elements?: HTMLElement | HTMLElement[] | null;
  customClass?: string | undefined;
  onSaved?: ((data: Omit<SavedData, 'key'>) => void) | undefined;
}
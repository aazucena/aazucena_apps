import { atom } from 'nanostores';

/**
 * Global store for the Journey page state
 */

// Set of visible category names (kebab-case)
export const visibleCategoriesStore = atom<Set<string> | null>(null);

// Search query for skills
export const skillSearchQueryStore = atom<string>('');

/**
 * Toggle a category's visibility
 */
export function toggleCategory(category: string) {
  const current = visibleCategoriesStore.get();
  if (!current) return;

  const next = new Set(current);
  if (next.has(category)) {
    next.delete(category);
  } else {
    next.add(category);
  }
  visibleCategoriesStore.set(next);
}

/**
 * Set all categories visible
 */
export function resetCategories(allCategories: string[]) {
  visibleCategoriesStore.set(new Set(allCategories));
}

/**
 * Debounce Utility
 * Delays function execution until after a specified wait time has passed since the last call
 */

/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the function
 *
 * @example
 * const debouncedSearch = debounce(() => filterProjects(), 300);
 * searchInput.addEventListener('input', debouncedSearch);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Client-side debounce for inline Astro scripts
 * This version is designed to be inlined in <script is:inline> tags
 * where TypeScript features are not available
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the function
 */
export const debounceInline = `
function debounce(func, delay = 300) {
  let timeoutId = null;

  return function(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
`;

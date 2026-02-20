/**
 * URL Utility Functions
 */

/**
 * Updates URL search parameters without reloading the page
 * @param params - Record of parameters to update or delete (if value is empty)
 */
export function updateURL(params: Record<string, string>) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, "", url.toString());
}

/**
 * Gets values from URL search parameters
 * @param keys - Array of parameter keys to retrieve
 * @returns Record of parameter values
 */
export function getURLParams(keys: string[]): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};

  keys.forEach((key) => {
    const value = params.get(key);
    if (value) result[key] = value;
  });

  return result;
}

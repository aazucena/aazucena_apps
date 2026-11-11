/**
 * Human-readable text for a form/validation error.
 * TanStack Form stores Standard Schema issues ({ message, path }) for schema
 * validators, so String(error) would print "[object Object]".
 */
export function getErrorMessage(error: unknown): string {
  if (error == null) return '';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return String(error);
}

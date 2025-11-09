/**
 * Validation Utilities
 * Input validation and type checking helpers
 */

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if value is within range
 */
export function isInRange(
  value: number,
  min: number,
  max: number
): boolean {
  return isValidNumber(value) && value >= min && value <= max;
}

/**
 * Validate opacity value (0-1)
 */
export function isValidOpacity(value: any): boolean {
  return isValidNumber(value) && isInRange(value, 0, 1);
}

/**
 * Validate HSL color values
 */
export function isValidHSL(
  hue: number,
  saturation: number,
  lightness: number
): boolean {
  return (
    isInRange(hue, 0, 360) &&
    isInRange(saturation, 0, 100) &&
    isInRange(lightness, 0, 100)
  );
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).trim();
}

/**
 * Validate array of numbers
 */
export function isValidNumberArray(
  arr: any,
  expectedLength?: number
): arr is number[] {
  if (!Array.isArray(arr)) return false;
  if (expectedLength !== undefined && arr.length !== expectedLength) return false;
  return arr.every(isValidNumber);
}

/**
 * Validate 3D position tuple
 */
export function isValid3DPosition(
  pos: any
): pos is [number, number, number] {
  return isValidNumberArray(pos, 3);
}

/**
 * Check if object has required properties
 */
export function hasRequiredProperties<T extends Record<string, any>>(
  obj: any,
  requiredProps: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  return requiredProps.every(prop => prop in obj);
}

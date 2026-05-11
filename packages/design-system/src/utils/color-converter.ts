import { formatHex, parse } from 'culori';

/**
 * Converts any valid CSS color string (including OKLCH) to a HEX string.
 * @param color - The CSS color string (e.g., 'oklch(0.64 0.11 215)')
 * @returns The HEX string (e.g., '#00a3e0') or the original string if parsing fails.
 */
export function toHex(color: string): string {
  try {
    const parsed = parse(color);
    if (!parsed) return color;
    return formatHex(parsed) || color;
  } catch {
    return color;
  }
}

/**
 * Colour parsing for handing CSS colours to three.js and Pixi.
 */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB =
  /^rgba?\(\s*(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i;

/**
 * Parses `#rgb`, `#rrggbb`, `rgb()` and `rgba()` into a 0xRRGGBB number, or null.
 * Other forms (`oklch()`, `color-mix()`) must be resolved to `rgb()` first, for example by
 * painting them on a canvas, because only the browser can convert them.
 */
export function parseCssColor(value: string): number | null {
  const v = value.trim();

  const hex = HEX.exec(v);
  if (hex) {
    const digits = hex[1]!;
    const full = digits.length === 3 ? digits.replace(/./g, (c) => c + c) : digits;
    return parseInt(full, 16);
  }

  const rgb = RGB.exec(v);
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map(Number) as [number, number, number];
    if (r > 255 || g > 255 || b > 255) return null;
    return (r << 16) | (g << 8) | b;
  }

  return null;
}

/**
 * Reads a design token (a CSS custom property) as a 0xRRGGBB number for three.js and Pixi.
 * It reads from the homepage's `.dark` content wrapper (HomeLayout), so the particles get the dark
 * tokens whatever the site theme is. Call it once when a scene starts; the colour does not
 * follow later theme changes.
 */
import { parseCssColor } from "@aazucena/utils";

/** Paints any CSS colour (oklch, color-mix, ...) on a 1px canvas and reads the pixel back. */
function paintToNumber(value: string): number | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "transparent";
  ctx.fillStyle = value; // an unparseable value leaves the pixel transparent
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 0 ? null : (r! << 16) | (g! << 8) | b!;
}

export function readTokenColor(name: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.querySelector(".dark") ?? document.body)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;
  const direct = parseCssColor(raw);
  if (direct !== null) return direct;
  try {
    return paintToNumber(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Width of a watermark word in em, so CSS can size it to fit without JavaScript.
 * Advances are Fira Sans Black (900) at 1em, measured once; the sum ignores kerning, which only
 * ever tightens a pair, so the result never under-estimates. A glyph outside the table counts as
 * wide (0.9em) so an unusual CMS word still fits.
 */
const ADVANCE: Record<string, number> = {
  "0": 0.602,
  "1": 0.482,
  "2": 0.53,
  "3": 0.532,
  "4": 0.585,
  "5": 0.557,
  "6": 0.582,
  "7": 0.482,
  "8": 0.599,
  "9": 0.582,
  A: 0.601,
  B: 0.622,
  C: 0.584,
  D: 0.656,
  E: 0.52,
  F: 0.485,
  G: 0.653,
  H: 0.657,
  I: 0.292,
  J: 0.325,
  K: 0.659,
  L: 0.522,
  M: 0.791,
  N: 0.651,
  O: 0.69,
  P: 0.611,
  Q: 0.69,
  R: 0.624,
  S: 0.588,
  T: 0.554,
  U: 0.644,
  V: 0.579,
  W: 0.859,
  X: 0.606,
  Y: 0.62,
  Z: 0.557,
  " ": 0.22,
  "-": 0.41,
  "&": 0.779,
  ".": 0.24,
  "'": 0.25,
  "/": 0.52,
  _: 0.52,
  "+": 0.55,
  ":": 0.24,
  ",": 0.24,
  "!": 0.24,
  "?": 0.495,
  "#": 0.58,
  "@": 1.02,
};

const UNKNOWN = 0.9;
export const WATERMARK_TRACKING = -0.04;

export function watermarkEmWidth(word: string): number {
  const chars = Array.from(word.toUpperCase());
  const sum = chars.reduce((acc, c) => acc + (ADVANCE[c] ?? UNKNOWN), 0);
  return Math.max(sum + chars.length * WATERMARK_TRACKING, 0.5);
}

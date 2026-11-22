/**
 * Font helpers for BaseLayout. The CMS configures the four font families; each name is checked
 * before it reaches CSS or a URL, so a stray quote, semicolon or brace can never leave the value.
 */

export interface ThemeFonts {
  sans: string;
  serif: string;
  heading: string;
  code: string;
}

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9 -]{0,63}$/;

/** Weights requested for the sans family and the code family (only the weights the site uses). */
const SANS_WEIGHTS = [300, 400, 500, 600, 700, 900];
const CODE_WEIGHTS = [400, 500];

/** Returns the trimmed name when it holds only letters, digits, spaces and hyphens, else the fallback. */
export function safeFontName(
  name: string | undefined | null,
  fallback: string,
): string {
  const trimmed = (name ?? "").trim();
  return SAFE_NAME.test(trimmed) ? trimmed : fallback;
}

const SANS_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SERIF_STACK = 'ui-serif, Georgia, "Times New Roman", serif';
const CODE_STACK =
  'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';

/** The resolved, validated families with Fira as the fallback for each role. */
export function resolveFonts(fonts: Partial<ThemeFonts> | undefined) {
  return {
    sans: safeFontName(fonts?.sans, "Fira Sans"),
    serif: safeFontName(fonts?.serif, "Fira Sans"),
    heading: safeFontName(fonts?.heading, "Fira Sans"),
    code: safeFontName(fonts?.code, "Fira Code"),
  };
}

/** Plain CSS for :root, no define:vars, so it survives `astro build` unchanged. */
export function fontVariablesCss(
  fonts: Partial<ThemeFonts> | undefined,
): string {
  const f = resolveFonts(fonts);
  return [
    ":root {",
    `  --font-sans: "${f.sans}", ${SANS_STACK};`,
    `  --font-serif: "${f.serif}", ${SERIF_STACK};`,
    `  --font-heading: "${f.heading}", ${SANS_STACK};`,
    `  --font-code: "${f.code}", ${CODE_STACK};`,
    `  --font-mono: var(--font-code);`,
    "}",
  ].join("\n");
}

/** Google Fonts stylesheet URL for the code and sans families, one request, display=swap. */
export function googleFontsUrl(fonts: Partial<ThemeFonts> | undefined): string {
  const f = resolveFonts(fonts);
  const family = (name: string, weights: number[]) =>
    `family=${name.replace(/ /g, "+")}:wght@${weights.join(";")}`;
  const families = [family(f.sans, SANS_WEIGHTS), family(f.code, CODE_WEIGHTS)];
  // Serif and heading may differ from sans; request them too, but only when they are distinct.
  for (const extra of new Set([f.serif, f.heading])) {
    if (extra !== f.sans && extra !== f.code)
      families.push(family(extra, [400, 700]));
  }
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

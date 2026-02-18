import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Playwright Test Reporting Theme
 * Maps brand tokens to Playwright's HTML report styles.
 */
export const playwrightTheme = {
  /** CSS Overrides for the Playwright HTML Reporter */
  css: `
    :root {
      --color-primary: ${toHex(colors.primary[500])};
      --color-bg: ${toHex(colors.zinc[950])};
      --color-text: ${toHex(colors.zinc[100])};
      --color-success: ${toHex(colors.success[500])};
      --color-error: ${toHex(colors.destructive[500])};
      --color-warning: ${toHex(colors.amber[500])};
      --color-border: ${toHex(colors.zinc[800])};
    }
    
    body {
      background-color: var(--color-bg);
      color: var(--color-text);
    }
    
    .test-result-success { color: var(--color-success); }
    .test-result-error { color: var(--color-error); }
  `.trim(),
  
  /** Configuration for the Playwright config file */
  config: {
    reporter: [['html', { open: 'never', dark: true }]],
  },
} as const;

export type PlaywrightTheme = typeof playwrightTheme;

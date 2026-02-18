import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Vercel OG (Satori) Theme Configuration
 * Optimized for @vercel/og and Satori image generation.
 * Note: Satori supports a subset of CSS and requires inline styles.
 */
export const vercelOgTheme = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: toHex(colors.zinc[950]),
    color: toHex(colors.zinc[100]),
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: 60,
    fontWeight: 700,
    letterSpacing: '-0.05em',
    color: toHex(colors.primary[500]),
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 30,
    color: toHex(colors.zinc[400]),
  },
  accent: {
    backgroundColor: toHex(colors.primary[500]),
    height: 10,
    width: 200,
    borderRadius: 5,
    marginTop: 40,
  },
} as const;

export type VercelOgTheme = typeof vercelOgTheme;

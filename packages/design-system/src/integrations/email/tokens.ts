import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Transactional Email Style Constants
 * Optimized for React Email, Resend, and standard HTML email templates.
 */
export const emailStyles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: toHex(colors.zinc[800]),
    fontSize: '16px',
    lineHeight: '1.5',
  },
  heading: {
    color: toHex(colors.zinc[950]),
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: toHex(colors.primary[500]),
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
  },
  footer: {
    color: toHex(colors.zinc[500]),
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '40px',
  },
} as const;

export type EmailStyles = typeof emailStyles;

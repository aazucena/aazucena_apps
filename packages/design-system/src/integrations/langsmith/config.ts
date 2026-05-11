import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * LangSmith AI Observability Branding
 * Maps semantic prompt categories and personas to brand colors for trace tagging.
 */
export const langsmithBranding = {
  /** Colors for categorizing different AI personas/agents */
  personas: {
    technical: toHex(colors.primary[500]),
    creative: toHex(colors.secondary[500]),
    managerial: toHex(colors.amber[500]),
    security: toHex(colors.destructive[500]),
  },

  /** Colors for different trace types or outcomes */
  traces: {
    success: toHex(colors.success[500]),
    failure: toHex(colors.destructive[500]),
    streaming: toHex(colors.primary[300]),
    cached: toHex(colors.zinc[500]),
  },

  /** UI primary accent for LangSmith shared views */
  accent: toHex(colors.primary[500]),
} as const;

export type LangsmithBranding = typeof langsmithBranding;

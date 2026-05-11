import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Webhook Notification Colors
 * Maps semantic status levels to platform-specific color formats (Slack, Discord).
 */
export const webhookColors = {
  /** Success states (e.g., successful deployment, contact form sent). */
  SUCCESS: {
    hex: toHex(colors.success[500]),
    decimal: 2278750, // Derived from success[500]
  },

  /** Information states (e.g., new visitor, session start). */
  INFO: {
    hex: toHex(colors.primary[500]),
    decimal: 42168, // Derived from primary[500]
  },

  /** Warning states (e.g., degraded performance, rate limit nearing). */
  WARNING: {
    hex: toHex(colors.amber[500]),
    decimal: 16753920, // Derived from amber[500]
  },

  /** Danger/Error states (e.g., build failure, 500 error). */
  DANGER: {
    hex: toHex(colors.destructive[500]),
    decimal: 15749300, // Derived from destructive[500]
  },
} as const;

export type WebhookColors = typeof webhookColors;

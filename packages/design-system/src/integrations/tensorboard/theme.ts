import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * TensorBoard Theme Configuration
 * Maps brand tokens to TensorBoard's machine learning visualization dashboard.
 */
export const tensorboardTheme = {
  /** Colors for categorical lines and charts */
  palette: [
    toHex(colors.primary[500]),
    toHex(colors.secondary[500]),
    toHex(colors.success[500]),
    toHex(colors.amber[500]),
    toHex(colors.destructive[500]),
  ],

  /** UI colors for the TensorBoard dashboard */
  ui: {
    background: toHex(colors.zinc[950]),
    foreground: toHex(colors.zinc[100]),
    paper: toHex(colors.zinc[900]),
  },

  /** Specific colors for loss and accuracy charts */
  metrics: {
    loss: toHex(colors.destructive[500]),
    accuracy: toHex(colors.success[500]),
    val_loss: toHex(colors.destructive[300]),
    val_accuracy: toHex(colors.success[300]),
  },
} as const;

export type TensorboardTheme = typeof tensorboardTheme;

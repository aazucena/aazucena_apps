import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { toHex } from '../../utils/color-converter';

const lightColors = {
  primary100: toHex(colors.primary[100]),
  primary200: toHex(colors.primary[200]),
  primary500: toHex(colors.primary[500]),
  primary600: toHex(colors.primary[600]),
  primary700: toHex(colors.primary[700]),
  
  secondary100: toHex(colors.secondary[100]),
  secondary200: toHex(colors.secondary[200]),
  secondary500: toHex(colors.secondary[500]),
  secondary600: toHex(colors.secondary[600]),
  secondary700: toHex(colors.secondary[700]),

  success100: toHex(colors.success[100]),
  success200: toHex(colors.success[200]),
  success500: toHex(colors.success[500]),
  success600: toHex(colors.success[600]),
  success700: toHex(colors.success[700]),

  danger100: toHex(colors.destructive[100]),
  danger200: toHex(colors.destructive[200]),
  danger500: toHex(colors.destructive[500]),
  danger600: toHex(colors.destructive[600]),
  danger700: toHex(colors.destructive[700]),

  warning100: toHex(colors.amber[100]),
  warning200: toHex(colors.amber[200]),
  warning500: toHex(colors.amber[500]),
  warning600: toHex(colors.amber[600]),
  warning700: toHex(colors.amber[700]),

  neutral0: '#ffffff',
  neutral100: toHex(colors.zinc[100]),
  neutral150: toHex(colors.zinc[150] || colors.zinc[200]),
  neutral200: toHex(colors.zinc[200]),
  neutral300: toHex(colors.zinc[300]),
  neutral400: toHex(colors.zinc[400]),
  neutral500: toHex(colors.zinc[500]),
  neutral600: toHex(colors.zinc[600]),
  neutral700: toHex(colors.zinc[700]),
  neutral800: toHex(colors.zinc[800]),
  neutral900: toHex(colors.zinc[900]),
  neutral1000: '#000000',

  buttonPrimary500: toHex(colors.primary[500]),
  buttonPrimary600: toHex(colors.primary[600]),
  buttonNeutral0: '#ffffff',

  alternative100: toHex(colors.zinc[100]),
  alternative200: toHex(colors.zinc[200]),
  alternative500: toHex(colors.zinc[500]),
  alternative600: toHex(colors.zinc[600]),
  alternative700: toHex(colors.zinc[700]),
};

const darkColors = {
  ...lightColors,
  neutral0: toHex(colors.zinc[950]),
  neutral100: toHex(colors.zinc[900]),
  neutral150: toHex(colors.zinc[800]),
  neutral200: toHex(colors.zinc[700]),
  neutral300: toHex(colors.zinc[600]),
  neutral400: toHex(colors.zinc[500]),
  neutral500: toHex(colors.zinc[400]),
  neutral600: toHex(colors.zinc[300]),
  neutral700: toHex(colors.zinc[200]),
  neutral800: toHex(colors.zinc[100]),
  neutral900: toHex(colors.zinc[50]),
  neutral1000: '#ffffff',
  buttonNeutral0: toHex(colors.zinc[900]),
};

export const strapiTheme = {
  light: {
    colors: lightColors,
    shadows: {
      filterShadow: shadows.sm,
      focus: `0 0 0 2px ${lightColors.primary500}`,
      focusShadow: shadows.sm,
      popupShadow: shadows.lg,
      tableShadow: shadows.md,
    },
  },
  dark: {
    colors: darkColors,
    shadows: {
      filterShadow: shadows.sm,
      focus: `0 0 0 2px ${darkColors.primary500}`,
      focusShadow: shadows.sm,
      popupShadow: shadows.lg,
      tableShadow: shadows.md,
    },
  },
};

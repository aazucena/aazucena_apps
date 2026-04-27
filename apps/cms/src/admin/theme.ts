// Pre-computed from @aazucena/design-system color tokens (OKLCH → hex via culori).
// Regenerate by running: node scripts/extract-strapi-theme.js

const lightColors = {
  primary100: '#e0f2f7',
  primary200: '#b9e7f3',
  primary500: '#139cb6',
  primary600: '#208295',
  primary700: '#0b6677',

  secondary100: '#ffe3d8',
  secondary200: '#ffccbb',
  secondary500: '#e97558',
  secondary600: '#d85e40',
  secondary700: '#cd5537',

  success100: '#b5f0b5',
  success200: '#96e498',
  success500: '#57cb60',
  success600: '#45ba50',
  success700: '#3ba946',

  danger100: '#ffc4bd',
  danger200: '#ffa49b',
  danger500: '#fc4447',
  danger600: '#e62b34',
  danger700: '#c9222b',

  warning100: '#fef3c6',
  warning200: '#fee685',
  warning500: '#fe9a00',
  warning600: '#e17100',
  warning700: '#bb4d00',

  neutral0: '#ffffff',
  neutral100: '#f2f2f2',
  neutral150: '#e1e1e1',
  neutral200: '#e1e1e1',
  neutral300: '#c7c7c7',
  neutral400: '#a1a1a1',
  neutral500: '#717171',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#181818',
  neutral1000: '#000000',

  buttonPrimary500: '#139cb6',
  buttonPrimary600: '#208295',
  buttonNeutral0: '#ffffff',

  alternative100: '#f2f2f2',
  alternative200: '#e1e1e1',
  alternative500: '#717171',
  alternative600: '#525252',
  alternative700: '#404040',
};

const darkColors = {
  ...lightColors,
  neutral0: '#090909',
  neutral100: '#181818',
  neutral150: '#262626',
  neutral200: '#404040',
  neutral300: '#525252',
  neutral400: '#717171',
  neutral500: '#a1a1a1',
  neutral600: '#c7c7c7',
  neutral700: '#e1e1e1',
  neutral800: '#f2f2f2',
  neutral900: '#f8f8f8',
  neutral1000: '#ffffff',
  buttonNeutral0: '#181818',
};

const lightShadows = {
  filterShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  focus: `0 0 0 2px ${lightColors.primary500}`,
  focusShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  popupShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
  tableShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.08)',
};

const darkShadows = {
  ...lightShadows,
  focus: `0 0 0 2px ${darkColors.primary500}`,
};

export const strapiTheme = {
  light: { colors: lightColors, shadows: lightShadows },
  dark: { colors: darkColors, shadows: darkShadows },
};

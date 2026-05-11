/**
 * Z-Index Hierarchy Tokens
 */

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dock: 10,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  max: 9999,
} as const;

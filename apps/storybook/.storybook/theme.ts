import { create } from 'storybook/theming';
import { managerTheme, previewTheme, LOGO_MAIN, defaultVibe, toHex } from '@aazucena/design-system';

function retrieveLogoDataUri(color: string): string {
  const logo = LOGO_MAIN.replace(/currentColor/g, color);
  return `data:image/svg+xml;base64,${btoa(logo)}`;
}

export const adminTheme = create({
  ...managerTheme,
  brandImage: retrieveLogoDataUri(managerTheme.colorPrimary),
});

/**
 * Docs frame themes, read from the default vibe's Avra roles so the frame,
 * prose, tables and code sit on the same surfaces as the components.
 * Links use `signal` (AA on `background` in both modes); coral stays for alerts.
 */
function docsThemeFor(mode: 'light' | 'dark') {
  const c = defaultVibe[mode].colors;
  const hex = (v: string | undefined, fallback: string) => (v ? toHex(v) : fallback);
  const background = hex(c.background, mode === 'dark' ? '#0e1a20' : '#e8f2f7');
  const panel = hex(c.panel, background);
  const signal = hex(c.signal, '#007493');

  return create({
    ...previewTheme,
    base: mode,
    brandImage: retrieveLogoDataUri(signal),
    appBg: background,
    appContentBg: background,
    appPreviewBg: panel,
    appBorderColor: hex(c.rule, '#c3d4dc'),
    appBorderRadius: 6,
    textColor: hex(c.foreground, mode === 'dark' ? '#d5e3ea' : '#0e1a20'),
    textInverseColor: background,
    textMutedColor: hex(c.mutedForeground, '#56707c'),
    barBg: panel,
    inputBg: panel,
    inputBorder: hex(c.rule, '#c3d4dc'),
    colorPrimary: signal,
    colorSecondary: signal,
  });
}

export const docsThemeLight = docsThemeFor('light');
export const docsThemeDark = docsThemeFor('dark');

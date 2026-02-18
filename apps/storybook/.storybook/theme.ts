import { create } from 'storybook/theming';
import { managerTheme, previewTheme, LOGO_MAIN } from '@aazucena/design-system';



function retrieveLogoDataUri(color: string): string {
  const logo = LOGO_MAIN.replace(/currentColor/g, color);
  return `data:image/svg+xml;base64,${btoa(logo)}`;
}


export const adminTheme = create({
  ...managerTheme,
  brandImage: retrieveLogoDataUri(managerTheme.colorPrimary),
});

export const docsTheme = create({
  ...previewTheme,
  brandImage: retrieveLogoDataUri(previewTheme.colorPrimary),
});

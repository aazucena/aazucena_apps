import { addons } from 'storybook/manager-api';
import { adminTheme } from './theme';

/**
 * Storybook Manager Configuration
 * Applies the custom @aazucena brand theme to the Storybook shell.
 */
// Inject the primary brand color into the theme-reactive logo

addons.setConfig({
  theme: adminTheme,
});

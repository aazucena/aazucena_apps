import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './preview';

// Applies preview.tsx decorators, parameters, and global types to every story test.
// setProjectAnnotations stores the result on globalThis so the addon-vitest
// internal setup-file can call beforeAll() from the annotations automatically.
setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);

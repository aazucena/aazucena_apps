import { ThemeManager, vibes } from '@aazucena/design-system';
import { withThemeByClassName } from '@storybook/addon-themes';
import { type Decorator, type Preview } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { docsThemeDark, docsThemeLight } from './theme';
import { AvraDocsContainer } from './docs-container';
import { avraVersion } from './version.ts';
import '../styles/globals.css';

// ---------------------------------------------------------------------------
// Variant background decorator
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Vibe decorator
// ---------------------------------------------------------------------------

// Storybook renders stories in Canvas (#storybook-root) and documentation
// pages in Docs (#storybook-docs). Only one is present at a time, so we
// maintain a manager per container id and apply to whichever exists.
const CANVAS_IDS = ['storybook-root', 'storybook-docs'] as const;

// Visual runs can capture another vibe or mode: STORYBOOK_VIBE=christmas STORYBOOK_MODE=dark
const initialVibe = (import.meta.env.STORYBOOK_VIBE as string | undefined) ?? 'default';
const initialMode = import.meta.env.STORYBOOK_MODE === 'dark' ? 'dark' : 'light';
/**
 * Applies the selected vibe to whichever Storybook container is active.
 * ThemeManager targets each container specifically so vibe vars never bleed
 * onto <html>, which withThemeByClassName (stories) and AvraDocsContainer (docs) manage.
 */
const withVibe: Decorator = (Story, context) => {
  const vibeId = (context.globals.vibe as string) ?? 'default';
  const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
  const managersRef = useRef<Map<string, ThemeManager>>(new Map());

  useEffect(() => {
    const managers = managersRef.current;

    CANVAS_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (!managers.has(id)) {
        managers.set(id, new ThemeManager(el as HTMLElement));
      }

      managers.get(id)!.apply(vibeId, mode);
    });

    return () => {
      managers.forEach((manager) => manager.destroy());
      managers.clear();
    };
  }, [vibeId, mode]);

  return <Story />;
};

// ---------------------------------------------------------------------------
// Preview config
// ---------------------------------------------------------------------------

const preview: Preview = {
  globalTypes: {
    vibe: {
      description: 'Active design system vibe',
      toolbar: {
        title: 'Vibe',
        icon: 'paintbrush',
        items: Object.values(vibes).map((v) => ({
          value: v.id,
          title: v.name,
        })),
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    vibe: initialVibe,
    theme: initialMode,
  },

  parameters: {
    // Toolbar version badge (registered in manager.tsx)
    version: avraVersion,

    docs: {
      // Standalone MDX pages render no story, so decorators never run there.
      // The container applies light/dark + vibe to every docs page.
      container: AvraDocsContainer,
      theme: initialMode === 'dark' ? docsThemeDark : docsThemeLight,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },

    darkMode: {
      classTarget: 'html',
      darkClass: 'dark',
      lightClass: 'light',
    },

    options: {
      storySort: {
        order: [
          'Docs',
          [
            'Introduction',
            'Getting Started',
            'Principles',
            'Voice & Tone',
            'Internationalization',
            'Style Conventions',
            'Capitalization',
            'Contributions Guideline',
            'Changelog',
          ],
          'Design Tokens',
          [
            'Overview',
            'Branding',
            'Colors',
            'Typography',
            'Layout & Spacing',
            'Effects & Shadows',
            'Motion & Animation',
            'Layering & Z-Index',
            'Theme System',
            'Themes',
            ['*'],
          ],
          'Icons',
          [
            'Overview',
            'Proprietary Assets',
            'System UI (MynaUI)',
            'Tech & Social (SimpleIcons)',
            'Engineering Standards',
            ['*'],
          ],
          'Components',
          [
            'Primitives',
            'Actions',
            'Forms',
            'Navigation',
            'Layout',
            'Content',
            'Data',
            'Feedback',
            'Overlay',
            'Identity',
            'AI',
            'Dashboard',
            'Utilities',
          ],
          'Charts & Graphs',
          ['Overview', 'Standard', 'Advanced', 'Relational', 'Specialized', 'Intelligence'],
          'Recipes',
          ['Forms', 'Cards', 'Navigation', 'Dashboards'],
          '*',
        ],
      },
    },
  },

  decorators: [
    withVibe,
    // Avra's CSS keys dark mode on the `.dark` class (@custom-variant dark).
    withThemeByClassName({
      defaultTheme: initialMode,
      themes: {
        light: 'light',
        dark: 'dark',
      },
    }),
  ],
};

export default preview;

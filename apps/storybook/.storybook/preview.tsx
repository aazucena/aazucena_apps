import { ThemeManager, vibes, previewTheme } from '@aazucena/design-system';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { type Decorator, type Preview } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { docsTheme } from './theme';
import '../styles/globals.css';

// ---------------------------------------------------------------------------
// Variant background decorator
// ---------------------------------------------------------------------------

/**
 * Automatically wraps Cyber/Glass variant stories with the appropriate
 * dark or gradient canvas background so components are always visible.
 * Reads context.args.variant at render time — no per-story configuration needed.
 */
const withVariantBackground: Decorator = (Story, context) => {
  const variant = context.args?.variant as string | undefined;

  if (variant === 'cyber') {
    return (
      <div
        style={{
          background: '#09090b',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          display: 'inline-block',
          minWidth: 'max-content',
        }}
      >
        <Story />
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          padding: '2rem',
          borderRadius: '1rem',
          display: 'inline-block',
          minWidth: 'max-content',
        }}
      >
        <Story />
      </div>
    );
  }

  return <Story />;
};

// ---------------------------------------------------------------------------
// Vibe decorator
// ---------------------------------------------------------------------------

// Storybook renders stories in Canvas (#storybook-root) and documentation
// pages in Docs (#storybook-docs). Only one is present at a time, so we
// maintain a manager per container id and apply to whichever exists.
const CANVAS_IDS = ['storybook-root', 'storybook-docs'] as const;

/**
 * Applies the selected vibe to whichever Storybook container is active.
 * ThemeManager targets each container specifically so vibe vars never bleed
 * onto <html>, which is exclusively managed by withThemeByClassName for dark/light.
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
    vibe: 'default',
  },

  parameters: {
    docs: {
      theme: docsTheme,
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
    withVariantBackground,
    withThemeByDataAttribute({
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark',
      },
      attributeName: 'data-mode',
    }),
  ],
};

export default preview;

import * as React from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { ThemeManager } from '@aazucena/design-system';
import { docsThemeDark, docsThemeLight } from './theme';

type Mode = 'light' | 'dark';

// Storybook core event names (storybook/internal/core-events). Inlined so the
// preview doesn't pull in an internal module Vite would optimize mid-test-run.
const GLOBALS_UPDATED = 'globalsUpdated';
const SET_GLOBALS = 'setGlobals';
type Globals = { theme?: string; vibe?: string };

const envVibe = (import.meta.env.STORYBOOK_VIBE as string | undefined) ?? 'default';
const envMode: Mode = import.meta.env.STORYBOOK_MODE === 'dark' ? 'dark' : 'light';

/** `store` is protected on DocsContext but present at runtime; it holds the toolbar globals. */
function readGlobals(context: DocsContainerProps['context']): Globals {
  try {
    const store = (context as unknown as { store?: { userGlobals?: { get(): Globals } } }).store;
    return store?.userGlobals?.get() ?? {};
  } catch {
    return {};
  }
}

/**
 * Story decorators never run on a standalone MDX page, so the light/dark and
 * Vibe toolbar used to do nothing there. This container applies both to every
 * docs page (MDX and autodocs alike): `.dark` on <html> for Avra's CSS, the
 * vibe on #storybook-docs, and a matching Storybook docs theme for the frame,
 * prose, tables and code blocks.
 */
export function AvraDocsContainer({
  children,
  context,
  ...rest
}: React.PropsWithChildren<DocsContainerProps>) {
  const [globals, setGlobals] = React.useState<Globals>(() => readGlobals(context));
  const manager = React.useRef<ThemeManager | null>(null);

  React.useEffect(() => {
    const onGlobals = ({ globals: next }: { globals: Globals }) =>
      setGlobals((prev) => ({ ...prev, ...next }));
    context.channel.on(GLOBALS_UPDATED, onGlobals);
    context.channel.on(SET_GLOBALS, onGlobals);
    return () => {
      context.channel.off(GLOBALS_UPDATED, onGlobals);
      context.channel.off(SET_GLOBALS, onGlobals);
    };
  }, [context.channel]);

  const mode: Mode =
    globals.theme === 'dark' ? 'dark' : globals.theme === 'light' ? 'light' : envMode;
  const vibe = globals.vibe ?? envVibe;

  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', mode === 'dark');
    html.classList.toggle('light', mode === 'light');
    html.style.colorScheme = mode;

    const el = document.getElementById('storybook-docs');
    if (!el) return;
    manager.current ??= new ThemeManager(el);
    manager.current.apply(vibe, mode);
  }, [mode, vibe]);

  React.useEffect(
    () => () => {
      manager.current?.destroy();
      manager.current = null;
    },
    [],
  );

  return (
    <DocsContainer
      {...rest}
      context={context}
      theme={mode === 'dark' ? docsThemeDark : docsThemeLight}
    >
      {children}
    </DocsContainer>
  );
}

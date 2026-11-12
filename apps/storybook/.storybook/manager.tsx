// The manager bundle compiles JSX with the classic runtime, so React must be in scope
import React from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { useTheme } from 'storybook/theming';
import { adminTheme } from './theme';
import type { VersionParameter } from './version.ts';

/**
 * Storybook Manager Configuration
 * Applies the custom @aazucena brand theme to the Storybook shell.
 */
addons.setConfig({
  theme: adminTheme,
});

/**
 * Version badge in the toolbar. Reads the `version` parameter set in
 * preview.tsx (the @aazucena/ui version) or overridden in a story's meta.
 * Built in-house because the storybook-version addon ships CommonJS, which
 * Storybook 10 can't load.
 */
function VersionBadge() {
  const version = useParameter<VersionParameter | undefined>('version');
  const theme = useTheme();
  if (!version) return null;
  const label = `v${version.major}.${version.minor}.${version.patch}${
    version.postfix ? `-${version.postfix}` : ''
  }`;
  return (
    <span
      title="Package version"
      style={{
        alignSelf: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        border: `1px solid ${theme.appBorderColor}`,
        color: theme.color.secondary,
        fontFamily: theme.typography.fonts.mono,
        fontSize: theme.typography.size.s1,
        fontWeight: theme.typography.weight.bold,
      }}
    >
      {label}
    </span>
  );
}

addons.register('avra/version', () => {
  addons.add('avra/version/tool', {
    type: types.TOOL,
    title: 'Version',
    match: () => true,
    render: () => <VersionBadge />,
  });
});

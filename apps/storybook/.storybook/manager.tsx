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
/**
 * Status tags shown as a pill next to a component in the sidebar. Set them in a
 * story file's meta, e.g. `tags: ['autodocs', 'beta']`. Untagged components are
 * stable.
 */
const STATUS_PILLS: Record<string, { label: string; color: string }> = {
  deprecated: { label: 'deprecated', color: '#e5484d' },
  beta: { label: 'beta', color: '#f5a524' },
  new: { label: 'new', color: '#139cb6' },
};

function StatusLabel({ name, tags }: { name: string; tags: string[] }) {
  const status = Object.keys(STATUS_PILLS).find((tag) => tags.includes(tag));
  if (!status) return <>{name}</>;
  const pill = STATUS_PILLS[status]!;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {name}
      <span
        style={{
          padding: '0 6px',
          borderRadius: 999,
          border: `1px solid ${pill.color}`,
          color: pill.color,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: '16px',
          textTransform: 'uppercase',
        }}
      >
        {pill.label}
      </span>
    </span>
  );
}

addons.setConfig({
  theme: adminTheme,
  sidebar: {
    // Pill on component rows only, so a beta component's stories don't repeat it
    renderLabel: (item) =>
      item.type === 'component' ? (
        <StatusLabel name={item.name} tags={'tags' in item ? (item.tags ?? []) : []} />
      ) : (
        item.name
      ),
  },
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

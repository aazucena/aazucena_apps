import * as React from 'react';
import { useOf } from '@storybook/addon-docs/blocks';
import usage from 'virtual:component-usage';
import type { AppName, ModuleUsage } from './scan';

const APP_LABEL: Record<AppName, string> = { analytics: 'Analytics', portfolio: 'Portfolio' };

/** Story title section → the package its components come from. */
const TITLE_PACKAGE: Record<string, string> = {
  Components: 'ui',
  'Charts & Graphs': 'visualizations',
  Layouts: 'layouts',
  Forms: 'forms',
};

interface UsageParameter {
  /** Module key to report, when the story's component name doesn't find it (`ui/sonner`). */
  module?: string;
  /** `false` hides the block (pattern or overview pages that aren't one component). */
  show?: boolean;
}

/** The module a story documents: an explicit parameter, then the component name, then the title. */
export function findModule(
  title: string,
  componentName: string | undefined,
  param: UsageParameter | undefined,
): ModuleUsage | undefined {
  if (param?.module) return usage.modules[param.module];
  const section = title.split('/')[0] ?? '';
  const pkg = TITLE_PACKAGE[section];
  if (!pkg) return undefined;
  const last = title
    .split('/')
    .pop()!
    .replace(/[^A-Za-z0-9]/g, '');
  for (const name of [componentName, last]) {
    const key = name && usage.byExport[`${pkg}:${name}`];
    if (key) return usage.modules[key];
  }
  return undefined;
}

export function UsageList({ module }: { module: ModuleUsage }) {
  const apps = Object.entries(module.apps) as [AppName, { file: string; names: string[] }[]][];
  if (!apps.length) {
    return <p className="text-muted-foreground text-sm">Catalog only: no app imports it yet.</p>;
  }
  const showNames = module.exports.length > 1;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {apps.map(([app, uses]) => (
        <div key={app} className="bg-panel rounded-card p-panel">
          <p className="micro-label text-muted-foreground">
            {APP_LABEL[app]} · {uses.length} {uses.length === 1 ? 'file' : 'files'}
          </p>
          <ul className="mt-2 grid gap-1">
            {uses.map(({ file, names }) => (
              <li key={file} className="text-sm">
                <code className="text-foreground block font-mono text-xs break-all">{file}</code>
                {showNames && (
                  <span className="text-muted-foreground block text-xs">{names.join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * "Used in" for a component docs page: which app files import the component, from
 * a scan of the apps' imports that runs whenever Storybook starts.
 */
export function UsedIn() {
  const meta = useOf('meta') as {
    preparedMeta: {
      title: string;
      component?: { displayName?: string; name?: string };
      parameters?: { usage?: UsageParameter };
    };
  };
  const { title, component, parameters } = meta.preparedMeta;
  if (parameters?.usage?.show === false) return null;
  const single = findModule(title, component?.displayName || component?.name, parameters?.usage);
  // Gallery pages (several components, no single `component`) report every module
  // their story file imports.
  const modules = single
    ? [single]
    : (usage.stories[title] ?? []).map((key) => usage.modules[key]!).filter(Boolean);
  if (!modules.length) return null;
  const used = modules.filter((m) => Object.keys(m.apps).length);
  const unused = modules.filter((m) => !used.includes(m));

  return (
    <section aria-labelledby="used-in" className="sb-unstyled my-8">
      <h2 id="used-in" className="text-foreground mb-1 text-xl font-bold">
        Used in
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Where the analytics app and the portfolio import{' '}
        {single ? <code className="font-mono text-xs">{single.key}</code> : 'these components'},
        read from their source when Storybook starts.{' '}
        {/* The docs page renders in the preview iframe; _top opens the index in the manager */}
        <a href="./?path=/docs/docs-component-usage--docs" target="_top">
          All components
        </a>
      </p>
      {single ? (
        <UsageList module={single} />
      ) : (
        <div className="grid gap-6">
          {used.map((m) => (
            <div key={m.key}>
              <h3 className="text-foreground mb-2 font-mono text-sm">{m.key}</h3>
              <UsageList module={m} />
            </div>
          ))}
          {unused.length > 0 && (
            <p className="text-muted-foreground text-sm">
              Catalog only: {unused.map((m) => m.key.split('/').pop()).join(', ')}.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

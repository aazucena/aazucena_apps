import * as React from 'react';
import usage from 'virtual:component-usage';
import type { AppName, ModuleUsage } from './scan';

const APPS: AppName[] = ['analytics', 'portfolio'];
const count = (m: ModuleUsage, app: AppName) => m.apps[app]?.length ?? 0;

/** Every library module with the number of app files that import it, used ones first. */
export function UsageIndex() {
  const modules = Object.values(usage.modules);
  const used = modules
    .filter((m) => APPS.some((a) => count(m, a)))
    .sort(
      (a, b) =>
        APPS.reduce((n, app) => n + count(b, app) - count(a, app), 0) || a.key.localeCompare(b.key),
    );
  const unused = modules
    .filter((m) => !used.includes(m))
    .sort((a, b) => a.key.localeCompare(b.key));
  const inBoth = used.filter((m) => APPS.every((a) => count(m, a))).length;

  return (
    <div className="sb-unstyled my-6 grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Used by an app', used.length],
          ['Used by both apps', inBoth],
          ['Catalog only', unused.length],
        ].map(([label, n]) => (
          <div key={label} className="bg-panel rounded-card p-panel">
            <p className="micro-label text-muted-foreground">{label}</p>
            <p className="text-foreground text-3xl font-light">{n}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        {/* Docs CSS makes tables display:block (so they scroll on phones); restore the table box */}
        <table className="w-full text-left text-sm" style={{ display: 'table' }}>
          <caption className="text-muted-foreground mb-2 text-left text-sm">
            App files importing each module, from a scan of the apps' source when Storybook starts.
          </caption>
          <thead>
            <tr className="border-rule border-b">
              <th scope="col" className="micro-label text-muted-foreground py-2 pr-4 font-normal">
                Module
              </th>
              {APPS.map((app) => (
                <th
                  key={app}
                  scope="col"
                  className="micro-label text-muted-foreground py-2 pr-4 font-normal"
                >
                  {app}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {used.map((m) => (
              <tr key={m.key} className="border-rule border-b">
                <th scope="row" className="py-2 pr-4 font-normal">
                  <code className="text-foreground font-mono text-xs">{m.key}</code>
                </th>
                {APPS.map((app) => (
                  <td
                    key={app}
                    className="text-foreground py-2 pr-4 font-mono text-xs tabular-nums"
                  >
                    {count(m, app) || <span className="text-muted-foreground">·</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details>
        <summary className="text-foreground cursor-pointer text-sm">
          {unused.length} modules no app imports yet
        </summary>
        <p className="text-muted-foreground mt-2 font-mono text-xs leading-relaxed">
          {unused.map((m) => m.key).join(' · ')}
        </p>
      </details>
    </div>
  );
}

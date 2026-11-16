/**
 * Where the apps use the library: scans each package's component exports and each
 * app's imports from those packages. Runs in Node when Storybook starts (see the
 * `virtual:component-usage` plugin in main.ts), so "Used in" can't go stale.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const APPS = {
  analytics: 'apps/analytics/src',
  portfolio: 'apps/portfolio/src',
} as const;
export type AppName = keyof typeof APPS;

const STORIES = 'apps/storybook/stories';

const PACKAGES = {
  ui: ['packages/ui/src/components'],
  visualizations: ['packages/visualizations/src'],
  layouts: ['packages/layouts/src'],
  forms: ['packages/forms/src/templates', 'packages/forms/src/components'],
} as const;
type PackageName = keyof typeof PACKAGES;

export interface ModuleUsage {
  /** `ui/panel`, `visualizations/d3/BarChart`, … */
  key: string;
  pkg: PackageName;
  /** Value exports of the module (components, plus helpers such as `toast`). */
  exports: string[];
  /** Per app: files (relative to the app's src) and which exports each one imports. */
  apps: Partial<Record<AppName, { file: string; names: string[] }[]>>;
}

export interface ComponentUsage {
  modules: Record<string, ModuleUsage>;
  /** `pkg:ExportName` → module key, to find a story's module from its component. */
  byExport: Record<string, string>;
  /** Story title → library modules its story file imports. */
  stories: Record<string, string[]>;
}

function files(dir: string, exts: RegExp, includeStories = false): string[] {
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(files(full, exts, includeStories));
    else if (exts.test(name) && (includeStories || !/\.(test|spec|stories)\./.test(name)))
      out.push(full);
  }
  return out;
}

const DECLARED = /export\s+(?:default\s+)?(?:const|function|class|let)\s+([A-Za-z_]\w*)/g;
const DEFAULT_NAMED = /export\s+default\s+([A-Z]\w*)\s*;/g;
const LISTED = /export\s*\{([^}]+)\}(?!\s*from)/g;

function moduleExports(src: string): string[] {
  const names = new Set<string>();
  for (const [, n] of src.matchAll(DECLARED)) names.add(n!);
  for (const [, n] of src.matchAll(DEFAULT_NAMED)) names.add(n!);
  for (const [, list] of src.matchAll(LISTED)) {
    for (const part of list!.split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop()!
        .trim();
      if (/^[A-Za-z_]\w*$/.test(name) && !part.trim().startsWith('type ')) names.add(name);
    }
  }
  return [...names];
}

// Value imports only: `import type { … }` is skipped by requiring no `type` keyword.
const IMPORT =
  /import\s+(?!type\b)\{([^}]+)\}\s+from\s+['"]@aazucena\/(ui|visualizations|layouts|forms)(?:\/[^'"]*)?['"]/g;

export function scanComponentUsage(root: string): ComponentUsage {
  const modules: Record<string, ModuleUsage> = {};
  const byExport: Record<string, string> = {};

  for (const [pkg, dirs] of Object.entries(PACKAGES) as [PackageName, readonly string[]][]) {
    for (const dir of dirs) {
      for (const file of files(join(root, dir), /\.tsx$/)) {
        const exports = moduleExports(readFileSync(file, 'utf8'));
        if (!exports.length) continue;
        const rel = relative(join(root, dir), file)
          .replace(/\.tsx$/, '')
          .replace(/^ui\//, '');
        const key = `${pkg}/${rel}`;
        modules[key] = { key, pkg, exports, apps: {} };
        // First module to export a name wins (barrels re-export, they don't declare)
        for (const name of exports) byExport[`${pkg}:${name}`] ??= key;
      }
    }
  }

  /** Library modules a source file imports, with the names it takes from each. */
  const importedModules = (src: string) => {
    const perModule = new Map<string, string[]>();
    for (const [, list, pkg] of src.matchAll(IMPORT)) {
      for (const part of list!.split(',')) {
        const raw = part.trim();
        if (!raw || raw.startsWith('type ')) continue;
        const name = raw.split(/\s+as\s+/)[0]!.trim();
        const key = byExport[`${pkg}:${name}`];
        if (key) perModule.set(key, [...new Set([...(perModule.get(key) ?? []), name])]);
      }
    }
    return perModule;
  };

  for (const [app, dir] of Object.entries(APPS) as [AppName, string][]) {
    for (const file of files(join(root, dir), /\.(tsx?|astro|mdx)$/)) {
      for (const [key, names] of importedModules(readFileSync(file, 'utf8'))) {
        (modules[key]!.apps[app] ??= []).push({ file: relative(join(root, dir), file), names });
      }
    }
  }

  // Story title → modules the story file imports, for pages that document several
  // components at once (the chart galleries) and so have no single `component`.
  const stories: Record<string, string[]> = {};
  for (const file of files(join(root, STORIES), /\.stories\.tsx$/, true)) {
    const src = readFileSync(file, 'utf8');
    const title = src.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
    if (title) stories[title] = [...importedModules(src).keys()];
  }
  return { modules, byExport, stories };
}

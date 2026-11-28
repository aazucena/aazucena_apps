# Strapi update, plugin cleanup and our own icon field (design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: brainstormed with the owner; owner agreed with every recommendation below. Not yet planned or built.

**Relation to earlier plans:** this is step 1 of [Strapi Plugin Icons Field v2.0](./strapi-plugin-icons-field/README.md) (owner decision, 2026-11-27); that plan's later phases stay future work.

## Intent

Bring the CMS up to date for the next release and make it smaller and safer. The owner's specific worry: the icon set the CMS offers and the one the portfolio draws can drift apart with nobody noticing. When the icon package (mynaui) releases a new version, **the CMS and the portfolio must update together, automatically.**

## Goals

1. Upgrade Strapi from 5.61.1 to the current 5.64.x line.
2. Remove the 14 unused plugins and the unused GraphQL plugin.
3. Replace `strapi-plugin-icons-field` with our own small icon custom field that **stores the icon name**, so chosen icons follow every package update.
4. Offer the owner's custom icons (`packages/icons/src/custom`, e.g. Ko-fi) in the picker next to mynaui.
5. Automate mynaui updates across the CMS and the portfolio in one pull request, guarded by tests, auto-merged for minor and patch releases.

## Non-goals

- GraphQL for the analytics dashboard (see "Revisit triggers").
- SimpleIcons brand logos in the picker (author's call; easy to add later).
- Changing any content model other than the icon fields' type.

## Anti-goals (a failure even if it works)

- An editor can pick an icon the portfolio cannot draw, or the portfolio shows the fallback icon for something an editor picked.
- The live admin's icon picker is empty after a deploy.
- A mynaui update merges while the CMS and portfolio are on different versions.

## Current state (2026-11-27)

- **Strapi** 5.61.1 (`apps/cms`), React 18 (Strapi 5 peer). Latest is 5.64.0, published 2026-11-28 UTC.
- **Two lockfiles** (CONTEXT.md, "CMS has two lockfiles"): the workspace uses the root `pnpm-lock.yaml`; Railway and the Dockerfiles install `apps/cms` standalone from `apps/cms/pnpm-lock.yaml`, where `apps/cms/package.json`'s own `pnpm.overrides` apply. Any dependency change runs `pnpm install --ignore-workspace --lockfile-only` in `apps/cms`.
- **Railway build**: `pnpm install && pnpm build` (`apps/cms/railway.json`, Nixpacks). Nothing in it runs `icons.sh`.
- **Icon field today**: `strapi-plugin-icons-field` (`publicPath: 'icons'`) lists SVGs from `apps/cms/public/icons/`, which is gitignored and filled by hand with `icons.sh` (installs `ICON_LIST`, copies SVGs into `mynaui-regular`, `mynaui-solid`; 1,272 each). The live admin's picker is therefore probably empty. The plugin **stores the SVG markup** in each entry: the portfolio's `getIconComponent` (`packages/icons/src/registry.ts`) returns stored `<svg` strings as-is, and `IconRenderer` injects them through `react-inlinesvg`.
- **Icon field usage**: 15 attributes use `plugin::icons-field.icon` (`grep -rho '"customField": "[^"]*"' apps/cms/src`).
- **Versions**: CMS `@mynaui/icons ^0.4.11` (SVG package, standalone lockfile); portfolio and `@aazucena/icons` `@mynaui/icons-react ^0.4.11` (root lockfile). Nothing checks they match.
- **Resolver**: `getIconComponent` resolves, in order, inline SVG, aliases, custom icons, mynaui exports (PascalCase names such as `Heart`), SimpleIcons (`Si*`), then a fallback.
- **No dependency bot**; CircleCI runs only on `main`.
- **Plugin usage** (schemas and config): used: icons-field, color-picker, sortable-list, phone-validator-5, advanced-fields (checkbox), navigation, config-sync, documentation, publisher, sortable-entries, duplicate-button, preview-button, sentry, redis, rest-cache, cloudinary-media-library, upload. Unused: combobox, liquid-templates, multiselect-field, multi-select, code-editor-custom-field, country-select, location-picker, table-field, tagsinput, timezone-select, video-field, strapi-advanced-uuid, ckeditor, cloud (disabled). GraphQL is enabled but no app or service calls `/graphql`. `seo` is configured but disabled and not installed.
- **Audit warnings waiting upstream** (backlog): `adm-zip` via config-sync, `@graphql-tools/utils` via plugin-graphql, `zod` 3 via cloudinary-media-library. Removing GraphQL clears the second.

## Approaches considered

**Keeping icons in step** (owner chose A):

|               | **A · Renovate + guard (chosen)**                                   | B · Scheduled CI job                   | C · CMS reads the deployed portfolio                          |
| ------------- | ------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| Update starts | Renovate opens one grouped PR for `@mynaui/*` across both lockfiles | A weekly job bumps both and opens a PR | The CMS build downloads the icon list from the live portfolio |
| Merge         | Auto for minor/patch when checks pass; owner approves majors        | Same                                   | Automatic                                                     |
| Cost          | GitHub app, `renovate.json`, CI on Renovate branches                | Hand-built bump-and-PR flow            | CMS deploys depend on the portfolio being up                  |

**The icon field** (owner chose 2):

|                             | 1 · Keep the plugin | **2 · Our own field (chosen)**                 | 3 · Fork the plugin             |
| --------------------------- | ------------------- | ---------------------------------------------- | ------------------------------- |
| Stores                      | SVG markup          | the icon name                                  | a name, after changing its code |
| Chosen icons follow updates | no (frozen copies)  | yes                                            | yes                             |
| Cost                        | none                | a small admin picker plus a one-time migration | maintaining a fork              |

## Design

### Our icon field (a local Strapi plugin)

- A local plugin in `apps/cms/src/plugins/icon-field` registering one custom field (for example `plugin::icon-field.icon`), stored as a `string`.
- **Value**: the resolver name the portfolio already understands: a mynaui export name (`Heart`, `ArrowRight`, `HeartSolid` for the solid style) or a custom icon name (`Kofi`). No SVG is stored.
- **Admin UI**: a search box and a grid of previews, keyboard reachable, built with Strapi's design system. It reads a generated icon list (below). An unknown stored value shows as "unknown icon" with the raw name, never a blank.
- **Server**: validates on save that the value is in the icon list.

### The icon list the picker reads

- **mynaui part, generated at CMS build**: a script run before `strapi build` reads the installed `@mynaui/icons` SVG files (regular and solid), converts each kebab-case file name to the PascalCase export name the React package uses (solid gets the `Solid` suffix), and writes a manifest of `{ name, style, svg }` the admin bundle imports. Railway's `pnpm build` therefore always produces a full picker; `icons.sh` and `public/icons` retire.
- **Custom part, committed**: a monorepo script renders each component in `packages/icons/src/custom` to static SVG (React server rendering) and writes it into the CMS plugin as a committed file. It changes only when the owner edits a custom icon. A test fails when it is stale.

### Migration of stored values

A one-time Strapi migration (or script run on the owner's go) for the 15 attributes:

1. For each entry, normalise the stored SVG and match it against the manifest (mynaui regular and solid, then custom).
2. On a match, store the name. On no match, leave the value, and add the entry to a report (content type, entry, field) for the owner to re-pick.
3. Switch the 15 schema attributes from `plugin::icons-field.icon` to the new field, then uninstall `strapi-plugin-icons-field`.

A dry run prints the match rate and the unmatched list before anything is written. A database backup comes first.

### Guards

1. **Same version**: a test fails if the mynaui version resolved in `apps/cms/pnpm-lock.yaml` differs from the one in the root lockfile, or if either `package.json` uses a range instead of an exact pin.
2. **Every picker icon draws**: every manifest name resolves through `getIconComponent` to a non-fallback component.
3. **Every stored icon draws**: a check (run against a Strapi export or the local database) that each stored value resolves; part of the migration report and re-runnable later.
4. **Custom export is fresh**: the committed custom SVGs match a fresh render.

### Renovate

- Install the Renovate GitHub app; `renovate.json` with a package rule grouping `@mynaui/**` across the root and `apps/cms` (separate lockfile), auto-merge for minor and patch, owner approval for major. Everything else Renovate would open is off by default in this change (only the mynaui group is enabled), so it does not flood the repo; widening it is a later decision.
- CircleCI runs the guards and the type checks on `renovate/*` branches (today it runs only on `main`). Branch protection requires those checks before auto-merge.
- Renovate's base branch is `main`. While the next release lives on `phase-5/next-release`, the owner decides whether mynaui PRs target `main` directly or wait (left open below).

### Strapi upgrade and cleanup

- Upgrade `@strapi/strapi` and the official `@strapi/*` plugins to the current 5.64.x patch, after its first patch release or a few days of soak, in both lockfiles. Follow the Strapi upgrade tool (`npx @strapi/upgrade`) for any codemods.
- Remove the 14 unused plugins and `@strapi/plugin-graphql`, from `package.json`, `config/plugins.ts`, `plugins.sh`, and any generated types; remove the disabled `seo` and `cloud` config blocks.
- Drop the `@strapi/design-system` 2.2.0 override if 2.4.0 (or Strapi's declared version) builds and the admin works.
- Regenerate `types/generated` and the documentation plugin's output only through the running container; `full_documentation.json` stays uncommitted (owner rule).

## Verification

- Unit tests: manifest generation (names, styles, count against the package), name conversion against `@mynaui/icons-react` exports, migration matching on fixtures (regular, solid, custom, unknown), field validation.
- The four guards above, in CI.
- Local Strapi (container): admin loads; the picker searches, selects and saves a mynaui icon, a solid icon and a custom icon; an entry with an unknown value shows the warning; each kept plugin's admin page opens.
- Portfolio with local Strapi data after migration: pages that show icons render them (no fallback), checked in the browser.
- `pnpm audit` in `apps/cms` before and after; the GraphQL warnings gone.
- No production deploy or data migration without the owner's go.

## Calls made after the builder check (author's, for the owner to check)

- **Count correction**: `@mynaui/icons` 0.4.11 ships 1,310 regular and 1,310 solid SVGs (not 1,272; the local folder was older). Kebab-case to PascalCase, with `Solid` for the solid set, maps every file to a real `@mynaui/icons-react` export.
- **The picker previews what the portfolio draws.** Nine names resolve to something other than mynaui on the site: custom icons `Bug`, `BugSolid`, `Download`, `Image`, and aliases `Twitter`, `X`, `Instagram`, `Facebook`, `Twitch`. The manifest applies the portfolio's own resolution order (aliases, custom, mynaui), so a shadowed mynaui icon is not offered and the name's preview is the custom drawing. Values stay bare names, no prefix. Guard 2 checks "the preview is the component the resolver returns", not only "not the fallback". The migration's dry run lists entries whose look would change because their stored mynaui SVG maps to a shadowed name.
- **Old values keep rendering.** The resolver's inline-SVG branch (and `IconRenderer`'s SVG path) stays as a bridge until the migration report is empty. Server validation accepts a value equal to what is already stored (so unmatched legacy entries can still be edited and published, including publisher's scheduled publishes) and rejects only new values that are not in the manifest. The admin shows a "legacy icon, please re-pick" warning on those.
- **More than one stored shape.** `packages/api/src/transformers/web-link.ts` reads `icon.name` and `icon.family`, so some stored values are objects, not SVG strings. The migration handles SVG strings, `{ name, family }` objects and plain names; the transformers read the new bare-name string, and `RelatedLinks` uses `getIconComponent` instead of `dangerouslySetInnerHTML` once its data is migrated.
- **Exact pins**: `apps/cms`, `apps/portfolio` and `packages/icons` move from `^0.4.11` to an exact `0.4.11` as part of this change, so Guard 1 has something to enforce.

## Left to the builder

The plugin's internal structure; the exact custom field id; how the manifest is bundled into the admin; migration mechanism (Strapi migration file or script); Renovate schedule and labels; the Strapi upgrade's codemod details.

## Owner decisions (2026-11-27), replacing the open questions

- **Renovate runs from our own CI**: a scheduled CircleCI job runs Renovate self-hosted (a GitHub token stored in CircleCI), so it can run `pnpm install --ignore-workspace --lockfile-only` in `apps/cms` after each mynaui bump and add the changeset. A mynaui bump gives `@aazucena/icons` a patch changeset (author's call; Renovate's post-upgrade step writes it). The hosted Renovate app is not used.
- **Renovate's PRs target `main` now**, not waiting for `phase-5/next-release` to merge.
- **Navigation icons are in scope**: the navigation plugin's free-text kebab-case `icon` moves to the same names the icon field uses (a navigation plugin custom field if it supports one, otherwise a validated string), the 10-entry map in `apps/portfolio/src/lib/utils/icons.ts` is replaced by `getIconComponent`, and the migration converts existing navigation icon values (kebab-case to the resolver's names) and reports any that don't resolve.

## Revisit triggers

- **GraphQL** returns if the analytics dashboard starts showing or editing portfolio content live across several content types, or a second client (native app, third party) consumes the content. Re-adding is one install.
- **Journey enrichment** goes to the ClickHouse project as a content dimension (url to title, type and tags), fed by the same Strapi extractor the retrieval project builds; no Strapi call at view time.

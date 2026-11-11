import uiPackage from '../../../packages/ui/package.json';

/** Shape of the `version` parameter read by the toolbar badge in manager.tsx. */
export interface VersionParameter {
  major: string;
  minor: string;
  patch: string;
  postfix?: string;
}

/** Splits a semver string ("1.2.3-beta.1") into the addon's parameter shape. */
export function toVersionParameter(version: string): VersionParameter {
  const [core = '0.0.0', ...rest] = version.split('-');
  const [major = '0', minor = '0', patch = '0'] = core.split('.');
  const postfix = rest.join('-');
  return postfix ? { major, minor, patch, postfix } : { major, minor, patch };
}

/**
 * Toolbar badge for every story: the @aazucena/ui version, bumped by Changesets.
 * A story from another package can override it in its meta:
 * `parameters: { version: toVersionParameter(formsPackage.version) }`.
 */
export const avraVersion = toVersionParameter(uiPackage.version);

/**
 * prop-types ESM shim for production builds.
 *
 * prop-types is a pure CJS package with no ESM build. In production,
 * React ignores component.propTypes entirely — type checks are dev-only.
 * This shim provides the same API surface as no-ops so that packages
 * like @mynaui/icons-react (which call PropTypes.string, PropTypes.oneOfType,
 * etc. at module-load time) don't crash, while keeping the bundle free of
 * the CJS interop wrapper code that @rollup/plugin-commonjs would generate.
 */

const noop = () => null;
const noopWithArgs = () => noop;

const PropTypes = {
  any: noop,
  string: noop,
  number: noop,
  bool: noop,
  func: noop,
  array: noop,
  object: noop,
  node: noop,
  element: noop,
  elementType: noop,
  symbol: noop,
  instanceOf: noopWithArgs,
  oneOf: noopWithArgs,
  oneOfType: noopWithArgs,
  arrayOf: noopWithArgs,
  objectOf: noopWithArgs,
  shape: noopWithArgs,
  exact: noopWithArgs,
  checkPropTypes: noop,
  resetWarningCache: noop,
};

export default PropTypes;
export const {
  any,
  string,
  number,
  bool,
  func,
  array,
  object,
  node,
  element,
  elementType,
  symbol,
  instanceOf,
  oneOf,
  oneOfType,
  arrayOf,
  objectOf,
  shape,
  exact,
  checkPropTypes,
  resetWarningCache,
} = PropTypes;

import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Accessibility rules for the component packages (ui, forms, layouts).
 *
 * These are the jsx-a11y rules the packages pass after the 2026-11-13 audit
 * (docs/audits/2026-11-13-accessibility.md). They are errors, so an icon-only
 * button without a name or an image without alt fails lint. Rules the code
 * does not pass yet are listed in the backlog, not switched on as warnings.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const a11yConfig = [
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y': eslintPluginJsxA11y },
    rules: {
      'jsx-a11y/control-has-associated-label': [
        'error',
        {
          // Inputs are named by a label or aria-label that this rule cannot follow.
          ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
          depth: 3,
        },
      ],
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
    },
  },
];

export default a11yConfig;

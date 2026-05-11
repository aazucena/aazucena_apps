/**
 * Commitlint configuration — extends conventional commits with:
 * 1. Optional emoji prefix support (e.g. "✨ feat(scope): message")
 * 2. Extra types used by the /commit skill: wip, ui, assets, db, experiment
 */

export default {
  extends: ['@commitlint/config-conventional'],

  parserPreset: {
    parserOpts: {
      /**
       * Matches optional emoji/non-word prefix before the conventional type.
       *
       * Pattern breakdown:
       *   (?:(?!\w)\S+\s)?  — optional emoji prefix: one or more non-whitespace
       *                        chars that do NOT start with a word char, followed
       *                        by a space. This accepts any emoji (single codepoint,
       *                        ZWJ sequences, variation selectors) while correctly
       *                        skipping messages that start directly with the type.
       *   (\w+)             — type (e.g. feat, fix, chore)
       *   (?:\(([^)]*)\))?  — optional scope
       *   (?:!)?            — optional breaking-change marker
       *   :\s               — colon + space separator
       *   (.+)              — subject
       */
      headerPattern: /^(?:(?!\w)\S+\s)?(\w+)(?:\(([^)]*)\))?(?:!)?:\s(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },

  rules: {
    'type-enum': [
      2,
      'always',
      [
        // Standard conventional commit types
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
        'build',
        // Extended types from /commit skill
        'wip',
        'ui',
        'assets',
        'db',
        'experiment',
      ],
    ],
  },
};

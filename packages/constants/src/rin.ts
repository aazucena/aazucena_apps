/**
 * Rin's facial expressions, in the order of the EmotionSM states in the .riv
 * artboard: the index of each entry is the number written to the `emotion`
 * input. Append new emotions at the end so existing indexes stay stable.
 */
export const RIN_EMOTIONS = [
  'idle',
  'happy',
  'thinking',
  'surprised',
  'shocked',
  'flustered',
  'sad',
  'angry',
  'disgusted',
  'laughing',
  'delighted',
  'uninterested',
  'cute',
  'annoyed',
  'winking',
  'silly',
  'smirky',
  'cringe',
  'impressed',
  'exhausted',
  'confused',
  'sleepy',
] as const;

export type RinEmotion = (typeof RIN_EMOTIONS)[number];

/**
 * Rin's body behaviors, in the order of the MovementSM `behavior` enum values
 * in the .riv artboard.
 */
export const RIN_BEHAVIORS = ['idle', 'listening', 'thinking', 'responding', 'error'] as const;

export type RinBehavior = (typeof RIN_BEHAVIORS)[number];

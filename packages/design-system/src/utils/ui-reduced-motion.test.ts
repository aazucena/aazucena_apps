import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Reduced-motion guards over @aazucena/ui and the animation hooks it uses.
 * CSS motion is handled once, globally; JS-driven motion (Framer Motion,
 * intervals, Rive) has to check the preference itself, which these tests enforce.
 */
const UI_SRC = join(__dirname, '../../../ui/src');
const UI_COMPONENTS = join(UI_SRC, 'components');
const HOOKS_SRC = join(__dirname, '../../../hooks/src');

function files(dir: string, ext: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? files(full, ext) : ext.test(name) ? [full] : [];
  });
}

const rel = (file: string) => file.split('/src/')[1];
const HANDLES_REDUCED_MOTION =
  /useReducedMotion|MotionConfig|prefersReducedMotion|prefers-reduced-motion|usePrefersReducedMotion/;

/**
 * Loops that update content rather than move anything, so they stay as they are.
 * Every entry needs a reason.
 */
const NOT_MOTION: Record<string, string> = {
  'components/ui/countdown.tsx': 'setInterval updates the displayed time once a second',
  'components/ui/mask-input.tsx': 'requestAnimationFrame only restores the caret position',
  'components/preloader/InteractivePreloader.tsx':
    'one requestAnimationFrame to dispatch a mount event',
  'components/preloader/SimplePreloader.tsx': 'one requestAnimationFrame to dispatch a mount event',
};

describe('@aazucena/ui reduced motion', () => {
  it('stops CSS animations and transitions globally under prefers-reduced-motion', () => {
    const css = files(join(UI_SRC, 'styles'), /\.css$/)
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    const block =
      css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    expect(block, 'no global @media (prefers-reduced-motion: reduce) block').not.toBe('');
    expect(block).toMatch(/animation-duration:/);
    expect(block).toMatch(/animation-iteration-count:\s*1/);
    expect(block).toMatch(/transition-duration:/);
  });

  it('every Framer Motion component respects the reduced-motion preference', () => {
    const offenders = files(UI_COMPONENTS, /\.tsx$/)
      .filter((f) => /from ['"](framer-motion|motion\/react)['"]/.test(readFileSync(f, 'utf8')))
      .filter((f) => !HANDLES_REDUCED_MOTION.test(readFileSync(f, 'utf8')))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it('every JS-driven loop (intervals, frames, infinite repeats, Rive autoplay) checks the preference', () => {
    const LOOP = /setInterval\(|requestAnimationFrame\(|repeat:\s*Infinity|autoplay:\s*true/;
    const offenders = files(UI_COMPONENTS, /\.tsx$/)
      .filter((f) => !NOT_MOTION[rel(f)!])
      .filter((f) => {
        const src = readFileSync(f, 'utf8');
        return LOOP.test(src) && !HANDLES_REDUCED_MOTION.test(src);
      })
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it.each(['dom/useTypingEffect.ts', 'animations/useFlipText.ts'])(
    'text animation hook %s shows the final text under reduced motion',
    (hook) => {
      expect(readFileSync(join(HOOKS_SRC, hook), 'utf8')).toMatch(HANDLES_REDUCED_MOTION);
    },
  );
});

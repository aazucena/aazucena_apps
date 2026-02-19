import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { applyPreset, ANIMATION_PRESETS, staggerFadeIn } from '@aazucena/animations';

/**
 * ## Engineering Standards
 * - **GSAP Integration:** Uses GSAP for high-performance, imperative animations via standardized presets.
 * - **Reusable Presets:** Provides a collection of standard animation presets for consistent motion across the app.
 * - **Performance:** GPU-accelerated animations using `y`, `x`, and `opacity`.
 */
const meta = {
  title: 'Animations/GSAP/Presets',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const AnimationBox = ({
  preset,
  name,
}: {
  preset: keyof typeof ANIMATION_PRESETS;
  name: string;
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      // Apply preset animation
      applyPreset(boxRef.current, preset, { delay: 0.5 });
    }
  }, [preset]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={boxRef}
        className="w-24 h-24 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center text-white font-bold"
      >
        Box
      </div>
      <span className="text-sm font-mono text-muted-foreground">{name}</span>
      <button
        onClick={() => {
          gsap.set(boxRef.current, { clearProps: 'all' });
          applyPreset(boxRef.current, preset);
        }}
        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors"
      >
        Replay
      </button>
    </div>
  );
};

export const FadeIn: StoryObj = {
  render: () => <AnimationBox preset="fadeIn" name="fadeIn" />,
};

export const SlideInLeft: StoryObj = {
  render: () => <AnimationBox preset="slideInLeft" name="slideInLeft" />,
};

export const SlideInRight: StoryObj = {
  render: () => <AnimationBox preset="slideInRight" name="slideInRight" />,
};

export const SlideInUp: StoryObj = {
  render: () => <AnimationBox preset="slideInUp" name="slideInUp" />,
};

export const SlideInDown: StoryObj = {
  render: () => <AnimationBox preset="slideInDown" name="slideInDown" />,
};

export const ScaleIn: StoryObj = {
  render: () => <AnimationBox preset="scaleIn" name="scaleIn" />,
};

export const StaggeredGroup: StoryObj = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        const children = containerRef.current.querySelectorAll('.stagger-item');
        staggerFadeIn(Array.from(children), 0.1);
      }
    }, []);

    return (
      <div className="flex flex-col items-center gap-6">
        <div ref={containerRef} className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="stagger-item w-16 h-16 bg-orange-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
            >
              {i}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const children = containerRef.current?.querySelectorAll('.stagger-item');
            if (children) {
              gsap.set(children, { clearProps: 'all' });
              staggerFadeIn(Array.from(children), 0.1);
            }
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm transition-colors"
        >
          Replay Stagger
        </button>
      </div>
    );
  },
};

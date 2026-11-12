'use client';

import * as React from 'react';
import * as RiveModule from '@rive-app/react-webgl2';

// @rive-app/react-webgl2 ships CommonJS only. In Node SSR (Astro) the ESM loader can't
// detect its re-exported names (Layout, Fit, Alignment), so read them from the CJS default
// export when present; in the browser Vite pre-bundles real named exports.
const Rive = ((RiveModule as unknown as { default?: typeof RiveModule }).default ??
  RiveModule) as typeof RiveModule;
const { useRive, useStateMachineInput, Layout, Fit, Alignment } = Rive;
import {
  RIN_BEHAVIORS,
  RIN_EMOTIONS,
  type RinBehavior,
  type RinEmotion,
} from '@aazucena/constants';

/** Static mark used before the .riv loads or when no src is set. */
export function RinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="14" cy="14" r="13" fill="currentColor" fillOpacity="0.08" />
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="10" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      <circle cx="10.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
      <circle cx="18.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
    </svg>
  );
}

const DEFAULT_STATE_MACHINES = {
  movement: 'MovementSM',
  emotion: 'EmotionSM',
} as const;

export interface RinStateMachines {
  /** State machine that owns body behavior + blinking (default: "MovementSM") */
  movement?: string;
  /** State machine that owns face expressions (default: "EmotionSM") */
  emotion?: string;
}

export interface RinCharacterProps {
  /** Path or URL to the .riv file. Falls back to the static RinMark SVG when absent. */
  src?: string;
  currentEmotion: RinEmotion;
  behavior: RinBehavior;
  className?: string;
  stateMachines?: RinStateMachines;
  /** Name of the Number input in EmotionSM that controls expression (default: "emotion") */
  emotionInput?: string;
  /** Name of the Enum input in MovementSM that controls body behavior (default: "behavior") */
  behaviorInput?: string;
}

// Isolate useRive into its own component so the canvas is never conditionally
// mounted/unmounted — following the Rive React docs recommendation to prevent
// animation restarts caused by remounting.
function RinCanvas({
  src,
  currentEmotion,
  behavior,
  className,
  movementSM,
  emotionSM,
  emotionInput,
  behaviorInput,
}: {
  src: string;
  currentEmotion: RinEmotion;
  behavior: RinBehavior;
  className?: string;
  movementSM: string;
  emotionSM: string;
  emotionInput: string;
  behaviorInput: string;
}) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: [movementSM, emotionSM],
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const emotionSMI = useStateMachineInput(rive, emotionSM, emotionInput);
  const behaviorSMI = useStateMachineInput(rive, movementSM, behaviorInput);

  // The state machine inputs take the index of the value in the shared lists
  React.useEffect(() => {
    if (emotionSMI) emotionSMI.value = RIN_EMOTIONS.indexOf(currentEmotion);
  }, [currentEmotion, emotionSMI]);

  React.useEffect(() => {
    if (behaviorSMI) behaviorSMI.value = RIN_BEHAVIORS.indexOf(behavior);
  }, [behavior, behaviorSMI]);

  return <RiveComponent className={className} />;
}

/**
 * Renders the animated Rin character from a .riv file.
 * Falls back to the static RinMark SVG when src is not provided,
 * so the UI is always functional even before the .riv file is ready.
 */
export function RinCharacter({
  src,
  currentEmotion,
  behavior,
  className,
  stateMachines,
  emotionInput = 'emotion',
  behaviorInput = 'behavior',
}: RinCharacterProps) {
  const movementSM = stateMachines?.movement ?? DEFAULT_STATE_MACHINES.movement;
  const emotionSM = stateMachines?.emotion ?? DEFAULT_STATE_MACHINES.emotion;

  if (!src) {
    return <RinMark className={className} />;
  }

  return (
    <RinCanvas
      src={src}
      currentEmotion={currentEmotion}
      behavior={behavior}
      className={className}
      movementSM={movementSM}
      emotionSM={emotionSM}
      emotionInput={emotionInput}
      behaviorInput={behaviorInput}
    />
  );
}

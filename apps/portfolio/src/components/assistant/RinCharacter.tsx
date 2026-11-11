"use client";

import * as React from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-webgl2";
import { RinMark } from "./RinMark";
import type { RinEmotion } from "~/lib/utils/chat/tools/set-emotion";

// Maps RinEmotion string → numeric index consumed by the Rive state machine.
// The numbers must match the order of emotion states in the .riv artboard.
const EMOTION_INDEX: Record<RinEmotion, number> = {
  idle: 0,
  happy: 1,
  thinking: 2,
  surprised: 3,
  shocked: 4,
  flustered: 5,
  sad: 6,
  angry: 7,
  disgusted: 8,
  laughing: 9,
  delighted: 10,
  uninterested: 11,
  cute: 12,
  annoyed: 13,
  winking: 14,
  silly: 15,
  smirky: 16,
  cringe: 17,
  impressed: 18,
  exhausted: 19,
  confused: 20,
  sleepy: 21,
};

// Maps RinBehavior string → numeric index consumed by MovementSM's behavior Enum input.
// The numbers must match the order of behavior values in the .riv artboard.
export const BEHAVIOR_INDEX = {
  idle: 0,
  listening: 1,
  thinking: 2,
  responding: 3,
  error: 4,
} as const;

export type RinBehavior = keyof typeof BEHAVIOR_INDEX;

const DEFAULT_STATE_MACHINES = {
  movement: "MovementSM",
  emotion: "EmotionSM",
} as const;

export interface RinStateMachines {
  /** State machine that owns body behavior + blinking (default: "MovementSM") */
  movement?: string;
  /** State machine that owns face expressions (default: "EmotionSM") */
  emotion?: string;
}

export interface RinCharacterProps {
  /** Path or URL to the .riv file. Falls back to static RinMark SVG when absent. */
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

  React.useEffect(() => {
    if (emotionSMI) emotionSMI.value = EMOTION_INDEX[currentEmotion];
  }, [currentEmotion, emotionSMI]);

  React.useEffect(() => {
    if (behaviorSMI) behaviorSMI.value = BEHAVIOR_INDEX[behavior];
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
  emotionInput = "emotion",
  behaviorInput = "behavior",
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

"use client";

import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { sendEasterEggTelemetry } from "@aazucena/analytics";

type TriggerType =
  | "konami"
  | "click_sequence"
  | "terminal_command"
  | "idle"
  | "cursor_pattern"
  | "rive";

interface EasterEggConfig {
  eggId: string;
  eggName: string;
  triggerType: TriggerType;
  onComplete: (metadata?: Record<string, unknown>) => void;
}

// ─── Konami Code ─────────────────────────────────────────────────────────────

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(config: Omit<EasterEggConfig, "triggerType">) {
  const progress = useRef(0);
  const attempts = useRef(0);
  const startTime = useRef<number | null>(null);
  const onCompleteRef = useRef(config.onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = config.onComplete;
  });

  const { eggId, eggName } = config;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (startTime.current === null) startTime.current = Date.now();

      if (e.key === KONAMI_SEQUENCE[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI_SEQUENCE.length) {
          attempts.current += 1;
          const completionTimeMs = startTime.current
            ? Date.now() - startTime.current
            : undefined;

          sendEasterEggTelemetry({
            eggId,
            eggName,
            triggerType: "konami",
            completionTimeMs,
            attemptCount: attempts.current,
          });
          onCompleteRef.current();
          progress.current = 0;
          startTime.current = null;
        }
      } else {
        if (progress.current > 0) attempts.current += 1;
        progress.current = 0;
        startTime.current = null;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [eggId, eggName]);
}

// ─── Click Sequence ───────────────────────────────────────────────────────────

export function useClickSequence(
  targets: string[],
  config: Omit<EasterEggConfig, "triggerType">,
) {
  const progress = useRef(0);
  const attempts = useRef(0);
  const startTime = useRef<number | null>(null);
  const onCompleteRef = useRef(config.onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = config.onComplete;
  });

  const { eggId, eggName } = config;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest("[data-egg]");
      if (!el) return;

      if (startTime.current === null) startTime.current = Date.now();

      const id = el.getAttribute("data-egg");
      if (id === targets[progress.current]) {
        progress.current += 1;
        if (progress.current === targets.length) {
          attempts.current += 1;
          const completionTimeMs = startTime.current
            ? Date.now() - startTime.current
            : undefined;

          sendEasterEggTelemetry({
            eggId,
            eggName,
            triggerType: "click_sequence",
            completionTimeMs,
            attemptCount: attempts.current,
            metadata: { sequence: targets },
          });
          onCompleteRef.current({ sequence: targets });
          progress.current = 0;
          startTime.current = null;
        }
      } else {
        if (progress.current > 0) attempts.current += 1;
        progress.current = 0;
        startTime.current = null;
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [targets, eggId, eggName]);
}

// ─── Terminal / Chatbot Command ───────────────────────────────────────────────

export function useTerminalCommand(
  commands: string[],
  config: Omit<EasterEggConfig, "triggerType">,
) {
  const trigger = useCallback(
    (input: string) => {
      const normalized = input.trim().toLowerCase();
      if (commands.includes(normalized)) {
        sendEasterEggTelemetry({
          eggId: config.eggId,
          eggName: config.eggName,
          triggerType: "terminal_command",
          metadata: { command: normalized },
        });
        config.onComplete({ command: normalized });
        return true;
      }
      return false;
    },
    [commands, config],
  );

  return { trigger };
}

// ─── Idle Trigger ─────────────────────────────────────────────────────────────

export function useIdleEasterEgg(
  idleMs: number,
  config: Omit<EasterEggConfig, "triggerType">,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTime = useRef<number>(Date.now());
  const fired = useRef(false);

  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      if (!fired.current) startTime.current = Date.now();
      timer.current = setTimeout(() => {
        if (fired.current) return;
        fired.current = true;
        sendEasterEggTelemetry({
          eggId: config.eggId,
          eggName: config.eggName,
          triggerType: "idle",
          completionTimeMs: Date.now() - startTime.current,
        });
        config.onComplete();
      }, idleMs);
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((ev) =>
      window.addEventListener(ev, reset, { passive: true }),
    );
    reset();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [idleMs, config]);
}

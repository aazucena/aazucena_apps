import { useEffect, useRef } from "react";
import type { AtmosphericPhase } from "@aazucena/types";

// Highpass cutoff per layer — as user descends, cutoff drops and sound fills in
const LAYER_CONFIG: Record<
  AtmosphericPhase,
  { cutoff: number; gain: number; sweepFreq: number }
> = {
  exosphere: { cutoff: 2500, gain: 0.025, sweepFreq: 1100 },
  thermosphere: { cutoff: 1400, gain: 0.035, sweepFreq: 620 },
  mesosphere: { cutoff: 700, gain: 0.05, sweepFreq: 320 },
  stratosphere: { cutoff: 280, gain: 0.06, sweepFreq: 150 },
  troposphere: { cutoff: 100, gain: 0.065, sweepFreq: 80 },
};

const CROSSFADE_TC = 0.4; // setTargetAtTime time constant (seconds)
const SWEEP_DURATION = 0.35;

interface AudioNodes {
  ctx: AudioContext;
  masterGain: GainNode;
  ambientGain: GainNode;
  filter: BiquadFilterNode;
  noiseSource: AudioBufferSourceNode;
}

function buildNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createNodes(ctx: AudioContext, phase: AtmosphericPhase): AudioNodes {
  const config = LAYER_CONFIG[phase];

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const ambientGain = ctx.createGain();
  ambientGain.gain.value = config.gain;
  ambientGain.connect(masterGain);

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = config.cutoff;
  filter.Q.value = 0.7;
  filter.connect(ambientGain);

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buildNoiseBuffer(ctx);
  noiseSource.loop = true;
  noiseSource.connect(filter);
  noiseSource.start();

  return { ctx, masterGain, ambientGain, filter, noiseSource };
}

function playSweep(nodes: AudioNodes, fromFreq: number, toFreq: number): void {
  const { ctx, masterGain } = nodes;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(fromFreq, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(
    toFreq,
    ctx.currentTime + SWEEP_DURATION,
  );

  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + SWEEP_DURATION,
  );

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(ctx.currentTime + SWEEP_DURATION);
}

export function useAtmosphericSound(
  phase: AtmosphericPhase,
  isMuted: boolean,
): void {
  const nodesRef = useRef<AudioNodes | null>(null);
  const prevPhaseRef = useRef<AtmosphericPhase | null>(null);

  // Create or destroy audio context based on mute toggle
  useEffect(() => {
    if (isMuted) {
      if (nodesRef.current) {
        const { masterGain, ctx, noiseSource } = nodesRef.current;
        masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
        const t = setTimeout(() => {
          try {
            noiseSource.stop();
            ctx.close();
          } catch (_) {}
          nodesRef.current = null;
          prevPhaseRef.current = null;
        }, 1200);
        return () => clearTimeout(t);
      }
      return;
    }

    if (!nodesRef.current) {
      const ctx = new AudioContext();
      ctx.resume().catch(() => {});
      const nodes = createNodes(ctx, phase);
      // Fade master in over ~1s
      nodes.masterGain.gain.setTargetAtTime(1, ctx.currentTime, 0.4);
      nodesRef.current = nodes;
      prevPhaseRef.current = phase;
    }
  }, [isMuted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Respond to phase changes
  useEffect(() => {
    if (isMuted || !nodesRef.current) return;
    if (prevPhaseRef.current === phase) return;

    const nodes = nodesRef.current;
    const { ctx, filter, ambientGain } = nodes;
    const config = LAYER_CONFIG[phase];
    const prevConfig = prevPhaseRef.current
      ? LAYER_CONFIG[prevPhaseRef.current]
      : null;

    if (prevConfig) {
      playSweep(nodes, prevConfig.sweepFreq, config.sweepFreq);
    }

    filter.frequency.setTargetAtTime(
      config.cutoff,
      ctx.currentTime,
      CROSSFADE_TC,
    );
    ambientGain.gain.setTargetAtTime(
      config.gain,
      ctx.currentTime,
      CROSSFADE_TC,
    );

    prevPhaseRef.current = phase;
  }, [phase, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        try {
          nodesRef.current.noiseSource.stop();
          nodesRef.current.ctx.close();
        } catch (_) {}
        nodesRef.current = null;
      }
    };
  }, []);
}

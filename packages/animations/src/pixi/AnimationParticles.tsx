/**
 * PixiJS Particles Component
 * Thin wrapper around ParticleSystem module
 */

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParticleSystem } from './particles/index';

export interface AnimationParticlesHandle {
  emitAt: (x: number, y: number, count?: number) => void;
  emitBurst: (x: number, y: number, count?: number) => void;
  clearEmittedParticles: () => void;
}

interface AnimationParticlesProps {
  width?: number;
  height?: number;
  count?: number;
  speed?: number;
  size?: number;
  opacity?: number;
  isPlaying?: boolean;
  preset?: 'space' | 'snow' | 'rain' | 'floating';
  effect?: 'glow' | 'blur' | 'none';
}

export const AnimationParticles = forwardRef<AnimationParticlesHandle, AnimationParticlesProps>(
  (props, ref) => {
    const {
      width = 800,
      height = 600,
      count,
      speed,
      size,
      opacity,
      isPlaying = true,
      preset = 'space',
      effect = 'glow',
    } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const systemRef = useRef<ParticleSystem | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const canvas = document.createElement('canvas');
      containerRef.current.appendChild(canvas);

      const particleSystem = new ParticleSystem({
        preset,
        count,
        speed,
        size,
        opacity,
      });

      systemRef.current = particleSystem;

      // Initialize the particle system
      particleSystem.initialize(canvas, width, height);

      if (!isPlaying) {
        particleSystem.pause();
      }

      return () => {
        particleSystem.destroy();
        systemRef.current = null;
      };
    }, [width, height, count, speed, size, opacity, preset]);

    // Handle play/pause
    useEffect(() => {
      if (systemRef.current) {
        if (isPlaying) {
          systemRef.current.play();
        } else {
          systemRef.current.pause();
        }
      }
    }, [isPlaying]);

    // Handle visual effects
    useEffect(() => {
      if (systemRef.current) {
        systemRef.current.applyEffect(effect);
      }
    }, [effect]);

    // Expose emission methods via ref
    useImperativeHandle(
      ref,
      () => ({
        emitAt: (x: number, y: number, count?: number) => {
          systemRef.current?.emitAt(x, y, count);
        },
        emitBurst: (x: number, y: number, count?: number) => {
          systemRef.current?.emitBurst(x, y, count);
        },
        clearEmittedParticles: () => {
          systemRef.current?.clearEmittedParticles();
        },
      }),
      [],
    );

    return (
      <div ref={containerRef} className="fixed inset-0 z-10" style={{ pointerEvents: 'none' }} />
    );
  },
);

AnimationParticles.displayName = 'AnimationParticles';

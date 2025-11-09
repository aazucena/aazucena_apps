/**
 * PixiJS Particles Component
 * Thin wrapper around PixiParticleSystem module
 */

import { useEffect, useRef } from 'react';
import { PixiParticleSystem } from './particles';

interface PixiJSParticlesProps {
  width?: number;
  height?: number;
  count?: number;
  speed?: number;
  isPlaying?: boolean;
}

export default function PixiJSParticles({
  width = 800,
  height = 600,
  count = 150,
  speed = 1,
  isPlaying = true
}: PixiJSParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<PixiParticleSystem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    containerRef.current.appendChild(canvas);

    const particleSystem = new PixiParticleSystem({
      count,
      speed,
      size: 2,
      opacity: 0.6
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
  }, [width, height, count, speed]);

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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}

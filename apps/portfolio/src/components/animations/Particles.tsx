// components/PixiJSParticles.tsx
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import type { ParticleData, MousePosition } from '@/types/animations';

interface PixiJSParticlesProps {
  width?: number;
  height?: number;
}

export default function PixiJSParticles({ width = 800, height = 600 }: PixiJSParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const particleSpritesRef = useRef<PIXI.Sprite[]>([]);
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const particleDataRef = useRef<Map<PIXI.Sprite, ParticleData>>(new Map());
  const animationFrameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let cleanupFn: (() => void) | null = null;

    // Initialize the application
    const initApp = async () => {
      // Create PixiJS application
      const app = new PIXI.Application();

      await app.init({
        width,
        height,
        backgroundAlpha: 0,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
        antialias: false,
        preference: 'webgl',
      });

      if (!containerRef.current) {
        app.destroy(true);
        return;
      }

      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      // Create particle texture
      const graphics = new PIXI.Graphics();
      graphics.circle(0, 0, 8);
      graphics.fill(0xFFFFFF);

      const particleTexture = app.renderer.generateTexture(graphics);
      graphics.destroy();

      // Initialize particles - HORIZONTAL MOVEMENT ONLY (RIGHT TO LEFT)
      const colors = [0x6366F1, 0x8B5CF6, 0x10B981, 0x06B6D4, 0xF59E0B, 0xEC4899, 0xFFFFFF, 0xE0E7FF];
      const sprites: PIXI.Sprite[] = [];
      const dataMap = new Map<PIXI.Sprite, ParticleData>();

      for (let i = 0; i < 150; i++) {
        const sprite = new PIXI.Sprite(particleTexture);

        // Random vertical position (can be anywhere on screen height)
        sprite.x = Math.random() * app.screen.width;
        sprite.y = Math.random() * app.screen.height;

        // Random size
        const scale = Math.random() * 0.4 + 0.1;
        sprite.scale.set(scale);

        // Random opacity
        sprite.alpha = Math.random() * 0.6 + 0.3;

        // Random color
        sprite.tint = colors[Math.floor(Math.random() * colors.length)]!;
        sprite.rotation = Math.random() * Math.PI * 2;

        // HORIZONTAL VELOCITY ONLY - moves from RIGHT to LEFT
        const data: ParticleData = {
          vx: -(Math.random() * 1.5 + 0.5), // Negative = left direction, varied speeds
          vy: 0, // NO vertical movement
          vr: (Math.random() - 0.5) * 0.02
        };

        sprites.push(sprite);
        dataMap.set(sprite, data);
        app.stage.addChild(sprite);
      }

      particleSpritesRef.current = sprites;
      particleDataRef.current = dataMap;

      let lastTime = performance.now();

      // INFINITE HORIZONTAL ANIMATION - RIGHT TO LEFT ONLY
      const animate = (currentTime: number) => {
        // Calculate delta time with failsafe
        const deltaTime = (currentTime - lastTime) / 1000;
        const safeDelta = deltaTime > 0 ? deltaTime : 0.016; // Fallback to ~60fps
        lastTime = currentTime;

        for (const sprite of particleSpritesRef.current) {
          const data = particleDataRef.current.get(sprite);
          if (!data) continue;

          // HORIZONTAL MOVEMENT ONLY - RIGHT TO LEFT
          sprite.x += data.vx * safeDelta * 60;
          // sprite.y stays constant (NO vertical movement)

          // INFINITE ROTATION of individual particles
          sprite.rotation += data.vr * safeDelta * 60;
          sprite.rotation %= (Math.PI * 2);

          // WRAP AROUND - when particle goes off left edge, reappear on right
          if (sprite.x < -50) {
            sprite.x = app.screen.width + 50;
            sprite.y = Math.random() * app.screen.height; // Random new vertical position
          }

          // Also check right edge (in case of mouse interaction)
          if (sprite.x > app.screen.width + 50) {
            sprite.x = -50;
            sprite.y = Math.random() * app.screen.height;
          }
        }

        // INFINITE LOOP - requestAnimationFrame ensures this runs forever
        animationFrameIdRef.current = requestAnimationFrame(animate);
      };

      // Start infinite animation
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Mouse move handler
      const handleMouseMove = (event: MouseEvent): void => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          mousePositionRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Store cleanup function
      cleanupFn = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameIdRef.current);

        sprites.forEach(sprite => {
          app.stage.removeChild(sprite);
          sprite.destroy();
        });

        particleTexture.destroy(true);
        app.destroy(true);
      };
    };

    initApp();

    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}

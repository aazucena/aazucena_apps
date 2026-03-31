/**
 * PixiJS Particle System
 * PixiJS implementation for 2D particle rendering
 */

import * as PIXI from 'pixi.js';
import type { ParticleSystemConfig, ParticleEmitterConfig } from '@aazucena/types';
import { ParticlesController } from './ParticlesController';
import { ParticleRenderer } from './ParticleRenderer';
import { ParticleEmitter } from './ParticleEmitter';

export class ParticleSystem {
  private app: PIXI.Application | null = null;
  private container: PIXI.Container | null = null;
  private controller: ParticlesController;
  private renderer: ParticleRenderer | null = null;
  private emitter: ParticleEmitter | null = null;
  private lastTime: number = 0;

  constructor(config: Partial<ParticleSystemConfig> = {}) {
    this.controller = new ParticlesController(config);
  }

  /**
   * Initialize PixiJS application
   */
  async initialize(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
    this.app = new PIXI.Application();

    await this.app.init({
      canvas,
      width,
      height,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    // Initialize renderer
    this.renderer = new ParticleRenderer(this.container);

    // Initialize emitter for dynamic particles
    this.emitter = new ParticleEmitter({
      emissionRate: 10,
      lifetime: 2000, // 2 seconds before fade-out
      initialVelocity: { x: 0, y: -1 },
      velocityVariance: 0.5,
      sizeRange: [2, 5], // Larger particles for visibility
    });

    // Initialize particles
    this.controller.initialize(width, height);

    // Create graphics through renderer
    const particles = this.controller.getParticles();
    this.renderer.createGraphics(particles);

    // Start animation loop
    this.lastTime = performance.now();
    this.app.ticker.add(this.animate.bind(this));
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.renderer || !this.emitter) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    const width = this.app?.renderer.width || 800;
    const height = this.app?.renderer.height || 600;

    // Update background particles (static stars/snow)
    this.controller.update(deltaTime, width, height);

    // Update emitted particles (dynamic effects)
    this.emitter.update(deltaTime);

    // Combine both particle sets for rendering
    const backgroundParticles = this.controller.getParticles();
    const emittedParticles = this.emitter.getActiveParticles();
    const allParticles = [...backgroundParticles, ...emittedParticles];

    // Render all particles
    this.renderer.render(allParticles);
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height);
    }
  }

  /**
   * Play animation
   */
  play(): void {
    this.controller.play();
  }

  /**
   * Pause animation
   */
  pause(): void {
    this.controller.pause();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ParticleSystemConfig>): void {
    this.controller.updateConfig(config);
  }

  /**
   * Apply visual effect
   */
  applyEffect(effect: 'glow' | 'blur' | 'none'): void {
    if (this.renderer) {
      this.renderer.applyEffect(effect);
    }
  }

  /**
   * Emit particles at a specific position
   */
  emitAt(x: number, y: number, count: number = 1): void {
    if (this.emitter) {
      this.emitter.emit(x, y, count);
    }
  }

  /**
   * Emit a burst of particles (explosion effect)
   */
  emitBurst(x: number, y: number, count: number = 50): void {
    if (this.emitter) {
      this.emitter.emit(x, y, count);
    }
  }

  /**
   * Update emitter configuration
   */
  updateEmitterConfig(config: Partial<ParticleEmitterConfig>): void {
    if (this.emitter) {
      this.emitter.updateConfig(config);
    }
  }

  /**
   * Clear all emitted particles
   */
  clearEmittedParticles(): void {
    if (this.emitter) {
      this.emitter.clear();
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.controller.destroy();

    if (this.emitter) {
      this.emitter.destroy();
      this.emitter = null;
    }

    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }

    if (this.container) {
      this.container.destroy();
      this.container = null;
    }

    if (this.app) {
      this.app.destroy(true, {
        children: true,
        texture: true,
        textureSource: true,
      });
      this.app = null;
    }
  }
}

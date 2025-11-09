/**
 * PixiJS Particle System
 * PixiJS implementation for 2D particle rendering
 */

import * as PIXI from 'pixi.js';
import type { ParticleSystemConfig, Particle } from './types';
import { ParticlesController } from './ParticlesController';

export class PixiParticleSystem {
  private app: PIXI.Application | null = null;
  private container: PIXI.Container | null = null;
  private graphics: PIXI.Graphics[] = [];
  private controller: ParticlesController;
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
      autoDensity: true
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    // Initialize particles
    this.controller.initialize(width, height);
    this.createGraphics();

    // Start animation loop
    this.lastTime = performance.now();
    this.app.ticker.add(this.animate.bind(this));
  }

  /**
   * Create graphics for particles
   */
  private createGraphics(): void {
    if (!this.container) return;

    const particles = this.controller.getParticles();

    particles.forEach(particle => {
      const graphics = new PIXI.Graphics();
      graphics.circle(0, 0, particle.size);
      graphics.fill({ color: particle.color, alpha: particle.alpha });
      this.container!.addChild(graphics);
      this.graphics.push(graphics);
    });
  }

  /**
   * Animation loop
   */
  private animate(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    const width = this.app?.renderer.width || 800;
    const height = this.app?.renderer.height || 600;

    // Update particle positions and twinkling
    this.controller.update(deltaTime, width, height);

    // Update graphics positions, colors, and alpha
    const particles = this.controller.getParticles();
    particles.forEach((particle, index) => {
      if (this.graphics[index]) {
        const graphics = this.graphics[index];

        // Update position
        graphics.x = particle.x;
        graphics.y = particle.y;

        // Redraw with updated color and alpha (for twinkling effect)
        graphics.clear();
        graphics.circle(0, 0, particle.size);
        graphics.fill({ color: particle.color, alpha: particle.alpha });
      }
    });
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
   * Cleanup and destroy
   */
  destroy(): void {
    this.controller.destroy();

    if (this.container) {
      this.graphics.forEach(g => g.destroy());
      this.graphics = [];
      this.container.destroy();
      this.container = null;
    }

    if (this.app) {
      this.app.destroy(true, { children: true, texture: true, textureSource: true });
      this.app = null;
    }
  }
}

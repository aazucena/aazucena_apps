/**
 * Particle Renderer
 * WebGL rendering optimizations and visual effects
 */

import * as PIXI from 'pixi.js';
import type { Particle, ParticleRendererConfig } from './types';

export class ParticleRenderer {
  private config: ParticleRendererConfig;
  private graphics: PIXI.Graphics[] = [];
  private container: PIXI.Container;

  constructor(container: PIXI.Container, config: Partial<ParticleRendererConfig> = {}) {
    this.container = container;
    this.config = {
      blendMode: config.blendMode || PIXI.BLEND_MODES.NORMAL,
      tint: config.tint || 0xffffff,
      texture: config.texture
    };
  }

  /**
   * Create graphics objects for particles
   */
  createGraphics(particles: Particle[]): void {
    this.clearGraphics();

    particles.forEach(particle => {
      const graphics = new PIXI.Graphics();
      graphics.circle(0, 0, particle.size);
      graphics.fill({ color: particle.color, alpha: particle.alpha });
      graphics.blendMode = this.config.blendMode;

      this.container.addChild(graphics);
      this.graphics.push(graphics);
    });
  }

  /**
   * Update graphics positions and opacity
   */
  updateGraphics(particles: Particle[]): void {
    particles.forEach((particle, index) => {
      const graphic = this.graphics[index];
      if (graphic) {
        graphic.x = particle.x;
        graphic.y = particle.y;
        graphic.alpha = particle.alpha;
      }
    });
  }

  /**
   * Render particles with optimized batching
   */
  render(particles: Particle[]): void {
    // Ensure we have the right number of graphics
    if (this.graphics.length !== particles.length) {
      this.createGraphics(particles);
    } else {
      this.updateGraphics(particles);
    }
  }

  /**
   * Apply visual effects to particles
   */
  applyEffect(effect: 'glow' | 'blur' | 'none'): void {
    if (effect === 'glow') {
      this.graphics.forEach(g => {
        g.tint = this.config.tint;
      });
    } else if (effect === 'blur') {
      // PixiJS blur filter can be added here if needed
      // const blurFilter = new PIXI.BlurFilter();
      // this.container.filters = [blurFilter];
    } else {
      this.graphics.forEach(g => {
        g.tint = 0xffffff;
      });
    }
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: Partial<ParticleRendererConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear all graphics
   */
  clearGraphics(): void {
    this.graphics.forEach(g => g.destroy());
    this.graphics = [];
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.clearGraphics();
  }
}

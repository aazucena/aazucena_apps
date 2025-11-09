/**
 * Particle Emitter
 * Handles particle emission and lifecycle
 */

import type { Particle, ParticleEmitterConfig } from './types';

export class ParticleEmitter {
  private config: ParticleEmitterConfig;
  private particlePool: Particle[] = [];
  private activeParticles: Particle[] = [];

  constructor(config: Partial<ParticleEmitterConfig> = {}) {
    this.config = {
      emissionRate: config.emissionRate || 10,
      lifetime: config.lifetime || 3000,
      initialVelocity: config.initialVelocity || { x: 0, y: -1 },
      velocityVariance: config.velocityVariance || 0.5,
      sizeRange: config.sizeRange || [1, 3]
    };
  }

  /**
   * Emit particles at a position
   */
  emit(x: number, y: number, count: number = 1): Particle[] {
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const particle = this.createParticle(x, y);
      this.activeParticles.push(particle);
      newParticles.push(particle);
    }

    return newParticles;
  }

  /**
   * Create a single particle
   */
  private createParticle(x: number, y: number): Particle {
    // Try to reuse from pool
    const particle = this.particlePool.pop() || this.createNewParticle();

    // Initialize particle
    particle.x = x;
    particle.y = y;
    particle.vx = this.config.initialVelocity.x + (Math.random() - 0.5) * this.config.velocityVariance;
    particle.vy = this.config.initialVelocity.y + (Math.random() - 0.5) * this.config.velocityVariance;
    particle.size = this.config.sizeRange[0] + Math.random() * (this.config.sizeRange[1] - this.config.sizeRange[0]);
    particle.alpha = 1;

    return particle;
  }

  /**
   * Create a brand new particle object
   */
  private createNewParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 1,
      color: 0xffffff,
      alpha: 1
    };
  }

  /**
   * Update active particles
   */
  update(deltaTime: number): void {
    this.activeParticles = this.activeParticles.filter(particle => {
      // Update alpha based on lifetime (fade out)
      particle.alpha -= deltaTime / this.config.lifetime;

      // Return to pool if dead
      if (particle.alpha <= 0) {
        this.particlePool.push(particle);
        return false;
      }

      return true;
    });
  }

  /**
   * Get active particles
   */
  getActiveParticles(): Particle[] {
    return this.activeParticles;
  }

  /**
   * Update emitter configuration
   */
  updateConfig(config: Partial<ParticleEmitterConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particlePool.push(...this.activeParticles);
    this.activeParticles = [];
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.activeParticles = [];
    this.particlePool = [];
  }
}

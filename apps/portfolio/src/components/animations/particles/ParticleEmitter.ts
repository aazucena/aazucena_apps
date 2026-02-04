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
      const particle = this.createParticle(x, y, count);
      this.activeParticles.push(particle);
      newParticles.push(particle);
    }

    return newParticles;
  }

  /**
   * Create a single particle with explosion physics
   */
  private createParticle(x: number, y: number, burstCount: number = 1): Particle {
    // Try to reuse from pool
    const particle = this.particlePool.pop() || this.createNewParticle();

    // Initialize particle position
    particle.x = x;
    particle.y = y;

    // For bursts (count > 1), create radial explosion effect
    if (burstCount > 1) {
      const angle = Math.random() * Math.PI * 2; // Random direction
      const speed = 100 + Math.random() * 100; // 100-200 pixels/sec
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.size = this.config.sizeRange[0] + Math.random() * (this.config.sizeRange[1] - this.config.sizeRange[0]);
      particle.alpha = 1;
    } else {
      // Single particle (shooting star) - bright, fast, diagonal
      particle.vx = 150 + Math.random() * 100; // 150-250 px/sec rightward
      particle.vy = 200 + Math.random() * 100; // 200-300 px/sec downward
      particle.size = 6 + Math.random() * 4; // Larger: 6-10px
      particle.alpha = 1;
      particle.color = 0xffffaa; // Bright yellow-white
      particle.baseColor = 0xffffaa;
      particle.targetColor = 0xffffff;
      particle.baseAlpha = 1;
      particle.twinkleSpeed = 2;
      particle.twinklePhase = 0;
    }

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
      alpha: 1,
      twinkleSpeed: 1,
      twinklePhase: 0,
      baseColor: 0xffffff,
      targetColor: 0xffffff,
      baseAlpha: 1
    };
  }

  /**
   * Update active particles (position + physics + fade-out)
   */
  update(deltaTime: number): void {
    this.activeParticles = this.activeParticles.filter(particle => {
      // Update position based on velocity
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Apply gravity for downward motion
      particle.vy += 300 * deltaTime; // Gravity acceleration

      // Apply air resistance (friction) for natural slowdown
      const friction = 0.98; // 2% speed loss per frame
      particle.vx *= Math.pow(friction, deltaTime * 60); // Frame-rate independent
      particle.vy *= Math.pow(friction, deltaTime * 60);

      // Update alpha based on lifetime (fade out)
      particle.alpha -= deltaTime / this.config.lifetime;

      // Return to pool if dead or off-screen
      if (particle.alpha <= 0 || particle.y > window.innerHeight + 100) {
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

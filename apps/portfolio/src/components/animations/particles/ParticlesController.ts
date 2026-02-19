/**
 * Particles Controller
 * Manages particle system lifecycle and state
 */

import type { ParticleSystemConfig, Particle } from "./types";
import { PARTICLE_DEFAULTS, PARTICLE_PRESETS } from "~/config/animations";

export class ParticlesController {
  private particles: Particle[] = [];
  private config: ParticleSystemConfig;
  private isPlaying: boolean = true;
  private animationFrameId: number | null = null;

  constructor(config: Partial<ParticleSystemConfig> = {}) {
    // Apply preset if specified
    const preset = config.preset ? PARTICLE_PRESETS[config.preset] : null;

    this.config = {
      count: config.count || preset?.count || 100,
      size: config.size || preset?.size || PARTICLE_DEFAULTS.SIZE,
      speed: config.speed || preset?.speed || PARTICLE_DEFAULTS.SPEED,
      opacity: config.opacity || preset?.opacity || PARTICLE_DEFAULTS.OPACITY,
      color: config.color,
      phase: config.phase,
      preset: config.preset,
    };
  }

  /**
   * Initialize particles
   */
  initialize(width: number, height: number): void {
    this.particles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push(this.createParticle(width, height));
    }
  }

  /**
   * Create a single particle
   */
  private createParticle(width: number, height: number): Particle {
    // Get colors from preset or use defaults
    const preset = this.config.preset
      ? PARTICLE_PRESETS[this.config.preset]
      : null;
    const colors = preset?.colors || [
      0xffffff, // White
      0xe0f0ff, // Blue-white
      0x88ffff, // Cyan
      0xfffacd, // Pale yellow
      0xddeeff, // Icy blue
    ];

    const baseColor = colors[0] || 0xffffff; // First color as base
    const targetColor =
      colors[Math.floor(Math.random() * colors.length)] || 0xffffff;
    const baseAlpha = this.config.opacity * (0.6 + Math.random() * 0.4);

    // Get twinkling speed from preset or use defaults
    const twinkleSpeedMin = preset?.twinkling
      ? preset.twinkleSpeed?.min || 0.5
      : 0.5;
    const twinkleSpeedMax = preset?.twinkling
      ? preset.twinkleSpeed?.max || 1.5
      : 1.5;

    // Apply preset-specific motion
    let vx = (Math.random() - 0.5) * this.config.speed * 10; // 10x multiplier for visibility
    let vy = (Math.random() - 0.5) * this.config.speed * 10;

    if (this.config.preset) {
      if (this.config.preset === "rain") {
        // Rain falls straight down with some drift
        vx = (Math.random() - 0.5) * 0.5;
        vy = this.config.speed * 50; // Fast downward
      } else if (this.config.preset === "snow") {
        // Snow drifts sideways while falling
        vx = (Math.random() - 0.5) * 2; // Gentle sideways drift
        vy = this.config.speed * 10; // Moderate fall
      } else if (this.config.preset === "space") {
        // Space - very slow drift
        vx = (Math.random() - 0.5) * this.config.speed * 2;
        vy = (Math.random() - 0.5) * this.config.speed * 2;
      } else if (this.config.preset === "floating") {
        // Floating - slow random motion
        vx = (Math.random() - 0.5) * this.config.speed * 5;
        vy = (Math.random() - 0.5) * this.config.speed * 5;
      }
    }

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      size: this.config.size * (0.5 + Math.random() * 0.5),
      color: baseColor,
      alpha: baseAlpha,
      // Twinkling properties
      twinkleSpeed:
        twinkleSpeedMin + Math.random() * (twinkleSpeedMax - twinkleSpeedMin),
      twinklePhase: Math.random() * Math.PI * 2, // Random phase so they don't sync
      baseColor,
      targetColor,
      baseAlpha,
    };
  }

  /**
   * Update all particles
   */
  update(deltaTime: number, width: number, height: number): void {
    if (!this.isPlaying) return;

    const currentTime = performance.now() / 1000; // Convert to seconds

    this.particles.forEach((particle) => {
      // Update position (velocity already scaled in createParticle)
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Wrap around screen
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Update twinkling effect
      const twinkle =
        Math.sin(currentTime * particle.twinkleSpeed + particle.twinklePhase) *
          0.5 +
        0.5;

      // Interpolate alpha for twinkling
      particle.alpha = particle.baseAlpha * (0.3 + twinkle * 0.7);

      // Interpolate color between base and target
      const r1 = (particle.baseColor >> 16) & 0xff;
      const g1 = (particle.baseColor >> 8) & 0xff;
      const b1 = particle.baseColor & 0xff;

      const r2 = (particle.targetColor >> 16) & 0xff;
      const g2 = (particle.targetColor >> 8) & 0xff;
      const b2 = particle.targetColor & 0xff;

      const colorMix = twinkle * 0.5; // Subtle color shift
      const r = Math.round(r1 + (r2 - r1) * colorMix);
      const g = Math.round(g1 + (g2 - g1) * colorMix);
      const b = Math.round(b1 + (b2 - b1) * colorMix);

      particle.color = (r << 16) | (g << 8) | b;
    });
  }

  /**
   * Get all particles
   */
  getParticles(): Particle[] {
    return this.particles;
  }

  /**
   * Play animation
   */
  play(): void {
    this.isPlaying = true;
  }

  /**
   * Pause animation
   */
  pause(): void {
    this.isPlaying = false;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ParticleSystemConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.particles = [];
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

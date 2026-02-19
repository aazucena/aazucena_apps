/**
 * Particle Renderer
 * WebGL rendering optimizations and visual effects
 */

import * as PIXI from "pixi.js";
import type { Particle, ParticleRendererConfig } from "./types";
export class ParticleRenderer {
  private config: ParticleRendererConfig;
  private sprites: PIXI.Sprite[] = [];
  private container: PIXI.Container;
  private particleTexture: PIXI.Texture | null = null;
  private currentEffect: "glow" | "blur" | "none" = "none";

  constructor(
    container: PIXI.Container,
    config: Partial<ParticleRendererConfig> = {},
  ) {
    this.container = container;
    this.config = {
      blendMode: config.blendMode || "normal",
      tint: config.tint || 0xffffff,
      texture: config.texture,
    };

    // Create particle texture
    this.particleTexture = this.createParticleTexture(32); // 32x32 particle texture
  }

  /**
   * Create a circular particle texture using canvas
   */
  private createParticleTexture(size: number): PIXI.Texture {
    // Create canvas for particle texture
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }

    const center = size / 2;
    const radius = size / 2;

    // Create radial gradient (bright center, soft edges)
    const gradient = ctx.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      radius,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    // Draw circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    // Create PixiJS texture from canvas
    return PIXI.Texture.from(canvas);
  }

  /**
   * Create sprite objects for particles
   */
  createGraphics(particles: Particle[]): void {
    this.clearGraphics();

    if (!this.particleTexture) return;

    particles.forEach((particle) => {
      const sprite = new PIXI.Sprite(this.particleTexture!);

      // Set anchor to center for rotation and scaling
      sprite.anchor.set(0.5);

      // Set initial properties
      sprite.x = particle.x;
      sprite.y = particle.y;
      sprite.tint = particle.color;
      sprite.alpha = particle.alpha;
      sprite.blendMode = this.config.blendMode;

      // Scale sprite to match particle size
      const scale = particle.size / 16; // 32px texture → particle size
      sprite.scale.set(scale);

      this.container.addChild(sprite);
      this.sprites.push(sprite);
    });
  }

  /**
   * Update sprite positions, colors, and opacity (OPTIMIZED - no redrawing!)
   */
  updateGraphics(particles: Particle[]): void {
    // Apply effect-based alpha multiplier
    const alphaMultiplier =
      this.currentEffect === "glow"
        ? 1.5
        : this.currentEffect === "blur"
          ? 1.2
          : 1.0;

    particles.forEach((particle, index) => {
      const sprite = this.sprites[index];
      if (sprite) {
        // Update position
        sprite.x = particle.x;
        sprite.y = particle.y;

        // Update color and alpha with sprite tinting (fast!)
        sprite.tint = particle.color;
        sprite.alpha = Math.min(particle.alpha * alphaMultiplier, 1);
      }
    });
  }

  /**
   * Render particles with optimized sprite batching
   */
  render(particles: Particle[]): void {
    // Ensure we have the right number of sprites
    if (this.sprites.length !== particles.length) {
      this.createGraphics(particles);
    } else {
      this.updateGraphics(particles);
    }
  }

  /**
   * Apply visual effects to particles
   */
  applyEffect(effect: "glow" | "blur" | "none"): void {
    if (this.currentEffect === effect) return; // No change needed

    // Remove previous filters
    this.container.filters = null;

    if (effect === "glow") {
      // Create glow effect with additive blending
      this.sprites.forEach((s) => {
        s.blendMode = "add"; // Additive blending for glow
        s.alpha = Math.min(s.alpha * 1.5, 1); // Boost alpha for visibility
      });
      this.currentEffect = "glow";
    } else if (effect === "blur") {
      // Add blur filter for soft, dreamy effect
      const blurFilter = new PIXI.BlurFilter({
        strength: 4, // Increased from 2
        quality: 4,
      });
      this.container.filters = [blurFilter];
      this.sprites.forEach((s) => {
        s.blendMode = "normal";
        s.alpha = Math.min(s.alpha * 1.2, 1); // Slightly boost to compensate for blur
      });
      this.currentEffect = "blur";
    } else {
      // Reset to normal
      this.sprites.forEach((s) => {
        s.blendMode = "normal";
      });
      this.currentEffect = "none";
    }
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: Partial<ParticleRendererConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear all sprites
   */
  clearGraphics(): void {
    this.sprites.forEach((s) => s.destroy());
    this.sprites = [];
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.clearGraphics();

    if (this.particleTexture) {
      this.particleTexture.destroy(true);
      this.particleTexture = null;
    }
  }
}

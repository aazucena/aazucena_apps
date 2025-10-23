export interface ParticleData {
  vx: number;
  vy: number;
  vr: number;
}

export interface DeviceCapabilities {
  isMobile: boolean;
  performanceTier: 'high' | 'medium' | 'low';
  canUseHeavyAnimations: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

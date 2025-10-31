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

// Animation configuration types
export type EntranceAnimation = 'fade' | 'slide' | 'elastic' | 'scale' | 'blur' | 'none';
export type ScrollAnimation = 'parallax' | 'fade' | 'scale' | 'reveal' | 'none';

export interface AnimationConfig {
  entrance?: {
    type: EntranceAnimation;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
  };
  scroll?: {
    type: ScrollAnimation;
    intensity?: number;
    start?: string;
    end?: string;
    scrub?: number | boolean;
  };
  effects?: {
    useParticles?: boolean;
    use3DScene?: boolean;
    sceneIntensity?: number;
    particleCount?: number;
  };
}

export interface AnimatedSectionProps {
  id?: string;
  children: React.ReactNode;
  animationConfig?: AnimationConfig;
  className?: string;
  as?: 'section' | 'div' | 'article';
}

// Preset configurations
export type AnimationPreset = 'hero' | 'feature' | 'minimal' | 'immersive' | 'none';

export interface ScrollTriggerConfig {
  trigger?: Element | string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
}

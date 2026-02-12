# @aazucena/animations : Motion_Intelligence_Engine

## SUMMARY

Sophisticated animation orchestration system providing GSAP, Three.js, and PixiJS utilities for scroll-driven animations, 3D scenes, and particle effects. Engineered for performance-tiered rendering and atmospheric layer transitions.

---

## 🛠️ TOOLKIT_MANIFEST

| System                    | Protocol           | Description                                                                  |
| :------------------------ | :----------------- | :--------------------------------------------------------------------------- |
| **GSAP_Utilities**        | Scroll_Triggers    | Entrance animations, timeline management, atmospheric layer transitions.     |
| **Three.js_Helpers**      | Scene_Factory      | Scene setup, geometry creators, material presets, post-processing effects.   |
| **PixiJS_Wrappers**       | Particle_System    | High-performance 2D particle systems with sprite management.                 |
| **Scroll_Orchestration**  | Layer_Transitions  | Atmospheric layer switching based on scroll progress (troposphere → exosphere). |
| **Performance_Tiers**     | Device_Detection   | Adaptive animation quality (high/medium/low) based on device capabilities.   |
| **React_Integration**     | Hook_Lifecycle     | Custom hooks for animation state management and lifecycle control.           |

---

## 🏗️ SYSTEM_FACTORIES

### [GSAP] : The_Orchestrator

- **Location:** `src/gsap/`
- **Logic:** Entrance/exit animations, scroll triggers, timeline sequencing.
- **Exports:** `fadeIn`, `slideUp`, `createScrollTrigger`, `atmosphericTransition`.

### [Three.js] : The_Renderer

- **Location:** `src/three/`
- **Logic:** Scene setup, geometry helpers, material presets, lighting utilities.
- **Exports:** `createScene`, `createCamera`, `createRenderer`, `addLights`.

### [PixiJS] : The_Accelerator

- **Location:** `src/pixi/`
- **Logic:** Particle systems, sprite management, performance optimization.
- **Exports:** `createParticleSystem`, `updateParticles`, `enableCulling`.

---

## 🚦 USAGE_PROTOCOLS

### GSAP Scroll Animations

```typescript
import { fadeIn, createScrollTrigger, atmosphericTransition } from '@aazucena/animations/gsap';

fadeIn('.hero-title', { duration: 1.2, delay: 0.3 });

createScrollTrigger({
  trigger: '.section',
  start: 'top 80%',
  onEnter: () => fadeIn('.content'),
});

atmosphericTransition({
  layerName: 'STRATOSPHERE',
  scrollProgress: 0.3,
  onTransition: (layer) => console.log(`Transitioned to ${layer}`),
});
```

### Three.js Scene Initialization

```typescript
import { createScene, createCamera, createRenderer, addLights } from '@aazucena/animations/three';

const scene = createScene({ background: 0x000000 });
const camera = createCamera({ fov: 75, position: [0, 0, 5] });
const renderer = createRenderer({ antialias: true, alpha: true });
addLights(scene, { ambient: { intensity: 0.5 }, directional: { intensity: 1 } });
```

### PixiJS Particle System

```typescript
import { createParticleSystem, updateParticles } from '@aazucena/animations/pixi';

const particles = createParticleSystem(app, {
  count: 100,
  speed: 1.0,
  size: { min: 2, max: 5 },
  color: 0xffffff,
});

app.ticker.add(() => {
  updateParticles(particles, { scroll: scrollProgress, mousePosition: { x, y } });
});
```

---

## ✅ VERIFICATION_SUITE

- **Performance:** 60fps target, device-adaptive quality tiers.
- **React Integration:** Custom hooks for animation lifecycle management.
- **Type Safety:** Full TypeScript support with strict mode.
- **Modularity:** Tree-shakeable exports (use only what you need).
- **Compatibility:** Works with Next.js, Astro, Remix via `client:load`.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/constants, @aazucena/context, @aazucena/hooks, @aazucena/stores, @aazucena/types, @aazucena/utils
**External:** gsap, @gsap/react, three, @react-three/fiber, @react-three/drei, pixi.js, @pixi/react

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Import animations in your component
import { fadeIn, slideUp } from '@aazucena/animations/gsap';
import { createScene } from '@aazucena/animations/three';
import { createParticleSystem } from '@aazucena/animations/pixi';
```

### Common Patterns

#### Entrance Animations with GSAP

```typescript
import { fadeIn, slideUp, scaleIn, rotateIn } from '@aazucena/animations/gsap';
import { useEffect, useRef } from 'react';

function HeroSection() {
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Fade in title
    fadeIn(titleRef.current, {
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out',
    });

    // Stagger cards
    slideUp(cardsRef.current, {
      stagger: 0.1,
      duration: 0.8,
      y: 50,
    });
  }, []);

  return (
    <>
      <h1 ref={titleRef}>Hero Title</h1>
      <div>
        {[1, 2, 3].map((_, i) => (
          <div key={i} ref={(el) => (cardsRef.current[i] = el)}>
            Card {i + 1}
          </div>
        ))}
      </div>
    </>
  );
}
```

#### Scroll-Triggered Animations

```typescript
import { createScrollTrigger } from '@aazucena/animations/gsap';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reveal sections on scroll
createScrollTrigger({
  trigger: '.section',
  start: 'top 80%',
  end: 'bottom 20%',
  onEnter: () => {
    gsap.to('.section-content', {
      opacity: 1,
      y: 0,
      duration: 1,
    });
  },
  onLeave: () => {
    gsap.to('.section-content', {
      opacity: 0,
      y: 50,
      duration: 0.5,
    });
  },
});

// Pin section during scroll
createScrollTrigger({
  trigger: '.pinned-section',
  start: 'top top',
  end: 'bottom bottom',
  pin: true,
  scrub: 1,
});
```

#### Atmospheric Layer Transitions

```typescript
import { atmosphericTransition } from '@aazucena/animations/gsap';
import { useEffect } from 'react';

function AnimatedBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(progress);

      // Transition between atmospheric layers
      atmosphericTransition({
        layerName: getLayerName(progress),
        scrollProgress: progress,
        onTransition: (layer) => {
          console.log(`Transitioned to ${layer}`);
          // Update background, particle effects, etc.
        },
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function getLayerName(progress: number) {
    if (progress < 0.25) return 'TROPOSPHERE';
    if (progress < 0.5) return 'STRATOSPHERE';
    if (progress < 0.75) return 'MESOSPHERE';
    return 'EXOSPHERE';
  }

  return <div className="atmospheric-background" />;
}
```

#### Three.js Scene Setup

```typescript
import { createScene, createCamera, createRenderer, addLights } from '@aazucena/animations/three';
import { useEffect, useRef } from 'react';

function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene
    const scene = createScene({
      background: 0x000000,
      fog: { color: 0x000000, near: 1, far: 1000 },
    });

    const camera = createCamera({
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      position: [0, 0, 5],
    });

    const renderer = createRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    addLights(scene, {
      ambient: { color: 0xffffff, intensity: 0.5 },
      directional: { color: 0xffffff, intensity: 1, position: [5, 5, 5] },
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

#### PixiJS Particle System

```typescript
import { createParticleSystem, updateParticles, destroyParticles } from '@aazucena/animations/pixi';
import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';

function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application>();
  const particlesRef = useRef<any>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize PixiJS app
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
    });
    appRef.current = app;
    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    // Create particle system
    const particles = createParticleSystem(app, {
      count: 100,
      speed: 1.0,
      size: { min: 2, max: 5 },
      color: 0xffffff,
      alpha: { min: 0.3, max: 1.0 },
    });
    particlesRef.current = particles;

    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    let scrollProgress = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleScroll = () => {
      scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    app.ticker.add(() => {
      updateParticles(particles, {
        scroll: scrollProgress,
        mousePosition: { x: mouseX, y: mouseY },
      });
    });

    // Cleanup
    return () => {
      destroyParticles(particles);
      app.destroy(true, { children: true });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div ref={containerRef} />;
}
```

### Advanced Usage

#### GSAP Timeline Sequencing

```typescript
import { createTimeline, sequenceAnimations } from '@aazucena/animations/gsap';
import gsap from 'gsap';

// Create timeline with labels
const tl = createTimeline({
  repeat: -1, // Infinite loop
  yoyo: true,
});

tl.add('start')
  .to('.box', { x: 100, duration: 1 })
  .add('middle')
  .to('.box', { y: 100, duration: 1 })
  .add('end')
  .to('.box', { rotation: 360, duration: 1 });

// Sequence multiple animations
sequenceAnimations([
  { target: '.hero', props: { opacity: 1, duration: 1 } },
  { target: '.content', props: { y: 0, duration: 0.8 }, delay: 0.2 },
  { target: '.cta', props: { scale: 1, duration: 0.5 }, delay: 0.3 },
]);
```

#### Three.js Custom Geometries

```typescript
import { createCustomGeometry, createMaterial } from '@aazucena/animations/three';
import * as THREE from 'three';

// Create custom geometry
const vertices = [
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(-1, -1, 0),
  new THREE.Vector3(1, -1, 0),
];

const geometry = createCustomGeometry(vertices, [[0, 1, 2]]);

// Apply custom material
const material = createMaterial('standard', {
  color: 0xff0000,
  metalness: 0.5,
  roughness: 0.5,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

#### Performance-Tiered Rendering

```typescript
import { useAnimation } from '@aazucena/context';
import { createScene } from '@aazucena/animations/three';
import { createParticleSystem } from '@aazucena/animations/pixi';

function AdaptiveAnimations() {
  const { capabilities, performanceTier } = useAnimation();

  // Adjust quality based on device capability
  const particleCount = performanceTier === 'high' ? 200 : performanceTier === 'medium' ? 100 : 50;

  const antialias = performanceTier === 'high';

  // Conditionally render heavy animations
  return (
    <>
      {capabilities.canUseHeavyAnimations ? (
        <ThreeScene antialias={antialias} />
      ) : (
        <LightweightAnimation />
      )}

      <ParticleBackground count={particleCount} />
    </>
  );
}
```

### Troubleshooting

#### GSAP Not Animating

```typescript
// ❌ Wrong: Animating before element exists
fadeIn('.hero-title', { duration: 1 });

// ✅ Correct: Ensure element exists
useEffect(() => {
  fadeIn('.hero-title', { duration: 1 });
}, []); // Run after mount

// 🎯 Best: Use refs for reliability
const titleRef = useRef(null);
useEffect(() => {
  if (titleRef.current) {
    fadeIn(titleRef.current, { duration: 1 });
  }
}, []);
```

#### ScrollTrigger Not Working

```typescript
// ❌ Wrong: Not registering plugin
import { createScrollTrigger } from '@aazucena/animations/gsap';

createScrollTrigger({ trigger: '.section' }); // Won't work

// ✅ Correct: Register ScrollTrigger plugin
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

createScrollTrigger({ trigger: '.section' }); // Now works
```

#### Three.js Scene Not Visible

```typescript
// ❌ Common issues
// 1. Camera position too close/far
// 2. Objects not added to scene
// 3. Renderer not appending to DOM

// ✅ Checklist
const scene = createScene();
const camera = createCamera({ position: [0, 0, 5] }); // Not [0, 0, 0]
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); // Don't forget to add to scene
renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size
container.appendChild(renderer.domElement); // Append to DOM
```

#### PixiJS Performance Issues

```typescript
// ❌ Wrong: Creating too many particles
const particles = createParticleSystem(app, { count: 10000 }); // Slow

// ✅ Correct: Use appropriate particle count
const count = window.innerWidth < 768 ? 50 : 150; // Mobile vs desktop
const particles = createParticleSystem(app, { count });

// 🎯 Best: Enable culling and batching
import { enableCulling, batchRender } from '@aazucena/animations/pixi';

enableCulling(particleContainer, { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });
batchRender(sprites); // Batch draw calls
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine

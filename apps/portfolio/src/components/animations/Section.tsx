// components/HeroSection.tsx
import { useEffect, useRef, useState, type JSX } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import PixiJSParticles from './Particles.tsx';
import ThreeJSScene from './Scene.tsx';
import type { DeviceCapabilities } from '@/types/animations.ts';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger);
}

export default function HeroSection(): JSX.Element {
  const pixiCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    performanceTier: 'medium',
    canUseHeavyAnimations: true
  });

  useGSAP(() => {

    // GSAP Animations
    const tl = gsap.timeline();

    // Text animations
    tl.fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(ctaRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.3"
    );

    // Scroll-triggered parallax and fade
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, { scope: heroRef })

  useEffect(() => {
    setMounted(true);

    // Detect device capabilities
    const detectCapabilities = (): DeviceCapabilities => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const memory = (navigator as any).deviceMemory || 4; // in GB
      const cores = navigator.hardwareConcurrency || 4;

      return {
        isMobile,
        performanceTier: memory >= 8 && cores >= 8 ? 'high' :
                        memory >= 4 && cores >= 4 ? 'medium' : 'low',
        canUseHeavyAnimations: !isMobile && memory >= 4
      };
    };

    setDeviceCapabilities(detectCapabilities());
  }, []);

  const handleCTAClick = (section: string): void => {
    // GSAP button animation
    if (ctaRef.current) {
      gsap.to(ctaRef.current.children, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    // Smooth scroll to section
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: section, offsetY: 50 },
      ease: "power2.inOut"
    });
  };

  const handleViewResume = (): void => {
    // Example of a more complex interaction
    const tl = gsap.timeline();
    tl.to(ctaRef.current?.children[1]!, {
      scale: 1.1,
      duration: 0.2,
      backgroundColor: "#059669"
    })
    .to(ctaRef.current?.children[1]!, {
      scale: 1,
      duration: 0.2
    });

    // Open resume PDF
    setTimeout(() => {
      window.open('/AldrinAzucena_Resume.pdf', '_blank');
    }, 400);
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-black via-primary-800 to-black animate-hue-shift"
    >
      {/* PixiJS Canvas for Particles */}
      <canvas
        ref={pixiCanvasRef}
        className="absolute inset-0 z-10"
        style={{ pointerEvents: 'none' }}
      />
      {mounted && deviceCapabilities.canUseHeavyAnimations && (
        <PixiJSParticles width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Three.js Canvas - Conditionally rendered based on capabilities */}
      {deviceCapabilities.canUseHeavyAnimations && (
        <div className="fixed inset-0 z-20">
          <Canvas
            camera={{ position: [0, 0, 0], fov: 15 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            shadows
          >
            <ThreeJSScene intensity={deviceCapabilities.performanceTier === 'high' ? 1 : 0.7} />
          </Canvas>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-30 container mx-auto px-6 h-full flex items-center">
        <div className={`max-w-2xl ${!deviceCapabilities.canUseHeavyAnimations ? 'mx-auto text-center' : ''}`}>
          <h1
            ref={titleRef}
            className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Full Stack
            <span className="block bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent">
              Software Developer
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            Accelerating development by 25% through reusable component libraries and cutting
            production errors by 75% with automated CI/CD pipelines. Building accessible,
            high-performance products with AI-enhanced workflows.
          </p>

          <div ref={ctaRef} className="flex space-x-4 justify-center md:justify-start">
            <button
              onClick={() => handleCTAClick('#projects')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Explore my projects"
            >
              Explore My Work
            </button>

            <button
              onClick={handleViewResume}
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg font-semibold text-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="View my resume"
            >
              View Resume
            </button>
          </div>

          {/* Tech Stack Badges */}
          <div className="mt-12 flex flex-wrap gap-3 justify-center md:justify-start">
            {['React', 'TypeScript', 'Python', 'Node.js', 'Docker', 'AWS', 'PostgreSQL', 'GraphQL'].map((tech, index) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 text-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Performance Fallback Message */}
      {!deviceCapabilities.canUseHeavyAnimations && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <p className="text-sm text-gray-400">
            Lightweight mode enabled for better performance
          </p>
        </div>
      )}
    </section>
  );
}

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
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
} from '@/components/ui/timeline';
import { InfiniteMovingCards, type Testimonial } from '@/components/ui/infinite-moving-cards';
import { PhoneDialTabs } from '@/components/ui/phone-dial-tabs';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger);
}

export default function HeroSection(): JSX.Element {
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const experienceContentRef = useRef<HTMLDivElement>(null);
  const skillsContentRef = useRef<HTMLDivElement>(null);
  const testimonialsContentRef = useRef<HTMLDivElement>(null);
  const blogContentRef = useRef<HTMLDivElement>(null);
  const awardsContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const flipTextRef = useRef<HTMLSpanElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(0); // 0 = hero, 1 = about, 2 = projects, 3 = experience, 4 = skills, 5 = testimonials, 6 = blog, 7 = awards
  const [currentFlipIndex, setCurrentFlipIndex] = useState<number>(0);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    performanceTier: 'medium',
    canUseHeavyAnimations: true
  });
  const isScrollingRef = useRef<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const flipWords = ['ideas', 'concepts', 'visions', 'dreams'];
  const totalSections = 8;

  // Initial entrance animations
  useGSAP(() => {
    const tl = gsap.timeline();

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

    return () => {
      tl.kill();
    };
  }, { scope: heroRef });

  // Text flip animation
  useEffect(() => {
    if (!flipTextRef.current) return;

    const interval = setInterval(() => {
      if (flipTextRef.current) {
        gsap.to(flipTextRef.current, {
          rotateX: 90,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setCurrentFlipIndex((prev) => (prev + 1) % flipWords.length);
            if (flipTextRef.current) {
              gsap.fromTo(flipTextRef.current,
                { rotateX: -90, opacity: 0 },
                { rotateX: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
              );
            }
          }
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [flipWords.length]);

  // Content transition animations based on currentSection
  useEffect(() => {
    if (!heroContentRef.current || !aboutContentRef.current || !projectsContentRef.current ||
        !experienceContentRef.current || !skillsContentRef.current || !testimonialsContentRef.current ||
        !blogContentRef.current || !awardsContentRef.current) return;

    const sections = [
      heroContentRef.current,
      aboutContentRef.current,
      projectsContentRef.current,
      experienceContentRef.current,
      skillsContentRef.current,
      testimonialsContentRef.current,
      blogContentRef.current,
      awardsContentRef.current
    ];

    sections.forEach((section, index) => {
      if (index === currentSection) {
        // Show current section
        gsap.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        });
      } else {
        // Hide other sections
        const direction = index < currentSection ? -150 : 150;
        gsap.to(section, {
          opacity: 0,
          y: direction,
          scale: 0.95,
          duration: 1,
          ease: "power3.out"
        });
      }
    });
  }, [currentSection]);

  // Modal entrance/exit animations
  useEffect(() => {
    if (selectedExperience !== null && modalRef.current) {
      // Entrance animation
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );

      // ESC key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeExperienceModal();
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [selectedExperience]);

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

    // Wheel event handler for section transitions
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return;

      const delta = e.deltaY;

      if (delta > 0 && currentSection < totalSections - 1) {
        // Scrolling down
        isScrollingRef.current = true;
        setCurrentSection(currentSection + 1);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      } else if (delta < 0 && currentSection > 0) {
        // Scrolling up
        isScrollingRef.current = true;
        setCurrentSection(currentSection - 1);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection]);

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

  const openExperienceModal = (index: number): void => {
    setSelectedExperience(index);
  };

  const closeExperienceModal = (): void => {
    setSelectedExperience(null);
  };

  // Experience data
  const experiences = [
    {
      logo: 'TM',
      logoGradient: 'from-cyan-400 to-blue-500',
      position: 'Full Stack Software Developer',
      company: 'Tangle Media Inc.',
      duration: 'Dec 2021 – Sep 2025',
      details: [
        'Built 25+ reusable UI components reducing development time by 25% and UI-related bugs by 15%',
        'Migrated 30+ databases (5TB+) with zero data loss using custom Python scripts and validation frameworks',
        'Managed 50+ client sites with 99.95% uptime through proactive monitoring and rapid incident response',
        'Developed 15+ multilingual accessible websites achieving Lighthouse scores above 95 and WCAG compliance',
        'Created 15+ admin dashboards reducing content publishing time from 30 minutes to under 10 minutes'
      ]
    },
    {
      logo: 'HD',
      logoGradient: 'from-purple-400 to-pink-500',
      position: 'Software Developer Intern',
      company: 'HelpUsDefend',
      duration: 'May 2021 – Jan 2022',
      details: [
        'Built proof-of-concept Flutter mobile app with TensorFlow Lite AI camera integration achieving 95% accuracy',
        'Reduced technical debt by 25% through comprehensive refactoring of legacy codebase',
        'Implemented automated testing suite improving code coverage from 40% to 75%',
        'Collaborated with cross-functional teams in an Agile environment to deliver features on schedule'
      ]
    },
    {
      logo: 'IFB',
      logoGradient: 'from-green-400 to-emerald-500',
      position: 'Web Developer Intern',
      company: 'Interfaith Food Bank',
      duration: 'Feb 2019 – Aug 2020',
      details: [
        'Launched volunteer management tool serving 1,000+ active users with real-time scheduling capabilities',
        'Increased volunteer sign-ups by 35% through intuitive UX design and streamlined registration process',
        'Built responsive web application using React and Node.js with PostgreSQL database',
        'Implemented user authentication and authorization system ensuring data security and privacy'
      ]
    }
  ];

  // Blog posts data
  const blogPosts = [
    {
      title: 'Optimizing React Applications for Production',
      description: 'Learn practical strategies to improve React app performance, including code splitting, lazy loading, and memoization techniques.',
      date: 'March 15, 2024',
      tags: [
        { label: 'React', color: 'cyan' },
        { label: 'Performance', color: 'cyan' }
      ],
      readTime: '5 min read',
      url: '/blog/optimizing-react-applications',
      isExternal: false
    },
    {
      title: 'Building AI-Powered Apps with LangChain',
      description: 'A comprehensive guide to integrating LangChain into your applications to build intelligent, context-aware features.',
      date: 'February 28, 2024',
      tags: [
        { label: 'AI', color: 'purple' },
        { label: 'LangChain', color: 'purple' }
      ],
      readTime: '8 min read',
      url: 'https://medium.com/@yourhandle/building-ai-powered-apps',
      isExternal: true
    },
    {
      title: 'Zero-Downtime Database Migrations',
      description: 'Best practices and strategies for migrating large-scale databases without impacting production systems.',
      date: 'January 20, 2024',
      tags: [
        { label: 'Database', color: 'green' },
        { label: 'Migration', color: 'green' }
      ],
      readTime: '6 min read',
      url: 'https://dev.to/yourhandle/zero-downtime-migrations',
      isExternal: true
    }
  ];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      quote: "Aldrin consistently delivers high-quality code and demonstrates exceptional problem-solving skills. His ability to tackle complex technical challenges makes him an invaluable team member.",
      name: "John Doe",
      title: "Senior Engineering Manager",
      avatar: "JD",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      quote: "Working with Aldrin has been a pleasure. He translates complex requirements into elegant solutions and always delivers ahead of schedule with exceptional attention to detail.",
      name: "Sarah Miller",
      title: "Product Manager",
      avatar: "SM",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      quote: "Aldrin's expertise in full-stack development and his collaborative approach make him stand out. He's always willing to share knowledge and mentor junior developers.",
      name: "Michael Kim",
      title: "Tech Lead",
      avatar: "MK",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      quote: "Aldrin's technical vision and execution are top-notch. He helped modernize our legacy systems and improved our team's development velocity significantly.",
      name: "Lisa Rodriguez",
      title: "CTO",
      avatar: "LR",
      gradient: "from-orange-400 to-red-500"
    },
    {
      quote: "The quality of Aldrin's work speaks for itself. He brings both technical excellence and strong communication skills to every project.",
      name: "David Chen",
      title: "Software Architect",
      avatar: "DC",
      gradient: "from-blue-400 to-indigo-500"
    }
  ];

  return (
    <>
      {/* Fixed Background Layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-primary-800 to-black animate-hue-shift z-0" />

      {/* PixiJS Particles - Fixed */}
      {mounted && deviceCapabilities.canUseHeavyAnimations && (
        <PixiJSParticles width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Three.js Canvas - Fixed */}
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

      {/* Content Section - Viewport Height Only */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Hero Content - Fades Out */}
        <div
          ref={heroContentRef}
          className="relative z-30 w-full px-6 min-h-screen flex items-center"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <h1
                ref={titleRef}
                className="font-bold mb-6 leading-tight text-center"
              >
                <span className="block text-6xl md:text-7xl mb-4 text-white">
                  Aldrin Azucena
                </span>
                <span className="block text-4xl md:text-5xl bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent">
                  Full Stack Software Developer
                </span>
              </h1>

              <p
                ref={subtitleRef}
                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed text-center"
              >
                Turning{' '}
                <span className="inline-block perspective-1000">
                  <span
                    ref={flipTextRef}
                    className="inline-block text-cyan-400 font-semibold"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {flipWords[currentFlipIndex]}
                  </span>
                </span>
                {' '}into elegant code, one pixel at a time.
              </p>

              <div ref={ctaRef} className="flex space-x-4 justify-center">
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
              <div className="mt-12 flex flex-wrap gap-3 justify-center">
                {['TypeScript', 'React', 'Vue.js', 'Svelte', 'Python', 'Django', 'Node.js', 'Docker', 'PostgreSQL', 'GraphQL', 'MongoDB', 'LangChain'].map((tech, index) => (
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
        </div>

        {/* About Content - Fades In */}
        <div
          ref={aboutContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                About Me
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Building Products That Drive Impact
                </span>
              </h2>

              <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed text-center">
                <p>
                  I'm a full-stack professional who transforms ideas into market-ready products. From rapid MVP development to enterprise-scale systems, I build high-performance SaaS, web, and mobile applications that deliver measurable business impact.
                </p>

                <p>
                  With expertise spanning TypeScript, Python, PHP, and Java, I leverage AI-powered workflows to create smarter, scalable solutions. I specialize in legacy system modernization, complex database migrations, and delivering secure, compliant applications that users love.
                </p>

                <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">What I Bring to the Table</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base text-left">
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Full-Stack Development & Architecture</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>MVP to Enterprise Scaling</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>AI-Integrated Applications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Secure & Compliant Engineering</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Legacy System Modernization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Clear Communication & Collaboration</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">4+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">30+</div>
                    <div className="text-sm text-gray-400">Databases Migrated</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
                    <div className="text-sm text-gray-400">Client Sites Managed</div>
                  </div>
                </div>

                {/* Education Callout */}
                <div className="mt-8 flex items-center justify-center gap-3 text-base text-gray-300">
                  <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-semibold text-white">B.S. Computer Science</span>
                  <span className="text-gray-500">•</span>
                  <span>University of Lethbridge</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-cyan-400">2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Content */}
        <div
          ref={projectsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Featured Projects
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Real Solutions, Real Impact
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {/* Project 1 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Hugo UI Component Library</h3>
                  <p className="text-gray-300 mb-4">
                    Engineered 25+ standardized, tested components accelerating front-end development by 25% and reducing UI-related bugs by 15%.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Hugo</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Component Library</span>
                  </div>
                </div>

                {/* Project 2 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Multi-lingual Accessible Websites</h3>
                  <p className="text-gray-300 mb-4">
                    Developed and deployed 15+ websites achieving Lighthouse scores above 95 and full WCAG compliance for global accessibility.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Vue.js</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Accessibility</span>
                  </div>
                </div>

                {/* Project 3 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Admin Dashboards Suite</h3>
                  <p className="text-gray-300 mb-4">
                    Built 15+ dashboards with Svelte, Vue, and React, reducing content publishing time from 30 minutes to under 10 minutes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Svelte</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Vue.js</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">React</span>
                  </div>
                </div>

                {/* Project 4 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Mobile App</h3>
                  <p className="text-gray-300 mb-4">
                    Proof-of-concept Flutter app with TensorFlow Lite AI camera integration achieving 95% accuracy in image recognition.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">Flutter</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">TensorFlow Lite</span>
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">AI/ML</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Content */}
        <div
          ref={experienceContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 3 ? 'auto' : 'none' }}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Experience
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Building Excellence Over Time
                </span>
              </h2>

              <Timeline className="mt-8 max-w-4xl mx-auto text-left">
                {experiences.map((exp, index) => (
                  <TimelineItem key={index}>
                    <TimelineDot variant="primary" />
                    {index < experiences.length - 1 && <TimelineLine />}
                    <TimelineContent>
                      <div
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        onClick={() => openExperienceModal(index)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Company Logo */}
                          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${exp.logoGradient} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {exp.logo}
                          </div>

                          {/* Condensed Info */}
                          <div className="flex-grow flex flex-col gap-1">
                              <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                              <span className="text-sm text-cyan-400">{exp.company}</span>
                              <p className="text-gray-400 text-xs whitespace-nowrap">{exp.duration}</p>
                          </div>

                          {/* Click Indicator */}
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>
        </div>

        {/* Skills & Technologies Content */}
        <div
          ref={skillsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 4 ? 'auto' : 'none' }}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Skills & Technologies
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Tools I Use to Build Great Products
                </span>
              </h2>

              <PhoneDialTabs
                tabs={[
                  {
                    id: 'frontend',
                    label: 'Frontend',
                    gradient: 'from-cyan-400 to-blue-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['React', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-400/30 hover:bg-cyan-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'backend',
                    label: 'Backend',
                    gradient: 'from-purple-400 to-pink-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['Node.js', 'Python', 'Django', 'PHP', 'Java', 'GraphQL', 'REST APIs'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-purple-400/20 text-purple-400 rounded-full text-sm font-medium border border-purple-400/30 hover:bg-purple-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'database',
                    label: 'Database',
                    gradient: 'from-green-400 to-emerald-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-green-400/20 text-green-400 rounded-full text-sm font-medium border border-green-400/30 hover:bg-green-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'cloud',
                    label: 'Cloud',
                    gradient: 'from-blue-400 to-indigo-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['Docker', 'AWS', 'Firebase', 'Kubernetes', 'CI/CD'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium border border-blue-400/30 hover:bg-blue-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'tools',
                    label: 'Tools',
                    gradient: 'from-yellow-400 to-orange-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['Git', 'Figma', 'VS Code', 'Agile', 'Jira'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-400/30 hover:bg-yellow-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'ai',
                    label: 'AI',
                    gradient: 'from-pink-400 to-red-500',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    content: (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['LangChain', 'TensorFlow', 'OpenAI', 'Machine Learning'].map((skill) => (
                          <span key={skill} className="px-4 py-2 bg-pink-400/20 text-pink-400 rounded-full text-sm font-medium border border-pink-400/30 hover:bg-pink-400/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  }
                ]}
                defaultTab="frontend"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Content */}
        <div
          ref={testimonialsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="w-full text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Testimonials
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  What People Say
                </span>
              </h2>

              <div className="mt-12">
                <InfiniteMovingCards
                  items={testimonials}
                  direction="left"
                  speed="slow"
                  pauseOnHover={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div
          ref={blogContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Blog
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Thoughts & Insights
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {blogPosts.map((post, index) => (
                  <a
                    key={index}
                    href={post.url}
                    target={post.isExternal ? '_blank' : '_self'}
                    rel={post.isExternal ? 'noopener noreferrer' : undefined}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group pointer-events-auto"
                  >
                    {/* Tags Row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-3 py-1 bg-${tag.color}-400/20 text-${tag.color}-400 rounded-full text-xs`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Title with External Link Icon */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </h3>
                      {post.isExternal && (
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Date and Read Time */}
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-sm text-gray-400">{post.date}</p>
                      <span className="text-gray-500">•</span>
                      <p className="text-sm text-gray-400">{post.readTime}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {post.description}
                    </p>
                  </a>
                ))}
              </div>

              {/* View All Articles Button */}
              <div className="mt-16 flex justify-center pointer-events-auto">
                <a
                  href="/blog"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                  aria-label="View all blog articles"
                >
                  View All Articles
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Awards & Certifications Content */}
        <div
          ref={awardsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Awards & Certifications
                <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Recognition & Achievements
                </span>
              </h2>

              {/* Hexagonal Grid Layout */}
              <div className="relative mt-16 flex items-center justify-center min-h-[600px]">
                {/* Honeycomb container */}
                <div className="relative w-full max-w-4xl">
                  {/* Certifications Label */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
                      <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-wider">Certifications</h3>
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
                    </div>
                  </div>

                  {/* Row 1 - 2 hexagons (Certifications) */}
                  <div className="flex justify-center gap-4 mb-[-30px]">
                    {/* AWS Certification */}
                    <div className="group relative w-48 h-52 flex items-center justify-center cursor-pointer">
                      {/* Hexagon SVG */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110">
                        <defs>
                          <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill="url(#grad-cyan)"
                          stroke="#22d3ee"
                          strokeWidth="2"
                          className="transition-all duration-300 group-hover:fill-opacity-40"
                        />
                      </svg>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">AWS</h3>
                        <p className="text-xs text-cyan-400">2023</p>
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-gray-900 border border-cyan-400/30 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl">
                        <h4 className="text-base font-bold text-white mb-2">AWS Certified Solutions Architect</h4>
                        <p className="text-xs text-gray-300 mb-2">Amazon Web Services • 2023</p>
                        <p className="text-xs text-gray-400">Professional-level certification demonstrating expertise in designing distributed systems.</p>
                      </div>
                    </div>

                    {/* Google Cloud Certification */}
                    <div className="group relative w-48 h-52 flex items-center justify-center cursor-pointer">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110">
                        <defs>
                          <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.2 }} />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill="url(#grad-purple)"
                          stroke="#c084fc"
                          strokeWidth="2"
                          className="transition-all duration-300 group-hover:fill-opacity-40"
                        />
                      </svg>

                      <div className="relative z-10 flex flex-col items-center p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Google Cloud</h3>
                        <p className="text-xs text-purple-400">2022</p>
                      </div>

                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-gray-900 border border-purple-400/30 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl">
                        <h4 className="text-base font-bold text-white mb-2">Google Cloud Professional Developer</h4>
                        <p className="text-xs text-gray-300 mb-2">Google Cloud • 2022</p>
                        <p className="text-xs text-gray-400">Certified in building scalable and reliable cloud applications using Google Cloud technologies.</p>
                      </div>
                    </div>
                  </div>

                  {/* Awards Label */}
                  <div className="flex items-center justify-center mb-8 mt-12">
                    <div className="flex items-center gap-4">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400/50"></div>
                      <h3 className="text-lg font-semibold text-yellow-400 uppercase tracking-wider">Awards</h3>
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400/50"></div>
                    </div>
                  </div>

                  {/* Row 2 - 2 hexagons (Awards - with dashed borders) */}
                  <div className="flex justify-center gap-4">
                    {/* Innovation Award */}
                    <div className="group relative w-48 h-52 flex items-center justify-center cursor-pointer">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110">
                        <defs>
                          <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0.2 }} />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill="url(#grad-yellow)"
                          stroke="#facc15"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          className="transition-all duration-300 group-hover:fill-opacity-40"
                        />
                      </svg>

                      <div className="relative z-10 flex flex-col items-center p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Innovation</h3>
                        <p className="text-xs text-yellow-400">2024</p>
                      </div>

                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-gray-900 border border-yellow-400/30 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl">
                        <h4 className="text-base font-bold text-white mb-2">Innovation Award</h4>
                        <p className="text-xs text-gray-300 mb-2">Tangle Media Inc. • 2024</p>
                        <p className="text-xs text-gray-400">Recognized for developing innovative solutions that significantly improved development efficiency.</p>
                      </div>
                    </div>

                    {/* Hackathon Winner */}
                    <div className="group relative w-48 h-52 flex items-center justify-center cursor-pointer">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110">
                        <defs>
                          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill="url(#grad-green)"
                          stroke="#4ade80"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          className="transition-all duration-300 group-hover:fill-opacity-40"
                        />
                      </svg>

                      <div className="relative z-10 flex flex-col items-center p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Hackathon</h3>
                        <p className="text-xs text-green-400">2020</p>
                      </div>

                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-gray-900 border border-green-400/30 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl">
                        <h4 className="text-base font-bold text-white mb-2">Hackathon Winner</h4>
                        <p className="text-xs text-gray-300 mb-2">University Tech Challenge • 2020</p>
                        <p className="text-xs text-gray-400">First place winner for developing an AI-powered accessibility tool for visually impaired users.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Modal */}
        {selectedExperience !== null && experiences[selectedExperience] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeExperienceModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <div
              ref={modalRef}
              className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeExperienceModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${experiences[selectedExperience]!.logoGradient} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  {experiences[selectedExperience]!.logo}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {experiences[selectedExperience]!.position}
                  </h2>
                  <p className="text-lg text-gray-300 mb-1">{experiences[selectedExperience]!.company}</p>
                  <p className="text-sm text-cyan-400">{experiences[selectedExperience]!.duration}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">Key Achievements</h3>
                <ul className="space-y-3">
                  {experiences[selectedExperience]!.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                      <span className="text-sm md:text-base leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            {[...Array(totalSections)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSection === index ? 'bg-cyan-400 scale-125' : 'bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => {
                  if (!isScrollingRef.current) {
                    isScrollingRef.current = true;
                    setCurrentSection(index);
                    setTimeout(() => {
                      isScrollingRef.current = false;
                    }, 1000);
                  }
                }}
              />
            ))}
          </div>
        </div>
        {currentSection === 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2">
            <svg
              className="w-8 h-8 text-white animate-delayed-entrance"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Performance Fallback Message */}
        {!deviceCapabilities.canUseHeavyAnimations && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 text-center">
            <p className="text-sm text-gray-400">
              Lightweight mode enabled for better performance
            </p>
          </div>
        )}
      </section>
    </>
  );
}

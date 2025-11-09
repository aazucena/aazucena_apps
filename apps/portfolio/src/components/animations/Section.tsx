/**
 * Hero Section Component
 * Main portfolio section orchestrating all content, animations, and interactions
 * Refactored to use modular components and custom hooks
 */

import { useState, type JSX } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import PixiJSParticles from './Particles.tsx';
import ThreeJSScene from './Scene.tsx';
import { TOTAL_SECTIONS } from './sections/data/sections';
import { aboutData } from './sections/data/about';
import { experiences } from './sections/data/experiences';
import {
  useDeviceCapabilities,
  useLocalStorage,
  useSectionTransition,
  useFlipText,
  useModal,
  useAtmosphericLayer,
  useGSAPEntrance,
  useSectionRefs,
  useSectionTransitions
} from './hooks';
import {
  Toolbar,
  SocialMenu,
  SettingsPanel,
  InfoPanel,
  ExperienceModal,
  ScrollIndicators,
  ScrollDownIndicator
} from './ui';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  ExperienceSection,
  SkillsSection,
  TestimonialsSection,
  BlogSection,
  AwardsSection
} from './sections';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

export default function PortfolioSection(): JSX.Element {
  const refs = useSectionRefs();
  const { capabilities, updateCapabilities, mounted } = useDeviceCapabilities();
  const [isSoundMuted, setIsSoundMuted] = useLocalStorage('soundMuted', true);
  const { currentSection, setCurrentSection, scrollProgress, setScrollProgress } = useSectionTransition({
    totalSections: TOTAL_SECTIONS
  });

  const { currentWord: currentFlipWord, elementRef: flipTextRef } = useFlipText({
    words: aboutData.flipWords,
    interval: 3000
  });

  const {
    isOpen: isExperienceModalOpen,
    data: selectedExperienceIndex,
    open: openExperienceModal,
    close: closeExperienceModal,
    modalRef
  } = useModal<number>();

  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);

  const { titleRef, subtitleRef, ctaRef } = useGSAPEntrance(refs.heroRef);
  const { phase: atmosphericLayer, backgroundStyle } = useAtmosphericLayer(currentSection, scrollProgress);

  // Apply section transition animations
  useSectionTransitions(currentSection, refs);

  // CTA handlers
  const handleSectionClick = (index: number): void => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current.children, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
    setCurrentSection(index);
    setScrollProgress(0);
  };

  const handleViewResume = (): void => {
    const tl = gsap.timeline();
    tl.to(ctaRef.current?.children[1]!, {
      scale: 1.1,
      duration: 0.2,
      backgroundColor: "#059669"
    }).to(ctaRef.current?.children[1]!, {
      scale: 1,
      duration: 0.2
    });

    setTimeout(() => {
      window.open('/AldrinAzucena_Resume.pdf', '_blank');
    }, 400);
  };

  return (
    <>
      {/* Dynamic Background with Smooth Transitions */}
      <div
        className="fixed inset-0 z-0 transition-all duration-300 ease-out"
        style={backgroundStyle}
      />

      {/* Atmospheric Overlays */}
      {atmosphericLayer === 'troposphere' && (
        <div className="fixed inset-0 bg-black/40 z-10 transition-opacity duration-1000" />
      )}
      {atmosphericLayer === 'stratosphere' && (
        <>
          <div className="fixed inset-0 bg-black/25 z-10 transition-opacity duration-1000" />
          <div
            className="fixed inset-0 z-30 transition-opacity duration-1000 ease-in-out"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 95%, transparent 100%)'
            }}
          />
        </>
      )}
      {atmosphericLayer === 'mesosphere' && (
        <div className="fixed inset-0 bg-black/10 z-10 transition-opacity duration-1000" />
      )}


      {/* PixiJS Particles - Only in Exosphere */}
      {mounted && capabilities.canUseHeavyAnimations && atmosphericLayer === 'exosphere' && (
        <div className="fixed inset-0 transition-opacity duration-1000" style={{ opacity: 1 }}>
          <PixiJSParticles width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      {/* Three.js Canvas - Adaptive to Atmospheric Layer */}
      {capabilities.canUseHeavyAnimations && (
        <div className="fixed inset-0 z-20 transition-opacity duration-1000">
          <Canvas
            camera={{ position: [0, 0, 0], fov: 15 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            shadows
          >
            <ThreeJSScene
              intensity={capabilities.performanceTier === 'high' ? 1 : 0.7}
              phase={atmosphericLayer}
              currentSection={currentSection}
              scrollProgress={scrollProgress}
            />
          </Canvas>
        </div>
      )}

      {/* Main Content Section */}
      <section ref={refs.heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Hero Content */}
        <div
          ref={refs.heroContentRef}
          className="relative z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 0 ? 'auto' : 'none' }}
        >
          <HeroSection
            data={aboutData}
            titleRef={titleRef}
            subtitleRef={subtitleRef}
            ctaRef={ctaRef}
            flipTextRef={flipTextRef as any}
            currentFlipWord={currentFlipWord || ''}
            onSectionClick={handleSectionClick}
            onViewResume={handleViewResume}
          />
        </div>

        {/* About Content */}
        <div
          ref={refs.aboutContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <AboutSection data={aboutData} />
        </div>

        {/* Projects Content */}
        <div
          ref={refs.projectsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 2 ? 'auto' : 'none' }}
        >
          <ProjectsSection />
        </div>

        {/* Experience Content */}
        <div
          ref={refs.experienceContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 3 ? 'auto' : 'none' }}
        >
          <ExperienceSection onOpenExperience={openExperienceModal} />
        </div>

        {/* Skills Content */}
        <div
          ref={refs.skillsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 4 ? 'auto' : 'none' }}
        >
          <SkillsSection isSoundMuted={isSoundMuted} />
        </div>

        {/* Testimonials Content */}
        <div
          ref={refs.testimonialsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center pointer-events-none"
        >
          <TestimonialsSection />
        </div>

        {/* Blog Content */}
        <div
          ref={refs.blogContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 6 ? 'auto' : 'none' }}
        >
          <BlogSection />
        </div>

        {/* Awards Content */}
        <div
          ref={refs.awardsContentRef}
          className="absolute top-0 left-0 right-0 z-30 w-full px-6 min-h-screen flex items-center"
          style={{ pointerEvents: currentSection === 7 ? 'auto' : 'none' }}
        >
          <AwardsSection />
        </div>

        {/* Experience Modal */}
        {isExperienceModalOpen && selectedExperienceIndex !== null && experiences[selectedExperienceIndex] && (
          <ExperienceModal
            experience={experiences[selectedExperienceIndex]}
            onClose={closeExperienceModal}
            modalRef={modalRef as any}
          />
        )}

        {/* Toolbar */}
        <Toolbar
          isSoundMuted={isSoundMuted}
          onToggleSound={() => setIsSoundMuted(!isSoundMuted)}
          onToggleInfo={() => {
            setShowInfoPanel(!showInfoPanel);
            setShowSettingsPanel(false);
            setShowSocialMenu(false);
          }}
          onToggleSettings={() => {
            setShowSettingsPanel(!showSettingsPanel);
            setShowInfoPanel(false);
            setShowSocialMenu(false);
          }}
          onToggleSocial={() => {
            setShowSocialMenu(!showSocialMenu);
            setShowInfoPanel(false);
            setShowSettingsPanel(false);
          }}
        />

        {/* Social Menu */}
        {showSocialMenu && <SocialMenu onClose={() => setShowSocialMenu(false)} />}

        {/* Settings Panel */}
        {showSettingsPanel && (
          <SettingsPanel
            onClose={() => setShowSettingsPanel(false)}
            capabilities={capabilities}
            onUpdateCapabilities={updateCapabilities}
          />
        )}

        {/* Info Panel */}
        {showInfoPanel && (
          <InfoPanel
            onClose={() => setShowInfoPanel(false)}
            currentPhase={atmosphericLayer}
          />
        )}

        {/* Scroll Indicators */}
        <ScrollIndicators
          visible={currentSection !== 0}
          currentSection={currentSection}
          onSectionClick={(index) => {
            setCurrentSection(index);
            setScrollProgress(0);
          }}
        />

        {/* Scroll Down Indicator */}
        <ScrollDownIndicator
          timeout={15 * 1000}
          visible={currentSection === 0}
          onClick={() => {
            setCurrentSection(1);
            setScrollProgress(0);
          }}
        />
      </section>
    </>
  );
}

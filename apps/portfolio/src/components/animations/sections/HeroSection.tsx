/**
 * HeroSection Component
 * Main landing section with title, subtitle, flip text, and CTA buttons
 */

import {
  Download
} from '@mynaui/icons-react';
import { gsap } from "gsap";
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconRenderer } from '~/components/blocks/IconRenderer';
import type { IconComponent } from '~/types/icons';
import {
  CTA_CLICK_DURATION,
  CTA_CLICK_REPEAT,
  CTA_CLICK_SCALE,
  RESUME_BUTTON_COLOR,
  RESUME_BUTTON_DURATION,
  RESUME_BUTTON_SCALE,
  RESUME_OPEN_DELAY,
} from "../config/constants";
import { useHomepageData, usePortfolio, usePortfolioData, useSectionData } from '../contexts';
import { useGSAPEntrance } from '../hooks';
import { FlipWordsTagline } from '../ui';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface HeroSectionProps extends SectionProps {}

export interface NavigationDropdownOption {
  label: string;
  index: number;
  icon?: IconComponent;
}

export function HeroSection({
  title,
  subtitle,
}: HeroSectionProps): JSX.Element {
  // Create our own container ref for GSAP scope
  const containerRef = useRef<HTMLDivElement>(null);
  const { titleRef, subtitleRef, ctaRef } = useGSAPEntrance(containerRef);
  const { hero } = useSectionData();
  const portfolio = usePortfolioData();
  const { sections } = useHomepageData();
  const options: NavigationDropdownOption[] = sections
    .filter((section) => section.name !== 'hero')
    .map((section, index) => ({
      label: section?.buttonLabel ?? section.title,
      index: section?.sort ?? index,
      icon: section.icon,
    }));

  // const navigationOptions = [
  //   { label: 'Learn About Me', sectionIndex: SECTION_NAMES.indexOf('about'), icon: User },
  //   { label: 'Explore My Work', sectionIndex: SECTION_NAMES.indexOf('projects'), icon: Briefcase },
  //   { label: 'See My Journey', sectionIndex: SECTION_NAMES.indexOf('experience'), icon: ClockCircle },
  //   { label: 'Seek My Tech Stack', sectionIndex: SECTION_NAMES.indexOf('skills'), icon: Code },
  //   { label: 'Read Testimonials', sectionIndex: SECTION_NAMES.indexOf('testimonials'), icon: MessageDots },
  //   { label: 'Browse Articles', sectionIndex: SECTION_NAMES.indexOf('blog'), icon: FileText },
  //   { label: 'View Achievements', sectionIndex: SECTION_NAMES.indexOf('awards'), icon: Badge }
  // ];


  const onNavigate = () => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current.children, {
        scale: CTA_CLICK_SCALE,
        duration: CTA_CLICK_DURATION,
        yoyo: true,
        repeat: CTA_CLICK_REPEAT,
      });
    }
  }

  const onViewResumeClick = () => {
    const resumeButton = ctaRef.current?.children[1];
    if (resumeButton) {
      const tl = gsap.timeline();
      tl.to(resumeButton, {
        scale: RESUME_BUTTON_SCALE,
        duration: RESUME_BUTTON_DURATION,
        backgroundColor: RESUME_BUTTON_COLOR,
      }).to(resumeButton, {
        scale: 1,
        duration: RESUME_BUTTON_DURATION,
      });
    }
  }

  return (
    <SectionLayout
      ref={containerRef}
      headerRef={titleRef}
      title={title || portfolio.name}
      subtitle={subtitle || portfolio.title}
      headerLevel="h1"
      contentWidth="narrow"
      headerClassName="max-w-2xl"
      headingClassName="font-bold mb-6 leading-tight text-center"
      titleClassName="block text-6xl md:text-7xl mb-4 text-white"
      subtitleClassName="block text-4xl md:text-5xl bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent"
    >
      <FlipWordsTagline words={hero.flipWords} ref={subtitleRef} content={hero.taglineTemplate} />
        {/* <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed text-center">
          Turning{' '}
          <span className="inline-block perspective-1000">
            <span
              ref={flipTextRef}
              className="inline-block text-cyan-400 font-semibold"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {currentFlipWord}
            </span>
          </span>
          {' '}into elegant code, one pixel at a time.
        </p> */}

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Split Dropdown Button */}
          {/* <div className="relative w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <button
                onClick={() => handleNavigate(SECTION_NAMES.indexOf('about'))}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-l-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                aria-label="Get started"
              >
                Get Started
              </button>

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex-shrink-0 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 border-l border-white/20"
                aria-label="Show navigation options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {showDropdown && (
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setShowDropdown(false)}
              />
            )}

            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:left-0 sm:right-auto sm:min-w-[280px] bg-gray-900 rounded-lg shadow-2xl border border-cyan-400/30 overflow-y-auto max-h-[216px] z-[500] scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-gray-800">
                {navigationOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.sectionIndex}
                      onClick={() => handleNavigate(option.sectionIndex)}
                      className="w-full px-6 py-3 text-left text-white hover:bg-cyan-500/20 transition-colors duration-200 flex items-center gap-3 border-b border-white/10 last:border-b-0"
                    >
                      <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div> */}
          <NavigationButton options={options} onNavigateClick={onNavigate} dropdown={hero.showDropdown} >
            {hero?.primaryButtonText ?? 'Get Started'}
          </NavigationButton>
          <ResumeButton src={portfolio.resume ?? '/AldrinAzucena_Resume.pdf'} show={hero.showSecondaryButton} onClick={onViewResumeClick}>
            {hero?.secondaryButtonText ?? 'View Resume'}
          </ResumeButton>
          {/* <button
            onClick={onViewResume}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 overflow-hidden"
            aria-label="View my resume"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

            <span className="relative flex items-center justify-center gap-2">
              <Download className="w-5 h-5 group-hover:animate-pulse" />
              View Resume
            </span>
          </button> */}
        </div>
    </SectionLayout>
  );
}
export interface NavigationButtonProps {
  options: NavigationDropdownOption[];
  onNavigateClick?: (index: number) => void;
  children?: React.ReactNode;
  dropdown?: boolean;
}

function NavigationButton({ dropdown = true, options, onNavigateClick, children }: NavigationButtonProps): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { navigateToSection } = usePortfolio();

  const handleToggleDropdown = () => {
    const newState = !showDropdown;

    // Calculate position immediately when opening
    if (newState && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const style = {
        position: 'fixed' as const,
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      };
      setDropdownStyle(style);
    }

    setShowDropdown(newState);
  };

  const onNavigate = (sectionIndex: number) => {
    onNavigateClick?.(sectionIndex);
    navigateToSection(sectionIndex);
    setShowDropdown(false);
  };

  // Guard against empty options array
  if (!options || options.length === 0) {
    return <></>;
  }

  const firstOptionIndex = options[0]!.index;
  const otherOptions = options.slice(1);

  // Auto-enable dropdown if there are multiple options, unless explicitly disabled
  const shouldShowDropdown = dropdown !== false && otherOptions.length > 0;
  const hasDropdownItems = shouldShowDropdown;

  // Calculate dropdown position
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Update position on scroll/resize as a fallback
  useEffect(() => {
    if (!showDropdown || !buttonRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const style = {
          position: 'fixed' as const,
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        };
        setDropdownStyle(style);
      }
    };

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showDropdown]);

  return (
      <div ref={buttonRef} className="relative w-full sm:w-auto">
        <div className="flex w-full sm:w-auto">
          {/* Main Button */}
          <button
            onClick={() => onNavigate(firstOptionIndex)}
            className={`flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 ${hasDropdownItems ? 'rounded-l-lg' : 'rounded-lg'}`}
            aria-label="Get started"
          >
            {children ?? 'Get Started'}
          </button>

          {/* Dropdown Trigger - only show if dropdown prop is true AND there are items */}
          {hasDropdownItems && (
            <button
              onClick={handleToggleDropdown}
              className="flex-shrink-0 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 border-l border-white/20"
              aria-label="Show navigation options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Backdrop to close dropdown - Rendered via Portal */}
        {hasDropdownItems && showDropdown && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setShowDropdown(false)}
          />,
          document.body
        )}

        {/* Dropdown Menu - Rendered via Portal to bypass overflow issues */}
        {hasDropdownItems && showDropdown && typeof document !== 'undefined' && (() => {
          const dropdownElement = (
            <div
              style={dropdownStyle}
              className="bg-gray-900 rounded-lg shadow-2xl border border-cyan-400/30 overflow-y-auto max-h-[216px] z-[500] scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-gray-800 sm:min-w-[280px]"
            >
              {otherOptions.map((option) => {
                return (
                  <button
                    key={option.index}
                    onClick={() => onNavigate(option.index)}
                    className="w-full px-6 py-3 text-left text-white hover:bg-cyan-500/20 transition-colors duration-200 flex items-center gap-3 border-b border-white/10 last:border-b-0"
                  >
                    <IconRenderer icon={option.icon} className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          );
          return createPortal(dropdownElement, document.body);
        })()}
      </div>
  )
}

export interface ResumeButtonProps {
  src?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  show?: boolean;
}

function ResumeButton({ show = true, onClick, children, src = '/AldrinAzucena_Resume.pdf' }: ResumeButtonProps) {
  if (!show) return (<></>);

  const handleClick = () => {
    onClick?.();
    setTimeout(() => {
      // Secure window.open to prevent tabnabbing attacks
      const resumeWindow = window.open(src, "_blank");
      if (resumeWindow) {
        resumeWindow.opener = null;
      }
    }, RESUME_OPEN_DELAY);
    
  }

  return (
    <button
      onClick={handleClick}
      className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 overflow-hidden"
      aria-label="View my resume"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

      <span className="relative flex items-center justify-center gap-2">
        <Download className="w-5 h-5 group-hover:animate-pulse" />
        {children ?? 'View Resume'}
      </span>
    </button>
  )
}
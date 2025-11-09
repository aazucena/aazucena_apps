/**
 * HeroSection Component
 * Main landing section with title, subtitle, flip text, and CTA buttons
 */

import type { JSX, RefObject } from 'react';
import { useState } from 'react';
import type { AboutData } from './data/about';
import { SECTION_NAMES } from './data/sections';
import {
  User,
  Briefcase,
  ClockCircle,
  Code,
  MessageDots,
  FileText,
  Badge,
  Download
} from '@mynaui/icons-react';

export interface HeroSectionProps {
  data: AboutData;
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
  ctaRef: RefObject<HTMLDivElement>;
  flipTextRef: RefObject<HTMLSpanElement>;
  currentFlipWord: string;
  onSectionClick: (index: number) => void;
  onViewResume: () => void;
}

export function HeroSection({
  data,
  titleRef,
  subtitleRef,
  ctaRef,
  flipTextRef,
  currentFlipWord,
  onSectionClick,
  onViewResume
}: HeroSectionProps): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigationOptions = [
    { label: 'Learn About Me', sectionIndex: SECTION_NAMES.indexOf('about'), icon: User },
    { label: 'Explore My Work', sectionIndex: SECTION_NAMES.indexOf('projects'), icon: Briefcase },
    { label: 'See My Journey', sectionIndex: SECTION_NAMES.indexOf('experience'), icon: ClockCircle },
    { label: 'Seek My Tech Stack', sectionIndex: SECTION_NAMES.indexOf('skills'), icon: Code },
    { label: 'Read Testimonials', sectionIndex: SECTION_NAMES.indexOf('testimonials'), icon: MessageDots },
    { label: 'Browse Articles', sectionIndex: SECTION_NAMES.indexOf('blog'), icon: FileText },
    { label: 'View Achievements', sectionIndex: SECTION_NAMES.indexOf('awards'), icon: Badge }
  ];

  const handleNavigate = (sectionIndex: number) => {
    onSectionClick(sectionIndex);
    setShowDropdown(false);
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="max-w-2xl mx-auto">
        <h1 ref={titleRef} className="font-bold mb-6 leading-tight text-center">
          <span className="block text-6xl md:text-7xl mb-4 text-white">{data.name}</span>
          <span className="block text-4xl md:text-5xl bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent">
            {data.title}
          </span>
        </h1>

        <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed text-center">
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
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Split Dropdown Button */}
          <div className="relative w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              {/* Main Button */}
              <button
                onClick={() => handleNavigate(SECTION_NAMES.indexOf('about'))}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-l-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                aria-label="Get started"
              >
                Get Started
              </button>

              {/* Dropdown Trigger */}
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

            {/* Backdrop to close dropdown */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setShowDropdown(false)}
              />
            )}

            {/* Dropdown Menu - Shows 4 items, scrollable for more */}
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
          </div>

          <button
            onClick={onViewResume}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 overflow-hidden"
            aria-label="View my resume"
          >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

            <span className="relative flex items-center justify-center gap-2">
              <Download className="w-5 h-5 group-hover:animate-pulse" />
              View Resume
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

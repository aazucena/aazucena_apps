/**
 * HeroSection Component
 * Main landing section with title, subtitle, flip text, and CTA buttons
 */

import { gsap } from "gsap";
import type { JSX } from 'react';
import { useRef } from 'react';
import {
  CTA_CLICK_DURATION,
  CTA_CLICK_REPEAT,
  CTA_CLICK_SCALE,
  RESUME_BUTTON_COLOR,
  RESUME_BUTTON_DURATION,
  RESUME_BUTTON_SCALE,
} from '~/config/animations/constants';
import { useHomepageData, usePortfolioData, useSectionData } from '~/contexts/animations';
import { useGSAPEntrance } from '~/hooks/animations';
import { FlipWordsTagline, NavigationButton, ResumeButton } from '~/components/ui';
import type { NavigationDropdownOption } from '~/components/ui/hero/NavigationButton';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface HeroSectionProps extends SectionProps {}

export type { NavigationDropdownOption };

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
      title={title || portfolio.fullName}
      subtitle={subtitle || portfolio.occupation}
      headerLevel="h1"
      contentWidth="narrow"
      headerClassName="max-w-2xl"
      headingClassName="font-bold mb-6 leading-tight text-center"
      titleClassName="block text-6xl md:text-7xl mb-4 text-white"
      subtitleClassName="block text-4xl md:text-5xl bg-gradient-to-r from-secondary-400 to-secondary-500 bg-clip-text text-transparent"
    >
      <FlipWordsTagline words={hero.flipWords} ref={subtitleRef} content={hero.taglineTemplate} />

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NavigationButton
            options={options}
            onNavigateClick={onNavigate}
            dropdown={hero.showDropdown}
          >
            {hero?.primaryButtonText ?? 'Get Started'}
          </NavigationButton>

          <ResumeButton
            src={portfolio.resumeUrl ?? '/AldrinAzucena_Resume.pdf'}
            show={hero.showSecondaryButton}
            onClick={onViewResumeClick}
          >
            {hero?.secondaryButtonText ?? 'View Resume'}
          </ResumeButton>
        </div>
    </SectionLayout>
  );
}
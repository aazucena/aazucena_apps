/**
 * AboutSection Component
 * About me section with description, highlights, stats, and education
 */

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { JSX } from 'react';
import { darkBlockRenderers, darkHighlightBlockRenderers } from '~/components/blocks/BlockRenderers';
import { IconRenderer } from '~/components/blocks/IconRenderer';
import { cn } from '~/lib/utils';
import type { CardLink } from '~/lib/validators/about';
import type { IconComponent } from '~/types/icons';
import { useSectionData } from '../contexts';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface AboutSectionProps extends SectionProps {}

export function AboutSection({ title = 'About Me', subtitle }: AboutSectionProps): JSX.Element {
  const { about } = useSectionData();
  return (
    <SectionLayout
      title={title}
      subtitle={subtitle || about.tagline}
      contentWidth="narrow"
    >
      <div className="space-y-6 text-lg md:text-xl text-center">
          {/* Render descriptions with rich text formatting */}
          <BlocksRenderer
            content={about.descriptions}
            blocks={darkBlockRenderers}
          />

          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">What I Bring to the Table</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base text-left">
              {/* Render highlights with checkmarks */}
              <BlocksRenderer
                content={about.highlights}
                blocks={darkHighlightBlockRenderers}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {about.stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Learn More Links */}
          <div className={cn("mt-8 grid grid-cols-1 md:grid-cols-2 gap-3")}>
            {about.learnMoreCards.map((card, index) => (
              <LearnMoreCard
                key={index}
                href={card.button.url}
                title={card.title}
                variant={card.variant}
                icon={card.icon}
                buttonText={card.button.label}
                buttonIcon={card.button.icon}
              >
                {card.description}
              </LearnMoreCard>
            ))}
            {/* Get to Know Me Card */}
            {/* <a
              href="/about"
              className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 rounded-lg p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white">Get to Know Me</h4>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Interests, hobbies, and what drives me
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium">
                <span>Explore</span>
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a> */}

            {/* Career Journey Card */}
            {/* <a
              href="/journey"
              className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-400/30 rounded-lg p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white">Career Journey</h4>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Interactive timeline of my professional growth
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-medium">
                <span>View Timeline</span>
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a> */}
          </div>
        </div>
    </SectionLayout>
  );
}


interface LearnMoreCardProps {
  href?: string;
  title: string;
  variant: CardLink['variant'];
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  icon: IconComponent;
  buttonText: string;
  buttonIcon: IconComponent;
  buttonClassName?: string;
}

const DEFAULT_LEARN_MORE_CARD_VARIANT = 'cyan-blue';
interface LearnMoreCardVariantResult {
  primary: string;
  secondary: string;
}
function getCardLinkVariant(value: string): LearnMoreCardVariantResult {
  if (!value.includes('-') || value.split('-').length !== 2) {
    value = DEFAULT_LEARN_MORE_CARD_VARIANT;
  }
  const [ primary, secondary ] = value.split('-');
  return {
    primary: `${primary}`,
    secondary: `${secondary}`
  }
}

function LearnMoreCard({ className, iconClassName, buttonClassName, variant, href, title, children, icon, buttonText, buttonIcon }: LearnMoreCardProps): JSX.Element {

  const { primary, secondary } = getCardLinkVariant(variant as string);

  const defaultCardClassName = `group bg-gradient-to-br from-${primary}-500/10 to-${secondary}-500/10 hover:from-${primary}-400/20 hover:to-${secondary}-500/20 border border-${primary}-400/30 rounded-lg p-4 transition-all duration-300 hover:scale-105`
  const defaultIconClassName = `w-8 h-8 bg-gradient-to-br from-${primary}-400 to-${secondary}-500 rounded-lg flex items-center justify-center flex-shrink-0`
  const defaultButtonClassName = `flex items-center gap-2 text-${primary}-400 text-xs font-medium`


  return (
    
    <a
      href={href}
      className={cn(defaultCardClassName, className)}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(defaultIconClassName, iconClassName)}>
          <IconRenderer icon={icon} className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-base font-bold text-white">{title}</h4>
      </div>
      {children && (
        <p className="text-xs text-gray-400 mb-2">
          {children}
        </p>
      )}
      
      <div className={cn(defaultButtonClassName, buttonClassName)}>
        <span>{buttonText}</span>
        {buttonIcon && (<IconRenderer icon={buttonIcon} className="w-3 h-3 transition-transform group-hover:translate-x-1" />)}
      </div>
    </a>
  )
};
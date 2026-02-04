/**
 * ExperienceModal Component
 * Modal for displaying experience details
 * Reordered sections for better UX: Company Info → Achievements → Overview → Responsibilities → Skills
 */

import { useEffect, type JSX, type RefObject } from 'react';
import type { Experience } from '~/lib/transformers/experiences';
import { getBadgeClasses } from '~/lib/utils/animations/colors';
import { calculateDuration, formatCompanySize, getCompanyLogoGradient } from '~/lib/utils/experiences';
import { toTitleCase } from '~/lib/utils/text';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { darkBlockRenderers } from '~/components/blocks/BlockRenderers';
import { MarkdownRenderer } from '~/components/blocks/MarkdownRenderer';
import { CompanyLogo } from './experience/CompanyLogo';
import {
  Location,
  Briefcase,
  BuildingOne,
  Globe,
  BrandLinkedin,
  Badge,
  ArrowRight,
} from '@mynaui/icons-react';

export interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

export function ExperienceModal({ experience, onClose, modalRef }: ExperienceModalProps): JSX.Element {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original overflow when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <CompanyLogo
            company={experience.company}
            companyLogo={experience.companyLogo}
            size="lg"
          />
          <div className="flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {toTitleCase(experience.position)}
            </h2>
            <p className="text-lg text-gray-300 mb-1">{toTitleCase(experience.company)}</p>
            <p className="text-sm text-cyan-400">{calculateDuration(experience.startDate, experience.endDate, !experience.endDate)}</p>
            {(experience.location || experience.employmentType) && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-2">
                {experience.employmentType && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{experience.employmentType}</span>
                  </div>
                )}
                {experience.location && (
                  <div className="flex items-center gap-1">
                    <Location className="w-4 h-4" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Company Metadata - Moved up for immediate context */}
        {(experience.industry || experience.companySize || experience.companyWebsite || experience.companyLinkedIn) && (
          <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Company Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experience.industry && (
                <div className="flex items-start gap-2">
                  <BuildingOne className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">Industry</span>
                    <p className="text-sm text-gray-300 mt-1">{experience.industry}</p>
                  </div>
                </div>
              )}
              {experience.companySize && (
                <div className="flex items-start gap-2">
                  <BuildingOne className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">Company Size</span>
                    <p className="text-sm text-gray-300 mt-1">{formatCompanySize(experience.companySize)}</p>
                  </div>
                </div>
              )}
              {experience.companyWebsite && (
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">Website</span>
                    <a
                      href={experience.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 mt-1 flex items-center gap-1 transition-colors"
                    >
                      {experience.companyWebsite.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
              {experience.companyLinkedIn && (
                <div className="flex items-start gap-2">
                  <BrandLinkedin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">LinkedIn</span>
                    <a
                      href={experience.companyLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 mt-1 flex items-center gap-1 transition-colors"
                    >
                      View Company Profile
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements - Moved up to hook attention early */}
        {experience.achievements && experience.achievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Badge className="w-5 h-5 text-yellow-400" />
              Key Achievements
            </h3>
            <div className="space-y-4">
              {experience.achievements.map((achievement, idx) => (
                <div
                  key={achievement.id || idx}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-400/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {achievement.icon && (
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                        <span className="text-xl">{achievement.icon}</span>
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="text-base font-semibold text-white mb-1">{toTitleCase(achievement.title)}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{achievement.description}</p>
                      {achievement.date && (
                        <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {experience.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
            <MarkdownRenderer className="prose prose-lg prose-invert *:!text-white *:prose-p:!text-gray-500 max-w-none prose-p:leading-relaxed" content={experience.description} />
          </div>
        )}

        {/* Responsibilities */}
        {experience.responsibilities && experience.responsibilities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Responsibilities</h3>
            <BlocksRenderer content={experience.responsibilities} blocks={darkBlockRenderers} />
          </div>
        )}

        {/* Skills - Limited to first 10 in modal */}
        {experience.skills && experience.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {experience.skills.slice(0, 10).map((skill, idx) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                const skillCategory = typeof skill === 'string' ? undefined : skill.category;

                return (
                  <span
                    key={idx}
                    className={getBadgeClasses(getCompanyLogoGradient(experience.company))}
                    title={skillCategory ? `Category: ${skillCategory}` : undefined}
                  >
                    {skillName}
                  </span>
                );
              })}
              {experience.skills.length > 10 && (
                <a
                  href={`/experiences/${experience.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-full transition-colors"
                  title="View all skills on the full experience page"
                >
                  +{experience.skills.length - 10} more
                </a>
              )}
            </div>
          </div>
        )}

        {/* View Full Experience CTA */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <a
            href={`/experiences/${experience.slug}`}
            className="group flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            aria-label="View full experience page"
          >
            <span>View Full Experience</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

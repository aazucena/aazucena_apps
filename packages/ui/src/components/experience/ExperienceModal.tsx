/**
 * ExperienceModal Component
 * Modal for displaying experience details
 */

import { useEffect, type JSX, type RefObject } from 'react';
import type { Experience } from '@aazucena/types';
import { toTitleCase } from '@aazucena/utils';
import {
  calculateDuration,
  formatCompanySize,
  getCompanyLogoGradient,
  getBadgeClasses,
} from '@aazucena/utils';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { darkBlockRenderers } from '../blocks/BlockRenderers.js';
import { MarkdownRenderer } from '../blocks/MarkdownRenderer.js';
import { CompanyLogo } from './CompanyLogo.js';
import { cn } from '@aazucena/utils';
import {
  Location,
  Briefcase,
  BuildingOne,
  Globe,
  BrandLinkedin,
  Badge,
  ArrowRight,
  X,
  ExternalLink,
} from '@aazucena/icons';

export interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export function ExperienceModal({
  experience,
  onClose,
  modalRef,
  className,
}: ExperienceModalProps): JSX.Element {
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
      {/* Backdrop - Decorative overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Invisible button for close logic */}
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default border-none bg-transparent outline-none"
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-modal-title"
        className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6 flex items-start gap-4">
          <CompanyLogo
            company={experience.company}
            companyLogo={experience.companyLogo}
            size="lg"
          />
          <div className="flex-grow">
            <h2 id="exp-modal-title" className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {toTitleCase(experience.position)}
            </h2>
            <p className="mb-1 text-lg text-gray-300">{toTitleCase(experience.company)}</p>
            <p className="text-sm text-cyan-400">
              {calculateDuration(experience.startDate, experience.endDate, experience.isCurrent)}
            </p>
            {(experience.location || experience.employmentType) && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                {experience.employmentType && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{experience.employmentType}</span>
                  </div>
                )}
                {experience.location && (
                  <div className="flex items-center gap-1">
                    <Location className="h-4 w-4" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {(experience.industry ||
          experience.companySize ||
          experience.companyWebsite ||
          experience.companyLinkedIn) && (
          <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
              Company Info
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {experience.industry && (
                <div className="flex items-start gap-2">
                  <BuildingOne className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div>
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">
                      Industry
                    </span>
                    <p className="mt-1 text-sm text-gray-300">{experience.industry}</p>
                  </div>
                </div>
              )}
              {experience.companySize && (
                <div className="flex items-start gap-2">
                  <BuildingOne className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div>
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">
                      Company Size
                    </span>
                    <p className="mt-1 text-sm text-gray-300">
                      {formatCompanySize(experience.companySize)}
                    </p>
                  </div>
                </div>
              )}
              {experience.companyWebsite && (
                <div className="flex items-start gap-2">
                  <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div>
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">
                      Website
                    </span>
                    <a
                      href={experience.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                    >
                      {experience.companyWebsite
                        .replace(/^https?:\/\/(www\.)?/, '')
                        .replace(/\/$/, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
              {experience.companyLinkedIn && (
                <div className="flex items-start gap-2">
                  <BrandLinkedin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <div>
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">
                      LinkedIn
                    </span>
                    <a
                      href={experience.companyLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                    >
                      View Company Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {experience.achievements && experience.achievements.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <Badge className="h-5 w-5 text-yellow-400" />
              Key Achievements
            </h3>
            <div className="space-y-4">
              {experience.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-yellow-400/30"
                >
                  <div className="flex items-start gap-3">
                    {achievement.description && (
                      <div className="flex-grow">
                        <h4 className="mb-1 text-base font-semibold text-white">
                          {toTitleCase(achievement.title)}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {achievement.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(experience.description as any) && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">Overview</h3>
            <MarkdownRenderer
              className="prose prose-lg prose-invert *:prose-p:!text-gray-500 prose-p:leading-relaxed max-w-none *:!text-white"
              content={experience.description as any}
            />
          </div>
        )}

        {(experience.responsibilities as any) && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">Key Responsibilities</h3>
            <BlocksRenderer
              content={experience.responsibilities as any}
              blocks={darkBlockRenderers}
            />
          </div>
        )}

        {experience.skills && experience.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">Technologies & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {experience.skills.slice(0, 10).map((skill, idx) => (
                <span
                  key={idx}
                  className={getBadgeClasses(getCompanyLogoGradient(experience.company))}
                >
                  {skill.name}
                </span>
              ))}
              {experience.skills.length > 10 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                  +{experience.skills.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <a
            href={`/experiences/${experience.slug}`}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/40"
          >
            <span>View Full Experience</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

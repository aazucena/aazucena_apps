/**
 * ExperienceModal Component
 * Modal for displaying experience details
 * Reordered sections for better UX: Company Info → Achievements → Overview → Responsibilities → Skills
 */

import React, { type JSX, type RefObject } from "react";
import type { Experience } from "@aazucena/types";
import { getBadgeClasses } from "@aazucena/utils";
import {
  calculateDuration,
  formatCompanySize,
  getCompanyLogoGradient,
} from "@aazucena/utils";
import { toTitleCase } from "@aazucena/utils";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";
import {
  Dialog,
  DialogContent,
  DialogBody,
  MarkdownRenderer,
} from "@aazucena/ui";
import { CompanyLogo } from "./experience/CompanyLogo";
import {
  Location,
  Briefcase,
  BuildingOne,
  Globe,
  BrandLinkedin,
  Badge,
  ArrowRight,
} from "@aazucena/icons";

export interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

export function ExperienceModal({
  experience,
  onClose,
  modalRef,
}: ExperienceModalProps): JSX.Element {
  const hasLocationInfo = !!(experience.location || experience.employmentType);
  const hasCompanyInfo = !!(
    experience.industry ||
    experience.companySize ||
    experience.companyWebsite ||
    experience.companyLinkedIn
  );

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={modalRef}
        size="lg"
        className="max-h-[80vh] overflow-hidden border-white/20 bg-gradient-to-br from-gray-900 to-black p-0 shadow-2xl"
      >
        <DialogBody className="overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <CompanyLogo
              company={experience.company}
              companyLogo={experience.companyLogo}
              size="lg"
            />
            <div className="flex-grow">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                {toTitleCase(experience.position)}
              </h2>
              <p className="mb-1 text-lg text-gray-300">
                {toTitleCase(experience.company)}
              </p>
              <p className="text-sm text-cyan-400">
                {calculateDuration(
                  experience.startDate,
                  experience.endDate,
                  !experience.endDate,
                )}
              </p>
              {hasLocationInfo && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  {experience.employmentType ? (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{experience.employmentType}</span>
                    </div>
                  ) : null}
                  {experience.location ? (
                    <div className="flex items-center gap-1">
                      <Location className="h-4 w-4" />
                      <span>{experience.location}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Company Metadata - Moved up for immediate context */}
          {hasCompanyInfo && (
            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                Company Info
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {experience.industry ? (
                  <div className="flex items-start gap-2">
                    <BuildingOne className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div>
                      <span className="block text-xs tracking-wide text-gray-500 uppercase">
                        Industry
                      </span>
                      <p className="mt-1 text-sm text-gray-300">
                        {experience.industry}
                      </p>
                    </div>
                  </div>
                ) : null}
                {experience.companySize ? (
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
                ) : null}
                {experience.companyWebsite ? (
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
                          .replace(/^https?:\/\/(www\.)?/, "")
                          .replace(/\/$/, "")}
                        <svg
                          className="h-3 w-3"
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
                      </a>
                    </div>
                  </div>
                ) : null}
                {experience.companyLinkedIn ? (
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
                        <svg
                          className="h-3 w-3"
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
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Achievements - Moved up to hook attention early */}
          {experience.achievements && experience.achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <Badge className="h-5 w-5 text-yellow-400" />
                Key Achievements
              </h3>
              <div className="space-y-4">
                {experience.achievements.map((achievement, idx) => (
                  <div
                    key={achievement.id || idx}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-yellow-400/30"
                  >
                    <div className="flex items-start gap-3">
                      {(achievement.icon as React.ReactNode) && (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                          <span className="text-xl">
                            {achievement.icon as React.ReactNode}
                          </span>
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="mb-1 text-base font-semibold text-white">
                          {toTitleCase(achievement.title)}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {achievement.description as string}
                        </p>
                        {achievement.date && (
                          <p className="mt-2 text-xs text-gray-500">
                            {achievement.date as string}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {!!experience.description && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Overview
              </h3>
              <MarkdownRenderer
                className="prose prose-lg prose-invert *:prose-p:!text-gray-500 prose-p:leading-relaxed max-w-none *:!text-white"
                content={experience.description as string}
              />
            </div>
          )}

          {/* Responsibilities */}
          {Array.isArray(experience.responsibilities) &&
          experience.responsibilities.length > 0 ? (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Key Responsibilities
              </h3>
              <BlocksRenderer
                content={
                  experience.responsibilities as import("@strapi/blocks-react-renderer").BlocksContent
                }
                blocks={darkBlockRenderers}
              />
            </div>
          ) : null}

          {/* Skills - Limited to first 10 in modal */}
          {experience.skills && experience.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {experience.skills.slice(0, 10).map((skill, idx) => {
                  const skillName =
                    typeof skill === "string" ? skill : skill.name;
                  const skillCategory =
                    typeof skill === "string" ? undefined : skill.category;

                  return (
                    <span
                      key={idx}
                      className={getBadgeClasses(
                        getCompanyLogoGradient(experience.company),
                      )}
                      title={
                        skillCategory ? `Category: ${skillCategory}` : undefined
                      }
                    >
                      {skillName}
                    </span>
                  );
                })}
                {experience.skills.length > 10 && (
                  <a
                    href={`/experiences/${experience.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400 transition-colors hover:bg-cyan-400/20 hover:text-cyan-300"
                    title="View all skills on the full experience page"
                  >
                    +{experience.skills.length - 10} more
                  </a>
                )}
              </div>
            </div>
          )}

          {/* View Full Experience CTA */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <a
              href={`/experiences/${experience.slug}`}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/40"
              aria-label="View full experience page"
            >
              <span>View Full Experience</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

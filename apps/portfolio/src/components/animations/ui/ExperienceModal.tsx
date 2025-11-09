/**
 * ExperienceModal Component
 * Modal for displaying experience details
 */

import type { JSX, RefObject } from 'react';
import type { Experience } from '../sections/data/experiences';
import { getBadgeClasses } from '../utilities/colors';

export interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement>;
}

export function ExperienceModal({ experience, onClose, modalRef }: ExperienceModalProps): JSX.Element {
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
          <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${experience.logoGradient} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
            {experience.logo}
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {experience.position}
            </h2>
            <p className="text-lg text-gray-300 mb-1">{experience.company}</p>
            <p className="text-sm text-cyan-400">{experience.duration}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Key Achievements</h3>
          <ul className="space-y-3">
            {experience.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                <span className="text-sm md:text-base leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">Technologies & Skills</h3>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, idx) => (
              <span
                key={idx}
                className={getBadgeClasses(experience.logoGradient)}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

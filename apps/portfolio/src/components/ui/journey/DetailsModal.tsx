/**
 * Skill Details Modal Component
 * Displays detailed information about a specific skill when clicked in the network graph
 */

import type { SkillDetails } from "~/lib/transformers/journey";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillDetails: SkillDetails | null;
}

export function DetailsModal({
  isOpen,
  onClose,
  skillDetails,
}: DetailsModalProps) {
  if (!isOpen || !skillDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="animate-in fade-in zoom-in relative w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="relative flex h-32 items-end bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-white/20 bg-white text-3xl shadow-xl dark:bg-gray-800">
              {skillDetails.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="mb-1 text-3xl font-bold text-white drop-shadow-md">
                {skillDetails.name}
              </h2>
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                {skillDetails.category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto p-6">
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <span className="mb-1 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                Years Used
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillDetails.yearsUsed.length}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <span className="mb-1 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                Projects
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillDetails.totalProjects}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <span className="mb-1 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                First Used
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillDetails.firstUsed.getFullYear()}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <span className="mb-1 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                Proficiency
              </span>
              <span
                className={`mt-1 block rounded-full px-2 py-0.5 text-sm font-bold ${
                  skillDetails.proficiencyLevel === "Expert"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : skillDetails.proficiencyLevel === "Advanced"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {skillDetails.proficiencyLevel}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Experience Timeline
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillDetails.yearsUsed.map((year) => (
                  <div
                    key={year}
                    className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {year}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Related Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillDetails.relatedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-gray-900"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Skill Details Modal Component
 * Displays detailed information about a specific skill when clicked in the network graph
 */

import type { SkillDetails } from '~/lib/transformers/journey';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillDetails: SkillDetails | null;
}

export function DetailsModal({ isOpen, onClose, skillDetails }: DetailsModalProps) {
  if (!isOpen || !skillDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 flex items-end">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-3xl shadow-xl border-4 border-white/20">
              {skillDetails.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{skillDetails.name}</h2>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/30">
                {skillDetails.category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Years Used</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{skillDetails.yearsUsed.length}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Projects</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{skillDetails.totalProjects}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">First Used</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{skillDetails.firstUsed.getFullYear()}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Proficiency</span>
              <span className={`text-sm font-bold block mt-1 px-2 py-0.5 rounded-full ${
                skillDetails.proficiencyLevel === 'Expert' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                skillDetails.proficiencyLevel === 'Advanced' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {skillDetails.proficiencyLevel}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Experience Timeline
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillDetails.yearsUsed.map(year => (
                  <div key={year} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-bold text-sm border border-blue-100 dark:border-blue-800">
                    {year}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Related Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillDetails.relatedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

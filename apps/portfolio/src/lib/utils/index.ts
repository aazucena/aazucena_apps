/**
 * Utility Functions Index
 * Central export for all utility helper functions
 */

export {
  formatCompanySize,
  calculateDuration,
  getEmploymentTypeIcon,
  getIndustryIcon,
  getCompanyLogoGradient,
  getCompanyInitials,
} from './experienceHelpers';

export {
  calculateReadTime,
  getAwardGradient,
  formatDate,
} from './contentHelpers';

export { debounce, debounceInline } from './debounce';

export { getTagColorClasses, isValidTagColor, getAllTagColors, type TagColor } from './tagColors';

export { extractTOC, slugify, type TOCHeading } from './toc';

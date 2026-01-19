import type { StrapiMaintenance } from '~/lib/validators/maintenance';

export interface MaintenanceData {
  enabled: boolean;
  message: string;
}

/**
 * Transform Strapi maintenance to frontend format
 */
export function transformMaintenance(strapiMaintenance: StrapiMaintenance): MaintenanceData {
  // Handle rich text - extract plain text if needed
  let message = '';
  if (typeof strapiMaintenance.message === 'string') {
    message = strapiMaintenance.message;
  } else if (Array.isArray(strapiMaintenance.message)) {
    // If it's structured richtext, extract text from paragraphs
    message = strapiMaintenance.message
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return {
    enabled: strapiMaintenance.enabled,
    message,
  };
}

/**
 * Default fallback maintenance data
 */
export const DEFAULT_MAINTENANCE: MaintenanceData = {
  enabled: false,
  message: 'The site is currently under maintenance. Please check back soon.',
};

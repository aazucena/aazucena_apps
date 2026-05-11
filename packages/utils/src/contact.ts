/**
 * Contact Form Utilities
 * Helper functions for contact forms and social platform integrations
 */

/**
 * Get local time for a specific timezone
 *
 * @param timezone - IANA timezone identifier (default: 'America/Edmonton')
 * @returns Formatted time string in 12-hour format (e.g., "02:30 PM")
 */
export function getLocalTime(timezone: string = 'America/Edmonton'): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get social platform icon component name
 * Maps platform names to icon component identifiers
 *
 * @param platform - Social platform name (e.g., 'LinkedIn', 'GitHub')
 * @returns Icon component name from @mynaui/icons-react
 */
export function getSocialPlatformIcon(platform: string): string {
  const platformMap: Record<string, string> = {
    LinkedIn: 'BrandLinkedin',
    GitHub: 'BrandGithub',
    Twitter: 'BrandTwitter',
    X: 'BrandTwitter',
    default: 'Globe',
  };
  return platformMap[platform] || platformMap.default!;
}

/**
 * Get local time for timezone
 */
export function getLocalTime(timezone: string = 'America/Edmonton'): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get social platform icon mapping
 */
export function getSocialPlatformIcon(platform: string): string {
  // Returns icon component name
  const platformMap: Record<string, string> = {
    'LinkedIn': 'BrandLinkedin',
    'GitHub': 'BrandGithub',
    'Twitter': 'BrandTwitter',
    'X': 'BrandTwitter',
    'default': 'Globe'
  };
  return platformMap[platform] || platformMap.default!;
}

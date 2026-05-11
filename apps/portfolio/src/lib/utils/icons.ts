import {
  Briefcase,
  ClockCircle,
  Code,
  FileText,
  User,
  Shield,
  Rss,
  Map,
  GitBranch,
  Send,
} from "@aazucena/icons";

/**
 * Navigation-specific icon mapping
 * Maps icon names from Strapi navigation to @aazucena/icons components
 */
export const navigationIcons = {
  briefcase: Briefcase,
  "clock-circle": ClockCircle,
  code: Code,
  "file-text": FileText,
  user: User,
  shield: Shield,
  rss: Rss,
  map: Map,
  "git-branch": GitBranch,
  send: Send,
};

/**
 * Get navigation icon component by name
 * @param iconName - Icon name from Strapi navigation (e.g., "briefcase", "clock-circle")
 */
export function getNavigationIcon(iconName?: string) {
  if (!iconName) return null;
  return navigationIcons[iconName as keyof typeof navigationIcons] || null;
}

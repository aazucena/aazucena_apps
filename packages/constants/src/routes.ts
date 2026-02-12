/**
 * Global Routing Map
 * Centralized internal and external URLs.
 */

export const ROUTES = {
  PORTFOLIO: {
    HOME: '/',
    ABOUT: '/about',
    PROJECTS: '/projects',
    EXPERIENCES: '/experiences',
    BLOG: '/blog',
    JOURNEY: '/journey',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
  },
  ANALYTICS: {
    DASHBOARD: '/',
    TRAFFIC: '/traffic',
    JOURNEYS: '/journey',
    LOGS: '/logs',
    PERFORMANCE: '/performance',
    AI_TERMINAL: '/ai',
    PROMPT_IDE: '/ai/prompts',
    TRAJECTORIES: '/ai/trajectories',
    MUSIC: '/music',
    COSTS: '/ai/costs',
    FINANCE: '/finance',
  },
  EXTERNAL: {
    GITHUB: 'https://github.com/aazucena',
    LINKEDIN: 'https://linkedin.com/in/aazucena',
    TWITTER: 'https://x.com/azucena',
    CALCOM: 'https://cal.com/aazucena',
  },
} as const;

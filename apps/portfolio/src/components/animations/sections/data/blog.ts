/**
 * Blog Data
 * Blog posts and articles
 */

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  publishedAt: string; // NEW: ISO string for robust parsing
  tags: Array<{ label: string; color: string }>;
  readTime: string;
  url: string;
  isExternal: boolean;
  // New CMS fields
  status?: 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
  featured?: boolean;
  coverImageUrl?: string;
  coverImageAlt?: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: 'Optimizing React Applications for Production',
    description: 'Learn practical strategies to improve React app performance, including code splitting, lazy loading, and memoization techniques.',
    date: 'March 15, 2024',
    tags: [
      { label: 'React', color: 'cyan' },
      { label: 'Performance', color: 'cyan' }
    ],
    readTime: '5 min read',
    url: '/blog/optimizing-react-applications',
    isExternal: false
  },
  {
    title: 'Building AI-Powered Apps with LangChain',
    description: 'A comprehensive guide to integrating LangChain into your applications to build intelligent, context-aware features.',
    date: 'February 28, 2024',
    tags: [
      { label: 'AI', color: 'purple' },
      { label: 'LangChain', color: 'purple' }
    ],
    readTime: '8 min read',
    url: 'https://medium.com/@yourhandle/building-ai-powered-apps',
    isExternal: true
  },
  {
    title: 'Zero-Downtime Database Migrations',
    description: 'Best practices and strategies for migrating large-scale databases without impacting production systems.',
    date: 'January 20, 2024',
    tags: [
      { label: 'Database', color: 'green' },
      { label: 'Migration', color: 'green' }
    ],
    readTime: '6 min read',
    url: 'https://dev.to/yourhandle/zero-downtime-migrations',
    isExternal: true
  }
];

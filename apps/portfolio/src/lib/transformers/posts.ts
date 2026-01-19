import type { StrapiPost } from '~/lib/validators/posts';
import type { BlogPost } from '~/components/animations/sections/data/blog';

/**
 * Generate tag color if not provided by CMS
 * Fallback for tags without color field
 */
function getTagColor(tag: string): string {
  const colors = ['cyan', 'purple', 'green', 'orange', 'blue', 'pink', 'yellow'];
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length] ?? colors[0]!;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Extract plain text from richtext for description
 * Basic extraction - can be enhanced with proper richtext parser
 */
function extractPlainText(richtext: any): string {
  if (typeof richtext === 'string') return richtext;
  if (!richtext) return '';

  // If it's a blocks array, extract text from blocks
  if (Array.isArray(richtext)) {
    return richtext
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
}

/**
 * Transform Strapi post to frontend format
 */
export function transformPost(strapiPost: StrapiPost): BlogPost {
  // Transform tags - CMS now provides Tag objects with label and optional color
  const tags = (strapiPost.tags || []).map((tag) => ({
    label: tag.label,
    color: tag.color || getTagColor(tag.label), // Use CMS color or generate fallback
  }));

  // Extract description from richtext field
  const description = extractPlainText(strapiPost.description);

  // Calculate estimated read time from description (roughly 200 words/min)
  const wordCount = description.split(/\s+/).length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${estimatedMinutes} min read`;

  // Use CMS url or fallback to slug-based URL
  const url = strapiPost.url || `/blog/${strapiPost.slug}`;
  const isExternal = strapiPost.isExternal ?? false; // Use CMS field

  return {
    title: strapiPost.title,
    description: description || '',
    date: formatDate(strapiPost.publishedAt || strapiPost.createdAt),
    tags,
    readTime,
    url,
    isExternal,
    // NEW: optional fields
    status: strapiPost.status,
    featured: strapiPost.featured ?? false,
    coverImageUrl: strapiPost.coverImage?.src?.url,
    coverImageAlt: strapiPost.coverImage?.altText,
  };
}

/**
 * Transform array of posts
 */
export function transformPosts(
  strapiPosts: StrapiPost[],
  featuredOnly: boolean = false
): BlogPost[] {
  const filtered = strapiPosts.filter((post) => {
    if (featuredOnly && !post.featured) return false;
    return true;
  });

  return filtered.map(transformPost);
}

/**
 * Default fallback posts
 */
export const DEFAULT_POSTS: BlogPost[] = [
  {
    title: 'Optimizing React Applications for Production',
    description: 'Learn practical strategies to improve React app performance.',
    date: 'March 15, 2024',
    tags: [
      { label: 'React', color: 'cyan' },
      { label: 'Performance', color: 'cyan' },
    ],
    readTime: '5 min read',
    url: '/blog/optimizing-react-applications',
    isExternal: false,
  },
];

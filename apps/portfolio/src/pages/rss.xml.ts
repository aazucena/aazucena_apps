import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '~/lib/api/posts';
import { getWebsiteConfig } from '~/lib/api/website-config';

export async function GET(context: APIContext) {
  // Fetch all blog posts and website config
  const [posts, websiteConfig] = await Promise.all([
    getPosts(false, 100), // Get all posts
    getWebsiteConfig(),
  ]);

  // Filter out external posts (they don't belong in our RSS feed)
  const internalPosts = posts.filter((post) => !post.isExternal);

  // Ensure site URL doesn't have trailing slash for consistency
  const siteUrl = websiteConfig.siteUrl.endsWith('/') 
    ? websiteConfig.siteUrl.slice(0, -1) 
    : websiteConfig.siteUrl;

  return rss({
    // Required fields
    title: `${websiteConfig.siteName} Blog`,
    description: websiteConfig?.defaultSEO!.description || 'Blog',
    site: context.site || websiteConfig.siteUrl,

    // RSS feed items
    items: internalPosts.map((post) => {
      // Ensure absolute URL for RSS links
      const link = post.url.startsWith('http') 
        ? post.url 
        : `${siteUrl}${post.url.startsWith('/') ? '' : '/'}${post.url}`;

      return {
        title: post.title,
        description: post.description,
        pubDate: new Date(post.publishedAt!), // Use raw ISO string for reliable parsing
        link,
        categories: post.tags.map((tag) => tag.label),
        author: websiteConfig.siteName,
      };
    }),

    // Optional: Customize RSS feed
    customData: `<language>en-us</language>`,

    // Optional: Add stylesheet for browser viewing (ensure it's absolute if needed)
    stylesheet: '/rss-styles.xsl',
  });
}
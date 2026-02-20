import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "~/lib/api/posts";

/**
 * Convert Strapi Blocks content to plain text for RSS
 * Handles the most common block types (paragraph, heading, list, quote)
 */
function blocksToPlainText(blocks: any): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block: any) => {
      if (!block || !block.type) return "";

      // Handle different block types
      switch (block.type) {
        case "paragraph":
        case "heading":
          return block.children
            ?.map((child: any) => child.text || "")
            .join("")
            .trim();

        case "list":
          return block.children
            ?.map((item: any) =>
              item.children?.map((child: any) => child.text || "").join(""),
            )
            .filter(Boolean)
            .join(" • ")
            .trim();

        case "quote":
          return `"${block.children
            ?.map((child: any) => child.text || "")
            .join("")
            .trim()}"`;

        case "code":
          return `[Code: ${block.language || "text"}]`;

        case "image":
          return block.image?.alternativeText
            ? `[Image: ${block.image.alternativeText}]`
            : "[Image]";

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

export async function GET(context: APIContext) {
  try {
    // Use Astro's built-in site URL from config (faster than fetching from CMS)
    const siteOrigin = context.site?.origin || context.url.origin;

    // Fetch blog posts (no need to fetch websiteConfig for basic metadata)
    const posts = await getPosts(false, 50); // Limit to 50 most recent posts

    // Filter out external posts (they don't belong in our RSS feed)
    // Then sort by published date (newest first) to ensure consistent ordering
    const internalPosts = posts
      .filter((post) => !post.isExternal)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

    // Generate RSS feed
    const feed = await rss({
      // Required fields
      title: "Aldrin Azucena Blog",
      description:
        "Articles and insights on web development, design, and technology",
      site: context.site || siteOrigin,

      // RSS feed items
      items: internalPosts.map((post) => {
        // Ensure absolute URL for RSS links
        const link = post.url.startsWith("http")
          ? post.url
          : `${siteOrigin}${post.url.startsWith("/") ? "" : "/"}${post.url}`;

        // Convert blocks to plain text for description
        const description =
          typeof post.description === "string"
            ? post.description
            : blocksToPlainText(post.description);

        // Create RSS item
        const item: any = {
          title: post.title,
          description: description || "Read more on the blog",
          pubDate: post.publishedAt
            ? new Date(post.publishedAt)
            : new Date(post.createdAt),
          link,
          guid: link, // Use link as GUID (permanent unique identifier)
          categories: post.tags.map((tag) => tag.label),
          author: "Aldrin Azucena",
        };

        // Add cover image as enclosure (for podcast apps, RSS readers with image support)
        if (post.coverImage?.url) {
          // Determine MIME type from URL extension
          const imageUrl = post.coverImage.url;
          let mimeType = "image/jpeg"; // Default

          if (imageUrl.endsWith(".png")) mimeType = "image/png";
          else if (imageUrl.endsWith(".webp")) mimeType = "image/webp";
          else if (imageUrl.endsWith(".gif")) mimeType = "image/gif";
          else if (imageUrl.endsWith(".svg")) mimeType = "image/svg+xml";

          item.enclosure = {
            url: imageUrl,
            type: mimeType,
            length: 0, // Optional: could fetch actual file size if needed
          };
        }

        return item;
      }),

      // Feed metadata
      customData: `
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>60</ttl>
        <docs>https://www.rssboard.org/rss-specification</docs>
      `.trim(),

      // Optional: Add stylesheet for browser viewing
      stylesheet: "/rss-styles.xsl",
    });

    // Add cache headers to improve performance (cache for 1 hour)
    feed.headers.set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    );

    return feed;
  } catch (error) {
    // Log error for debugging
    console.error("RSS Feed Generation Error:", error);

    // Fallback site URL for error response
    const fallbackSite = context.site?.href || context.url.origin;

    // Return 503 Service Unavailable with minimal valid response
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog - Temporarily Unavailable</title>
    <link>${fallbackSite}</link>
    <description>RSS feed is temporarily unavailable. Please try again later.</description>
  </channel>
</rss>`,
      {
        status: 503,
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Retry-After": "300", // Suggest retry after 5 minutes
        },
      },
    );
  }
}

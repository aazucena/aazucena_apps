import type { APIContext } from "astro";
import { getPosts, getProjects, getExperiences } from "@aazucena/api";

function toW3CDate(date: Date | string | undefined | null): string {
  if (!date) return new Date().toISOString().split("T")[0]!;
  return new Date(date).toISOString().split("T")[0]!;
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

export async function GET(context: APIContext) {
  try {
    const site = context.site?.origin || context.url.origin;
    const buildDate = toW3CDate(new Date());

    const [posts, projects, experiences] = await Promise.all([
      getPosts(false, 100),
      getProjects("listed"),
      getExperiences(),
    ]);

    const internalPosts = posts.filter((p) => !p.isExternal);

    const staticPages = [
      { path: "/", changefreq: "daily", priority: "1.0" },
      { path: "/blog/", changefreq: "weekly", priority: "0.9" },
      { path: "/projects/", changefreq: "weekly", priority: "0.8" },
      { path: "/about/", changefreq: "monthly", priority: "0.8" },
      { path: "/experiences/", changefreq: "monthly", priority: "0.8" },
      { path: "/skills/", changefreq: "monthly", priority: "0.7" },
      { path: "/journey/", changefreq: "monthly", priority: "0.7" },
      { path: "/contact/", changefreq: "monthly", priority: "0.7" },
      { path: "/support/", changefreq: "monthly", priority: "0.5" },
      { path: "/privacy/", changefreq: "yearly", priority: "0.3" },
      { path: "/terms/", changefreq: "yearly", priority: "0.3" },
    ];

    const entries = [
      ...staticPages.map(({ path, changefreq, priority }) =>
        urlEntry(`${site}${path}`, buildDate, changefreq, priority),
      ),

      ...internalPosts.map((post) => {
        const loc = post.url.startsWith("http")
          ? post.url
          : `${site}${post.url.startsWith("/") ? "" : "/"}${post.url}`;
        const lastmod = toW3CDate(
          post.publishedAt || post.updatedAt || post.createdAt,
        );
        return urlEntry(loc, lastmod, "monthly", "0.7");
      }),

      ...projects.map((project) =>
        urlEntry(
          `${site}/projects/${project.slug}/`,
          toW3CDate(project.updatedAt),
          "monthly",
          "0.7",
        ),
      ),

      ...experiences.map((experience) =>
        urlEntry(
          `${site}/experiences/${experience.slug}/`,
          buildDate,
          "yearly",
          "0.6",
        ),
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);

    const fallbackSite = context.site?.origin || context.url.origin;

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${fallbackSite}/</loc>
  </url>
</urlset>`,
      {
        status: 503,
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Retry-After": "300",
        },
      },
    );
  }
}

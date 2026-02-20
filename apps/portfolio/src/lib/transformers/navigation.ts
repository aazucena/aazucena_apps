import type { Navigation, NavigationItem } from "../validators/navigation";

/**
 * Transform Strapi navigation render response (array of items) to internal Navigation structure
 * @param items - Array of navigation items from Strapi /render endpoint
 * @param slug - Navigation slug for identification
 */
export function transformNavigationRender(
  items: NavigationItem[],
  slug: string,
): Navigation {
  return {
    id: 0,
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug,
    visible: true,
    items: items
      .map(transformNavigationItem)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  };
}

/**
 * Transform Strapi navigation to frontend format (for direct Navigation objects)
 */
export function transformNavigation(data: Navigation): Navigation {
  return {
    ...data,
    items: data.items
      .map(transformNavigationItem)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  };
}

/**
 * Transform individual navigation item
 * Flattens additionalFields and uses label as display text if available
 */
function transformNavigationItem(item: NavigationItem): NavigationItem {
  const href = item.type === "EXTERNAL" ? item.externalPath : item.path;

  // Flatten additionalFields to top level for easier component access
  const flattenedFields = item.additionalFields || {};

  return {
    ...item,
    path: href || "#",
    // Flatten custom fields from additionalFields
    label: flattenedFields.label,
    icon: flattenedFields.icon,
    buttonStyle: flattenedFields.buttonStyle,
    description: flattenedFields.description,
    cssClass: flattenedFields.cssClass,
    // Use label for display if provided, otherwise fall back to title
    title: flattenedFields.label || item.title,
    items: item.items
      ?.map(transformNavigationItem)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  };
}

/**
 * Fallback navigation data if CMS unavailable
 */
export function getDefaultNavigation(slug: string): Navigation {
  const defaults: Record<string, Navigation> = {
    "main-navigation": {
      id: 0,
      name: "Main Navigation",
      slug: "main-navigation",
      visible: true,
      items: [
        {
          id: 1,
          title: "Portfolio",
          type: "INTERNAL",
          path: "/projects",
          icon: "briefcase",
          order: 1,
          menuAttached: true,
        },
        {
          id: 2,
          title: "Journey",
          type: "INTERNAL",
          path: "/experiences",
          icon: "clock-circle",
          order: 2,
          menuAttached: true,
        },
        {
          id: 3,
          title: "Expertise",
          type: "INTERNAL",
          path: "/skills",
          icon: "code",
          order: 3,
          menuAttached: true,
        },
        {
          id: 4,
          title: "Journal",
          type: "INTERNAL",
          path: "/blog",
          icon: "file-text",
          order: 4,
          menuAttached: true,
        },
        {
          id: 5,
          title: "Biography",
          type: "INTERNAL",
          path: "/about",
          icon: "user",
          order: 5,
          menuAttached: true,
        },
      ],
    },
    "footer-navigation": {
      id: 0,
      name: "Footer Navigation",
      slug: "footer-navigation",
      visible: true,
      items: [
        // WRAPPER: Explore section
        {
          id: 1,
          title: "Explore",
          type: "WRAPPER",
          path: null,
          order: 1,
          menuAttached: true,
          items: [
            {
              id: 11,
              title: "Projects Portfolio",
              type: "INTERNAL",
              path: "/projects",
              order: 1,
              menuAttached: true,
            },
            {
              id: 12,
              title: "Career Journey",
              type: "INTERNAL",
              path: "/experiences",
              order: 2,
              menuAttached: true,
            },
            {
              id: 13,
              title: "Technical Expertise",
              type: "INTERNAL",
              path: "/skills",
              order: 3,
              menuAttached: true,
            },
            {
              id: 14,
              title: "Technical Journal",
              type: "INTERNAL",
              path: "/blog",
              order: 4,
              menuAttached: true,
            },
            {
              id: 15,
              title: "Biography",
              type: "INTERNAL",
              path: "/about",
              order: 5,
              menuAttached: true,
            },
          ],
        },
        // WRAPPER: Resources section
        {
          id: 2,
          title: "Resources",
          type: "WRAPPER",
          path: null,
          order: 2,
          menuAttached: true,
          items: [
            {
              id: 21,
              title: "Privacy Framework",
              type: "INTERNAL",
              path: "/privacy",
              icon: "shield",
              order: 1,
              menuAttached: true,
            },
            {
              id: 22,
              title: "Terms of Service",
              type: "INTERNAL",
              path: "/terms",
              icon: "file-text",
              order: 2,
              menuAttached: true,
            },
            // RSS and Sitemap are WRAPPER type because they're static/generated files, not CMS content types
            {
              id: 23,
              title: "RSS Feed",
              type: "WRAPPER",
              path: "/rss.xml",
              icon: "rss",
              order: 3,
              menuAttached: true,
            },
            {
              id: 24,
              title: "Sitemap",
              type: "WRAPPER",
              path: "/sitemap-index.xml",
              icon: "map",
              order: 4,
              menuAttached: true,
            },
          ],
        },
      ],
    },
  };

  return defaults[slug] || defaults["main-navigation"]!;
}

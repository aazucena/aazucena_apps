import { defineMiddleware } from "astro:middleware";
import { getMaintenance } from "./lib/api/maintenance";

/**
 * Global Middleware for Maintenance Mode
 * If maintenance mode is enabled in the CMS, redirects all visitors to /maintenance.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;

  // 1. Skip in development mode to avoid blocking the developer
  // You can still test it by adding ?maintenance=true to any URL
  if (import.meta.env.DEV && !url.searchParams.has("maintenance")) {
    return next();
  }

  // 2. Exclude static assets, API routes, and Astro internal routes
  const isStaticAsset =
    url.pathname.includes(".") || url.pathname.startsWith("/_astro");
  const isApiRoute = url.pathname.startsWith("/api");
  const isMaintenancePage = url.pathname === "/maintenance";

  if (isStaticAsset || isApiRoute || isMaintenancePage) {
    return next();
  }

  try {
    // 2. Fetch maintenance status from CMS
    // Since this is a portfolio, real-time check is preferred
    const maintenance = await getMaintenance();

    // 3. If enabled, force redirect to maintenance page
    if (maintenance.enabled) {
      return redirect("/maintenance");
    }
  } catch (error) {
    console.error("[Middleware] Maintenance check failed:", error);
    // If CMS is down, we allow the request to proceed to avoid complete lockout
  }

  return next();
});

import type { APIRoute } from "astro";

const COOKIE_NAME = "preview_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const GET: APIRoute = ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const redirectTo = url.searchParams.get("redirect") || "/";

  const previewToken = import.meta.env.PREVIEW_TOKEN;

  if (!previewToken) {
    return new Response(
      JSON.stringify({ error: "Preview mode not configured" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (!token || token !== previewToken) {
    return new Response(JSON.stringify({ error: "Invalid preview token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return redirect(redirectTo);
};

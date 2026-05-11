import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: "UP",
      timestamp: new Date().toISOString(),
      framework: "Astro",
      service: "portfolio",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

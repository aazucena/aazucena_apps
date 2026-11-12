import type { APIRoute } from "astro";
import {
  streamText,
  convertToModelMessages,
  isStepCount,
  createGateway,
} from "ai";
import { getSecret } from "astro:env/server";
import { setStrapiConfig } from "@aazucena/api";
import { fetchChatContext, fetchRagContext } from "~/lib/utils/chat/context";
import { createChatTools } from "~/lib/utils/chat/tools";

export const prerender = false;

// Astro reads .env through astro:env, not process.env, so the shared
// @aazucena/api gateway (process.env) never sees a local key under `astro dev`.
// getSecret reads .env in dev and the real environment at runtime without
// inlining the key into the build. With no key, the gateway falls back to
// Vercel OIDC on deployments.
const gateway = createGateway({ apiKey: getSecret("AI_GATEWAY_API_KEY") });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sanitize pathname — strip anything that isn't a valid URL path character
  // to prevent prompt injection via newlines or fabricated section headers
  const rawPathname = typeof body.pathname === "string" ? body.pathname : "/";
  const pathname =
    rawPathname.replace(/[^a-zA-Z0-9\-_/[\].~%]/g, "").slice(0, 200) || "/";

  // Validate messages is an array and reject oversized payloads (token-stuffing)
  const rawMessages = body.messages;
  const safeMessages = (() => {
    if (!Array.isArray(rawMessages)) return [];
    const serialized = JSON.stringify(rawMessages);
    if (serialized.length > 50_000) return [];
    return rawMessages.slice(0, 50);
  })();

  setStrapiConfig({
    url: import.meta.env.STRAPI_URL || "http://localhost:1337",
    apiEndpoint: import.meta.env.STRAPI_API_ENDPOINT || "/api",
    token: import.meta.env.STRAPI_TOKEN || "",
  });

  const lastUserMsg = safeMessages.findLast((m: any) => m.role === "user");
  const lastUserMessage: string =
    (typeof lastUserMsg?.content === "string" && lastUserMsg.content) ||
    lastUserMsg?.parts?.find((p: any) => p.type === "text")?.text ||
    "";

  const [{ systemPrompt }, ragContext] = await Promise.all([
    fetchChatContext(pathname),
    fetchRagContext(lastUserMessage),
  ]);

  const last10Messages = safeMessages.slice(-10);

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4.6"),
    instructions: ragContext
      ? `${systemPrompt}\n\n--- KNOWLEDGE BASE ---\n${ragContext}`
      : systemPrompt,
    messages: await convertToModelMessages(last10Messages),
    maxOutputTokens: 1024,
    stopWhen: isStepCount(3),
    tools: createChatTools(pathname),
  });

  return result.toUIMessageStreamResponse();
};

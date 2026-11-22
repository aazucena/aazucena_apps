import type { APIRoute } from "astro";
import {
  streamText,
  convertToModelMessages,
  isStepCount,
  createGateway,
} from "ai";
import { getSecret } from "astro:env/server";
import { setStrapiConfig } from "@aazucena/api";
import { DEFAULT_CHAT_MODEL } from "@aazucena/constants";
import { fetchChatContext, fetchRagContext } from "~/lib/utils/chat/context";
import { createChatTools } from "~/lib/utils/chat/tools";
import { sanitizeMessages } from "~/lib/utils/chat/sanitize-messages";

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

  // Validate the history: newest messages, user/assistant roles, text parts only
  const sanitized = sanitizeMessages(body.messages);
  if (!sanitized.ok) {
    return new Response(JSON.stringify({ error: sanitized.error }), {
      status: sanitized.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  setStrapiConfig({
    url: import.meta.env.STRAPI_URL || "http://localhost:1337",
    apiEndpoint: import.meta.env.STRAPI_API_ENDPOINT || "/api",
    token: import.meta.env.STRAPI_TOKEN || "",
  });

  const { lastUserMessage } = sanitized;

  const [{ systemPrompt }, ragContext] = await Promise.all([
    fetchChatContext(pathname),
    fetchRagContext(lastUserMessage),
  ]);

  const result = streamText({
    model: gateway(DEFAULT_CHAT_MODEL),
    instructions: ragContext
      ? `${systemPrompt}\n\n--- KNOWLEDGE BASE ---\n${ragContext}`
      : systemPrompt,
    messages: await convertToModelMessages(sanitized.messages),
    maxOutputTokens: 1024,
    stopWhen: isStepCount(3),
    tools: createChatTools(pathname),
  });

  return result.toUIMessageStreamResponse();
};

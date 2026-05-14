import type { APIRoute } from "astro";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export const prerender = false;

const INTEL_ENGINE_URL = import.meta.env.INTEL_ENGINE_URL as string | undefined;
const INTEL_ENGINE_KEY = import.meta.env.INTEL_ENGINE_API_KEY as
  | string
  | undefined;

/** Parses the incoming SSE line-pair, returning the event name and data or null. */
function parseSseLine(
  eventLine: string,
  dataLine: string,
): { event: string; data: string } | null {
  if (!eventLine.startsWith("event: ") || !dataLine.startsWith("data: "))
    return null;
  return {
    event: eventLine.slice(7).trim(),
    data: dataLine.slice(6).trim(),
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!INTEL_ENGINE_URL) {
    return new Response(
      JSON.stringify({ error: "Intel-engine not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawMessages = body.messages;
  const safeMessages = (() => {
    if (!Array.isArray(rawMessages)) return [];
    const serialized = JSON.stringify(rawMessages);
    if (serialized.length > 50_000) return [];
    return rawMessages.slice(0, 50);
  })();

  const lastUserMsg = safeMessages.findLast((m: any) => m.role === "user");
  const query: string =
    (typeof lastUserMsg?.content === "string" && lastUserMsg.content) ||
    lastUserMsg?.parts?.find((p: any) => p.type === "text")?.text ||
    "";

  if (!query.trim()) {
    return new Response(JSON.stringify({ error: "No user message found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let engineResponse: Response;
  try {
    engineResponse = await fetch(`${INTEL_ENGINE_URL}/brain/think`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTEL_ENGINE_KEY ? { "X-API-Key": INTEL_ENGINE_KEY } : {}),
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    return new Response(JSON.stringify({ error: "Intel-engine unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!engineResponse.ok || !engineResponse.body) {
    return new Response(JSON.stringify({ error: "Intel-engine error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const engineBody = engineResponse.body;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = crypto.randomUUID();
      let finalResponseWritten = false;

      const reader = engineBody.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let pendingEventLine = "";

      try {
        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const raw of lines) {
            const line = raw.trimEnd();

            if (line.startsWith("event: ")) {
              pendingEventLine = line;
            } else if (line.startsWith("data: ") && pendingEventLine) {
              const parsed = parseSseLine(pendingEventLine, line);
              pendingEventLine = "";
              if (!parsed) continue;

              const { event, data } = parsed;

              if (event === "node_start") {
                // Emit each LangGraph node as a reasoning step so it's visible
                // in the chat as a thinking indicator while the brain processes.
                const rid = crypto.randomUUID();
                writer.write({ type: "reasoning-start", id: rid });
                writer.write({
                  type: "reasoning-delta",
                  id: rid,
                  delta: data,
                });
                writer.write({ type: "reasoning-end", id: rid });
              } else if (event === "final_response") {
                let response = "No response received.";
                try {
                  const parsed = JSON.parse(data) as {
                    response?: string;
                    intent?: string;
                    trajectory_id?: string;
                  };
                  response = parsed.response ?? response;
                } catch {
                  // malformed JSON — use fallback text
                }

                writer.write({ type: "text-start", id: textId });
                writer.write({
                  type: "text-delta",
                  id: textId,
                  delta: response,
                });
                writer.write({ type: "text-end", id: textId });
                finalResponseWritten = true;
                break outer;
              } else if (event === "status" && data.startsWith("ERROR:")) {
                writer.write({
                  type: "error",
                  errorText: data.slice(6).trim(),
                });
                break outer;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
        if (!finalResponseWritten) {
          writer.write({
            type: "error",
            errorText: "Brain did not return a final response.",
          });
        }
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
};

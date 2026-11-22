import { z } from "zod";
import { MAX_MESSAGE_CHARS } from "./limits";

/** Messages Rin sees: the newest ones only. */
export const MAX_MESSAGES = 10;
export { MAX_MESSAGE_CHARS };
/** Characters of text in all retained messages together. */
export const MAX_REQUEST_CHARS = 50_000;
/** Characters of the last question sent to knowledge-base retrieval. */
export const MAX_RETRIEVAL_CHARS = 1_000;

const textPart = z.object({ type: z.literal("text"), text: z.string() });
const otherPart = z.object({ type: z.string() }).loose();
const part = z.union([textPart, otherPart]);

const message = z.object({
  id: z.string().max(200).optional(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(part).max(50),
});

export interface CleanMessage {
  id?: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
}

export type SanitizeResult =
  | { ok: true; messages: CleanMessage[]; lastUserMessage: string }
  | { ok: false; status: 400 | 413; error: string };

/**
 * Validates the client's chat history. Keeps the newest MAX_MESSAGES and accepts only user and
 * assistant roles. Text parts are kept (blank ones skipped), other parts are dropped, and messages left empty are dropped. Only an oversized
 * newest user message is rejected; older and assistant messages are cut to the limit.
 */
export function sanitizeMessages(raw: unknown): SanitizeResult {
  if (!Array.isArray(raw)) {
    return { ok: false, status: 400, error: "messages must be an array" };
  }
  const kept = raw.slice(-MAX_MESSAGES);
  const messages: CleanMessage[] = [];
  for (const [index, item] of kept.entries()) {
    const parsed = message.safeParse(item);
    if (!parsed.success) {
      return { ok: false, status: 400, error: "Invalid message" };
    }
    const isNewest = index === kept.length - 1;
    const parts: CleanMessage["parts"] = [];
    let used = 0;
    for (const p of parsed.data.parts) {
      let text: string;
      if (
        p.type === "text" &&
        typeof (p as { text?: unknown }).text === "string"
      ) {
        text = (p as { text: string }).text;
      } else {
        continue;
      }
      if (!text.trim()) continue;
      if (used + text.length > MAX_MESSAGE_CHARS) {
        if (isNewest && parsed.data.role === "user") {
          return { ok: false, status: 413, error: "Message too long" };
        }
        text = text.slice(0, MAX_MESSAGE_CHARS - used);
        if (!text.trim()) break;
      }
      used += text.length;
      parts.push({ type: "text", text });
      if (used >= MAX_MESSAGE_CHARS) break;
    }
    if (parts.length === 0) continue;
    messages.push({ id: parsed.data.id, role: parsed.data.role, parts });
  }
  // Fit the request cap by dropping the oldest messages. One message is at most
  // MAX_MESSAGE_CHARS, so the newest alone always fits.
  const size = (m: CleanMessage) =>
    m.parts.reduce((n, p) => n + p.text.length, 0);
  let total = messages.reduce((n, m) => n + size(m), 0);
  while (total > MAX_REQUEST_CHARS && messages.length > 1) {
    total -= size(messages.shift()!);
  }
  while (messages.length > 1 && messages[0]!.role !== "user") messages.shift();
  const lastUser = messages.findLast((m) => m.role === "user");
  if (!lastUser) {
    return { ok: false, status: 400, error: "A user message is required" };
  }
  const lastUserMessage = lastUser.parts
    .map((p) => p.text)
    .join(" ")
    .slice(0, MAX_RETRIEVAL_CHARS);
  return { ok: true, messages, lastUserMessage };
}

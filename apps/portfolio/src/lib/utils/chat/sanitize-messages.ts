import { z } from "zod";

/** Messages Rin sees: the newest ones only. */
export const MAX_MESSAGES = 10;
/** Characters of text in one message. */
export const MAX_MESSAGE_CHARS = 8_000;
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
 * Validates the client's chat history. Keeps the newest MAX_MESSAGES, accepts only user and
 * assistant roles, keeps text parts and drops everything else (client tool parts included),
 * and drops messages left empty.
 */
export function sanitizeMessages(raw: unknown): SanitizeResult {
  if (!Array.isArray(raw)) {
    return { ok: false, status: 400, error: "messages must be an array" };
  }
  const messages: CleanMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    const parsed = message.safeParse(item);
    if (!parsed.success) {
      return { ok: false, status: 400, error: "Invalid message" };
    }
    const parts: CleanMessage["parts"] = [];
    for (const p of parsed.data.parts) {
      if (
        p.type !== "text" ||
        typeof (p as { text?: unknown }).text !== "string"
      )
        continue;
      const text = (p as { text: string }).text;
      if (text.length > MAX_MESSAGE_CHARS) {
        return { ok: false, status: 413, error: "Message too long" };
      }
      parts.push({ type: "text", text });
    }
    if (parts.length === 0) continue;
    messages.push({ id: parsed.data.id, role: parsed.data.role, parts });
  }
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

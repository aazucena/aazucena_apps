import { z } from "zod";
import { MAX_MESSAGE_CHARS } from "./limits";

/** Messages Rin sees: the newest ones only. */
export const MAX_MESSAGES = 10;
export { MAX_MESSAGE_CHARS };
/** Parts read from one message: the newest ones only. */
const MAX_PARTS = 50;
/** Characters of text in all retained messages together. */
export const MAX_REQUEST_CHARS = 50_000;
/** Characters of the last question sent to knowledge-base retrieval. */
export const MAX_RETRIEVAL_CHARS = 1_000;
/** Stand in for a contact-form tool turn; its input and output are never forwarded. */
const CONTACT_SENT = "(an earlier contact message was sent)";
const CONTACT_NOT_SENT =
  "(an earlier contact submission did not complete; nothing was confirmed as sent)";

/** Sent only when the tool finished and reported success: anything else may need sending again. */
function contactNote(toolPart: object): string {
  const { state, output } = toolPart as {
    state?: unknown;
    output?: { success?: unknown } | null;
  };
  return state === "output-available" && output?.success === true
    ? CONTACT_SENT
    : CONTACT_NOT_SENT;
}

const textPart = z.object({ type: z.literal("text"), text: z.string() });
const otherPart = z.object({ type: z.string() }).loose();
const part = z.union([textPart, otherPart]);

const message = z.object({
  id: z.string().max(200).optional(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.unknown()),
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
 * assistant roles. Text parts are kept (blank ones skipped), a contact-form tool part becomes a
 * plain note, other parts are dropped, and messages left empty are dropped. Only an oversized
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
    const recentParts = z
      .array(part)
      .safeParse(parsed.data.parts.slice(-MAX_PARTS));
    if (!recentParts.success) {
      return { ok: false, status: 400, error: "Invalid message" };
    }
    const isNewestUser =
      index === kept.length - 1 && parsed.data.role === "user";
    const parts: CleanMessage["parts"] = [];
    let used = 0;
    for (const p of recentParts.data) {
      let text: string;
      if (p.type === "tool-submit_contact_form") {
        text = contactNote(p);
      } else if (
        p.type === "text" &&
        typeof (p as { text?: unknown }).text === "string"
      ) {
        text = (p as { text: string }).text;
      } else {
        continue;
      }
      if (!text.trim()) continue;
      if (used + text.length > MAX_MESSAGE_CHARS) {
        if (isNewestUser) {
          return { ok: false, status: 413, error: "Message too long" };
        }
        text = text.slice(0, MAX_MESSAGE_CHARS - used).toWellFormed();
        if (!text.trim()) break;
      }
      used += text.length;
      parts.push({ type: "text", text });
      // the newest user message reads on, so text past the limit is a 413
      if (used >= MAX_MESSAGE_CHARS && !isNewestUser) break;
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
  if (messages.at(-1)?.role !== "user") {
    return { ok: false, status: 400, error: "A user message is required" };
  }
  const lastUser = messages.at(-1)!;
  const lastUserMessage = lastUser.parts
    .map((p) => p.text)
    .join(" ")
    .slice(0, MAX_RETRIEVAL_CHARS)
    .toWellFormed();
  return { ok: true, messages, lastUserMessage };
}

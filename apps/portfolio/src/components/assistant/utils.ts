import { Marked } from "marked";
import type { UIMessage } from "ai";
import { STORAGE_KEY } from "./constants";

export function exportTranscript(messages: UIMessage[]): void {
  const dated = new Date();
  const dateStr = dated.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const timeStr = dated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [
    `# Conversation with Rin`,
    `*Exported ${dateStr} at ${timeStr}*`,
    "",
    "---",
    "",
  ];

  for (const msg of messages) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const label = msg.role === "user" ? "**Visitor**" : "**Rin**";
    const text = (msg.parts ?? [])
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text as string)
      .join("\n")
      .trim();
    if (!text) continue;
    lines.push(label, "", text, "", "---", "");
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rin-conversation-${dateStr}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// Isolated Marked instance — avoids the global marked.use() in MarkdownRenderer
// which patches the singleton with page-level heading classes (text-4xl etc.).
const chatMarked = new Marked({ gfm: true, breaks: true, silent: true });
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  colon: ":",
  tab: "\t",
  newline: "\n",
  lpar: "(",
  rpar: ")",
};

function decodeEntities(value: string): string {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi,
    (match, body: string) => {
      if (body[0] === "#") {
        const code =
          body[1]?.toLowerCase() === "x"
            ? parseInt(body.slice(2), 16)
            : parseInt(body.slice(1), 10);
        return Number.isFinite(code) && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : "";
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? match;
    },
  );
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Returns the URL when it is http, https, mailto or relative, otherwise null. */
function safeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let value = raw;
  // Decode entities and percent escapes (twice, for double encoding), then strip
  // control characters and whitespace before reading the scheme.
  for (let i = 0; i < 2; i += 1) {
    value = decodeEntities(value);
    try {
      value = decodeURIComponent(value);
    } catch {
      // keep the value as is
    }
  }
  const probe = value.replace(
    /[\p{Cc}\u0020\u200b-\u200f\u2028\u2029\ufeff]/gu,
    "",
  );
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(probe);
  if (
    scheme &&
    !["http", "https", "mailto"].includes(scheme[1]!.toLowerCase())
  ) {
    return null;
  }
  return raw;
}

chatMarked.use({
  // Rin writes markdown, so HTML is plain text.
  tokenizer: {
    html: () => undefined,
    tag: () => undefined,
  },
  renderer: {
    // Raw HTML, block or inline, is shown as text.
    html({ text }) {
      return escapeAttr(text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const url = safeUrl(decodeEntities(href));
      if (!url) return inner;
      const t = title ? ` title="${escapeAttr(title)}"` : "";
      return `<a href="${escapeAttr(url)}"${t}>${inner}</a>`;
    },
    image({ href, title, text }) {
      const url = safeUrl(decodeEntities(href));
      if (!url || /^mailto:/i.test(url)) return escapeAttr(text);
      const t = title ? ` title="${escapeAttr(title)}"` : "";
      return `<img src="${escapeAttr(url)}" alt="${escapeAttr(text)}"${t}>`;
    },
  },
});

export function renderMarkdown(text: string): string {
  return chatMarked.parse(text) as string;
}

export function loadPersistedMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UIMessage[];
  } catch {
    return [];
  }
}

/**
 * Output of a finished tool call part, or undefined while it is still running.
 * AI SDK 5+ marks a finished call with state "output-available" (v4 used "result").
 */
export function getToolOutput<T = unknown>(
  part: unknown,
  toolName: string,
): T | undefined {
  const p = part as { type?: string; state?: string; output?: T };
  return p?.type === `tool-${toolName}` && p.state === "output-available"
    ? p.output
    : undefined;
}

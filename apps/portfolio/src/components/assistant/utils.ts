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
chatMarked.use({
  hooks: {
    postprocess: (html) =>
      html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object[\s\S]*?<\/object>/gi, "")
        .replace(/<embed[^>]*>/gi, "")
        .replace(/<base[^>]*>/gi, "")
        .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "")
        .replace(
          /(href|src|action)\s*=\s*["']\s*(javascript|data):[^"']*/gi,
          '$1="#"',
        ),
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

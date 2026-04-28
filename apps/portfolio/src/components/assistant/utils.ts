import { Marked } from "marked";
import type { UIMessage } from "ai";
import { STORAGE_KEY } from "./constants";

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

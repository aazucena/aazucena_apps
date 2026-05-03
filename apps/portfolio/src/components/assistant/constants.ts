export const STORAGE_KEY = "rin_conversation";

export const LOADING_STATUSES = [
  "Searching the archive…",
  "Consulting Aldrin's work…",
  "Tracing the timeline…",
  "Gathering relevant context…",
  "Reading through the projects…",
  "Cross-referencing the record…",
  "Composing a response…",
  "Almost there…",
];

export const POPOVER_SHOWN_KEY = "rin_popover_shown";
export const TRANSPARENCY_KEY = "rin_transparency_v1";
export const MAX_INPUT_WORDS = 200;

export function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith("/projects"))
    return [
      "What projects has Aldrin built?",
      "What's his most recent project?",
      "What tools does Aldrin use?",
      "How can I collaborate with Aldrin?",
    ];
  if (pathname.startsWith("/blog"))
    return [
      "What has Aldrin written about?",
      "What topics does he cover?",
      "What's his background?",
      "How can I reach Aldrin?",
    ];
  return [
    "What does Aldrin specialize in?",
    "Tell me about his recent projects",
    "What's his tech stack?",
    "How can I reach Aldrin?",
  ];
}

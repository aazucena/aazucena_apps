"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Marked } from "marked";
import { Dots, SparklesSolid } from "@aazucena/icons";
import {
  AssistantTrigger,
  Chat,
  ChatFeed,
  ChatMessage,
  ChatAvatar,
  ChatContent,
  ChatBubble,
  ChatInputContainer,
  ChatInputWrapper,
  ChatInputArea,
  ChatInputSubmit,
  ChatSuggestion,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aazucena/ui";

// Isolated Marked instance — avoids the global marked.use() in MarkdownRenderer
// which patches the singleton with page-level heading classes (text-4xl etc.).
const chatMarked = new Marked({ gfm: true, breaks: true, silent: true });
chatMarked.use({
  hooks: {
    postprocess: (html) =>
      html
        // Strip executable elements
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object[\s\S]*?<\/object>/gi, "")
        .replace(/<embed[^>]*>/gi, "")
        .replace(/<base[^>]*>/gi, "")
        // Strip all event handler attributes (onclick, onerror, onload, etc.)
        .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "")
        // Strip javascript: and data: URI schemes
        .replace(
          /(href|src|action)\s*=\s*["']\s*(javascript|data):[^"']*/gi,
          '$1="#"',
        ),
  },
});

function renderMarkdown(text: string): string {
  return chatMarked.parse(text) as string;
}

const STORAGE_KEY = "rin_conversation";

const LOADING_STATUSES = [
  "Searching the archive…",
  "Consulting Aldrin's work…",
  "Tracing the timeline…",
  "Gathering relevant context…",
  "Reading through the projects…",
  "Cross-referencing the record…",
  "Composing a response…",
  "Almost there…",
];

function getSuggestions(pathname: string): string[] {
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

function loadPersistedMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UIMessage[];
  } catch {
    return [];
  }
}

function RinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Orb background */}
      <circle cx="14" cy="14" r="13" fill="currentColor" fillOpacity="0.08" />
      <circle
        cx="14"
        cy="14"
        r="13"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      {/* Observer dots */}
      <circle cx="10" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.85" />
      {/* Highlights */}
      <circle cx="10.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
      <circle cx="18.8" cy="13.2" r="0.7" fill="white" fillOpacity="0.45" />
    </svg>
  );
}

const RinAvatar = () => <RinMark className="text-secondary h-7 w-7 shrink-0" />;
const rinAvatarIcon = <RinMark className="text-secondary h-4 w-4" />;

export default function AssistantChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loadingStatusIdx, setLoadingStatusIdx] = React.useState(0);
  const feedRef = React.useRef<HTMLDivElement | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // @ai-sdk/react v3: api + body go inside DefaultChatTransport;
  // initialMessages → messages; append → sendMessage
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { pathname },
    }),
    messages: loadPersistedMessages(),
  });

  const isLoading = status === "streaming" || status === "submitted";

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [messages]);

  React.useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStatusIdx(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingStatusIdx((s) => (s + 1) % LOADING_STATUSES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [isLoading]);

  function handleClear() {
    setMessages([]);
    setClearDialogOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-[100]"
          : "fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-3"
      }
    >
      {isOpen && (
        <div
          className={
            isExpanded
              ? "bg-background flex h-full w-full flex-col overflow-hidden"
              : "border-border bg-background flex h-[480px] max-h-[60vh] w-80 flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300"
          }
        >
          {/* Header */}
          <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <RinAvatar />
              <span className="text-foreground text-xs font-black tracking-widest uppercase">
                Rin
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* ⋯ overflow menu */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground flex h-[32px] w-[32px] items-center justify-center rounded-md transition-colors"
                    aria-label="More options"
                  >
                    <Dots size={32} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="z-[200] min-w-[160px]"
                >
                  <DropdownMenuLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                    About Rin
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-muted-foreground/80 max-w-[160px] pb-2 text-[10px] font-normal tracking-normal whitespace-normal normal-case">
                    AI guide to Aldrin's portfolio — ask about projects, skills,
                    or how to get in touch.
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setIsExpanded((e) => !e)}
                    className="cursor-pointer text-xs"
                  >
                    {isExpanded ? "Collapse chat" : "Expand chat"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setDropdownOpen(false);
                      setClearDialogOpen(true);
                    }}
                    className="text-destructive focus:text-destructive cursor-pointer text-xs"
                  >
                    Clear conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Close — always explicit */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Feed + Input */}
          <Chat className="flex-1 overflow-hidden">
            <ChatFeed ref={feedRef} className="space-y-4 p-4">
              {messages.length === 0 && (
                <>
                  <ChatMessage role="assistant">
                    <ChatAvatar variant="ai" icon={rinAvatarIcon} />
                    <ChatContent role="assistant">
                      <ChatBubble
                        variant="default"
                        role="assistant"
                        className="space-y-2 p-3 font-sans text-xs [&_li]:text-xs [&_p]:text-xs [&_strong]:text-xs [&_ul]:text-xs"
                      >
                        <p>
                          Hi — I'm <strong>Rin</strong>, the guide to{" "}
                          <strong>Aldrin Azucena</strong>'s portfolio. I know
                          this work well: the projects, the decisions behind
                          them, the skills he's built, and what he's looking for
                          next.
                        </p>
                        <p>Here's what I can help you with:</p>
                        <ul className="text-muted-foreground list-disc space-y-0.5 pl-4">
                          <li>His tech stack, specialties, and experience</li>
                          <li>
                            Details about specific projects and how they were
                            built
                          </li>
                          <li>Career background and what drives his work</li>
                          <li>
                            How to reach Aldrin for collaborations or
                            opportunities
                          </li>
                        </ul>
                        <p className="text-muted-foreground/80 italic">
                          What brings you here today?
                        </p>
                      </ChatBubble>
                    </ChatContent>
                  </ChatMessage>
                  <ChatSuggestion
                    suggestions={getSuggestions(pathname)}
                    onSelectSuggestion={(s) => {
                      if (!isLoading) sendMessage({ text: s });
                    }}
                    className="justify-center [&_button]:h-7 [&_button]:px-2.5 [&_button]:text-[10px]"
                  />
                </>
              )}
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const parts = msg.parts ?? [];

                return (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role as "user" | "assistant"}
                  >
                    {!isUser && (
                      <ChatAvatar variant="ai" icon={rinAvatarIcon} />
                    )}
                    <ChatContent role={msg.role as "user" | "assistant"}>
                      {/* AI SDK v6: render each part by type */}
                      {parts.map((part: any, i: number) => {
                        if (part.type === "text") {
                          return (
                            <ChatBubble
                              key={i}
                              variant={isUser ? "muted" : "default"}
                              role={msg.role as "user" | "assistant"}
                              className="p-3 font-sans text-xs"
                            >
                              {isUser ? (
                                <span>{part.text}</span>
                              ) : (
                                // Content from Claude via controlled Vercel AI Gateway.
                                // chatMarked strips script/iframe tags as extra defence.
                                // eslint-disable-next-line react/no-danger
                                <div
                                  className="[&_a]:text-primary [&_code]:bg-muted text-xs [&_a]:underline [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[10px] [&_em]:opacity-80 [&_li]:mb-0.5 [&_li]:text-xs [&_ol]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:text-xs [&_p]:mb-1.5 [&_p]:text-xs [&_p]:last:mb-0 [&_strong]:font-semibold [&_ul]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:text-xs"
                                  dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(part.text),
                                  }}
                                />
                              )}
                            </ChatBubble>
                          );
                        }
                        // AI SDK v6: tool parts use tool-<toolName> naming
                        if (
                          part.type === "tool-submit_contact_form" &&
                          part.state === "result" &&
                          part.output?.success === true
                        ) {
                          return (
                            <p
                              key={i}
                              className="mt-1 font-mono text-[10px] text-emerald-500"
                            >
                              ✓ Message sent to Aldrin.
                            </p>
                          );
                        }
                        return null;
                      })}
                    </ChatContent>
                  </ChatMessage>
                );
              })}

              {isLoading && (
                <ChatMessage role="assistant">
                  <ChatAvatar variant="ai" icon={rinAvatarIcon} />
                  <ChatContent role="assistant">
                    <ChatBubble
                      variant="default"
                      role="assistant"
                      className="px-4 py-2.5"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex shrink-0 items-center gap-0.5">
                          <span
                            className="h-1 w-1 animate-bounce rounded-full bg-current"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="h-1 w-1 animate-bounce rounded-full bg-current"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="h-1 w-1 animate-bounce rounded-full bg-current"
                            style={{ animationDelay: "300ms" }}
                          />
                        </span>
                        <span className="text-muted-foreground font-sans text-[10px]">
                          {LOADING_STATUSES[loadingStatusIdx]}
                        </span>
                      </span>
                    </ChatBubble>
                  </ChatContent>
                </ChatMessage>
              )}
            </ChatFeed>

            {/* Input */}
            <ChatInputContainer className="px-3 pt-2 pb-3">
              <ChatInputWrapper className="border-foreground/20 bg-muted/30 rounded-xl border-2">
                <ChatInputArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Aldrin's work…"
                  minRows={1}
                  maxRows={4}
                  disabled={isLoading}
                  className="pr-12 text-xs"
                />
                <ChatInputSubmit
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-8 w-8"
                />
              </ChatInputWrapper>
              <p className="text-muted-foreground/50 mt-1.5 text-right text-[9px]">
                <kbd className="font-sans">Shift</kbd> +{" "}
                <kbd className="font-sans">Enter</kbd> for new line
              </p>
            </ChatInputContainer>
          </Chat>
        </div>
      )}

      {/* Clear conversation confirmation */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent
          size="sm"
          className="z-[200]"
          overlayClassName="z-[200]"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your chat history with Rin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!isExpanded && (
        <AssistantTrigger
          variant="default"
          isOpen={isOpen}
          icon={<SparklesSolid size={18} />}
          label="Chat"
          closeLabel="Close"
          tooltipSide="right"
          className="focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary-dark relative right-auto bottom-auto left-auto h-11 w-auto !rotate-0 rounded-full px-4 shadow-lg duration-300 outline-none hover:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setIsOpen((o) => !o)}
        />
      )}
    </div>
  );
}

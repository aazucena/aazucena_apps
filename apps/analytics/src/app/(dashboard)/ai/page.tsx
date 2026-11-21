'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Activity, Send, Sparkles, Copy, Trash, Check, Plus } from '@aazucena/icons';
import {
  Button,
  Panel,
  PanelBody,
  PanelHeader,
  ScrollArea,
  Skeleton,
  Textarea,
} from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  clearAllHistory,
  createNewChat,
  switchConversation,
  deleteConversation,
  type Conversation,
} from '@/store';

const AVAILABLE_MODELS = [
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
];

function AiTerminalContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);
  const activeConv = activeConversationId ? conversations[activeConversationId] : null;

  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]!.id);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydration guard, fires once on mount
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Object.keys(conversations).length === 0) {
      dispatch(createNewChat());
    }
  }, [conversations, dispatch]);

  const { status, sendMessage, messages, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/chat' }),
  });

  const isLoading = status === 'streaming';

  const sendQuery = useCallback(
    (query: string) => {
      if (!query.trim() || isLoading) return;
      sendMessage({ text: query }, { body: { modelId: selectedModel } });
      setInput('');
    },
    [isLoading, sendMessage, selectedModel],
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sortedConvs = useMemo(
    () => Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (q && !isLoading && isMounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: q param is cleared immediately after, no cascade
      sendQuery(q);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('q');
      router.replace(`/ai${newParams.toString() ? `?${newParams.toString()}` : ''}`, {
        scroll: false,
      });
    }
  }, [q, isLoading, isMounted, sendQuery, searchParams, router]);

  const liveIdx = messages[messages.length - 1]?.role === 'assistant' ? messages.length - 1 : -1;
  const activeModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel);
  const isDisabled = isLoading || (isMounted && !activeConversationId);

  const renderMessage = (m: (typeof messages)[number]) => {
    return (
      <div key={m.id} className="flex flex-col gap-1.5">
        <span className="micro-label text-signal">
          {m.role === 'user' ? 'OPERATOR' : 'AI_CORE'}
        </span>
        <div
          className={cn(
            'rounded-control border px-4 py-3 text-sm leading-relaxed',
            m.role === 'user' ? 'bg-state border-transparent' : 'border-rule-strong',
          )}
        >
          {m.parts.map((part, i) => {
            if (part.type === 'text') return <MarkdownRenderer key={i} content={part.text} />;
            if (part.type === 'reasoning')
              return (
                <details
                  key={i}
                  open
                  className="bg-panel-raised border-rule rounded-control my-3 border font-mono"
                >
                  <summary className="micro-label text-muted-foreground cursor-pointer px-3 py-2">
                    INTERNAL_REASONING
                  </summary>
                  <p className="text-muted-foreground px-3 pb-3 text-xs whitespace-pre-wrap">
                    {part.text}
                  </p>
                </details>
              );
            return null;
          })}

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(
                  m.id,
                  m.parts
                    .filter((p) => p.type === 'text')
                    .map((p) => (p as { type: 'text'; text: string }).text)
                    .join('\n'),
                )
              }
              disabled={isLoading}
              className={cn('micro-label h-6 px-2', copiedId === m.id && 'text-success')}
            >
              {copiedId === m.id ? (
                <>
                  <Check size={12} /> COPIED
                </>
              ) : (
                <>
                  <Copy size={12} /> COPY
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 flex h-[calc(100vh-8rem)] gap-4">
      {/* CONVERSATIONS */}
      <Panel
        className={cn(
          'min-h-0 shrink-0 overflow-hidden',
          isSidebarOpen ? 'w-64 max-lg:w-52' : 'hidden',
        )}
      >
        <PanelHeader label="CONVERSATIONS">
          <span className="micro-label text-signal flex items-center gap-1.5">
            <span aria-hidden className="bg-signal size-1.5 rounded-full" />
            {isMounted ? sortedConvs.length : 0}
          </span>
        </PanelHeader>
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              dispatch(createNewChat());
              setMessages([]);
            }}
          >
            <Plus size={14} /> New Chat
          </Button>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1 px-3 pb-3">
            {isMounted &&
              sortedConvs.map((conv: Conversation) => (
                <div key={conv.id} className="group relative">
                  <button
                    onClick={() => {
                      dispatch(switchConversation(conv.id));
                      setMessages([]);
                    }}
                    aria-current={activeConversationId === conv.id ? 'true' : undefined}
                    className={cn(
                      'rounded-control focus-visible:outline-signal w-full border-l-2 px-3 py-2.5 pr-10 text-left outline-none focus-visible:outline-1',
                      activeConversationId === conv.id
                        ? 'border-l-signal bg-state text-foreground'
                        : 'text-muted-foreground hover:bg-state hover:text-foreground border-l-transparent',
                    )}
                  >
                    <p className="truncate text-sm leading-tight font-medium">{conv.title}</p>
                    <p className="micro-label text-muted-foreground mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete conversation "${conv.title}"?`)) {
                        setDeletingId(conv.id);
                        setTimeout(() => {
                          dispatch(deleteConversation(conv.id));
                          setDeletingId(null);
                        }, 1000);
                      }
                    }}
                    className={cn(
                      'rounded-control focus-visible:outline-signal absolute top-1/2 right-2 -translate-y-1/2 p-1.5 outline-none focus-visible:outline-1',
                      deletingId === conv.id
                        ? 'text-success'
                        : 'text-muted-foreground hover:text-alert opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
                    )}
                    aria-label={`Delete conversation ${conv.title}`}
                    disabled={deletingId === conv.id}
                  >
                    {deletingId === conv.id ? <Check size={14} /> : <Trash size={14} />}
                  </button>
                </div>
              ))}
          </div>
        </ScrollArea>
        <div className="border-rule border-t p-3">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => {
              dispatch(clearAllHistory());
              setMessages([]);
            }}
          >
            <Trash size={14} /> Clear All
          </Button>
        </div>
      </Panel>

      {/* THREAD */}
      <Panel className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <PanelHeader label={`AI_CORE // ${isMounted ? (activeConv?.title ?? 'THREAD') : 'THREAD'}`}>
          <div className="flex shrink-0 items-center gap-3">
            <span className="xl:hidden">
              <label htmlFor="ai-model-compact" className="sr-only">
                Model
              </label>
              <select
                id="ai-model-compact"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border border-rule-strong h-control-sm rounded-control text-foreground focus-visible:outline-signal bg-transparent px-3 text-sm outline-none focus-visible:outline-1"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id} className="bg-panel">
                    {model.name}
                  </option>
                ))}
              </select>
            </span>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-pressed={isSidebarOpen}
              className="micro-label text-muted-foreground hover:text-foreground focus-visible:outline-signal outline-none focus-visible:outline-1"
            >
              {isSidebarOpen ? 'HIDE LIST' : 'SHOW LIST'}
            </button>
            <span
              className={cn(
                'micro-label flex items-center gap-1.5',
                isLoading ? 'text-signal' : 'text-muted-foreground',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'size-1.5 rounded-full',
                  isLoading ? 'bg-signal motion-safe:animate-pulse' : 'bg-rule-strong',
                )}
              />
              {isLoading ? 'INFERENCE_ACTIVE' : 'IDLE'}
            </span>
          </div>
        </PanelHeader>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Sparkles size={24} className="text-muted-foreground" />
              <p className="micro-label text-muted-foreground">CORE READY FOR ANALYSIS</p>
            </div>
          )}

          {messages.slice(0, liveIdx < 0 ? messages.length : liveIdx).map(renderMessage)}
          <div aria-live="polite">{liveIdx >= 0 && renderMessage(messages[liveIdx]!)}</div>

          {isLoading && (
            <div className="flex flex-col gap-1.5" role="status" aria-label="Inference running">
              <span className="micro-label text-signal">AI_CORE</span>
              <div className="border-rule-strong rounded-control max-w-md space-y-2 border p-4">
                <Skeleton className="h-2 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
          )}
        </div>

        <div className="border-rule border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuery(input);
            }}
            className="flex items-end gap-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendQuery(input);
                }
              }}
              aria-label="Message the core"
              placeholder="Ask the core about telemetry, costs or errors..."
              disabled={isDisabled}
              rows={Math.min(5, input.split('\n').length || 1)}
              className="border-rule-strong min-h-control flex-1 resize-none font-mono text-xs md:text-xs"
            />
            <Button type="submit" disabled={isDisabled || !input.trim()}>
              <Send size={14} /> Send
            </Button>
          </form>
          <p className="micro-label text-muted-foreground mt-3 flex flex-wrap gap-x-3">
            <span>ENTER TO INFER</span>
            <span aria-hidden>·</span>
            <span>SHIFT + ENTER FOR A NEW LINE</span>
            <span aria-hidden>·</span>
            <span>{messages.length} MESSAGES</span>
          </p>
        </div>
      </Panel>

      {/* SESSION CONTEXT */}
      <Panel className="min-h-0 w-64 shrink-0 overflow-y-auto max-xl:hidden">
        <PanelHeader label="SESSION // CONTEXT" />
        <PanelBody className="gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ai-model" className="micro-label text-muted-foreground">
              MODEL
            </label>
            <select
              id="ai-model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border border-rule-strong h-control rounded-control text-foreground focus-visible:outline-signal bg-transparent px-3 text-sm outline-none focus-visible:outline-1"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id} className="bg-panel">
                  {model.name}
                </option>
              ))}
            </select>
            <span className="micro-label text-muted-foreground">{activeModel?.provider}</span>
          </div>
          <dl className="flex flex-col gap-3">
            {['TOKENS IN', 'TOKENS OUT', 'LATENCY', 'COST'].map((k) => (
              <div key={k} className="flex items-baseline justify-between">
                <dt className="micro-label text-muted-foreground">{k}</dt>
                <dd className="text-muted-foreground font-mono text-sm">—</dd>
              </div>
            ))}
          </dl>
          <div className="border-rule border-t pt-3">
            <p className="micro-label text-muted-foreground mb-2">TOOLS AVAILABLE</p>
            <p className="text-muted-foreground font-mono text-sm">—</p>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

export default function AiTerminalPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mt-6 flex h-[calc(100vh-8rem)] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Activity className="text-signal size-6 motion-safe:animate-pulse" />
            <p className="micro-label text-muted-foreground text-center">
              INITIALIZING CORE // LOADING CONTEXT
            </p>
          </div>
        </div>
      }
    >
      <AiTerminalContent />
    </React.Suspense>
  );
}

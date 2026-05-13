'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Activity,
  Send,
  Terminal as TerminalIcon,
  Sparkles,
  Copy,
  Trash,
  Check,
  Plus,
  Puzzle,
} from '@aazucena/icons';
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
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
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

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* SIDEBAR */}
      <div
        className={cn(
          'flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] transition-all duration-300 overflow-hidden shadow-2xl shadow-black/5',
          isSidebarOpen ? 'w-72' : 'w-0 opacity-0 -translate-x-10',
        )}
      >
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <Activity size={14} /> History
          </h2>
          <button
            onClick={() => {
              dispatch(createNewChat());
              setMessages([]);
            }}
            className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
          {isMounted &&
            sortedConvs.map((conv: Conversation) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => {
                    dispatch(switchConversation(conv.id));
                    setMessages([]);
                  }}
                  className={cn(
                    'w-full p-4 pr-12 rounded-2xl text-left transition-all border flex items-start gap-3',
                    activeConversationId === conv.id
                      ? 'bg-primary-500/5 border-primary-500/30 text-primary-500'
                      : 'bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
                  )}
                >
                  <Puzzle size={14} className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate leading-tight">{conv.title}</p>
                    <p className="text-[8px] font-mono opacity-50 mt-1 uppercase">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
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
                    'absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all z-20 shadow-sm border',
                    deletingId === conv.id
                      ? 'bg-emerald-500 text-white border-emerald-600 opacity-100 scale-110 shadow-emerald-500/20'
                      : 'opacity-60 hover:opacity-100 bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white hover:scale-110',
                  )}
                  title="Delete Chat"
                  disabled={deletingId === conv.id}
                >
                  {deletingId === conv.id ? <Check size={16} /> : <Trash size={16} />}
                </button>
              </div>
            ))}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => {
              dispatch(clearAllHistory());
              setMessages([]);
            }}
            className="w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <Trash size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                'p-3 rounded-2xl border transition-all',
                isSidebarOpen
                  ? 'bg-primary-500 text-white border-primary-600'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800',
              )}
            >
              <Activity size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-2">
                AI_CORE<span className="text-primary-500">_TERMINAL</span>
              </h1>
              <p className="text-zinc-500 text-[9px] font-mono uppercase font-bold tracking-widest leading-none">
                Intelligence Interface
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  selectedModel === model.id
                    ? 'bg-white dark:bg-zinc-800 text-primary-500 shadow-sm border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                )}
              >
                {model.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES VIEW */}
        <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-primary-500/5">
          <div className="px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <p className="text-zinc-900 dark:text-zinc-100 text-[11px] font-black uppercase tracking-widest truncate">
                {isMounted ? activeConv?.title || 'New Conversation' : 'New Conversation'}
              </p>
              <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                <TerminalIcon
                  size={12}
                  className={cn(isLoading ? 'text-primary-500 animate-spin' : 'text-zinc-400')}
                />
                status:{' '}
                <span className={cn(isLoading ? 'text-primary-500' : 'text-zinc-500')}>
                  {isLoading ? 'INFERENCE_ACTIVE' : 'IDLE'}
                </span>
              </div>
            </div>

            <div className="text-[9px] font-mono text-emerald-500 font-black animate-pulse uppercase ml-6 shrink-0 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              [{selectedModel.replace('/', '_')}]
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <Activity size={32} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  Core Ready for Analysis
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-4 group/msg',
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover/msg:scale-110',
                    m.role === 'user'
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      : 'bg-primary-500/10 border-primary-500/20 text-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
                  )}
                >
                  {m.role === 'user' ? <Activity size={16} /> : <Sparkles size={16} />}
                </div>

                <div
                  className={cn(
                    'flex flex-col max-w-[85%] relative group/bubble',
                    m.role === 'user' ? 'items-end text-right' : 'items-start text-left',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {m.role === 'user' ? 'Operator' : 'AI_Core'}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'p-5 rounded-2xl text-sm font-mono leading-relaxed transition-all border group relative shadow-sm',
                      m.role === 'user'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tr-none border-zinc-200 dark:border-zinc-800'
                        : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none',
                    )}
                  >
                    {m.parts.map((part, i) => {
                      if (part.type === 'text')
                        return <MarkdownRenderer key={i} content={part.text} />;
                      if (part.type === 'reasoning')
                        return (
                          <div
                            key={i}
                            className="text-[11px] text-zinc-500 italic border-l-2 border-primary-500/30 pl-3 my-3 font-mono bg-primary-500/5 py-2 rounded-r-lg"
                          >
                            <span className="text-[9px] font-black text-primary-500/50 block mb-1 uppercase tracking-tighter">
                              INTERNAL_REASONING
                            </span>
                            {part.text}
                          </div>
                        );
                      return null;
                    })}

                    <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2 opacity-30 group-hover/msg:opacity-100 transition-all duration-300">
                      <button
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
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-md transition-all text-[9px] font-black uppercase tracking-tighter border',
                          copiedId === m.id
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'hover:bg-primary-500/10 hover:text-primary-500 text-zinc-500 border-transparent hover:border-primary-500/20',
                        )}
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 animate-pulse">
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                  <div className="max-w-[400px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl animate-pulse">
                    <div className="space-y-2">
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(input);
              }}
              className="relative flex items-end gap-3"
            >
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendQuery(input);
                    }
                  }}
                  placeholder="ENTER_COMMAND_FOR_AI_ANALYSIS..."
                  disabled={isLoading || (isMounted && !activeConversationId)}
                  rows={Math.min(5, input.split('\n').length || 1)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-6 pr-14 py-4 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all shadow-inner resize-none min-h-[56px] scrollbar-none"
                />
                <div className="absolute right-3 bottom-3">
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || (isMounted && !activeConversationId)}
                    className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 flex items-center justify-between px-2 text-[8px] font-mono text-zinc-400 uppercase">
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" /> {messages.length} messages
              </span>
              <div className="flex items-center gap-3">
                <span>Shift+Enter for newline</span>
                <span className="text-primary-500 font-black">Enter to infer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiTerminalPage() {
  return (
    <React.Suspense
      fallback={
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Activity className="w-8 h-8 text-primary-500 animate-pulse" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
              Initializing_Neural_Core...
              <br />
              Loading_System_Context
            </p>
          </div>
        </div>
      }
    >
      <AiTerminalContent />
    </React.Suspense>
  );
}

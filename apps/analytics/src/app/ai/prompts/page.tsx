// apps/analytics/src/app/ai/prompts/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Terminal, 
  Sparkles, 
  Save, 
  Refresh, 
  Database, 
  ChevronRight,
  Zap,
  Message,
  XCircle,
  DangerTriangle
} from '@mynaui/icons-react';
import { cn } from '@/lib/utils';
import { usePrompts, useUpdatePrompt } from '@/hooks/usePrompts';
import type { Prompt } from '@/lib/transformers/prompt';

export default function PromptManagerPage() {
  // --- Data Fetching ---
  const { data: prompts = [], isLoading: isPromptsLoading, error: promptsError } = usePrompts();
  console.log("🚀 ~ PromptManagerPage ~ prompts:", prompts)
  const updateMutation = useUpdatePrompt();
  
  // --- Local UI State ---
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [forceReset, setForceReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'lab'>('editor');
  
  // --- Editor Form State ---
  const [systemMsg, setSystemMsg] = useState("");
  const [humanTmpl, setHumanTemplate] = useState("");
  const [description, setDescription] = useState("");
  
  // --- Lab State ---
  const [testVariables, setTestVariables] = useState<Record<string, string>>({
    input: "How do I start the monorepo?",
    context: "The monorepo uses pnpm and Turborepo. Run 'pnpm dev' to start all apps."
  });
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Derived: Current Selected Prompt
  const selectedPrompt = useMemo(() => 
    prompts.find(p => p.id === selectedPromptId) || prompts[0],
  [prompts, selectedPromptId]);

  // Sync selection to first prompt on load
  useEffect(() => {
    if (prompts.length > 0 && !selectedPromptId) {
      setSelectedPromptId(prompts[0]!.id);
    }
  }, [prompts, selectedPromptId]);

  // Sync form state when selection changes
  useEffect(() => {
    if (selectedPrompt) {
      setSystemMsg(selectedPrompt.systemMessage);
      setHumanTemplate(selectedPrompt.humanTemplate || "");
      setDescription(selectedPrompt.description || "");
      setTestResult("");
    }
  }, [selectedPrompt]);

  // --- Handlers ---
  const handleSave = async () => {
    if (!selectedPrompt) return;
    
    try {
      await updateMutation.mutateAsync({
        id: selectedPrompt.id,
        data: {
          systemMessage: systemMsg,
          humanTemplate: humanTmpl,
          description: description,
        }
      });
    } catch (e) {
      console.error('Failed to save prompt:', e);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // communicates with the Intel Engine directly to pull latest from Strapi
      const res = await fetch(`/api/brain/sync${forceReset ? '?force=true' : ''}`, { method: 'POST' });
      if (!res.ok) throw new Error('SYNC_FAILED');
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const runTest = async () => {
    setIsTesting(true);
    try {
      // Simulated logic test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult(`[SIMULATED_LLM_RESPONSE]: Synthesized successfully using instructions from ${selectedPrompt?.name}. Logic validation status: 100%.`);
    } finally {
      setIsTesting(false);
    }
  };

  // Stats calculation
  const totalChars = systemMsg.length + humanTmpl.length;
  const estTokens = Math.ceil(totalChars / 4);
  const estCost = (estTokens / 1000000 * 10).toFixed(6);

  // --- Loading/Error Views ---
  if (isPromptsLoading) return <div className="h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500 animate-pulse">Initializing_Prompt_Hub...</div>;
  if (promptsError) return <div className="h-full flex items-center justify-center text-rose-500 font-mono text-xs uppercase"><XCircle className="mr-2" size={16} /> Hub_Connection_Failed</div>;

  return (
    <div className="space-y-10 pb-20 h-[calc(100vh-10rem)] flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            PROMPT<span className="text-primary-500">_LABS</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold text-wrap">
            Centralized Intelligence Instructions & Template IDE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end px-4 border-r border-zinc-200 dark:border-zinc-800">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Est_Payload_Cost</span>
            <span className="text-xs font-mono font-black text-primary-500">${estCost}</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={forceReset}
                  onChange={(e) => setForceReset(e.target.checked)}
                  className="sr-only" 
                />
                <div className={cn(
                  "block w-8 h-5 rounded-full border transition-all",
                  forceReset ? "bg-rose-500/20 border-rose-500/40" : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                )}></div>
                <div className={cn(
                  "absolute left-1 top-1 w-3 h-3 rounded-full transition-all",
                  forceReset ? "translate-x-3 bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-zinc-400 dark:bg-zinc-500"
                )}></div>
              </div>
              <span className={cn(
                "ml-2 text-[8px] font-black uppercase tracking-widest transition-colors",
                forceReset ? "text-rose-500" : "text-zinc-400 group-hover:text-zinc-300"
              )}>Force_Reset</span>
            </label>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-primary-500 transition-all disabled:opacity-50"
            >
              <Refresh size={14} className={cn(isSyncing && "animate-spin")} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* SIDEBAR: PROMPT LIST */}
        <div className="xl:col-span-1 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Database size={12} /> Templates
            </h3>
            <span className="text-[8px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase">
              {prompts.length}_Stored
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPromptId(p.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                  selectedPrompt?.id === p.id 
                    ? "bg-primary-500 border-primary-600 text-white shadow-lg"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between mb-1 relative z-10">
                  <div className="flex gap-2">
                    <span className="text-[8px] font-mono font-bold opacity-70 uppercase tracking-tighter">
                      {p.type}
                    </span>
                    {p.locale !== 'en' && (
                      <span className="text-[8px] font-mono font-black text-primary-500 bg-primary-500/10 px-1 rounded">
                        {p.locale.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="text-xs font-black uppercase tracking-wider truncate relative z-10">
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN: EDITOR/LAB VIEW */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-primary-500/5">
            {/* Editor Header & Tabs */}
            <div className="px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-primary-500" />
                  <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
                    {selectedPrompt?.name}
                  </span>
                </div>
                <div className="flex items-center bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('editor')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'editor' ? "bg-white dark:bg-zinc-700 text-primary-500 shadow-sm" : "text-zinc-500"
                    )}
                  >Editor</button>
                  <button 
                    onClick={() => setActiveTab('lab')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'lab' ? "bg-white dark:bg-zinc-700 text-rose-500 shadow-sm" : "text-zinc-500"
                    )}
                  >Test_Lab</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-4 py-1.5 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                >
                  {updateMutation.isPending ? <Refresh className="animate-spin" size={14} /> : <Save size={14} />} 
                  {updateMutation.isPending ? 'Committing...' : 'Commit_Changes'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {activeTab === 'editor' ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* System Message */}
                    <div className="space-y-3 flex flex-col h-[450px]">
                      <div className="flex justify-between items-center shrink-0">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                          <Sparkles size={12} /> System_Persona
                        </label>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">{systemMsg.length} Chars</span>
                      </div>
                      <textarea 
                        value={systemMsg}
                        onChange={(e) => setSystemMsg(e.target.value)}
                        className="flex-1 w-full bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-sm font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none shadow-inner leading-relaxed"
                      />
                    </div>

                    {/* Human Template */}
                    <div className="space-y-3 flex flex-col h-[450px]">
                      <div className="flex justify-between items-center shrink-0">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                          <Message size={12} /> Interaction_Template
                        </label>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">{humanTmpl.length} Chars</span>
                      </div>
                      <textarea 
                        value={humanTmpl}
                        onChange={(e) => setHumanTemplate(e.target.value)}
                        className="flex-1 w-full bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-sm font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none shadow-inner leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Variables Discovery */}
                  <div className="p-6 bg-primary-500/5 border border-primary-500/10 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider">Variables Detected</p>
                        <div className="flex gap-2 mt-1">
                          {['input', 'context'].map(v => (
                            <code key={v} className="text-[9px] font-mono bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-primary-500">{`{${v}}`}</code>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Est_Token_Volume</p>
                          <p className="text-xs font-mono font-black text-zinc-600 dark:text-zinc-300">~{estTokens}</p>
                       </div>
                       <button 
                        onClick={() => setActiveTab('lab')}
                        className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors text-[10px] font-black uppercase tracking-widest"
                       >
                        Go_to_Lab <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* TEST LAB VIEW */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full pb-8">
                  <div className="space-y-6 flex flex-col">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Simulation_Inputs</h4>
                    <div className="space-y-4 flex-1">
                      {['input', 'context'].map(v => (
                        <div key={v} className="space-y-2">
                          <label className="text-[9px] font-mono text-primary-500 uppercase">{v}</label>
                          <textarea 
                            value={testVariables[v]}
                            onChange={(e) => setTestVariables(prev => ({...prev, [v]: e.target.value}))}
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none resize-none h-32"
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={runTest}
                      disabled={isTesting}
                      className="w-full py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isTesting ? 'Synthesizing_Inference...' : 'Run_Logic_Test'}
                    </button>
                  </div>

                  <div className="flex flex-col space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Inference_Output</h4>
                    <div className="flex-1 bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-inner relative overflow-hidden group">
                      <div className="absolute top-4 right-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">Status: Success</span>
                      </div>
                      <div className="h-full flex flex-col">
                        <pre className="flex-1 text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {testResult || (isTesting ? 'Awaiting response from neural core...' : 'Ready for test execution...')}
                        </pre>
                        {testResult && (
                          <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-center">
                            <span className="text-[8px] font-mono text-zinc-600 uppercase italic">Inference produced in 1042ms</span>
                            <button className="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:underline">Copy_Output</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Database,
  Terminal,
  Components,
  ArrowRight,
  Copy,
  Check,
  CheckCircle,
  Sparkles,
  Search,
  Message,
  ChartBar,
  CreditCard,
  HardDrive,
  ClockCircle,
  Refresh,
} from '@mynaui/icons-react';
import { NeuralMap } from '@/components/visualizations/NeuralMap';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

// --- MOCK TYPES ---
interface TrajectoryStep {
  step: number;
  observation: string;
  action: string;
  reward: number;
  probability: number;
  metadata: Record<string, any>;
}

interface Trajectory {
  id: string;
  agent: string;
  timestamp: string;
  totalReward: number;
  length: number;
  steps: TrajectoryStep[];
}

// --- COMPONENTS ---

/**
 * A clean, recursive JSON viewer for engineering diagnostics
 */
const JsonView = ({
  data,
  keyName,
  level = 0,
}: {
  data: any;
  keyName?: string;
  level?: number;
}) => {
  if (data === null) return <span className="text-rose-500/50 italic">null</span>;
  if (typeof data === 'boolean') {
    return (
      <span
        className={cn(
          'font-bold px-1.5 py-0.5 rounded text-[10px]',
          keyName === 'is_valid' && data === false
            ? 'bg-rose-500 text-white animate-pulse'
            : keyName === 'is_valid' && data === true
              ? 'bg-emerald-500 text-white'
              : 'text-amber-500',
        )}
      >
        {data.toString().toUpperCase()}
      </span>
    );
  }
  if (typeof data === 'number') return <span className="text-emerald-500 font-mono">{data}</span>;

  if (typeof data === 'string') {
    const isShade = data.includes('[KNOWLEDGE_SOURCE]') || data.startsWith('---');
    const isMarkdownField =
      keyName?.toLowerCase().includes('reasoning') ||
      keyName?.toLowerCase() === 'content' ||
      keyName?.toLowerCase() === 'thought' ||
      (level === 0 && data.length > 20) ||
      isShade;

    const isInvalid = data.toUpperCase().startsWith('INVALID');

    if (isMarkdownField) {
      return (
        <div
          className={cn(
            'border-l-2 pl-4 py-3 my-2 rounded-r-xl transition-colors',
            isInvalid
              ? 'bg-rose-500/10 border-rose-500/50'
              : isShade
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-primary-500/5 border-primary-500/30',
            level === 0 ? 'w-full' : 'w-auto',
          )}
        >
          {isInvalid && (
            <div className="flex items-center gap-2 mb-2 text-rose-500 font-black text-[9px] uppercase tracking-tighter">
              <Activity size={12} /> Audit_Discrepancy_Detected
            </div>
          )}
          {isShade && (
            <div className="flex items-center gap-2 mb-2 text-emerald-500 font-black text-[9px] uppercase tracking-tighter">
              <Database size={12} /> Ground_Truth_Shade
            </div>
          )}
          <MarkdownRenderer
            content={data}
            className={cn(
              'text-sm leading-relaxed prose-invert prose-p:mb-3 last:prose-p:mb-0 prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-code:text-primary-500 prose-strong:text-zinc-900 dark:prose-strong:text-white',
              isInvalid
                ? 'text-rose-200'
                : isShade
                  ? 'text-emerald-700 dark:text-emerald-200'
                  : 'text-zinc-700 dark:text-zinc-200',
            )}
          />
        </div>
      );
    }
    return (
      <span
        className={cn(
          'break-words leading-relaxed',
          isInvalid ? 'text-rose-500 font-bold' : 'text-zinc-600 dark:text-zinc-300',
        )}
      >
        "{data}"
      </span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-zinc-500">[]</span>;
    return (
      <div className="flex flex-col gap-1">
        {data.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[10px] shrink-0">
              [{i}]
            </span>
            <JsonView data={item} level={level + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="text-zinc-500">{}</span>;

    // DETECT AUDIT FAILURE AT OBJECT LEVEL
    const hasFailedAudit = data['is_valid'] === false;

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5 transition-all',
          level > 0 && 'pl-4 border-l border-zinc-200 dark:border-zinc-800 ml-1 py-1',
          hasFailedAudit &&
            'bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 my-2 shadow-lg shadow-rose-500/5',
        )}
      >
        {hasFailedAudit && (
          <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest animate-pulse">
            <CheckCircle size={14} /> Critical_Audit_Failure
          </div>
        )}
        {keys.map((key) => (
          <div key={key} className="flex flex-col sm:flex-row sm:gap-2 items-start">
            <span
              className={cn(
                'font-black uppercase text-[9px] tracking-tighter shrink-0 mt-0.5',
                key === 'is_valid' && data[key] === false ? 'text-rose-500' : 'text-primary-500',
              )}
            >
              {key}:
            </span>
            <div className="flex-1 min-w-0">
              <JsonView data={data[key]} keyName={key} level={level + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export default function TrajectoryLabsPage() {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [selectedTrajectory, setSelectedTrajectory] = useState<Trajectory | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrajectories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stats/trajectories');
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setTrajectories(json.data);
        // If we already have a selected trajectory, update it with the fresh data
        if (selectedTrajectory) {
          const updated = json.data.find((t: Trajectory) => t.id === selectedTrajectory.id);
          if (updated) setSelectedTrajectory(updated);
        } else {
          setSelectedTrajectory(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load trajectories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajectories();
  }, []);

  const currentStep = useMemo(
    () => selectedTrajectory?.steps[currentStepIndex],
    [selectedTrajectory, currentStepIndex],
  );

  const parsedObservation = useMemo(() => {
    const obs = currentStep?.observation;
    if (!obs) return null;
    try {
      if (obs.trim().startsWith('{') || obs.startsWith('[')) return JSON.parse(obs);
      const jsonStart = obs.indexOf('{');
      if (jsonStart !== -1) {
        const prefix = obs.substring(0, jsonStart).trim();
        const possibleJson = obs.substring(jsonStart).trim();
        try {
          return { _info: prefix, ...JSON.parse(possibleJson) };
        } catch {}
      }
      return obs;
    } catch {
      return obs;
    }
  }, [currentStep]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && selectedTrajectory) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % selectedTrajectory.steps.length);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedTrajectory]);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            TRAJECTORY<span className="text-primary-500">_LABS</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Agent Decision Playback & Behavioral Analysis
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-2xl shrink-0 self-start">
          <Activity size={14} className="text-primary-500 animate-pulse" />
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
            Neural_Sync_Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-14rem)] min-h-[600px]">
        {/* SIDEBAR: SEQUENCES */}
        <div className="xl:col-span-1 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Database size={12} /> Recent Sequences
            </h3>
            <button
              onClick={fetchTrajectories}
              disabled={isLoading}
              className={cn(
                'p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-primary-500',
                isLoading && 'animate-spin text-primary-500',
              )}
              title="Refresh Data"
            >
              <Refresh size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pr-2 -mr-1">
              {isLoading ? (
                <div className="py-20 text-center animate-pulse text-[10px] font-mono text-zinc-500 uppercase">
                  Sequencing_Neural_Logs...
                </div>
              ) : trajectories.length === 0 ? (
                <div className="py-20 text-center text-[10px] font-mono text-zinc-500 uppercase italic">
                  No_Trajectories_Detected
                </div>
              ) : (
                trajectories.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrajectory(t);
                      setCurrentStepIndex(0);
                    }}
                    className={cn(
                      'w-full p-4 rounded-2xl border text-left transition-all group',
                      selectedTrajectory?.id === t.id
                        ? 'bg-primary-500 border-primary-600 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-primary-500/30',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold opacity-70 truncate max-w-[100px]">
                        {t.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold">
                        R: {t.totalReward.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'text-xs font-black uppercase tracking-wider truncate',
                        selectedTrajectory?.id === t.id
                          ? 'text-white'
                          : 'text-zinc-900 dark:text-zinc-100',
                      )}
                    >
                      {t.agent}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[8px] font-black',
                          selectedTrajectory?.id === t.id
                            ? 'bg-white/20'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500',
                        )}
                      >
                        {t.length} STEPS
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MAIN VIEWPORT */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-h-0">
          {/* 1. TOP: NEURAL ARCHITECTURE (The Context) */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm h-40 shrink-0">
            <div className="px-6 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Components size={12} /> Active_Neural_Path
              </span>
              <div className="text-[9px] font-mono text-primary-500 font-black uppercase tracking-widest">
                Node_Playback: {selectedTrajectory?.id || 'IDLE'}
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10">
              <NeuralMap
                steps={selectedTrajectory?.steps || []}
                currentStepIndex={currentStepIndex}
              />
            </div>
          </div>

          {/* 2. MIDDLE: PLAYBACK CONTROLS & KPI (The Decision) */}
          <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-xl shadow-primary-500/5 min-h-0">
            <div className="px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="text-[10px] font-mono text-primary-500 font-black uppercase tracking-[0.2em]">
                  Step_{(currentStepIndex + 1).toString().padStart(3, '0')} /{' '}
                  {selectedTrajectory?.length || 0}
                </div>
                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentStepIndex(
                        Math.min((selectedTrajectory?.length || 1) - 1, currentStepIndex + 1),
                      )
                    }
                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                    Outcome_Reward
                  </div>
                  <div
                    className={cn(
                      'text-lg font-black font-mono leading-none',
                      (currentStep?.reward ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500',
                    )}
                  >
                    {(currentStep?.reward ?? 0) >= 0 ? '+' : ''}
                    {currentStep?.reward ?? 0}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                    Decision_Confidence
                  </div>
                  <div className="text-lg font-black font-mono leading-none text-zinc-900 dark:text-zinc-100">
                    {((currentStep?.probability || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BOTTOM: SENSORY DATA (The "Meat") */}
            <div className="flex-1 p-8 min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Decision Insight (Small side bar) */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto scrollbar-none pr-2">
                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Cognitive_Decision
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-start gap-3">
                      <ArrowRight size={16} className="text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase leading-snug break-words">
                        {currentStep?.action || 'IDLE'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Step_Metadata
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 relative group/meta h-48 overflow-y-auto scrollbar-none">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(currentStep?.metadata || {}, null, 2),
                          )
                        }
                        className="absolute top-3 right-3 opacity-0 group-hover/meta:opacity-100 p-1.5 bg-primary-500 text-white rounded-lg transition-all shadow-lg"
                      >
                        <Copy size={12} />
                      </button>
                      <pre className="text-[10px] font-mono text-emerald-500/80 leading-relaxed">
                        {JSON.stringify(currentStep?.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Main Sensory Input (Large area) */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-0 space-y-2">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Agent_Sensory_Input (Observation)
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentStep?.observation || '')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-500 rounded-xl text-[9px] font-black hover:bg-primary-500 hover:text-white transition-all"
                    >
                      <Copy size={12} /> Copy Raw
                    </button>
                  </div>
                  <div className="flex-1 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-inner relative overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pr-4 -mr-2">
                      <div className="text-[12px] leading-relaxed">
                        {parsedObservation ? (
                          <JsonView data={parsedObservation} />
                        ) : (
                          <span className="text-zinc-500 italic uppercase">Awaiting_Signal...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

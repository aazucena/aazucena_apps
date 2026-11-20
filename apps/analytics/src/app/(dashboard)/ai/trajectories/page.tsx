'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Pause, Play, Refresh } from '@aazucena/icons';
import { NeuralMap } from '@aazucena/visualizations';
import { Badge, Button, CodeBlock, Panel, PanelBody, PanelHeader, ScrollArea } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { PageHeader } from '@/components/common/PageHeader';

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
 * A recursive JSON viewer for observations. Failed audits get a ▲ marker, passes read OK.
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
  if (data === null) return <span className="text-muted-foreground italic">null</span>;
  if (typeof data === 'boolean') {
    if (keyName === 'is_valid') {
      return data ? (
        <Badge variant="success">OK</Badge>
      ) : (
        <Badge variant="destructive">INVALID</Badge>
      );
    }
    return <span className="text-foreground font-mono">{data.toString()}</span>;
  }
  if (typeof data === 'number') return <span className="text-foreground font-mono">{data}</span>;

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
            'rounded-control my-2 border-l-2 py-2 pl-3',
            isInvalid
              ? 'border-l-alert bg-panel-raised'
              : isShade
                ? 'border-l-success bg-panel-raised'
                : 'border-l-signal bg-panel-raised',
            level === 0 ? 'w-full' : 'w-auto',
          )}
        >
          {isInvalid && <p className="micro-label text-alert mb-2">▲ AUDIT DISCREPANCY</p>}
          {isShade && <p className="micro-label text-success mb-2">GROUND TRUTH</p>}
          <MarkdownRenderer
            content={data}
            className="text-foreground prose-p:mb-3 last:prose-p:mb-0 text-sm leading-relaxed"
          />
        </div>
      );
    }
    return (
      <span
        className={cn(
          'leading-relaxed break-words',
          isInvalid ? 'text-alert' : 'text-muted-foreground',
        )}
      >
        &quot;{data}&quot;
      </span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted-foreground">[]</span>;
    return (
      <div className="flex flex-col gap-1">
        {data.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-muted-foreground shrink-0 font-mono text-xs">[{i}]</span>
            <JsonView data={item} level={level + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="text-muted-foreground">{'{}'}</span>;

    const hasFailedAudit = data['is_valid'] === false;

    return (
      <div
        className={cn(
          'flex flex-col gap-1.5',
          level > 0 && 'border-rule ml-1 border-l py-1 pl-3',
          hasFailedAudit && 'border-alert rounded-control my-2 border border-l-2 p-3',
        )}
      >
        {hasFailedAudit && <p className="micro-label text-alert">▲ AUDIT FAILURE</p>}
        {keys.map((key) => (
          <div key={key} className="flex flex-col items-start sm:flex-row sm:gap-2">
            <span
              className={cn(
                'micro-label mt-0.5 shrink-0',
                key === 'is_valid' && data[key] === false ? 'text-alert' : 'text-signal',
              )}
            >
              {key}:
            </span>
            <div className="min-w-0 flex-1">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; adding fetchTrajectories would loop: fetch → setSelectedTrajectory → fn recreates → effect refires
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
        } catch {
          /* ignore malformed JSON */
        }
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

  const stepLabel = `${currentStepIndex + 1} / ${selectedTrajectory?.length || 0}`;
  const progress = selectedTrajectory?.length
    ? ((currentStepIndex + 1) / selectedTrajectory.length) * 100
    : 0;
  const reward = currentStep?.reward ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="TRAJECTORY_LABS"
        meta="AGENT DECISION PLAYBACK & BEHAVIORAL ANALYSIS"
        actions={
          <Button variant="outline" onClick={fetchTrajectories} disabled={isLoading}>
            <Refresh size={14} className={cn(isLoading && 'motion-safe:animate-spin')} /> Refresh
          </Button>
        }
      />

      <div className="grid h-[calc(100vh-11rem)] min-h-[560px] grid-cols-1 gap-4 xl:grid-cols-[17rem_minmax(0,1fr)_20rem]">
        {/* TRAJECTORY LIST */}
        <Panel className="min-h-0 overflow-hidden">
          <PanelHeader label="TRAJECTORIES">
            <span className="micro-label text-signal flex items-center gap-1.5">
              <span aria-hidden className="bg-signal size-1.5 rounded-full" />
              {trajectories.length}
            </span>
          </PanelHeader>
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-2">
              {isLoading ? (
                <p className="micro-label text-muted-foreground py-16 text-center" role="status">
                  LOADING TRAJECTORIES
                </p>
              ) : trajectories.length === 0 ? (
                <p className="micro-label text-muted-foreground py-16 text-center">
                  NO TRAJECTORIES RECORDED
                </p>
              ) : (
                trajectories.map((t) => {
                  const active = selectedTrajectory?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTrajectory(t);
                        setCurrentStepIndex(0);
                      }}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'rounded-control focus-visible:outline-signal w-full border-l-2 px-3 py-2.5 text-left outline-none focus-visible:outline-1',
                        active
                          ? 'border-l-signal bg-state text-foreground'
                          : 'text-muted-foreground hover:bg-state hover:text-foreground border-l-transparent',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'truncate font-mono text-xs',
                            active ? 'text-signal' : 'text-foreground',
                          )}
                        >
                          {t.id}
                        </span>
                        <span
                          className={cn(
                            'micro-label text-muted-foreground shrink-0 font-mono tabular-nums',
                          )}
                        >
                          R {t.totalReward > 0 ? '+' : ''}
                          {t.totalReward.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs">
                        {t.agent} · {t.length} steps
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Panel>

        {/* NEURAL MAP + PLAYBACK */}
        <Panel className="min-h-0 min-w-0 overflow-hidden">
          <PanelHeader label={`NEURAL_MAP // ${selectedTrajectory?.id ?? 'IDLE'}`}>
            <span className="micro-label text-signal flex items-center gap-1.5">
              <span aria-hidden className="bg-signal size-1.5 rounded-full" />
              STEP {stepLabel}
            </span>
          </PanelHeader>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <NeuralMap
              steps={selectedTrajectory?.steps || []}
              currentStepIndex={currentStepIndex}
            />
          </div>
          <div className="border-rule flex items-center gap-3 border-t p-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous step"
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
              aria-pressed={isPlaying}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next step"
              onClick={() =>
                setCurrentStepIndex(
                  Math.min((selectedTrajectory?.length || 1) - 1, currentStepIndex + 1),
                )
              }
            >
              <ChevronRight size={16} />
            </Button>
            <div
              role="progressbar"
              aria-label="Playback position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="bg-state h-1 flex-1 overflow-hidden rounded-full"
            >
              <div className="bg-signal h-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="micro-label text-muted-foreground font-mono">{stepLabel}</span>
          </div>
        </Panel>

        {/* STEP INSPECTOR */}
        <Panel className="min-h-0 overflow-hidden">
          <PanelHeader
            label={`STEP_${(currentStepIndex + 1).toString().padStart(2, '0')} // INSPECTOR`}
          />
          <div
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users must be able to scroll this region
            tabIndex={0}
            role="region"
            aria-label="Step inspector"
            className="focus-visible:outline-signal min-h-0 flex-1 overflow-y-auto outline-none focus-visible:outline-1"
          >
            <PanelBody className="gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-panel-raised rounded-control p-3">
                  <p className="micro-label text-muted-foreground">OUTCOME_REWARD</p>
                  <p className="text-foreground mt-1 font-mono text-xl tabular-nums">
                    {reward > 0 ? '+' : ''}
                    {reward}
                  </p>
                </div>
                <div className="bg-panel-raised rounded-control p-3">
                  <p className="micro-label text-muted-foreground">CONFIDENCE</p>
                  <p className="text-signal mt-1 font-mono text-xl">
                    {((currentStep?.probability || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="micro-label text-muted-foreground">COGNITIVE_DECISION</p>
                <p className="text-sm leading-snug break-words">{currentStep?.action || 'IDLE'}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="micro-label text-muted-foreground">STEP_METADATA</p>
                <CodeBlock
                  code={JSON.stringify(currentStep?.metadata ?? {}, null, 2)}
                  language="json"
                  showLineNumbers={false}
                  className="max-h-56 overflow-y-auto font-mono text-xs"
                  tabIndex={0}
                  role="region"
                  aria-label="Step metadata"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <p className="micro-label text-muted-foreground">OBSERVATION</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => navigator.clipboard.writeText(currentStep?.observation || '')}
                  >
                    <Copy size={12} /> Copy raw
                  </Button>
                </div>
                <div className="bg-panel-raised rounded-control border-rule border p-3 text-xs leading-relaxed">
                  {parsedObservation ? (
                    <JsonView data={parsedObservation} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </PanelBody>
          </div>
        </Panel>
      </div>
    </div>
  );
}

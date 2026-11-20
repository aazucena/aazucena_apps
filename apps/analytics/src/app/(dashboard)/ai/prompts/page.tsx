// apps/analytics/src/app/ai/prompts/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Refresh, Save } from '@aazucena/icons';
import {
  Badge,
  Button,
  Panel,
  PanelBody,
  PanelHeader,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@aazucena/ui';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { usePrompts, useUpdatePrompt } from '@/hooks/usePrompts';

export default function PromptManagerPage() {
  // --- Data Fetching ---
  const { data: prompts = [], isLoading: isPromptsLoading, error: promptsError } = usePrompts();
  const updateMutation = useUpdatePrompt();

  const queryClient = useQueryClient();

  // --- Local UI State ---
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [forceReset, setForceReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'lab'>('editor');

  // --- Editor Form State ---
  const [systemMsg, setSystemMsg] = useState('');
  const [humanTmpl, setHumanTemplate] = useState('');
  const [description, setDescription] = useState('');

  // --- Lab State ---
  const [testVariables, setTestVariables] = useState<Record<string, string>>({
    input: 'How do I start the monorepo?',
    context: "The monorepo uses pnpm and Turborepo. Run 'pnpm dev' to start all apps.",
  });
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Derived: Current Selected Prompt
  const selectedPrompt = useMemo(
    () => prompts.find((p) => p.id === selectedPromptId) || prompts[0],
    [prompts, selectedPromptId],
  );

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
      setHumanTemplate(selectedPrompt.humanTemplate || '');
      setDescription(selectedPrompt.description || '');
      setTestResult('');
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
        },
      });
    } catch (e) {
      console.error('Failed to save prompt:', e);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setIsSyncing(false);
    }
  };

  const runTest = async () => {
    setIsTesting(true);
    try {
      // Simulated logic test
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestResult(
        `[SIMULATED_LLM_RESPONSE]: Synthesized successfully using instructions from ${selectedPrompt?.name}. Logic validation status: 100%.`,
      );
    } finally {
      setIsTesting(false);
    }
  };

  // Stats calculation
  const totalChars = systemMsg.length + humanTmpl.length;
  const estTokens = Math.ceil(totalChars / 4);
  const estCost = ((estTokens / 1000000) * 10).toFixed(6);

  // --- Loading/Error Views ---
  if (isPromptsLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center" role="status">
        <p className="micro-label text-muted-foreground motion-safe:animate-pulse">
          LOADING PROMPTS
        </p>
      </div>
    );
  if (promptsError)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Badge variant="destructive">PROMPT HUB UNREACHABLE</Badge>
      </div>
    );

  const variables = ['input', 'context'];
  const fieldClass =
    'border-rule-strong bg-panel-raised min-h-0 flex-1 resize-none font-mono text-sm leading-relaxed';

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="PROMPT_LABS"
        meta="CENTRALIZED INTELLIGENCE INSTRUCTIONS & TEMPLATE IDE"
        actions={
          <>
            <dl className="border-rule bg-panel rounded-card flex items-stretch divide-x divide-[var(--rule)] border">
              <div className="px-4 py-1.5">
                <dt className="micro-label text-muted-foreground">≈ PAYLOAD COST</dt>
                <dd className="font-mono text-sm">${estCost}</dd>
              </div>
              <div className="px-4 py-1.5">
                <dt className="micro-label text-muted-foreground">≈ TOKENS</dt>
                <dd className="font-mono text-sm">~{estTokens}</dd>
              </div>
            </dl>
            <label className="micro-label text-muted-foreground flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={forceReset}
                onChange={(e) => setForceReset(e.target.checked)}
                className="accent-[var(--signal)]"
              />
              FORCE RESET
            </label>
            <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
              <Refresh size={14} className={cn(isSyncing && 'motion-safe:animate-spin')} />
              {isSyncing ? 'Syncing...' : 'Sync prompts'}
            </Button>
          </>
        }
      />

      <div className="grid h-[calc(100vh-11rem)] min-h-[560px] grid-cols-1 gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
        {/* PROMPT LIST */}
        <Panel className="min-h-0 overflow-hidden">
          <PanelHeader label="PROMPTS">
            <span className="micro-label text-signal flex items-center gap-1.5">
              <span aria-hidden className="bg-signal size-1.5 rounded-full" />
              {prompts.length}
            </span>
          </PanelHeader>
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-2">
              {prompts.length === 0 && (
                <p className="micro-label text-muted-foreground py-16 text-center">
                  NO PROMPTS STORED
                </p>
              )}
              {prompts.map((p) => {
                const active = selectedPrompt?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPromptId(p.id)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'rounded-control focus-visible:outline-signal w-full border-l-2 px-3 py-2.5 text-left outline-none focus-visible:outline-1',
                      active
                        ? 'border-l-signal bg-state text-foreground'
                        : 'text-muted-foreground hover:bg-state hover:text-foreground border-l-transparent',
                    )}
                  >
                    <span
                      className={cn('block truncate font-mono text-sm', active && 'text-signal')}
                    >
                      {p.name}
                    </span>
                    <span className="micro-label text-muted-foreground mt-1 block">
                      {p.type} · {p.locale.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </Panel>

        {/* EDITOR / TEST LAB */}
        <Panel className="min-h-0 min-w-0 overflow-hidden">
          <PanelHeader
            label={`${selectedPrompt?.name ?? 'NO PROMPT'} // ${selectedPrompt?.type ?? ''}`}
          >
            <span
              className={cn(
                'micro-label flex items-center gap-1.5',
                updateMutation.isPending ? 'text-signal' : 'text-muted-foreground',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'size-1.5 rounded-full',
                  updateMutation.isPending
                    ? 'bg-signal motion-safe:animate-pulse'
                    : 'bg-rule-strong',
                )}
              />
              {updateMutation.isPending ? 'SAVING' : 'IDLE'}
            </span>
          </PanelHeader>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'editor' | 'lab')}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex items-center justify-between gap-3 px-panel pt-4">
              <TabsList className="micro-label">
                <TabsTrigger value="editor" className="micro-label data-[state=active]:bg-state">
                  EDITOR
                </TabsTrigger>
                <TabsTrigger value="lab" className="micro-label data-[state=active]:bg-state">
                  TEST LAB
                </TabsTrigger>
              </TabsList>
              <Button onClick={handleSave} disabled={updateMutation.isPending || !selectedPrompt}>
                {updateMutation.isPending ? (
                  <Refresh className="motion-safe:animate-spin" size={14} />
                ) : (
                  <Save size={14} />
                )}
                {updateMutation.isPending ? 'Saving...' : 'Save version'}
              </Button>
            </div>

            <TabsContent value="editor" className="mt-0 min-h-0 flex-1 overflow-y-auto">
              <PanelBody className="gap-5">
                <div className="flex h-60 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="system-persona" className="micro-label text-muted-foreground">
                      SYSTEM PERSONA
                    </label>
                    <span className="micro-label text-muted-foreground">
                      {systemMsg.length} CHARS
                    </span>
                  </div>
                  <Textarea
                    id="system-persona"
                    value={systemMsg}
                    onChange={(e) => setSystemMsg(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div className="flex h-48 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="interaction-template"
                      className="micro-label text-muted-foreground"
                    >
                      INTERACTION TEMPLATE
                    </label>
                    <span className="micro-label text-muted-foreground">
                      {humanTmpl.length} CHARS
                    </span>
                  </div>
                  <Textarea
                    id="interaction-template"
                    value={humanTmpl}
                    onChange={(e) => setHumanTemplate(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="micro-label text-muted-foreground">
                    VARIABLES DETECTED // {variables.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((v) => (
                      <code
                        key={v}
                        className="border-rule-strong rounded-control border px-2 py-0.5 font-mono text-xs"
                      >{`{${v}}`}</code>
                    ))}
                  </div>
                </div>
                <div className="border-rule flex items-center justify-between border-t pt-4">
                  <p className="micro-label text-muted-foreground">≈ TOKENS ~{estTokens}</p>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('lab')}>
                    Go to lab <ChevronRight size={14} />
                  </Button>
                </div>
              </PanelBody>
            </TabsContent>

            <TabsContent value="lab" className="mt-0 min-h-0 flex-1 overflow-y-auto">
              <PanelBody className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <p className="micro-label text-muted-foreground">SIMULATION INPUTS</p>
                  {variables.map((v) => (
                    <div key={v} className="flex flex-col gap-1.5">
                      <label htmlFor={`lab-${v}`} className="micro-label text-signal">
                        {v}
                      </label>
                      <Textarea
                        id={`lab-${v}`}
                        value={testVariables[v]}
                        onChange={(e) =>
                          setTestVariables((prev) => ({ ...prev, [v]: e.target.value }))
                        }
                        className="border-rule-strong bg-panel-raised h-32 resize-none font-mono text-xs"
                      />
                    </div>
                  ))}
                  <Button onClick={runTest} disabled={isTesting}>
                    {isTesting ? 'Running...' : 'Run logic test'}
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="micro-label text-muted-foreground">INFERENCE OUTPUT (SIMULATED)</p>
                  <div className="bg-panel-raised border-rule rounded-control flex min-h-64 flex-1 flex-col border p-4">
                    <pre
                      role="status"
                      className="text-foreground flex-1 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                    >
                      {testResult ||
                        (isTesting ? 'Awaiting response...' : 'Ready for test execution.')}
                    </pre>
                    {testResult && (
                      <div className="border-rule mt-4 flex items-center justify-between border-t pt-3">
                        <Badge variant="success">OK</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(testResult)}
                        >
                          Copy output
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </PanelBody>
            </TabsContent>
          </Tabs>
        </Panel>
      </div>
    </div>
  );
}

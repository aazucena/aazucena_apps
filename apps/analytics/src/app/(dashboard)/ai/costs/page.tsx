'use client';

import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import {
  Badge,
  Meter,
  Panel,
  PanelBody,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aazucena/ui';
import { MetricCard } from '@/components/widgets/MetricCard';
import { PageHeader } from '@/components/common/PageHeader';
import { StateNote } from '@/components/common/StateNote';
import { StreamGraph } from '@aazucena/visualizations';
import { useAiStats } from '@/hooks/useAiStats';
import type { GenericTimeSeriesStep } from '@aazucena/types';

function Bar({ pct, tone }: { pct: number; tone: string }) {
  return (
    <div aria-hidden className="bg-state mt-1 ml-auto h-1 w-16 overflow-hidden rounded-full">
      <div className={`h-full ${tone}`} style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }} />
    </div>
  );
}

export default function AiCostCenterPage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading, error } = useAiStats();

  useEffect(() => {
    dispatch(setCategoryPreset('PERFORMANCE')); // Use high-integrity preset
  }, [dispatch]);

  // AiIntelligenceStats field names (package type)
  const totalSpendNum = stats?.summary?.total_cost_usd || (stats as any)?.summary?.total_spend || 0;
  const totalSpend = error ? '—' : `$${totalSpendNum.toFixed(4)}`;
  const totalSavingsNum = (stats as any)?.summary?.total_savings || 0;
  const totalSavings = error ? '—' : `$${totalSavingsNum.toFixed(4)}`;
  const totalTokens = error ? '—' : stats?.summary?.total_tokens?.toLocaleString() || '0';

  // Calculate Monthly Projection (24h burn * 30)
  const monthlyProjection = (totalSpendNum * 30).toFixed(2);
  const monthlyLabel = error ? '—' : `$${monthlyProjection}`;

  // Calculate Efficiency Score (Savings / (Spend + Savings))
  const efficiencyScore =
    totalSpendNum + totalSavingsNum > 0
      ? ((totalSavingsNum / (totalSpendNum + totalSavingsNum)) * 100).toFixed(1)
      : '0';
  const efficiencyLabel = error ? '—' : `${efficiencyScore}%`;

  // The stats payload carries no budget yet; without one the meter stays empty.
  const budgetNum: number | null = Number((stats as any)?.summary?.budget_usd) || null;
  const burn = budgetNum ? ((totalSpendNum * 30) / budgetNum) * 100 : null;
  const budgetState = burn === null ? null : burn >= 100 ? 'alert' : burn >= 80 ? 'warning' : 'ok';

  // Group trends by date → GenericTimeSeriesStep[] (cost by model over time)
  const statsTrends = stats?.trends;
  const statsHistory = (stats as any)?.history;
  const streamData = useMemo((): GenericTimeSeriesStep[] => {
    const trends = statsTrends ?? statsHistory;
    if (!trends) return [];
    const map = new Map<string, Record<string, number>>();
    (trends as any[]).forEach((d) => {
      const key = String(d.date);
      if (!map.has(key)) map.set(key, {});
      map.get(key)![d.model ?? 'spend'] = d.cost ?? d.value ?? 0;
    });
    return Array.from(map.entries()).map(([date, values]) => ({
      timestamp: new Date(date),
      values,
    }));
  }, [statsTrends, statsHistory]);

  const models: any[] = stats?.models ?? (stats as any)?.distribution ?? [];
  const agents: any[] = (stats as any)?.agents ?? [];
  const th = 'micro-label text-muted-foreground';
  const emptyRow = (cols: number, text: string) => (
    <TableRow>
      <TableCell colSpan={cols} className="micro-label text-muted-foreground py-10 text-center">
        {text}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <PageHeader
        title="FISCAL_INTEL"
        meta="Financial Ledger & Model Resource Consumption"
        actions={
          stats && !error ? (
            <Badge variant="primary" animated>
              BUDGET_AUDIT_ACTIVE
            </Badge>
          ) : undefined
        }
      />

      {error && <StateNote kind="fault">Fiscal telemetry unavailable. The fetch failed.</StateNote>}

      {/* BUDGET LEDGER */}
      <Panel
        label="BUDGET // LEDGER"
        status={isLoading ? 'idle' : 'none'}
        className="overflow-hidden"
      >
        <PanelBody className="gap-5">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <div className="micro-label text-muted-foreground">SPENT · 24H</div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-light tabular-nums">{totalSpend}</span>
                <span className="micro-label text-muted-foreground">
                  {budgetNum ? `OF $${budgetNum.toFixed(2)}` : 'NO BUDGET SET'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
              <MetricCard
                className="border-0 bg-transparent p-0"
                label="Token Volume"
                value={totalTokens}
              />
              <MetricCard
                className="border-0 bg-transparent p-0"
                label="Efficiency Score"
                value={efficiencyLabel}
              />
              <MetricCard
                className="border-0 bg-transparent p-0"
                label="Fiscal Savings"
                value={totalSavings}
              />
              <MetricCard
                className="border-0 bg-transparent p-0"
                label="Monthly Projection"
                value={monthlyLabel}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {budgetNum && burn !== null ? (
              <Meter
                label="Budget burn"
                value={Math.min(burn, 100)}
                variant={
                  budgetState === 'alert'
                    ? 'destructive'
                    : budgetState === 'warning'
                      ? 'warning'
                      : 'cyber'
                }
              />
            ) : (
              <div
                role="meter"
                aria-label="Budget burn"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext="No budget set"
                className="bg-state h-2 w-full rounded-full"
              />
            )}
            <div className="micro-label text-muted-foreground flex flex-wrap items-center justify-between gap-2">
              <span>$0</span>
              <span>
                {budgetNum && burn !== null
                  ? `PROJECTION $${monthlyProjection} (${burn.toFixed(0)}% OF BUDGET)`
                  : 'PROJECTION — · NO BUDGET SET'}
              </span>
              {budgetState === 'alert' && <Badge variant="destructive">OVER BUDGET</Badge>}
              {budgetState === 'warning' && <Badge variant="warning">◆ NEAR BUDGET</Badge>}
              <span>{budgetNum ? `BUDGET $${budgetNum.toFixed(2)}` : 'BUDGET —'}</span>
            </div>
          </div>
        </PanelBody>
      </Panel>

      {/* DAILY SPEND */}
      <Panel label="DAILY SPEND // BY MODEL" status={isLoading ? 'idle' : 'none'}>
        <PanelBody>
          <div className="micro-label text-muted-foreground">
            {isLoading ? 'CALCULATING LEDGER...' : 'UNIT: USD ($)'}
          </div>
          <div className="min-h-[360px]">
            <StreamGraph data={streamData} />
          </div>
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <Panel label="MODEL EFFICIENCY AUDIT // 7_DAY_ANALYSIS" className="overflow-hidden">
          <PanelBody className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-rule">
                  <TableHead className={th}>MODEL_ID</TableHead>
                  <TableHead className={`${th} text-right`}>INFERENCES</TableHead>
                  <TableHead className={`${th} text-right`}>ACTUAL_SPEND</TableHead>
                  <TableHead className={`${th} text-right`}>FISCAL_SAVINGS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model: any) => (
                  <TableRow key={model.model} className="border-rule">
                    <TableCell className="font-mono text-sm">
                      <div className="max-w-[180px] truncate">{model.model.split('/').pop()}</div>
                      <div className="micro-label text-muted-foreground">
                        {model.model.split('/')[0]}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {model.inferences.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      ${model.spend.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-success text-right font-mono text-sm tabular-nums">
                      <div>+${(model.savings || 0).toFixed(4)}</div>
                      <Bar
                        pct={((model.savings || 0) / (totalSavingsNum || 1)) * 100}
                        tone="bg-success"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {models.length === 0 &&
                  emptyRow(
                    4,
                    error
                      ? '▲ FISCAL TELEMETRY UNAVAILABLE'
                      : 'FISCAL TELEMETRY INGESTION PENDING...',
                  )}
              </TableBody>
            </Table>
          </PanelBody>
        </Panel>

        <Panel label="AGENT RESOURCE ALLOCATION // 7_DAY_ANALYSIS" className="overflow-hidden">
          <PanelBody className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-rule">
                  <TableHead className={th}>AGENT_IDENTITY</TableHead>
                  <TableHead className={`${th} text-right`}>INFERENCES</TableHead>
                  <TableHead className={`${th} text-right`}>TOTAL_SPEND</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent: any) => (
                  <TableRow key={agent.agent_name} className="border-rule">
                    <TableCell className="font-mono text-sm">{agent.agent_name}</TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {agent.inferences.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      <div>${agent.spend.toFixed(4)}</div>
                      <Bar pct={(agent.spend / (totalSpendNum || 1)) * 100} tone="bg-signal" />
                    </TableCell>
                  </TableRow>
                ))}
                {agents.length === 0 &&
                  emptyRow(
                    3,
                    error ? '▲ AGENT MAPPING UNAVAILABLE' : 'AGENT FISCAL MAPPING PENDING...',
                  )}
              </TableBody>
            </Table>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}

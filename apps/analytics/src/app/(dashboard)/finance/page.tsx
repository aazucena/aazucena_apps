'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import {
  Badge,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aazucena/ui';
import { categorical } from '@aazucena/visualizations';
import { formatCurrency } from '@aazucena/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { StackedColumns, type ColumnDatum } from '@/components/common/StackedColumns';
import { MetricCard } from '@/components/widgets/MetricCard';
import { useFinanceStats } from '@/hooks/useFinance';

const WEEKS = 13;
const DAY_MS = 86_400_000;

function Note({ children }: { children: React.ReactNode }) {
  return <p className="micro-label text-muted-foreground p-6 text-center">{children}</p>;
}

/** Amount in its own currency; refunds and chargebacks get an explicit minus, neutral colour. */
function formatAmount(amount: number, currency: string, negative: boolean): string {
  const abs = Math.abs(amount);
  let text: string;
  try {
    text = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(abs);
  } catch {
    text = `${abs.toFixed(2)} ${currency}`;
    return `${negative ? '−' : ''}${text}`;
  }
  return `${negative ? '−' : ''}${text} ${currency}`;
}

/** Monday (UTC) of the week holding `d`, as a timestamp. */
function weekStart(d: Date): number {
  const day = (d.getUTCDay() + 6) % 7;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - day * DAY_MS;
}

export default function FinancePage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading, error } = useFinanceStats();

  useEffect(() => {
    dispatch(setCategoryPreset('INTELLIGENCE'));
  }, [dispatch]);

  // Weekly revenue per provider; Stripe takes series 1, every other provider the next series.
  const { columns, providers } = useMemo(() => {
    const trends = (stats?.trends ?? []) as { date: string; revenue: number; provider: string }[];
    const names = Array.from(new Set(trends.map((d) => d.provider)));
    names.sort((a, b) => (a === 'STRIPE' ? -1 : b === 'STRIPE' ? 1 : a.localeCompare(b)));
    const colorOf = (name: string) => categorical[names.indexOf(name) % categorical.length];
    const sums = new Map<number, Map<string, number>>();
    trends.forEach((d) => {
      const wk = weekStart(new Date(d.date));
      const row = sums.get(wk) ?? new Map<string, number>();
      row.set(d.provider, (row.get(d.provider) ?? 0) + (d.revenue ?? 0));
      sums.set(wk, row);
    });
    const current = weekStart(new Date());
    const cols: ColumnDatum[] = Array.from({ length: WEEKS }, (_, i) => {
      const wk = current - (WEEKS - 1 - i) * 7 * DAY_MS;
      const row = sums.get(wk);
      return {
        key: String(wk),
        label: `Wk of ${new Date(wk).toLocaleDateString(undefined, {
          month: 'short',
          day: '2-digit',
          timeZone: 'UTC',
        })}`,
        note: wk === current ? 'to date' : undefined,
        segments: names.map((n) => ({ name: n, value: row?.get(n) ?? 0, color: colorOf(n) })),
      };
    });
    return { columns: cols, providers: names.map((n) => ({ name: n, color: colorOf(n) })) };
  }, [stats]);

  const history = stats?.history ?? [];
  const summary = stats?.summary;
  const empty = (text: string) =>
    isLoading ? (
      <Note>Syncing ledger…</Note>
    ) : error ? (
      <Note>▲ Ledger unavailable. The fetch failed.</Note>
    ) : (
      <Note>{text}</Note>
    );

  return (
    <>
      <PageHeader title="FINANCIAL_LEDGER" meta="Revenue Performance & Capital Tracking" />

      <div className="divide-rule border-rule bg-panel grid grid-cols-1 divide-y overflow-hidden rounded-card border md:grid-cols-3 md:divide-y-0 md:divide-x">
        <MetricCard
          className="rounded-none border-0"
          label="Total Revenue ≈ USD"
          value={summary ? formatCurrency(summary.total_revenue ?? 0) : '—'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Transaction Count"
          value={summary ? (summary.transaction_count ?? 0).toLocaleString() : '—'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Avg Transaction ≈ USD"
          value={summary ? formatCurrency(summary.avg_transaction ?? 0) : '—'}
        />
      </div>

      <Panel label={`REVENUE VELOCITY // WEEKLY${providers.length ? ` // ${WEEKS} WEEKS` : ''}`}>
        {providers.length === 0 ? (
          empty('No revenue recorded yet.')
        ) : (
          <>
            <ul className="micro-label text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
              {providers.map((p) => (
                <li key={p.name} className="flex items-center gap-1.5">
                  <span aria-hidden className="h-0.5 w-3" style={{ backgroundColor: p.color }} />
                  {p.name}
                </li>
              ))}
            </ul>
            <StackedColumns
              emptyLabel="No revenue in window"
              height={200}
              data={columns}
              format={(v) => formatCurrency(v)}
              summary={`Weekly revenue by provider, last ${WEEKS} weeks, ${providers
                .map((p) => p.name)
                .join(' and ')}`}
            />
            <div className="micro-label text-muted-foreground flex justify-between pt-1">
              <span>{columns[0]!.label}</span>
              <span>{columns[columns.length - 1]!.label} · TO DATE</span>
            </div>
          </>
        )}
      </Panel>

      <Panel label={`RECENT TRANSACTIONS${history.length ? ` // ${history.length}` : ''}`}>
        {history.length === 0 ? (
          empty('No financial events detected yet.')
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-rule">
                {['Timestamp', 'Provider', 'Amount', 'Identifier', 'Context'].map((h) => (
                  <TableHead
                    key={h}
                    scope="col"
                    className={`micro-label h-9 px-2 font-normal uppercase ${
                      h === 'Amount' ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((t, idx) => {
                const reversal = /refund|chargeback/i.test(t.type ?? '');
                const failed = /fail/i.test(t.type ?? '');
                return (
                  <TableRow key={t.transaction_id || idx} className="border-rule">
                    <TableCell className="text-muted-foreground px-2 font-mono text-xs whitespace-nowrap">
                      {new Date(t.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="px-2">
                      <Badge variant={t.provider === 'STRIPE' ? 'primary' : 'outline'} size="xs">
                        {t.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2 text-right font-mono text-xs whitespace-nowrap tabular-nums">
                      {formatAmount(t.amount, t.currency, reversal)}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-40 truncate px-2 font-mono text-xs">
                      {t.transaction_id}
                    </TableCell>
                    <TableCell className="px-2 text-sm">
                      {failed && (
                        <Badge variant="destructive" size="xs" className="mr-2">
                          Failed
                        </Badge>
                      )}
                      <span className="micro-label text-muted-foreground mr-2">{t.type}</span>
                      {t.customer_email || '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}

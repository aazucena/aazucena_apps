'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { StateNote } from '@/components/common/StateNote';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import {
  Button,
  Input,
  Panel,
  PanelBody,
  PanelHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aazucena/ui';
import { useJourneys, useJourneyDetail } from '@/hooks/useTelemetry';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline';
import { formatDistanceToNow } from 'date-fns';

const EMPTY = '—';

export default function JourneyPage() {
  const dispatch = useDispatch();
  const [selectedSid, setSelectedSid] = useState<string | null>(null);
  const [searchTerm, setSearchQuery] = useState('');

  const { data: journeys, isLoading: journeysLoading, isError: journeysError } = useJourneys();
  const {
    data: detail,
    isLoading: detailLoading,
    isError: detailError,
  } = useJourneyDetail(selectedSid);

  useEffect(() => {
    dispatch(setCategoryPreset('LOGS'));
  }, [dispatch]);

  const filteredJourneys = journeys?.filter(
    (j: any) =>
      j.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const avgEvents = useMemo(() => {
    if (!journeys?.length) return EMPTY;
    const total = journeys.reduce((n: number, j: any) => n + (Number(j.event_count) || 0), 0);
    return (total / journeys.length).toFixed(1);
  }, [journeys]);

  const events: any[] = useMemo(() => detail?.events ?? [], [detail]);
  const mix = useMemo(() => {
    const count = (names: string[]) => events.filter((e) => names.includes(e.event)).length;
    return {
      pages: count(['PageView']),
      music: count(['MusicPlay']),
      errors: count(['ClientError', 'Error']),
      other: events.filter(
        (e) => !['PageView', 'MusicPlay', 'ClientError', 'Error'].includes(e.event),
      ).length,
    };
  }, [events]);

  const stats: Array<[label: string, value: string]> = [
    ['IDENTITIES // LOADED', journeys ? String(journeys.length) : EMPTY],
    ['RETURNING', EMPTY],
    ['AVG EVENTS', avgEvents],
    ['UNRESOLVED', EMPTY],
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="JOURNEY_EXPLORER"
        meta="BEHAVIORAL IDENTITY STITCHING & PERSONA MAPPING"
        actions={
          <dl className="border-rule bg-panel rounded-card flex items-stretch divide-x divide-rule border">
            {stats.map(([label, value]) => (
              <div key={label} className="px-4 py-1.5">
                <dt className="micro-label text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    'font-mono text-lg tabular-nums',
                    value === EMPTY && 'text-muted-foreground',
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <div className="grid h-[calc(100vh-11rem)] min-h-[520px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_26rem]">
        {/* IDENTITIES */}
        <Panel className="flex min-h-0 flex-col overflow-hidden">
          <PanelHeader label="IDENTITIES">
            <span className="micro-label text-signal flex items-center gap-1.5">
              <span aria-hidden className="bg-signal size-1.5 rounded-full" />
              {journeys ? `${journeys.length} TRACES` : `0 TRACES`}
            </span>
          </PanelHeader>
          <div className="p-panel shrink-0">
            <Input
              type="search"
              aria-label="Search identities by session ID or country"
              placeholder="Search by session ID or country..."
              value={searchTerm}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users must be able to scroll this region
            tabIndex={0}
            role="region"
            aria-label="Identities list"
            className="px-panel pb-panel focus-visible:outline-signal min-h-0 flex-1 overflow-y-auto focus-visible:outline-1"
          >
            {journeysLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : journeysError ? (
              <StateNote kind="fault">
                Identities unavailable. The telemetry fetch failed.
              </StateNote>
            ) : filteredJourneys?.length === 0 ? (
              <StateNote kind="empty">No identities found.</StateNote>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-rule">
                    {['Identity / Origin', 'Last active', 'Engagement', 'Top events'].map((h) => (
                      <TableHead
                        key={h}
                        scope="col"
                        className="micro-label h-9 px-2 font-normal uppercase"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJourneys?.map((journey: any) => {
                    const selected = journey.sessionId === selectedSid;
                    return (
                      <TableRow
                        key={journey.sessionId}
                        onClick={() => setSelectedSid(journey.sessionId)}
                        className={cn(
                          'border-rule hover:bg-state cursor-pointer font-mono text-[13px]',
                          selected && 'bg-state',
                        )}
                      >
                        <TableCell className="p-0">
                          <button
                            type="button"
                            aria-current={selected ? 'true' : undefined}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSid(journey.sessionId);
                            }}
                            className="focus-visible:outline-signal block w-full truncate px-2 py-2.5 text-left outline-none focus-visible:outline-1"
                          >
                            {journey.sessionId}
                            <span className="text-muted-foreground"> · {journey.country}</span>
                            {journey.device && (
                              <span className="text-muted-foreground"> · {journey.device}</span>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-muted-foreground px-2 whitespace-nowrap">
                          {formatDistanceToNow(new Date(journey.end_time), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="px-2 whitespace-nowrap tabular-nums">
                          {journey.event_count} events
                        </TableCell>
                        <TableCell className="px-2">
                          {journey.unique_events.slice(0, 2).join(', ')}
                          {journey.unique_events.length > 2 && (
                            <span className="text-muted-foreground">
                              {' '}
                              +{journey.unique_events.length - 2}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Panel>

        {/* SESSION */}
        <Panel className="flex min-h-0 flex-col overflow-hidden">
          <PanelHeader label={selectedSid ? `SESSION // ${selectedSid}` : 'SESSION'}>
            {selectedSid && (
              <Button
                variant="ghost"
                size="sm"
                className="micro-label h-6 px-2"
                onClick={() => setSelectedSid(null)}
              >
                Close
              </Button>
            )}
          </PanelHeader>
          {!selectedSid ? (
            <StateNote kind="empty">Select an identity to read its session.</StateNote>
          ) : (
            <div
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users must be able to scroll this region
              tabIndex={0}
              role="region"
              aria-label="Session detail"
              className="focus-visible:outline-signal min-h-0 flex-1 overflow-y-auto focus-visible:outline-1"
            >
              <PanelBody className="gap-0">
                <dl>
                  {[
                    ['Global node', events[0]?.country || EMPTY],
                    [
                      'Access client',
                      events[0] ? `${events[0].device_type} / ${events[0].browser}` : EMPTY,
                    ],
                    [
                      'Session age',
                      events.length > 0
                        ? formatDistanceToNow(new Date(events[0].timestamp), { addSuffix: false })
                        : EMPTY,
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="border-rule flex items-baseline justify-between gap-3 border-b py-2"
                    >
                      <dt className="micro-label text-muted-foreground">{k}</dt>
                      <dd className="font-mono text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>

                <h3 className="micro-label text-muted-foreground mt-5 mb-3">
                  ACTIVITY TIMELINE // {events.length} EVENTS
                </h3>
                {detailLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : detailError ? (
                  <StateNote kind="fault">Session events failed to load.</StateNote>
                ) : events.length === 0 ? (
                  <StateNote kind="empty">No events logged.</StateNote>
                ) : (
                  <Timeline>
                    {events.map((ev: any, idx: number) => {
                      const isPage = ev.event === 'PageView';
                      const isMusic = ev.event === 'MusicPlay';
                      const isError = ev.event === 'ClientError' || ev.event === 'Error';
                      const data =
                        ev.data && Object.keys(ev.data).length > 0
                          ? Object.entries(ev.data)
                              .map(([k, v]) => `${k}=${String(v)}`)
                              .join(' · ')
                          : null;
                      return (
                        <TimelineItem key={ev.id || idx} className="pb-2">
                          {idx < events.length - 1 && <TimelineLine />}
                          <TimelineDot
                            variant={
                              isError
                                ? 'danger'
                                : isPage
                                  ? 'primary'
                                  : isMusic
                                    ? 'neutral'
                                    : 'default'
                            }
                          />
                          <TimelineContent className="ml-9 pt-6">
                            <div
                              className={cn(
                                'micro-label',
                                isError ? 'text-alert' : 'text-muted-foreground',
                              )}
                            >
                              {new Date(ev.timestamp).toLocaleTimeString([], {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}{' '}
                              // {isError && '▲ '}
                              {ev.event}
                            </div>
                            <div className="truncate font-mono text-[13px]">{ev.url || EMPTY}</div>
                            {data && (
                              <div className="text-muted-foreground truncate font-mono text-xs">
                                {data}
                              </div>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                )}

                <h3 className="micro-label text-muted-foreground mt-6 mb-2">EVENT MIX</h3>
                <p className="bg-panel-raised border-rule rounded-control border p-3 font-mono text-xs leading-relaxed">
                  {events.length === 0
                    ? EMPTY
                    : `${mix.pages} page views · ${mix.music} music plays · ${mix.errors} errors · ${mix.other} other`}
                </p>
              </PanelBody>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

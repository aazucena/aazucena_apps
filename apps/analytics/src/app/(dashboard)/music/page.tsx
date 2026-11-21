'use client';

import React, { useEffect } from 'react';
import { StateNote } from '@/components/common/StateNote';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { Panel, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@aazucena/ui';
import { categorical } from '@aazucena/visualizations';
import { PageHeader } from '@/components/common/PageHeader';
import { RankBar } from '@/components/common/RankBar';
import { MetricCard } from '@/components/widgets/MetricCard';
import { useMusicStats } from '@/hooks/useTelemetry';

export default function MusicPage() {
  const dispatch = useDispatch();
  const { data: musicData, isLoading, error } = useMusicStats();

  useEffect(() => {
    dispatch(setCategoryPreset('INTELLIGENCE'));
  }, [dispatch]);

  const stats = musicData?.stats;
  const tracks: any[] = musicData?.tracks ?? [];
  const genres: any[] = musicData?.genres ?? [];
  const topGenre = genres[0];
  const num = (v: unknown) => (typeof v === 'number' ? v.toLocaleString() : '—');
  const empty = (text: string) =>
    isLoading ? (
      <StateNote kind="empty">Syncing audio nodes…</StateNote>
    ) : error ? (
      <StateNote kind="fault">Audio telemetry unavailable. The fetch failed.</StateNote>
    ) : (
      <StateNote kind="empty">{text}</StateNote>
    );

  return (
    <>
      <PageHeader title="AUDIO_INTELLIGENCE" meta="Composition Playback & Engagement Telemetry" />

      <div className="divide-rule border-rule bg-panel grid grid-cols-1 divide-y overflow-hidden rounded-card border md:grid-cols-2 md:divide-y-0 lg:grid-cols-5 lg:divide-x">
        <MetricCard
          className="rounded-none border-0"
          label="Total Streams"
          value={num(stats?.total_streams)}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Unique Listeners"
          value={num(stats?.unique_listeners)}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Avg. Completion"
          value={typeof stats?.avg_completion === 'number' ? `${stats.avg_completion}%` : '—'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Total Downloads"
          value={num(stats?.total_downloads)}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Top Genre"
          value={topGenre?.name || '—'}
          description={topGenre ? `${topGenre.value}% OF PLAYS` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel label={`TOP COMPOSITIONS${tracks.length ? ` // ${tracks.length} TRACKS` : ''}`}>
          {tracks.length === 0 ? (
            empty('No composition telemetry captured.')
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-rule">
                  <TableHead scope="col" className="micro-label h-9 px-2 font-normal uppercase">
                    Rank
                  </TableHead>
                  <TableHead scope="col" className="micro-label h-9 px-2 font-normal uppercase">
                    Track title
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="micro-label h-9 px-2 text-right font-normal uppercase"
                  >
                    Plays
                  </TableHead>
                  <TableHead scope="col" className="micro-label h-9 px-2 font-normal uppercase">
                    Completion
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.map((track) => (
                  <TableRow key={track.title} className="border-rule">
                    <TableCell className="text-muted-foreground px-2 font-mono text-xs tabular-nums">
                      #{String(track.rank).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="text-sm">{track.title}</div>
                      <div className="micro-label text-muted-foreground">
                        {track.genre || 'OTHER'}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 text-right font-mono text-xs tabular-nums">
                      {track.plays.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-3">
                        <div aria-hidden className="bg-state h-1.5 w-24 overflow-hidden">
                          <div
                            className="bg-signal h-full"
                            style={{ width: `${Math.min(100, track.completionRate)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">
                          {track.completionRate}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>

        <Panel label={`GENRE SPECTRUM${genres.length ? ` // ${genres.length} GENRES` : ''}`}>
          {genres.length === 0 ? (
            empty('Frequency analysis pending.')
          ) : (
            <div className="flex flex-col gap-4">
              {genres.map((genre, i) => (
                <RankBar
                  key={genre.name}
                  label={genre.name || 'OTHER'}
                  color={categorical[i % categorical.length]}
                  percent={genre.value}
                  value={`${genre.value}%`}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

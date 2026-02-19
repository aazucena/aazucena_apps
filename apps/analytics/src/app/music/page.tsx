'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { Music, Play, HardDrive as Disc, Headphones, Download } from '@mynaui/icons-react';
import { useMusicStats } from '@/hooks/useTelemetry';

export default function MusicPage() {
  const dispatch = useDispatch();
  const { data: musicData, isLoading } = useMusicStats();

  useEffect(() => {
    dispatch(setCategoryPreset('INTELLIGENCE'));
  }, [dispatch]);

  const topGenre = musicData?.genres?.[0]?.name || 'Unknown';

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            AUDIO_INTELLIGENCE
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Composition Playback & Engagement Telemetry
          </p>
        </div>
        {isLoading && (
          <div className="text-[10px] font-mono text-primary-500 animate-pulse uppercase font-black">
            Syncing_Audio_Nodes...
          </div>
        )}
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          label="Total Streams"
          value={musicData?.stats?.total_streams?.toLocaleString() || '0'}
          description="+SIGNAL_VELOCITY"
          icon={<Play size={24} />}
        />
        <MetricCard
          label="Unique Listeners"
          value={musicData?.stats?.unique_listeners?.toLocaleString() || '0'}
          description="SIGNAL_ENTITIES"
          icon={<Headphones size={24} />}
        />
        <MetricCard
          label="Total Downloads"
          value={musicData?.stats?.total_downloads?.toLocaleString() || '0'}
          description="OFFLINE_COLLECTION"
          icon={<Download size={24} />}
        />
        <MetricCard
          label="Avg. Completion"
          value={`${musicData?.stats?.avg_completion || 0}%`}
          description="RETENTION_RATE"
          icon={<Music size={24} />}
        />
        <MetricCard
          label="Top Genre"
          value={topGenre}
          description="DOMINANT_FREQUENCY"
          icon={<Disc size={24} />}
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOP TRACKS LEADERBOARD */}
        <div className="lg:col-span-2 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
                <Music size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
                Top Compositions
              </h3>
            </div>
          </div>

          <div className="p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Track Title
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Plays
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody>
                {(musicData?.tracks || []).map((track: any) => (
                  <tr
                    key={track.title}
                    className="group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        #{track.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        {track.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                        {track.genre || 'OTHER'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {track.plays.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-mono text-xs text-zinc-500">
                          {track.completionRate}%
                        </span>
                        <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${track.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!musicData?.tracks || musicData.tracks.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest italic"
                    >
                      No composition telemetry captured...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GENRE DISTRIBUTION */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Disc size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Genre Spectrum
            </h3>
          </div>

          <div className="space-y-6">
            {(musicData?.genres || []).map((genre: any) => (
              <div key={genre.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <span>{genre.name || 'OTHER'}</span>
                  <span className="font-mono">{genre.value}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    style={{ width: `${genre.value}%` }}
                  />
                </div>
              </div>
            ))}
            {(!musicData?.genres || musicData.genres.length === 0) && (
              <div className="py-30 h-full text-center text-zinc-500 font-mono text-xs uppercase tracking-widest italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                Frequency analysis pending...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

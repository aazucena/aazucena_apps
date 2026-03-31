'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import {
  Compass,
  Hand as Fingerprint,
  Globe,
  Terminal,
  ClockCircle,
  ChevronRight,
  ArrowLeft,
  Search,
  Zap,
  Music,
  Eye,
  DangerTriangle,
} from '@aazucena/icons';
import { useJourneys, useJourneyDetail } from '@/hooks/useTelemetry';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function JourneyPage() {
  const dispatch = useDispatch();
  const [selectedSid, setSelectedSid] = useState<string | null>(null);
  const [searchTerm, setSearchQuery] = useState('');

  const { data: journeys, isLoading: journeysLoading } = useJourneys();
  const { data: detail, isLoading: detailLoading } = useJourneyDetail(selectedSid);

  useEffect(() => {
    dispatch(setCategoryPreset('LOGS'));
  }, [dispatch]);

  const filteredJourneys = journeys?.filter(
    (j: any) =>
      j.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 pb-20 h-[calc(100vh-8rem)] flex flex-col">
      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            <Compass size={36} className="text-primary-500" />
            JOURNEY_EXPLORER
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Behavioral Identity Stitching & Persona Mapping
          </p>
        </div>

        {selectedSid && (
          <button
            onClick={() => setSelectedSid(null)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:text-primary-500 transition-all border border-zinc-200 dark:border-zinc-700"
          >
            <ArrowLeft size={14} />
            Back to List
          </button>
        )}
      </div>

      {!selectedSid ? (
        <>
          {/* JOURNEY LIST SEARCH */}
          <div className="shrink-0 relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by Session_ID or Country..."
              value={searchTerm}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-xs font-mono focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          {/* JOURNEY LIST */}
          <div className="flex-1 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm">
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 grid grid-cols-12 text-[10px] font-black uppercase text-zinc-400 tracking-widest shrink-0">
              <div className="col-span-4">Identity / Origin</div>
              <div className="col-span-2">Last Active</div>
              <div className="col-span-2">Engagement</div>
              <div className="col-span-3">Top Events</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {journeysLoading ? (
                <div className="p-20 text-center text-xs font-mono uppercase text-zinc-500 animate-pulse">
                  Scanning_Neural_Traces...
                </div>
              ) : filteredJourneys?.length === 0 ? (
                <div className="p-20 text-center text-xs font-mono uppercase text-zinc-500">
                  No identities found.
                </div>
              ) : (
                filteredJourneys?.map((journey: any) => (
                  <div
                    key={journey.sessionId}
                    onClick={() => setSelectedSid(journey.sessionId)}
                    className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-900/50 grid grid-cols-12 items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer group"
                  >
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all">
                        <Fingerprint size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate w-48">
                          {journey.sessionId}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase font-black tracking-tighter">
                            <Globe size={10} /> {journey.country}
                          </span>
                          <span className="text-zinc-800 dark:text-zinc-700">•</span>
                          <span className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase font-black tracking-tighter">
                            <Terminal size={10} /> {journey.device}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                        {formatDistanceToNow(new Date(journey.end_time), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Zap size={12} />
                        <span className="text-[10px] font-black">
                          {journey.event_count} SIGNAL_PULSES
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 flex flex-wrap gap-1">
                      {journey.unique_events.slice(0, 3).map((ev: string) => (
                        <span
                          key={ev}
                          className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[8px] font-black uppercase text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                        >
                          {ev}
                        </span>
                      ))}
                      {journey.unique_events.length > 3 && (
                        <span className="text-[8px] text-zinc-400 font-black">
                          +{journey.unique_events.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 text-right">
                      <ChevronRight
                        size={18}
                        className="inline text-zinc-300 group-hover:text-primary-500 transition-all"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        /* JOURNEY DETAIL VIEW */
        <div className="flex-1 flex gap-8 overflow-hidden">
          {/* TIMELINE VIEW */}
          <div className="flex-1 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Activity Timeline
              </span>
              <span className="text-[10px] font-mono text-primary-500 font-bold uppercase">
                {detail?.events?.length || 0} Events Logged
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {detailLoading ? (
                <div className="p-20 text-center text-xs font-mono uppercase text-zinc-500 animate-pulse">
                  Retrieving_Event_Sequence...
                </div>
              ) : (
                <div className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

                  {detail?.events?.map((ev: any, idx: number) => {
                    const isPage = ev.event === 'PageView';
                    const isMusic = ev.event === 'MusicPlay';
                    const isError = ev.event === 'ClientError' || ev.event === 'Error';

                    return (
                      <div key={ev.id || idx} className="relative pl-12 group">
                        {/* Bullet */}
                        <div
                          className={cn(
                            'absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 z-10 transition-all group-hover:scale-125',
                            isError
                              ? 'bg-rose-500'
                              : isPage
                                ? 'bg-primary-500'
                                : isMusic
                                  ? 'bg-emerald-500'
                                  : 'bg-zinc-400',
                          )}
                        />

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 transition-all hover:border-primary-500/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2">
                              {isPage ? (
                                <Eye size={14} className="text-primary-500" />
                              ) : isMusic ? (
                                <Music size={14} className="text-emerald-500" />
                              ) : isError ? (
                                <DangerTriangle size={14} className="text-rose-500" />
                              ) : (
                                <Fingerprint size={14} className="text-zinc-400" />
                              )}
                              <span className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">
                                {ev.event}
                              </span>
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {new Date(ev.timestamp).toLocaleTimeString([], {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-zinc-500 truncate mb-3">
                            URL:{' '}
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {ev.url || 'N/A'}
                            </span>
                          </div>

                          {ev.data && Object.keys(ev.data).length > 0 && (
                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 grid grid-cols-2 gap-2">
                              {Object.entries(ev.data).map(([k, v]: [string, any]) => (
                                <div key={k} className="flex flex-col gap-0.5">
                                  <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">
                                    {k}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 truncate">
                                    {String(v)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* IDENTITY SIDEBAR */}
          <div className="w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 mb-4 shadow-2xl shadow-primary-500/10">
                  <Fingerprint size={40} />
                </div>
                <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 break-all mb-2">
                  {selectedSid}
                </div>
                <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-black uppercase text-zinc-500 border border-zinc-200 dark:border-zinc-700 tracking-widest">
                  Persona: UNKNOWN_ENTITY
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                    Global Node
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Globe size={14} className="text-zinc-400" />{' '}
                    {detail?.events?.[0]?.country || 'Unknown'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                    Access Client
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Terminal size={14} className="text-zinc-400" />{' '}
                    {detail?.events?.[0]?.device_type} / {detail?.events?.[0]?.browser}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                    Session Age
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <ClockCircle size={14} className="text-zinc-400" />
                    {detail?.events?.length > 0 &&
                      formatDistanceToNow(new Date(detail.events[0].timestamp), {
                        addSuffix: false,
                      })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-6">
                Inference Suggestions
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic">
                    &quot;This entity has strong engagement with audio tracks and high-latency
                    interactions. Potential Persona: MUSIC_ENTHUSIAST.&quot;
                  </p>
                </div>
                <button className="w-full py-3 bg-primary-500/10 border border-primary-500/20 rounded-xl text-[9px] font-black uppercase text-primary-500 hover:bg-primary-500/20 transition-all">
                  Request_Deep_Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

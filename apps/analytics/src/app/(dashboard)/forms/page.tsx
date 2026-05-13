'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import {
  Mail,
  Inbox,
  Send,
  Trash,
  Archive,
  Search,
  Refresh,
  XCircle,
  ChevronRight,
} from '@aazucena/icons';
import { cn } from '@/lib/utils';
import { useForm as useTanstackForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Form, toast } from '@aazucena/ui';
import { FormButton, FormErrorSummary, ControlledInput, ControlledTextarea } from '@aazucena/forms';
import {
  useForms,
  useForm,
  useUpdateFormStatus,
  useDeleteForm,
  useReplyToForm,
  type FormSubmission,
} from '@/hooks/useForms';

// ─── Reply schema ────────────────────────────────────────────────────────────

const replySchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(10, 'Reply must be at least 10 characters'),
});
type ReplyFormData = z.infer<typeof replySchema>;

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['all', 'New', 'Read', 'Replied', 'Archived'] as const;

const STATUS_STYLES: Record<string, string> = {
  New: 'bg-amber-500/10 text-amber-500',
  Read: 'bg-primary-500/10 text-primary-500',
  Replied: 'bg-emerald-500/10 text-emerald-500',
  Archived: 'bg-zinc-500/10 text-zinc-500',
};

const INTENT_STYLES: Record<string, string> = {
  job_inquiry: 'bg-indigo-500/10 text-indigo-500',
  collaboration: 'bg-violet-500/10 text-violet-500',
  feedback: 'bg-sky-500/10 text-sky-500',
  project_inquiry: 'bg-rose-500/10 text-rose-500',
};

const SENTIMENT_STYLES: Record<string, string> = {
  'Very Positive': 'text-emerald-500',
  Positive: 'text-green-500',
  Neutral: 'text-zinc-400',
  Negative: 'text-amber-500',
  'Very Negative': 'text-rose-500',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SubmissionRow({
  sub,
  isSelected,
  onClick,
}: {
  sub: FormSubmission;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-2xl border text-left transition-all group',
        isSelected
          ? 'bg-primary-500 border-primary-600 text-white shadow-lg'
          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700',
        sub.status === 'New' && !isSelected && 'border-l-2 border-l-amber-400',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[140px]">
          {sub.submitterName}
        </span>
        <span
          className={cn(
            'text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full',
            isSelected ? 'bg-white/20 text-white' : STATUS_STYLES[sub.status],
          )}
        >
          {sub.status}
        </span>
      </div>
      <p className={cn('text-[9px] truncate', isSelected ? 'text-white/70' : 'text-zinc-400')}>
        {sub.aiSummary ?? sub.submitterEmail}
      </p>
      <div className="flex items-center justify-between mt-2">
        {sub.aiIntent && (
          <span
            className={cn(
              'text-[8px] font-mono px-1.5 py-0.5 rounded uppercase',
              isSelected
                ? 'bg-white/20 text-white'
                : (INTENT_STYLES[sub.aiIntent] ?? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'),
            )}
          >
            {sub.aiIntent}
          </span>
        )}
        <span
          className={cn(
            'text-[8px] font-mono ml-auto',
            isSelected ? 'text-white/50' : 'text-zinc-400',
          )}
        >
          {new Date(sub.submittedAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

function DetailPanel({ submissionId, onClose }: { submissionId: string; onClose: () => void }) {
  const { data, isLoading } = useForm(submissionId);
  const sub = data?.data;

  const updateStatus = useUpdateFormStatus();
  const deleteForm = useDeleteForm();
  const replyMutation = useReplyToForm();

  const [activeTab, setActiveTab] = useState<'detail' | 'reply'>('detail');
  const [replySent, setReplySent] = useState(false);

  const replyForm = useTanstackForm({
    validatorAdapter: zodValidator(),
    defaultValues: { subject: '', body: '' } as ReplyFormData,
    onSubmit: async ({ value }: { value: any }) => {
      const validated = replySchema.parse(value);
      try {
        await replyMutation.mutateAsync({
          id: submissionId,
          subject: validated.subject,
          body: validated.body,
        });
        setReplySent(true);
        setActiveTab('detail');
        toast.success('Reply_Transmitted');
      } catch {
        toast.error('Transmission_Failed');
      }
    },
  } as any);

  useEffect(() => {
    if (sub?.status === 'New') {
      updateStatus.mutate({ id: submissionId, status: 'Read' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, sub?.status]);

  useEffect(() => {
    if (sub) {
      replyForm.setFieldValue('subject', `Re: message from ${sub.submitterName}`);
      setReplySent(sub.status === 'Replied');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub]);

  const handleDelete = async () => {
    try {
      await deleteForm.mutateAsync(submissionId);
      toast.success('Transmission_Deleted');
      onClose();
    } catch {
      toast.error('Delete_Failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-xs text-zinc-500 uppercase animate-pulse tracking-widest">
        Loading_Transmission...
      </div>
    );
  }

  if (!sub) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-primary-500" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
              {sub.submitterName}
            </span>
          </div>
          <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
            {(['detail', 'reply'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-700 text-primary-500 shadow-sm'
                    : 'text-zinc-500',
                )}
              >
                {tab === 'detail' ? 'Transmission' : 'Reply'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              updateStatus.mutate(
                { id: submissionId, status: 'Archived' },
                {
                  onSuccess: () => toast.success('Transmission_Archived'),
                  onError: () => toast.error('Archive_Failed'),
                },
              )
            }
            disabled={sub.status === 'Archived'}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all disabled:opacity-30"
            title="Archive"
          >
            <Archive size={14} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteForm.isPending}
            className="p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-all disabled:opacity-50"
            title="Delete"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {activeTab === 'detail' ? (
          <>
            {/* Sender metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  From
                </p>
                <p className="text-xs font-mono text-zinc-900 dark:text-zinc-100">
                  {sub.submitterName}
                </p>
                <p className="text-[10px] text-zinc-400">{sub.submitterEmail}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  Received
                </p>
                <p className="text-xs font-mono text-zinc-900 dark:text-zinc-100">
                  {new Date(sub.submittedAt).toLocaleString()}
                </p>
                <p className="text-[10px] text-zinc-400 uppercase">{sub.formType}</p>
              </div>
            </div>

            {/* AI enrichment */}
            {(sub.aiSummary || sub.aiIntent || sub.aiSentiment) && (
              <div className="p-6 bg-primary-500/5 border border-primary-500/10 rounded-[2rem] space-y-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary-500">
                  AI_Analysis
                </p>
                {sub.aiSummary && (
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                    "{sub.aiSummary}"
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  {sub.aiIntent && (
                    <span
                      className={cn(
                        'text-[8px] font-black uppercase px-2 py-0.5 rounded-full',
                        INTENT_STYLES[sub.aiIntent] ?? 'bg-zinc-100 text-zinc-500',
                      )}
                    >
                      {sub.aiIntent}
                    </span>
                  )}
                  {sub.aiSentiment && (
                    <span
                      className={cn(
                        'text-[9px] font-mono',
                        SENTIMENT_STYLES[sub.aiSentiment] ?? 'text-zinc-400',
                      )}
                    >
                      {sub.aiSentiment}
                    </span>
                  )}
                  {sub.aiTags?.map((tag) => (
                    <code
                      key={tag}
                      className="text-[8px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500"
                    >
                      #{tag}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {/* Raw message */}
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                Message
              </p>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {sub.rawMessage ?? JSON.stringify(sub.formData, null, 2)}
                </p>
              </div>
            </div>

            {sub.status !== 'Replied' && (
              <button
                onClick={() => setActiveTab('reply')}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                Compose_Reply <ChevronRight size={14} />
              </button>
            )}
            {replySent && (
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Reply_Transmitted
              </div>
            )}
          </>
        ) : (
          /* Reply composer */
          <div className="space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-[10px] font-mono text-zinc-500">
              To: {sub.submitterEmail}
            </div>

            <Form
              form={replyForm}
              variant="default"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                replyForm.handleSubmit();
              }}
            >
              <FormErrorSummary />
              <ControlledInput
                name="subject"
                label="Subject"
                required
                validators={{ onChange: replySchema.shape.subject }}
              />
              <div className="[&_textarea]:min-h-[240px]">
                <ControlledTextarea
                  name="body"
                  label="Body"
                  required
                  validators={{ onChange: replySchema.shape.body }}
                />
              </div>
              <FormButton
                className="w-full flex items-center justify-center gap-2"
                disabled={replyMutation.isPending}
              >
                {replyMutation.isPending ? (
                  <Refresh size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {replyMutation.isPending ? 'Transmitting...' : 'Transmit_Reply'}
              </FormButton>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormsPage() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setCategoryPreset('INTELLIGENCE'));
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, error, refetch, isFetching } = useForms({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: debouncedSearch || undefined,
    pageSize: 50,
  });

  const submissions = data?.data ?? [];
  const total = data?.meta?.pagination?.total ?? 0;
  const newCount = submissions.filter((s) => s.status === 'New').length;

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-rose-500 font-mono text-xs uppercase">
        <XCircle className="mr-2" size={16} /> Inbox_Connection_Failed
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 h-[calc(100vh-10rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            COMMS<span className="text-primary-500">_INBOX</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Portfolio Contact Transmissions & Response Terminal
          </p>
        </div>
        <div className="flex items-center gap-4">
          {newCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                {newCount} Unread
              </span>
            </div>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-zinc-500 disabled:opacity-50"
          >
            <Refresh size={12} className={cn(isFetching && 'animate-spin')} />
            Sync
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Total', value: total, color: 'text-zinc-900 dark:text-zinc-100' },
          {
            label: 'New',
            value: submissions.filter((s) => s.status === 'New').length,
            color: 'text-amber-500',
          },
          {
            label: 'Replied',
            value: submissions.filter((s) => s.status === 'Replied').length,
            color: 'text-emerald-500',
          },
          {
            label: 'Archived',
            value: submissions.filter((s) => s.status === 'Archived').length,
            color: 'text-zinc-400',
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-5 backdrop-blur-md"
          >
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
            <p className={cn('text-3xl font-black tracking-tighter mt-1', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main two-panel layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* LEFT: Submission list */}
        <div className="xl:col-span-2 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-md">
          {/* Search + filter */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transmissions..."
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[11px] font-mono text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all',
                    statusFilter === s
                      ? 'bg-primary-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 font-mono text-xs text-zinc-500 uppercase animate-pulse tracking-widest">
                Scanning_Transmissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                <Inbox size={32} className="opacity-30" />
                <p className="font-mono text-[10px] uppercase tracking-widest">
                  No transmissions found
                </p>
              </div>
            ) : (
              submissions.map((sub) => (
                <SubmissionRow
                  key={sub.documentId}
                  sub={sub}
                  isSelected={selectedId === sub.documentId}
                  onClick={() => setSelectedId(sub.documentId)}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        <div className="xl:col-span-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-primary-500/5">
          {selectedId ? (
            <DetailPanel
              key={selectedId}
              submissionId={selectedId}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400">
              <Mail size={40} className="opacity-20" />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                Select_Transmission_to_Decode
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

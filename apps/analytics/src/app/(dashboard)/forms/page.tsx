'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { Refresh, Send } from '@aazucena/icons';
import { cn } from '@/lib/utils';
import { useForm as useTanstackForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import {
  Badge,
  Button,
  Form,
  Input,
  Panel,
  PanelBody,
  PanelHeader,
  Skeleton,
  ToggleGroup,
  ToggleGroupItem,
  toast,
} from '@aazucena/ui';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
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

const STATUS_BADGE: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  New: 'cyber',
  Read: 'outline',
  Replied: 'success',
  Archived: 'secondary',
};

/** Sentiment text carries its meaning in the label; only negative sentiment gets a warning marker. */
function sentimentLabel(sentiment: string): { text: string; tone: string } {
  if (sentiment === 'Very Negative' || sentiment === 'Negative')
    return { text: `◆ ${sentiment}`, tone: 'text-warning' };
  return { text: sentiment, tone: 'text-muted-foreground' };
}

const sectionLabel = 'micro-label text-muted-foreground';

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
      type="button"
      onClick={onClick}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(
        'border-rule focus-visible:outline-signal hover:bg-state flex w-full flex-col gap-1 border-b px-3 py-3 text-left outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
        isSelected && 'bg-state',
      )}
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium">{sub.submitterName}</span>
        <span className="micro-label text-muted-foreground shrink-0">
          {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
        </span>
      </span>
      <span
        className={cn(
          'truncate text-sm',
          sub.status === 'New' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {sub.aiSummary ?? sub.submitterEmail}
      </span>
      <span className="flex items-center gap-2">
        <Badge variant={STATUS_BADGE[sub.status] ?? 'outline'} size="xs">
          {sub.status}
        </Badge>
        {sub.aiIntent && <span className="micro-label text-muted-foreground">{sub.aiIntent}</span>}
      </span>
    </button>
  );
}

function DetailPanel({ submissionId, onClose }: { submissionId: string; onClose: () => void }) {
  const { data, isLoading } = useForm(submissionId);
  const sub = data?.data;

  const updateStatus = useUpdateFormStatus();
  const deleteForm = useDeleteForm();
  const replyMutation = useReplyToForm();

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
      <>
        <PanelHeader label="TRANSMISSION" />
        <PanelBody className="gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </PanelBody>
      </>
    );
  }

  if (!sub) return null;

  return (
    <>
      <PanelHeader label={`TRANSMISSION // #${submissionId.slice(-4).toUpperCase()}`}>
        <Badge variant={STATUS_BADGE[sub.status] ?? 'outline'} size="xs">
          {sub.status}
        </Badge>
      </PanelHeader>

      <div
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users must be able to scroll this region
        tabIndex={0}
        role="region"
        aria-label="Transmission detail"
        className="focus-visible:outline-signal min-h-0 flex-1 overflow-y-auto focus-visible:outline-1"
      >
        <PanelBody className="gap-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="truncate text-lg font-medium">{sub.submitterName}</h2>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
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
              >
                Archive
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteForm.isPending}
              >
                Delete
              </Button>
            </div>
          </div>

          <dl className="flex flex-wrap gap-x-10 gap-y-3">
            <div>
              <dt className={sectionLabel}>FROM</dt>
              <dd className="text-sm">{sub.submitterName}</dd>
              <dd className="text-muted-foreground font-mono text-xs">{sub.submitterEmail}</dd>
            </div>
            <div>
              <dt className={sectionLabel}>RECEIVED</dt>
              <dd className="text-sm">{new Date(sub.submittedAt).toLocaleString()}</dd>
              <dd className="text-muted-foreground font-mono text-xs">
                {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
              </dd>
            </div>
            <div>
              <dt className={sectionLabel}>FORM</dt>
              <dd className="text-sm uppercase">{sub.formType}</dd>
            </div>
          </dl>

          {(sub.aiSummary || sub.aiIntent || sub.aiSentiment) && (
            <section
              aria-label="AI analysis"
              className="bg-panel-raised border-rule rounded-control flex flex-col gap-2 border p-4"
            >
              <h3 className="micro-label text-signal flex items-center gap-1.5">
                <span aria-hidden className="bg-signal size-1.5 rounded-full" />
                AI_ANALYSIS
              </h3>
              {sub.aiSummary && (
                <p className="font-mono text-sm leading-relaxed">&ldquo;{sub.aiSummary}&rdquo;</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {sub.aiIntent && (
                  <span className="micro-label text-foreground">{sub.aiIntent}</span>
                )}
                {sub.aiSentiment && (
                  <span className={cn('micro-label', sentimentLabel(sub.aiSentiment).tone)}>
                    {sentimentLabel(sub.aiSentiment).text}
                  </span>
                )}
                {sub.aiTags?.map((tag) => (
                  <code key={tag} className="micro-label text-signal">
                    #{tag}
                  </code>
                ))}
              </div>
            </section>
          )}

          <section aria-label="Message" className="flex flex-col gap-2">
            <h3 className={sectionLabel}>MESSAGE</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {sub.rawMessage ?? JSON.stringify(sub.formData, null, 2)}
            </p>
          </section>

          {replySent && (
            <p className="micro-label text-success flex items-center gap-2">
              <span aria-hidden className="bg-success size-1.5 rounded-full" />
              Reply_Transmitted
            </p>
          )}

          <section
            aria-label="Compose reply"
            className="border-rule flex flex-col gap-3 border-t pt-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className={sectionLabel}>COMPOSE_REPLY</h3>
              <span className="text-muted-foreground font-mono text-xs">
                To: {sub.submitterEmail}
              </span>
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
              <div className="[&_textarea]:min-h-[120px]">
                <ControlledTextarea
                  name="body"
                  label="Body"
                  required
                  validators={{ onChange: replySchema.shape.body }}
                />
              </div>
              <div className="flex justify-end">
                <FormButton
                  className="flex items-center justify-center gap-2"
                  disabled={replyMutation.isPending}
                >
                  {replyMutation.isPending ? (
                    <Refresh size={14} className="motion-safe:animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {replyMutation.isPending ? 'Transmitting...' : 'Send reply'}
                </FormButton>
              </div>
            </Form>
          </section>
        </PanelBody>
      </div>
    </>
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
      <div className="flex flex-col gap-4">
        <PageHeader
          title="COMMS_INBOX"
          meta="PORTFOLIO CONTACT TRANSMISSIONS & RESPONSE TERMINAL"
        />
        <Panel label="TRANSMISSIONS" status="alert">
          <p className="micro-label text-alert">▲ Inbox_Connection_Failed</p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="COMMS_INBOX"
        meta="PORTFOLIO CONTACT TRANSMISSIONS & RESPONSE TERMINAL"
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <Refresh size={14} className={cn(isFetching && 'motion-safe:animate-spin')} />
            Sync
          </Button>
        }
      />

      <div className="grid h-[calc(100vh-11rem)] min-h-[520px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* LEFT: Submission list */}
        <Panel className="flex min-h-0 flex-col overflow-hidden">
          <PanelHeader label={`TRANSMISSIONS // ${total}`}>
            {newCount > 0 && (
              <span className="micro-label text-signal flex items-center gap-1.5">
                <span aria-hidden className="bg-signal size-1.5 rounded-full" />
                {newCount} NEW
              </span>
            )}
          </PanelHeader>
          <div className="p-panel flex shrink-0 flex-col gap-3">
            <Input
              type="search"
              aria-label="Search transmissions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transmissions..."
            />
            <ToggleGroup
              type="single"
              aria-label="Filter by status"
              value={statusFilter}
              onValueChange={(v) => v && setStatusFilter(v)}
              className="flex-wrap justify-start"
            >
              {STATUS_FILTERS.map((s) => (
                <ToggleGroupItem
                  key={s}
                  value={s}
                  className="micro-label border-rule h-7 min-w-0 border px-2.5 uppercase data-[state=on]:border-signal data-[state=on]:bg-signal-faint data-[state=on]:text-signal"
                >
                  {s}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users must be able to scroll this region
            tabIndex={0}
            role="region"
            aria-label="Transmissions list"
            className="px-panel pb-panel focus-visible:outline-signal min-h-0 flex-1 overflow-y-auto focus-visible:outline-1"
          >
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <p className="micro-label text-muted-foreground p-6 text-center">
                No transmissions found
              </p>
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
        </Panel>

        {/* RIGHT: Detail panel */}
        <Panel className="flex min-h-0 flex-col overflow-hidden">
          {selectedId ? (
            <DetailPanel
              key={selectedId}
              submissionId={selectedId}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <>
              <PanelHeader label="TRANSMISSION" />
              <p className="micro-label text-muted-foreground p-6 text-center">
                Select a transmission to decode
              </p>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FormSubmission {
  id: number;
  documentId: string;
  formType: string;
  submitterName: string;
  submitterEmail: string;
  rawMessage?: string;
  formData?: Record<string, string>;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  submittedAt: string;
  aiIntent?: string;
  aiSentiment?: string;
  aiSummary?: string;
  aiTags?: string[];
}

interface FormListResponse {
  data: FormSubmission[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

async function fetchForms(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}): Promise<FormListResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.pageSize) q.set('pageSize', String(params.pageSize));
  if (params.status) q.set('status', params.status);
  if (params.search) q.set('search', params.search);
  const res = await fetch(`/api/forms?${q}`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}

async function fetchForm(id: string): Promise<{ data: FormSubmission }> {
  const res = await fetch(`/api/forms/${id}`);
  if (!res.ok) throw new Error('Submission not found');
  return res.json();
}

export function useForms(
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: ['forms', params],
    queryFn: () => fetchForms(params),
    staleTime: 30_000,
  });
}

export function useForm(id: string | null) {
  return useQuery({
    queryKey: ['form', id],
    queryFn: () => fetchForm(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useUpdateFormStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/forms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['forms'] });
      qc.invalidateQueries({ queryKey: ['form'] });
    },
  });
}

export function useDeleteForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/forms/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forms'] }),
  });
}

export function useReplyToForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, subject, body }: { id: string; subject: string; body: string }) =>
      fetch(`/api/forms/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'Send failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['forms'] });
      qc.invalidateQueries({ queryKey: ['form'] });
    },
  });
}

'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { addNotification } from '@aazucena/stores';
import type { FormSubmission } from '@/hooks/useForms';

async function fetchNewForms(): Promise<{ data: FormSubmission[] }> {
  const res = await fetch('/api/forms?status=New&pageSize=20');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function NewFormWatcher() {
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ['forms-watcher-new'],
    queryFn: fetchNewForms,
    staleTime: 55_000,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!data?.data) return;
    for (const sub of data.data) {
      dispatch(
        addNotification({
          id: `form-${sub.documentId}`,
          title: `New message from ${sub.submitterName}`,
          description: sub.aiSummary ?? sub.submitterEmail,
          time: new Date(sub.submittedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          read: false,
          sourceType: 'form',
          sourceId: sub.documentId,
        }),
      );
    }
  }, [data, dispatch]);

  return null;
}

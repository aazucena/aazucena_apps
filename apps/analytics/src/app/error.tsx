'use client';

import React, { useEffect } from 'react';
import { Button, Panel } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ROOT_LAYOUT_EXCEPTION:', error);
  }, [error]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col gap-4 p-6">
      <PageHeader title="SYSTEM_FAULT" meta="ROOT_LAYOUT" />
      <Panel label="FAULT // ROOT_LAYOUT" status="alert" className="max-w-xl">
        <p className="text-muted-foreground font-mono text-sm break-words">{error.message}</p>
        <div className="pt-2">
          <Button onClick={reset}>Retry</Button>
        </div>
      </Panel>
    </div>
  );
}

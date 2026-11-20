'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button, Panel } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error('CRITICAL_SYSTEM_EXCEPTION:', error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="SYSTEM_FAULT" meta="CORE_RUNTIME" />
      <Panel label="FAULT // CORE_INTEGRITY" status="alert">
        <p className="text-muted-foreground text-sm">
          An unexpected exception occurred in the core runtime. Diagnostic data has been sent to the
          engineering deck.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="border-rule bg-background text-muted-foreground max-h-64 overflow-auto rounded-control border p-3 font-mono text-xs">
            {error.stack || error.message}
          </pre>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => reset()}>Reboot node</Button>
          <Button asChild variant="outline">
            <Link href="/">Return to overview</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

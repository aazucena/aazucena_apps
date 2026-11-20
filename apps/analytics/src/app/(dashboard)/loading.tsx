import { Panel, Skeleton } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading">
      <PageHeader title="LOADING" meta="SYNC_IN_PROGRESS" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Panel label="SIGNAL // PENDING" status="idle">
        <Skeleton className="h-72" />
      </Panel>
      <Panel label="LOGS // PENDING" status="idle">
        <Skeleton className="h-40" />
      </Panel>
    </div>
  );
}

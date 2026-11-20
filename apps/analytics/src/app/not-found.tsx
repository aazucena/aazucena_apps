import Link from 'next/link';
import { Button, Panel } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';

const NODES = [
  { label: 'Overview', href: '/' },
  { label: 'Audio', href: '/music' },
  { label: 'Telemetry', href: '/logs' },
  { label: 'Integrity', href: '/performance' },
];

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader title="NODE_NOT_FOUND" meta="ERR_404" />
      <Panel label="TRACE // LOST" status="idle">
        <p className="text-muted-foreground text-sm">
          The requested telemetry node does not exist. Return to a known node.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {NODES.map((n) => (
            <Button key={n.href} asChild variant={n.href === '/' ? 'default' : 'outline'}>
              <Link href={n.href}>{n.label}</Link>
            </Button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

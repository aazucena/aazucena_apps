import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Stat,
  StatValue,
  StatLabel,
  StatDescription,
} from '@aazucena/ui';
import { Activity, TrendingUp, Users, Database } from '@aazucena/icons';

/**
 * ## Data Dashboard Recipe
 * Demonstrates composing Stat, Tabs, Badge, and Card into a data dashboard layout.
 */
const meta = {
  title: 'Recipes/Dashboards/DataDashboard',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A data dashboard composed from Stat, Tabs, Badge, and Card primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const stats = [
  {
    label: 'Total Users',
    value: '14,892',
    change: '+12.5% this month',
    icon: Users,
  },
  {
    label: 'Active Sessions',
    value: '1,204',
    change: '+3.1% from yesterday',
    icon: Activity,
  },
  {
    label: 'Data Points',
    value: '2.4M',
    change: '+28.7% this week',
    icon: Database,
  },
  {
    label: 'Avg. Response',
    value: '42ms',
    change: '-8.2% (improved)',
    icon: TrendingUp,
  },
];

/**
 * Overview dashboard with KPI stats and tabbed data sections.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter">System Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time telemetry dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" animated>
            LIVE
          </Badge>
          <Button size="sm" variant="outline">
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="pt-6">
                <Stat>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <StatLabel>{stat.label}</StatLabel>
                  </div>
                  <StatValue>{stat.value}</StatValue>
                  <StatDescription className="text-emerald-500 mt-1">
                    {stat.change}
                  </StatDescription>
                </Stat>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 max-w-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60">
                Overview Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All systems nominal. No critical alerts in the last 24 hours.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                P95 latency: 87ms. P99 latency: 142ms. Uptime: 99.98%.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60">
                Recent Log Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-xs space-y-2 text-muted-foreground">
              <p>[INFO] Heartbeat received from node_0x7F42</p>
              <p>[INFO] Cache invalidated for user session</p>
              <p>[WARN] Elevated memory usage: 78%</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

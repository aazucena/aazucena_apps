import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Globe, Shield, Zap, Activity, Database, Dots as MoreHorizontal } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for high-density structured data.
 * - **Responsiveness:** Features a `relative w-full overflow-auto` wrapper to manage horizontal overflow on smaller viewports.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `` and pulsing status indicators.
 * - **Composition:** Fully modular parts (Header, Body, Footer, Head, Row, Cell) for flexible tabular architecture.
 */
const meta = {
  title: 'Components/Data/Table',
  component: Table,
  subcomponents: {
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
  } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=17-70',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust table system for presenting structured information. Supports high-fidelity technical themes and responsive overflow management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the table container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNodes = [
  { id: '0x7F42', sector: 'US_EAST_1', status: 'NOMINAL', latency: '12ms', load: 42 },
  { id: '0x8B11', sector: 'EU_WEST_2', status: 'DEGRADED', latency: '145ms', load: 88 },
  { id: '0x3C9D', sector: 'AP_SOUTH_1', status: 'STABLE', latency: '42ms', load: 15 },
  { id: '0x5E2A', sector: 'SA_EAST_1', status: 'OFFLINE', latency: 'INF', load: 0 },
];

// --- STORIES ---

/**
 * Standard implementation showing a system node registry.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[800px]">
      <Table {...args}>
        <TableCaption>Active Node Registry // Updated just now</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Unit_ID</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Latency</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockNodes.map((node) => (
            <TableRow key={node.id}>
              <TableCell className="font-bold font-mono">{node.id}</TableCell>
              <TableCell>{node.sector}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    node.status === 'NOMINAL'
                      ? 'secondary'
                      : node.status === 'OFFLINE'
                        ? 'destructive'
                        : 'outline'
                  }
                  size="xs"
                >
                  {node.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{node.latency}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[800px] p-8 bg-background rounded-card">
      <div className="flex items-center gap-3 mb-6 px-4">
        <Activity className="size-4 text-signal animate-pulse" />
        <span className="font-mono text-[10px] text-signal uppercase tracking-[0.3em]">
          // KERNEL_INGESTION_BUFFER
        </span>
      </div>
      <Table {...args} className="font-mono text-xs">
        <TableHeader variant="cyber">
          <TableRow variant="cyber" className="hover:bg-transparent">
            <TableHead className="text-signal font-black uppercase">Sector</TableHead>
            <TableHead className="text-signal font-black uppercase">Buffer_Load</TableHead>
            <TableHead className="text-right text-signal font-black uppercase">Stability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockNodes.slice(0, 3).map((node) => (
            <TableRow key={node.id} variant="cyber">
              <TableCell className="text-foreground">{node.sector}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-1 w-24 bg-signal/10 rounded-full overflow-hidden">
                    <div className="h-full bg-signal" style={{ width: `${node.load}%` }} />
                  </div>
                  <span className="opacity-40">{node.load}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className={node.status === 'NOMINAL' ? 'text-success' : 'text-warning'}>
                  {node.status === 'NOMINAL' ? 'OPTIMAL' : 'FLUCTUATING'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for overlays on complex visual backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 rounded-card relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-scrim" />
      <div className="w-[700px] relative z-10">
        <Table {...args} className="border-rule text-foreground">
          <TableHeader variant="glass">
            <TableRow variant="glass" className="hover:bg-transparent">
              <TableHead className="text-foreground/40 uppercase tracking-widest font-black text-[10px]">
                Resource
              </TableHead>
              <TableHead className="text-foreground/40 uppercase tracking-widest font-black text-[10px]">
                Encryption
              </TableHead>
              <TableHead className="text-right text-foreground/40 uppercase tracking-widest font-black text-[10px]">
                Availability
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow variant="glass">
              <TableCell className="flex items-center gap-3">
                <Database size={14} className="opacity-60" /> Core_Enclave
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-success">
                  <Shield size={12} /> AES-256
                </div>
              </TableCell>
              <TableCell className="text-right text-success font-bold">100%</TableCell>
            </TableRow>
            <TableRow variant="glass">
              <TableCell className="flex items-center gap-3">
                <Zap size={14} className="opacity-60" /> Edge_Sync
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-signal">
                  <Shield size={12} /> ChaCha20
                </div>
              </TableCell>
              <TableCell className="text-right text-signal font-bold">98.2%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};

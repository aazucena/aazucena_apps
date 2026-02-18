import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  Status, 
  StatusDot, 
  StatusLabel, 
  HeartbeatItem, 
  HeartbeatHeader, 
  HeartbeatFooter, 
  HeartbeatDetail, 
  HeartbeatDetailLabel, 
  HeartbeatDetailValue 
} from '@aazucena/ui';
import { IconBox } from '@aazucena/ui';
import { Activity, Database, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout system for service-level status tracking.
 * - **UX:** Features high-contrast semantic signals (Nominal, Warning, Critical) using pulsing dots.
 * - **Design:** Optimized for high-density analytical dashboards with mono-typography and mini-trend visualizations.
 * - **Composition:** Fully modular parts (Header, Footer, Detail, Label, Value) for flexible status reporting.
 */
const meta = {
  title: 'Components/Data/Heartbeat',
  component: HeartbeatItem,
  subcomponents: { 
    HeartbeatHeader, 
    HeartbeatFooter, 
    HeartbeatDetail, 
    HeartbeatDetailLabel, 
    HeartbeatDetailValue,
    Status,
    StatusDot,
    StatusLabel
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A service health monitoring component. Provides detailed uptime, stability, and pulse metrics for individual edge nodes or backend services.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeartbeatItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for monitoring a core cluster node.
 */
export const ServiceCard: Story = {
  render: () => (
    <div className="w-[450px]">
      <HeartbeatItem>
        <HeartbeatHeader>
          <div className="flex items-center gap-4">
            <IconBox variant="primary" size="md">
              <Database size={20} />
            </IconBox>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest uppercase">CLUSTER_MAIN_01</span>
              <div className="flex items-center gap-2 mt-1">
                <StatusDot state="nominal" pulse />
                <StatusLabel variant="cyber" className="text-emerald-500">CONNECTED</StatusLabel>
              </div>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold opacity-40 uppercase tracking-tighter">Latency: 12ms</span>
        </HeartbeatHeader>
        
        {/* Trend Mock */}
        <div className="h-16 flex items-end gap-1 px-2 opacity-30">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
          ))}
        </div>

        <HeartbeatFooter>
          <HeartbeatDetail>
            <HeartbeatDetailLabel>Stability</HeartbeatDetailLabel>
            <HeartbeatDetailValue>99.98% UPTIME</HeartbeatDetailValue>
          </HeartbeatDetail>
          <HeartbeatDetail align="right">
            <HeartbeatDetailLabel>Last Pulse</HeartbeatDetailLabel>
            <HeartbeatDetailValue>2s_AGO</HeartbeatDetailValue>
          </HeartbeatDetail>
        </HeartbeatFooter>
      </HeartbeatItem>
    </div>
  ),
};

/**
 * High-urgency state representing a degraded or failing service.
 */
export const DegradedState: Story = {
  render: () => (
    <div className="w-[450px]">
      <HeartbeatItem className="border-rose-500/20 bg-rose-500/5 shadow-rose-500/5 shadow-2xl">
        <HeartbeatHeader>
          <div className="flex items-center gap-4">
            <IconBox variant="cyber" size="md" className="border-rose-500/20 text-rose-500 bg-rose-500/10">
              <Activity size={20} />
            </IconBox>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest uppercase text-rose-500">INGESTION_RELAY</span>
              <div className="flex items-center gap-2 mt-1">
                <StatusDot state="warning" animated />
                <StatusLabel variant="cyber" className="text-amber-500">JITTER_DETECTED</StatusLabel>
              </div>
            </div>
          </div>
          <span className="font-mono text-[10px] font-black text-rose-500/60 uppercase">HIGH_LATENCY</span>
        </HeartbeatHeader>
        
        <div className="h-16 flex items-end gap-1 px-2 opacity-20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex-1 bg-rose-500 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>

        <HeartbeatFooter className="border-rose-500/10">
          <HeartbeatDetail>
            <HeartbeatDetailLabel className="text-rose-500/40">Packet_Loss</HeartbeatDetailLabel>
            <HeartbeatDetailValue className="text-rose-500">12.4% FAIL</HeartbeatDetailValue>
          </HeartbeatDetail>
          <HeartbeatDetail align="right">
            <HeartbeatDetailLabel className="text-rose-500/40">Incident_ID</HeartbeatDetailLabel>
            <HeartbeatDetailValue className="text-rose-500">0x7F42</HeartbeatDetailValue>
          </HeartbeatDetail>
        </HeartbeatFooter>
      </HeartbeatItem>
    </div>
  ),
};

/**
 * Gallery of standalone status indicators used within larger components.
 */
export const IndicatorGallery: Story = {
  render: () => (
    <div className="p-12 border rounded-[2rem] bg-card space-y-12 w-[500px]">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">SYSTEM_SIGNALS</p>
        <div className="flex justify-center gap-12">
          <Status variant="pill" className="px-4 py-1.5">
            <StatusDot state="nominal" pulse />
            <StatusLabel variant="bright">OPERATIONAL</StatusLabel>
          </Status>
          <Status variant="pill" className="px-4 py-1.5 border-rose-500/20 bg-rose-500/5">
            <StatusDot state="critical" animated />
            <StatusLabel variant="bright" className="text-rose-500">OFFLINE</StatusLabel>
          </Status>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">AGENT_STATUS</p>
        <div className="flex justify-center gap-12">
          <div className="flex items-center gap-2">
            <StatusDot state="intel" size="lg" pulse />
            <StatusLabel variant="cyber">ACTIVE_INFERENCE</StatusLabel>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot state="loading" size="lg" animated />
            <StatusLabel variant="cyber">INGESTING_SIGNAL</StatusLabel>
          </div>
        </div>
      </div>
    </div>
  )
}

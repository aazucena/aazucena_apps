import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Panel, PanelBody, PanelHeader } from '@aazucena/ui';

/**
 * Instrument panel: the base surface of Avra 0.2. A flat panel-tone surface with a
 * framed header strip (micro-caps label + status). Coral appears only for `status="alert"`,
 * always with a ▲ marker. Compose freely with `PanelHeader` / `PanelBody`.
 */
const meta = {
  title: 'Components/Layout/Panel',
  component: Panel,
  subcomponents: { PanelHeader, PanelBody } as any,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=10-40',
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    status: {
      control: 'select',
      options: ['idle', 'live', 'alert'],
      table: { category: 'State' },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
  },
  args: { label: 'TRAFFIC // 30D', status: 'live' },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Metric = ({ value, caption }: { value: string; caption: string }) => (
  <div className="flex flex-col gap-1.5">
    <span className="font-sans text-[40px] leading-[44px] font-light tabular-nums">{value}</span>
    <span className="font-mono text-xs text-muted-foreground">{caption}</span>
  </div>
);

export const Live: Story = {
  render: (args) => (
    <Panel {...args} className="w-80">
      <Metric value="12,480" caption="sessions · 30 days" />
    </Panel>
  ),
};

export const Idle: Story = {
  args: { label: 'AI COST // MTD', status: 'idle' },
  render: Live.render,
};

/**
 * Alert status: coral 2px edge and a ▲ marker, never color alone.
 */
export const Alert: Story = {
  args: { label: 'ERROR RATE // 24H', status: 'alert' },
  render: (args) => (
    <Panel {...args} className="w-80">
      <Metric value="2.4%" caption="▲ 38% above baseline" />
    </Panel>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/▲ ALERT/)).toBeInTheDocument();
    const panel = canvasElement.querySelector('[data-slot="panel"]') as HTMLElement;
    await expect(panel.dataset.status).toBe('alert');
    await expect(getComputedStyle(panel).borderTopLeftRadius).toBe('6px');
  },
};

/**
 * Static: no status passed, so no live indicator. Only panels fed by a stream say LIVE.
 */
export const Static: Story = {
  args: { label: 'ARCHIVE // 2025', status: undefined },
  render: (args) => (
    <Panel label={args.label} className="w-80">
      <Metric value="412" caption="posts" />
    </Panel>
  ),
  play: async ({ canvasElement }: any) => {
    const panel = canvasElement.querySelector('[data-slot="panel"]') as HTMLElement;
    await expect(panel.dataset.status).toBe('none');
    await expect(within(canvasElement).queryByText(/LIVE|IDLE|ALERT/)).toBeNull();
  },
};

/**
 * Composition: header and body as separate parts, e.g. a chart panel.
 */
export const Composed: Story = {
  render: () => (
    <Panel className="w-96">
      <PanelHeader label="SOURCE MIX // 30D" status="live" />
      <PanelBody>
        <p className="text-sm text-muted-foreground">Any content: charts, tables, lists.</p>
      </PanelBody>
    </Panel>
  ),
};

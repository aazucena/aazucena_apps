import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SplitButton,
  SplitButtonPrimary,
  SplitButtonTrigger,
  SplitButtonContent,
  SplitButtonItem,
  SplitButtonMenu,
} from '@aazucena/ui';
import {
  Play,
  ChevronDown,
  Database,
  Shield,
  Zap,
  Globe,
  Save,
  Download,
  Share,
} from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite action component combining a primary button with a secondary dropdown menu.
 * - **UX:** Features merged borders and corner-radii using the `ButtonGroup` primitive for a unified module look.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`, `gradient`) with consistent tactile feedback.
 * - **Composition:** Fully modular parts (Primary, Menu, Trigger, Content, Item) for flexible action orchestration.
 */
const meta = {
  title: 'Components/Actions/SplitButton',
  component: SplitButton,
  subcomponents: {
    SplitButtonPrimary,
    SplitButtonTrigger,
    SplitButtonContent,
    SplitButtonItem,
    SplitButtonMenu,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button group that provides a primary action and a secondary dropdown menu for related tasks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'glass', 'cyber', 'gradient'],
      description: 'The visual style of the button pair',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['default', 'sm', 'lg'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for saving or committing changes.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <SplitButtonMenu>
      <SplitButton {...args}>
        <SplitButtonPrimary>
          <Save className="mr-2" /> Save_Project
        </SplitButtonPrimary>
        <SplitButtonTrigger variant={args.variant} />
      </SplitButton>
      <SplitButtonContent>
        <SplitButtonItem>Save as Draft</SplitButtonItem>
        <SplitButtonItem>Export to JSON</SplitButtonItem>
        <SplitButtonItem>Push to GitHub</SplitButtonItem>
      </SplitButtonContent>
    </SplitButtonMenu>
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
    <div className="p-12 bg-background border border-signal/10 rounded-card">
      <SplitButtonMenu>
        <SplitButton {...args}>
          <SplitButtonPrimary
            variant="cyber"
            className="font-mono italic uppercase tracking-tighter text-sm h-12"
          >
            <Play className="mr-2 animate-pulse" /> EXECUTE_INIT
          </SplitButtonPrimary>
          <SplitButtonTrigger variant="cyber" className="h-12 border-signal/40" />
        </SplitButton>
        <SplitButtonContent variant="cyber" className="font-mono">
          <SplitButtonItem className="focus:bg-signal/20 focus:text-signal gap-3">
            <Zap className="size-4" /> PULSE_SYNC
          </SplitButtonItem>
          <SplitButtonItem className="focus:bg-signal/20 focus:text-signal gap-3">
            <Shield className="size-4" /> AUTH_ENCLAVE
          </SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonMenu>
    </div>
  ),
};

/**
 * Modern gradient variant for primary call-to-actions.
 */
export const Highlight: Story = {
  args: {
    variant: 'gradient',
  },
  render: (args) => (
    <SplitButtonMenu>
      <SplitButton {...args}>
        <SplitButtonPrimary
          variant="gradient"
          className="rounded-control rounded-r-none px-10 h-14 font-black uppercase tracking-widest text-foreground"
        >
          DOWNLOAD_INTEL
        </SplitButtonPrimary>
        <SplitButtonTrigger
          variant="gradient"
          className="rounded-control rounded-l-none h-14 px-6 border-rule text-foreground"
        />
      </SplitButton>
      <SplitButtonContent className="rounded-card">
        <SplitButtonItem className="gap-3">
          <Globe className="size-4 opacity-40" /> Global Region
        </SplitButtonItem>
        <SplitButtonItem className="gap-3">
          <Database className="size-4 opacity-40" /> Local Node
        </SplitButtonItem>
      </SplitButtonContent>
    </SplitButtonMenu>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 rounded-card relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-scrim" />
      <SplitButtonMenu>
        <SplitButton {...args} className="">
          <SplitButtonPrimary
            variant="glass"
            className="bg-state text-foreground border-rule hover:bg-panel-raised rounded-l-card h-12"
          >
            Share_Uplink
          </SplitButtonPrimary>
          <SplitButtonTrigger
            variant="glass"
            className="bg-state text-foreground border-rule hover:bg-panel-raised rounded-r-card h-12"
          />
        </SplitButton>
        <SplitButtonContent variant="glass" className="border-rule text-foreground">
          <SplitButtonItem className="focus:bg-state">To_Public_Channel</SplitButtonItem>
          <SplitButtonItem className="focus:bg-state">To_Private_Enclave</SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonMenu>
    </div>
  ),
};

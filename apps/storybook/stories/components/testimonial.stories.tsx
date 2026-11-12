import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAvatar,
  TestimonialFooter,
  TestimonialName,
  TestimonialQuote,
  TestimonialTitle,
} from '@aazucena/ui';
import { MessageDots as Quote, Activity, Zap, Globe, Shield } from '@aazucena/icons';
import { Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for social proof and entity endorsements.
 * - **UX:** Features integrated avatar scaling and high-impact quote typography with leading-relaxed presets.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `` and decorative icons.
 * - **Composition:** Fully modular parts (Quote, Footer, Author, Name, Title, Avatar) for tailorable testimonial blocks.
 */
const meta = {
  title: 'Components/Content/Testimonial',
  component: Testimonial,
  subcomponents: {
    TestimonialQuote,
    TestimonialFooter,
    TestimonialAuthor,
    TestimonialName,
    TestimonialTitle,
    TestimonialAvatar,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for displaying client feedback or endorsements. Supports multiple visual themes and high-fidelity avatar integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the card',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a professional endorsement with an image avatar.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px]">
      <Testimonial {...args} className="">
        <div className="flex justify-between items-start mb-4">
          <Quote className="size-8 text-primary opacity-20" />
          <Badge variant="outline" size="xs">
            CLIENT_REVIEW
          </Badge>
        </div>
        <TestimonialQuote>
          "Aldrin's approach to engineering intelligence is truly unique. The level of fidelity and
          adaptive logic in his design systems has significantly optimized our workflow and
          increased signal gain by 42%."
        </TestimonialQuote>
        <TestimonialFooter>
          <TestimonialAuthor>
            <TestimonialName>Dr. Elias Vance</TestimonialName>
            <TestimonialTitle>Director of Research @ BlackMesa_Labs</TestimonialTitle>
          </TestimonialAuthor>
          <TestimonialAvatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" />
        </TestimonialFooter>
      </Testimonial>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-background rounded-card border border-signal/10">
      <Testimonial {...args} className="border-signal/20 shadow-none">
        <div className="flex justify-between items-center mb-6">
          <Activity className="size-5 text-signal animate-pulse" />
          <span className="font-mono text-[9px] text-signal/40 uppercase tracking-[0.4em]">
            SOURCE: EXTERNAL_VALIDATOR
          </span>
        </div>
        <TestimonialQuote className="font-mono italic text-signal/80 leading-relaxed text-sm">
          "PROTOCOL_SUCCESS: Integration with the AAZUCENA_OS core was seamless. Performance
          benchmarks exceeded all previous iterations across US_EAST sectors."
        </TestimonialQuote>
        <TestimonialFooter>
          <TestimonialAuthor className="font-mono">
            <TestimonialName className="text-signal uppercase tracking-tighter">
              UNIT_0x7F42
            </TestimonialName>
            <TestimonialTitle className="text-signal/40 uppercase text-[10px]">
              Security_Enclave_V4
            </TestimonialTitle>
          </TestimonialAuthor>
          <TestimonialAvatar variant="cyber">CY</TestimonialAvatar>
        </TestimonialFooter>
      </Testimonial>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-40 rounded-card relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-scrim" />
      <div className="w-[500px] relative z-10">
        <Testimonial {...args} className="border-rule text-foreground">
          <TestimonialQuote className="text-foreground text-lg font-medium tracking-tight">
            "The crystal-clear interface and responsiveness of the glass-mode components are
            world-class. A paradigm shift in high-fidelity application architecture."
          </TestimonialQuote>
          <TestimonialFooter className="pt-8 border-t border-rule">
            <TestimonialAuthor>
              <TestimonialName className="text-foreground">Sarah Connor</TestimonialName>
              <TestimonialTitle className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">
                Lead_UX_Unit
              </TestimonialTitle>
            </TestimonialAuthor>
            <TestimonialAvatar variant="glass" className="bg-state border-rule">
              SC
            </TestimonialAvatar>
          </TestimonialFooter>
        </Testimonial>
      </div>
    </div>
  ),
};

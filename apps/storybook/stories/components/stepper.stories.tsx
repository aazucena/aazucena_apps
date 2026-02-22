import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, Step, StepIndicator, StepLabel, StepLine } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, CheckCircle, Database } from '@aazucena/icons';
import { useState } from 'react';
import { Button, Card, CardContent } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Sequential navigation primitive for multi-step processes (Onboarding, Checkouts, Data Ingestion).
 * - **UX:** Features state-aware indicators (`pending`, `active`, `completed`) with automated icon switching.
 * - **Design:** Optimized for horizontal flow with integrated connectors (`StepLine`) that respond to the step status.
 * - **Composition:** Fully modular parts (Step, Indicator, Label, Line) for tailorable workflow visualizations.
 */
const meta = {
  title: 'Components/Navigation/Stepper',
  component: Stepper,
  subcomponents: {
    Step,
    StepIndicator,
    StepLabel,
    StepLine,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigational helper that guides users through a multi-step process. Supports multiple visual states and responsive labeling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'The physical spacing between steps',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

const basicSteps = [
  { label: 'Identity_Token', status: 'completed' },
  { label: 'Extraction_Phase', status: 'active' },
  { label: 'Verification', status: 'pending' },
  { label: 'Commit', status: 'pending' },
];

/**
 * Standard implementation for sequential task flows.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[700px] p-12 border rounded-[2rem] bg-card shadow-2xl">
      <Stepper {...args}>
        {basicSteps.map((step, index) => (
          <Step key={index} status={step.status as any}>
            <StepIndicator status={step.status as any} index={index} />
            <StepLabel>{step.label}</StepLabel>
            {index < basicSteps.length - 1 && <StepLine status={step.status as any} />}
          </Step>
        ))}
      </Stepper>
    </div>
  ),
};

/**
 * High-performance technical implementation using custom icons.
 */
export const TechnicalSequence: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const techSteps = [
      { label: 'BOOT_INIT', icon: Zap },
      { label: 'SYLINK_UP', icon: Globe },
      { label: 'ENCLAVE_AUTH', icon: Shield },
      { label: 'DATA_READY', icon: Database },
    ];

    const getStatus = (index: number) => {
      if (index < current) return 'completed';
      if (index === current) return 'active';
      return 'pending';
    };

    return (
      <div className="w-[800px] space-y-12">
        <Stepper>
          {techSteps.map((step, index) => (
            <Step key={index} status={getStatus(index)}>
              <StepIndicator status={getStatus(index)}>
                <step.icon size={16} />
              </StepIndicator>
              <StepLabel className="font-mono italic text-cyan-500/60">{step.label}</StepLabel>
              {index < techSteps.length - 1 && (
                <StepLine
                  status={getStatus(index)}
                  className={cn(
                    getStatus(index) === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500/20',
                  )}
                />
              )}
            </Step>
          ))}
        </Stepper>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setCurrent(Math.max(0, current - 1))}>
            Previous_Phase
          </Button>
          <Button size="sm" onClick={() => setCurrent(Math.min(3, current + 1))}>
            Advance_Sequence
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Compact format for secondary workflows or sidebar settings.
 */
export const Compact: Story = {
  args: {
    variant: 'compact',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Stepper {...args}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <Step key={i} status={i === 0 ? 'completed' : i === 1 ? 'active' : 'pending'}>
            <StepIndicator
              status={i === 0 ? 'completed' : i === 1 ? 'active' : 'pending'}
              index={i}
            />
            {i < 4 && <StepLine status={i === 0 ? 'completed' : i === 1 ? 'active' : 'pending'} />}
          </Step>
        ))}
      </Stepper>
    </div>
  ),
};

// Helper for stories
const cn = (...args: any[]) => args.filter(Boolean).join(' ');

import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  Field, 
  FieldContent, 
  FieldDescription, 
  FieldError, 
  FieldLabel, 
  FieldSeparator, 
  FieldTitle,
  FieldHeader,
  FieldMeta,
  FieldControl,
  FieldGroup,
  FieldSet,
  FieldLegend
} from '@aazucena/ui';
import { Input, Checkbox, Button, Badge } from '@aazucena/ui';
import { Shield, Zap, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Deeply atomic system for managing form layout, validation states, and technical metadata.
 * - **Accessibility:** Built-in support for `aria-invalid`, `aria-describedby`, and standard Label linking.
 * - **Layout:** Supports `vertical`, `horizontal`, and `responsive` orientations using CVA.
 * - **Aesthetics:** Optimized for high-density technical forms with `FieldMeta` and `FieldHeader` extensions.
 */
const meta = {
  title: 'Components/Forms/Field',
  component: Field,
  subcomponents: {
    FieldContent,
    FieldLabel,
    FieldTitle,
    FieldDescription,
    FieldError,
    FieldSeparator,
    FieldHeader,
    FieldMeta,
    FieldControl,
    FieldGroup,
    FieldSet,
    FieldLegend,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive layout suite for form elements. Manages labels, descriptions, error states, and technical metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Layout flow of the field elements',
      table: { category: 'Layout' }
    }
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard vertical field implementation with label and description.
 */
export const Basic: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Field {...args}>
        <FieldLabel>NODE_IDENTIFIER</FieldLabel>
        <FieldControl>
          <Input placeholder="e.g., US_EAST_01" />
        </FieldControl>
        <FieldDescription>The unique string used to address this edge node.</FieldDescription>
      </Field>
    </div>
  ),
};

/**
 * High-density technical field with metadata and status indicators.
 */
export const TechnicalField: Story = {
  render: () => (
    <div className="w-[450px] p-8 border rounded-[2rem] bg-card">
      <FieldHeader>
        <FieldTitle className="gap-2">
          <Shield size={14} className="text-primary" /> Security_Key
        </FieldTitle>
        <FieldMeta>STATUS: ENCRYPTED</FieldMeta>
      </FieldHeader>
      <Field>
        <FieldControl>
          <Input type="password" value="••••••••••••" readOnly />
        </FieldControl>
        <div className="mt-3 flex justify-between items-center">
          <FieldDescription className="text-[10px]">RSA-4096 // Rotated 12d ago</FieldDescription>
          <Badge variant="outline" size="xs">ACTIVE</Badge>
        </div>
      </Field>
    </div>
  ),
};

/**
 * Demonstrates the horizontal orientation, ideal for settings or toggles.
 */
export const HorizontalToggle: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-[450px] p-6 border rounded-2xl bg-muted/5">
      <Field {...args}>
        <div className="flex-1 space-y-1">
          <FieldLabel className="text-sm font-bold">Enable_Edge_Ingestion</FieldLabel>
          <FieldDescription className="text-xs">Automatically process telemetry at the closest node.</FieldDescription>
        </div>
        <FieldControl className="w-auto">
          <Checkbox defaultChecked />
        </FieldControl>
      </Field>
    </div>
  ),
};

/**
 * Comprehensive form section using FieldSet and FieldGroup.
 */
export const FormSection: Story = {
  render: () => (
    <div className="w-[500px]">
      <FieldSet>
        <FieldLegend variant="legend" className="text-xl font-black tracking-tighter uppercase">Protocol_Configuration</FieldLegend>
        <FieldGroup className="space-y-8">
          <Field>
            <FieldLabel>Ingestion_Path</FieldLabel>
            <FieldControl>
              <Input placeholder="/api/v1/telemetry" />
            </FieldControl>
          </Field>
          
          <FieldSeparator>AUDIT_LEVELS</FieldSeparator>
          
          <Field>
            <FieldHeader>
              <FieldLabel>Validation_Threshold</FieldLabel>
              <Badge variant="cyber">CRITICAL</Badge>
            </FieldHeader>
            <FieldControl>
              <Input type="number" defaultValue={95} />
            </FieldControl>
            <FieldError errors={[{ message: "Threshold below 98% increases jitter risk." }]} />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

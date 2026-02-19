import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from '@storybook/test';
import {
  FloatingLabel,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@aazucena/ui';
import { Send } from '@aazucena/icons';

/**
 * ## Contact Form Recipe
 * Demonstrates composing FloatingLabel, Select, Checkbox, and Button
 * into a fully-functional contact form pattern.
 */
const meta = {
  title: 'Recipes/Forms/ContactForm',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A complete contact form composed from FloatingLabel, Select, Checkbox, and Button primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ContactFormUI = ({ showErrors = false }: { showErrors?: boolean }) => (
  <Card className="w-[480px] shadow-xl">
    <CardHeader>
      <CardTitle className="text-2xl font-black tracking-tighter">Get In Touch</CardTitle>
      <CardDescription>Fill out the form below and I'll respond within 24 hours.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FloatingLabel label="First Name" id="first-name" />
          {showErrors && <p className="text-xs text-destructive mt-1">First name is required</p>}
        </div>
        <div>
          <FloatingLabel label="Last Name" id="last-name" />
          {showErrors && <p className="text-xs text-destructive mt-1">Last name is required</p>}
        </div>
      </div>
      <div>
        <FloatingLabel label="Email Address" type="email" id="email" />
        {showErrors && <p className="text-xs text-destructive mt-1">Valid email is required</p>}
      </div>
      <Select>
        <SelectTrigger className="rounded-xl h-12">
          <SelectValue placeholder="Select inquiry type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="project">Project Collaboration</SelectItem>
          <SelectItem value="speaking">Speaking Opportunity</SelectItem>
          <SelectItem value="general">General Inquiry</SelectItem>
          <SelectItem value="feedback">Portfolio Feedback</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <FloatingLabel label="Message" multiline rows={4} id="message" />
        {showErrors && <p className="text-xs text-destructive mt-1">Message is required</p>}
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="consent" />
        <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
          I agree to the privacy policy and terms of service.
        </Label>
      </div>
      <Button className="w-full" size="lg">
        <Send className="mr-2 size-4" />
        Send Message
      </Button>
    </CardContent>
  </Card>
);

/**
 * Default contact form in its initial empty state.
 */
export const Default: Story = {
  render: () => <ContactFormUI />,
};

/**
 * Shows inline validation error states for all required fields.
 */
export const WithValidationErrors: Story = {
  render: () => <ContactFormUI showErrors />,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const errors = canvas.getAllByText(/is required/i);
    await expect(errors.length).toBeGreaterThan(0);
    errors.forEach(async (err: HTMLElement) => {
      await expect(err).toBeVisible();
    });
  },
};

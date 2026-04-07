import type { Meta, StoryObj } from '@storybook/react';
import { PurchaseCard } from '@aazucena/ui';

const meta: Meta<typeof PurchaseCard> = {
  title: 'Components/Commerce/PurchaseCard',
  component: PurchaseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the product or service.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    description: {
      control: 'text',
      description: 'Brief description of the product or service.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    price: {
      control: 'text',
      description: 'Price string (e.g., "$9.99/month").',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    imageUrl: {
      control: 'text',
      description: 'Optional URL for a product image.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    buttonText: {
      control: 'text',
      description: 'Text for the purchase button.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Purchase' },
      },
    },
    onPurchase: {
      action: 'purchased',
      description: 'Callback function when the purchase button is clicked.',
      table: { category: 'Behavior', type: { summary: '() => void' } },
    },
    features: {
      control: 'object',
      description: 'Array of features to list.',
      table: { category: 'Content', type: { summary: 'object' } },
    },
    badgeText: {
      control: 'text',
      description: 'Optional text for a badge (e.g., "New", "Pro").',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the purchase button is disabled.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PurchaseCard>;

export const Default: Story = {
  args: {
    title: 'Basic Plan',
    description: 'Essential features for getting started.',
    price: '$9.99/month',
    buttonText: 'Get Started',
    features: ['5GB Storage', '1 User', 'Basic Analytics'],
  },
};

export const WithImage: Story = {
  args: {
    title: 'Pro Access',
    description: 'Unlock advanced features and priority support.',
    price: '$49.99/year',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    buttonText: 'Upgrade Now',
    features: ['Unlimited Storage', '10 Users', 'Advanced Analytics', '24/7 Support'],
    badgeText: 'Popular',
  },
};

export const CyberVariant: Story = {
  args: {
    title: 'Enterprise_Node',
    description: 'Custom solutions for large organizations.',
    price: 'Contact for pricing',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    buttonText: 'REQUEST_DEMO',
    features: ['Dedicated Servers', 'Custom Integrations', 'On-Premise Deployment'],
    badgeText: 'Cyber',
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    title: 'Glass Tier',
    description: 'Experience the clarity of transparent data streams.',
    price: '$29.99/month',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    buttonText: 'Activate Glass',
    features: ['Frosted UI', 'Blended Analytics', 'Atmospheric Themes'],
    badgeText: 'New',
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const DisabledPurchase: Story = {
  args: {
    title: 'Unavailable Item',
    description: 'This item is currently out of stock.',
    price: 'N/A',
    buttonText: 'Out of Stock',
    disabled: true,
  },
};

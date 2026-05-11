import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ConsentManager } from '@aazucena/ui';

const meta: Meta<typeof ConsentManager> = {
  title: 'Components/Utilities/ConsentManager',
  component: ConsentManager,
  parameters: {
    layout: 'fullscreen', // Use fullscreen layout for banner-like components
  },
  tags: ['autodocs'],
  argTypes: {
    appName: {
      control: 'text',
      description: 'The name of the application requesting consent.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'My Application' },
      },
    },
    policyLink: {
      control: 'text',
      description: 'URL to the privacy policy.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: '#' },
      },
    },
    categories: {
      control: 'object',
      description: 'Array of consent categories with id, name, description, and required status.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    storageKey: {
      control: 'text',
      description: 'Local storage key to save consent preferences.',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: 'app_consent_preferences' },
      },
    },
    onConsentChange: {
      action: 'consentChanged',
      description: 'Callback function when consent preferences are updated.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the consent banner.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
  // Add a decorator to clear local storage for consistent story behavior
  decorators: [
    (Story) => {
      React.useEffect(() => {
        localStorage.clear();
      }, []);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ConsentManager>;

const defaultCategories = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for basic site functionality.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Helps us understand how visitors interact with the website.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to track visitors across websites to display relevant ads.',
    required: false,
  },
];

export const Default: Story = {
  args: {
    appName: 'aazucena.me',
    policyLink: '/privacy-policy',
    categories: defaultCategories,
  },
};

export const CustomInitialState: Story = {
  args: {
    appName: 'aazucena.me',
    policyLink: '/privacy-policy',
    categories: [
      {
        id: 'essential',
        name: 'Essential',
        description: 'Required for basic site functionality.',
        required: true,
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Optional analytics.',
        required: false,
        checked: true,
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Optional marketing.',
        required: false,
        checked: false,
      },
    ],
  },
};

export const CyberVariant: Story = {
  args: {
    appName: 'aazucena.me',
    policyLink: '/privacy-policy',
    categories: defaultCategories,
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    appName: 'aazucena.me',
    policyLink: '/privacy-policy',
    categories: defaultCategories,
    variant: 'glass',
  },
};

export const WithMoreCategories: Story = {
  args: {
    appName: 'aazucena.me',
    policyLink: '/privacy-policy',
    categories: [
      ...defaultCategories,
      {
        id: 'social',
        name: 'Social Media',
        description: 'Enables social media features.',
        required: false,
      },
      {
        id: 'personalization',
        name: 'Personalization',
        description: 'Customizes your experience.',
        required: false,
      },
    ],
  },
};

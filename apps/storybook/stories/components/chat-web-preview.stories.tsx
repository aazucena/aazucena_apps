import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatWebPreview } from '@aazucena/ui';

const meta: Meta<typeof ChatWebPreview> = {
  title: 'Components/Chat/ChatWebPreview',
  component: ChatWebPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'The URL for which to display the preview.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    previewData: {
      control: 'object',
      description: 'Pre-fetched data for the web preview (title, description, image, favicon).',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Custom placeholder content to display while loading or if no preview data.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the web preview card.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size constraint of the web preview card.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'sm' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatWebPreview>;

const examplePreviewData = {
  title: 'Google - Search the world\'s information',
  description: 'Search the world\'s information, including webpages, images, videos and more. Google has many special features to help you find exactly what you\'re looking for.',
  image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  favicon: 'https://www.google.com/favicon.ico',
  url: 'https://www.google.com',
};

const examplePreviewData2 = {
  title: 'GitHub: Where the world builds software',
  description: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code, and more.',
  image: 'https://github.githubassets.com/images/modules/site/social-cards/github-social-card.png',
  favicon: 'https://github.githubassets.com/favicons/favicon.svg',
  url: 'https://github.com',
};

export const Default: Story = {
  args: {
    url: 'https://www.google.com',
    previewData: examplePreviewData,
  },
};

export const CyberVariant: Story = {
  args: {
    url: 'https://github.com',
    previewData: examplePreviewData2,
    variant: 'cyber',
    size: 'lg',
  },
};

export const GlassVariant: Story = {
  args: {
    url: 'https://vercel.com',
    previewData: {
      title: 'Vercel: Develop. Preview. Ship.',
      description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
      image: 'https://assets.vercel.com/image/upload/front/vercel/twitter-card.png',
      favicon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png',
      url: 'https://vercel.com',
    },
    variant: 'glass',
    size: 'sm',
  },
};

export const NoImage: Story = {
  args: {
    url: 'https://example.com',
    previewData: {
      title: 'Example Domain',
      description: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
      favicon: 'https://example.com/favicon.ico',
      url: 'https://example.com',
    },
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    url: 'https://loading-example.com',
    placeholder: <div className="flex h-24 items-center justify-center text-orange-500">Custom Loading...</div>,
  },
};

export const OnlyURL: Story = {
  args: {
    url: 'https://aazucena.me',
  },
};

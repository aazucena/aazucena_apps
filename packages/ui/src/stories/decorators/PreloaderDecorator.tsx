import React from 'react';
import { Decorator } from '@storybook/react';

export const PreloaderDecorator: Decorator = (Story) => (
  <div className="font-sans antialiased">
    <Story />
  </div>
);

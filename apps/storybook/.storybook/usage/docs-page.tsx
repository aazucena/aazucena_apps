import * as React from 'react';
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import { UsedIn } from './UsedIn';

/** Storybook's default autodocs page, plus where the apps use the component. */
export function AvraDocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <UsedIn />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}

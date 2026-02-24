import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { AddressForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Account/AddressForm',
  component: AddressForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
    defaultMode: {
      control: 'select',
      options: ['autocomplete', 'manual'],
      table: { category: 'Behaviour' },
    },
  },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };

/**
 * Demonstrates the autocomplete slot wired with a simulated provider search input.
 * In a real integration, replace the inner `<input>` and button with your SDK's
 * autocomplete widget (Google Places, Mapbox, HERE, etc.) and call `onSelect` with
 * the normalised AddressFormData when the user picks a result.
 */
export const WithAutocompleteSlot: Story = {
  args: {
    variant: 'default',
    autocompleteSlot: (onSelect) => (
      <div className="space-y-2">
        <input
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
          placeholder="Search for an address…"
          readOnly
        />
        <button
          type="button"
          className="text-xs text-primary underline underline-offset-2"
          onClick={() =>
            onSelect({
              line1: '1600 Amphitheatre Pkwy',
              city: 'Mountain View',
              state: 'CA',
              postalCode: '94043',
              country: 'United States',
              placeId: 'ChIJj61dQgK6j4AR4GeTYWZsKWw',
              formattedAddress:
                '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
              source: 'google',
              geojson: {
                type: 'Point',
                coordinates: [-122.0842499, 37.4224764],
              },
            })
          }
        >
          Simulate selecting &ldquo;Google HQ&rdquo;
        </button>
      </div>
    ),
  },
};

export const WithDefaultValues: Story = {
  args: {
    variant: 'default',
    defaultValues: {
      fullName: 'Aldrin Azucena',
      line1: '123 Dev Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      type: 'home',
      isDefault: true,
    },
  },
};

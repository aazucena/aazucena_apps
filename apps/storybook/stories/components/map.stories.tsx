import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Map, Marker, Popup } from '@aazucena/ui';
import { defaultMarkerIcon } from '@aazucena/ui/components/ui/map.impl';
import { Button } from '@aazucena/ui';
import { MapPin, Target } from '@aazucena/icons'; // Assuming these icons are available

const meta: Meta<typeof Map> = {
  title: 'Components/Display/Map',
  component: Map,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    center: {
      control: 'object',
      description: 'Initial geographical center of the map (latitude, longitude).',
      table: {
        category: 'State',
        type: { summary: 'object' },
        defaultValue: { summary: '{ lat: 51.505, lng: -0.09 }' },
      },
    },
    zoom: {
      control: 'number',
      description: 'Initial zoom level of the map.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '13' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the map container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the map is interactive (zoom, pan, etc.).',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      control: false,
      description: 'Map layers, markers, popups, etc.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    center: [51.505, -0.09],
    zoom: 13,
    className: 'h-[400px] w-[600px]',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    );
  },
};

export const CustomCenterAndZoom: Story = {
  args: {
    center: [34.052235, -118.243683], // Los Angeles
    zoom: 10,
    className: 'h-[400px] w-[600px]',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[34.052235, -118.243683]} icon={icon}>
          <Popup>Los Angeles</Popup>
        </Marker>
      </Map>
    );
  },
};

export const MultipleMarkers: Story = {
  args: {
    center: [39.8283, -98.5795], // Center of US
    zoom: 4,
    className: 'h-[400px] w-[800px]',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[40.7128, -74.006]} icon={icon}>
          <Popup>New York</Popup>
        </Marker>
        <Marker position={[34.052235, -118.243683]} icon={icon}>
          <Popup>Los Angeles</Popup>
        </Marker>
        <Marker position={[41.8781, -87.6298]} icon={icon}>
          <Popup>Chicago</Popup>
        </Marker>
      </Map>
    );
  },
};

export const CyberVariant: Story = {
  args: {
    center: [48.8566, 2.3522], // Paris
    zoom: 12,
    variant: 'cyber',
    className: 'h-[500px] w-[700px] bg-black',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[48.8584, 2.2945]} icon={icon}>
          <Popup>Eiffel Tower</Popup>
        </Marker>
      </Map>
    );
  },
};

export const GlassVariant: Story = {
  args: {
    center: [35.6895, 139.6917], // Tokyo
    zoom: 10,
    variant: 'glass',
    className: 'h-[500px] w-[700px] bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[35.658, 139.7414]} icon={icon}>
          <Popup>Tokyo Tower</Popup>
        </Marker>
      </Map>
    );
  },
};

export const StaticMap: Story = {
  args: {
    center: [51.505, -0.09],
    zoom: 13,
    interactive: false,
    className: 'h-[400px] w-[600px]',
  },
  render: (args) => {
    const icon = defaultMarkerIcon();
    return (
      <Map {...args}>
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>Static Location</Popup>
        </Marker>
      </Map>
    );
  },
};

export const MapWithButtonTrigger: Story = {
  args: {
    center: [51.505, -0.09],
    zoom: 13,
    className: 'h-[400px] w-[600px]',
  },
  render: (args) => {
    const [showMap, setShowMap] = React.useState(false);
    const icon = defaultMarkerIcon();
    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setShowMap(!showMap)}>{showMap ? 'Hide Map' : 'Show Map'}</Button>
        {showMap && (
          <Map {...args}>
            <Marker position={[51.505, -0.09]} icon={icon}>
              <Popup>Dynamic Map</Popup>
            </Marker>
          </Map>
        )}
      </div>
    );
  },
};

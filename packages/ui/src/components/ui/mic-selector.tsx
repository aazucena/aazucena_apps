'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'; // Assuming Select components are available
import { Microphone, ChevronDown, DangerCircle as Alert } from '@aazucena/icons';

const micSelectorVariants = cva(
  'flex items-center gap-2 rounded-md border p-2 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface MicSelectorProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof micSelectorVariants> {
  selectedDeviceId: string;
  onSelectDevice: (deviceId: string) => void;
  placeholder?: string;
}

const MicSelector = React.forwardRef<HTMLDivElement, MicSelectorProps>(
  (
    {
      className,
      variant,
      selectedDeviceId,
      onSelectDevice,
      placeholder = 'Select Microphone',
      ...props
    },
    ref,
  ) => {
    const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
    const [permissionGranted, setPermissionGranted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const getMicrophones = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setPermissionGranted(true);
          const deviceList = await navigator.mediaDevices.enumerateDevices();
          setDevices(deviceList.filter((device) => device.kind === 'audioinput'));
          stream.getTracks().forEach((track) => track.stop()); // Stop stream after getting devices
        } catch (err: unknown) {
          setError('Microphone access denied or not available. Please check browser permissions.');
          console.error('Error accessing microphone:', err);
          setPermissionGranted(false);
        }
      };

      getMicrophones();
      navigator.mediaDevices.addEventListener('devicechange', getMicrophones);

      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', getMicrophones);
      };
    }, []);

    if (!permissionGranted) {
      return (
        <div ref={ref} className={cn(micSelectorVariants({ variant }), className)} {...props}>
          <Alert className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-500">{error || 'Microphone access required.'}</span>
        </div>
      );
    }

    if (devices.length === 0) {
      return (
        <div ref={ref} className={cn(micSelectorVariants({ variant }), className)} {...props}>
          <Microphone className="text-muted-foreground h-5 w-5" />
          <span className="text-muted-foreground text-sm">No microphones found.</span>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(micSelectorVariants({ variant }), className)} {...props}>
        <Select value={selectedDeviceId} onValueChange={onSelectDevice}>
          <SelectTrigger
            className={cn(
              'flex items-center gap-2 [&>span]:line-clamp-1',
              variant === 'cyber' && 'border-cyan-500/30 bg-cyan-500/5 font-mono text-cyan-400',
              variant === 'glass' && 'glass border-input/20',
            )}
          >
            <Microphone className="h-4 w-4 shrink-0" />
            <SelectValue placeholder={placeholder} />
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              variant === 'cyber' && 'border-cyan-500/30 bg-black font-mono text-cyan-400',
              variant === 'glass' && 'glass border-input/20',
            )}
          >
            {devices.map((device) => (
              <SelectItem
                key={device.deviceId}
                value={device.deviceId}
                className={cn(
                  variant === 'cyber' && 'focus:bg-cyan-500/20 focus:text-cyan-400',
                  variant === 'glass' && 'focus:bg-white/10 focus:text-white',
                )}
              >
                {device.label || `Microphone (${device.deviceId})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);
MicSelector.displayName = 'MicSelector';

export { MicSelector, micSelectorVariants };

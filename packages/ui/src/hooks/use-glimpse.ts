'use client';

import * as React from 'react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFocus,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from '@floating-ui/react';

export interface UseGlimpseOptions {
  url: string;
  delay?: number | { open?: number; close?: number };
  placement?: Placement;
}

export interface UseGlimpseReturn {
  isOpen: boolean;
  refs: ReturnType<typeof useFloating>['refs'];
  floatingStyles: ReturnType<typeof useFloating>['floatingStyles'];
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  domain: string;
}

export function useGlimpse({
  url,
  delay = { open: 600, close: 100 },
  placement = 'bottom',
}: UseGlimpseOptions): UseGlimpseReturn {
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(12), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const hover = useHover(context, { delay, move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const domain = React.useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, [url]);

  return { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, domain };
}

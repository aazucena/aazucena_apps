'use client';

import * as React from 'react';
import { useLocalStorage, useTypingEffect } from '@aazucena/hooks';

export interface UseCodeBlockCommandOptions {
  methods?: Record<string, string>;
  command?: string;
  storageKey?: string;
  typingEffect?: boolean;
  typingDelay?: number;
  showCommandSymbol?: boolean;
  output?: string;
}

export interface UseCodeBlockCommandReturn {
  methodKeys: string[];
  preferredMethod: string;
  setPreferredMethod: (value: string) => void;
  activeMethod: string;
  activeCommand: string;
  displayedCommand: string;
  displayedOutput: string;
  commandContent: string;
  cmdStatus: { copied: boolean; error: boolean };
  outStatus: { copied: boolean; error: boolean };
  handleCopyAction: (
    text: string,
    setStatus: React.Dispatch<React.SetStateAction<{ copied: boolean; error: boolean }>>,
  ) => Promise<void>;
  setCmdStatus: React.Dispatch<React.SetStateAction<{ copied: boolean; error: boolean }>>;
  setOutStatus: React.Dispatch<React.SetStateAction<{ copied: boolean; error: boolean }>>;
}

export function useCodeBlockCommand({
  methods,
  command: singleCommand,
  storageKey = 'aazucena-command-preference',
  typingEffect = false,
  typingDelay = 50,
  showCommandSymbol = true,
  output,
}: UseCodeBlockCommandOptions): UseCodeBlockCommandReturn {
  const methodKeys = React.useMemo(() => (methods ? Object.keys(methods) : []), [methods]);
  const initialMethod = methodKeys.length > 0 ? methodKeys[0]! : '';

  const [preferredMethod, setPreferredMethod] = useLocalStorage<string>(storageKey, initialMethod);

  const activeMethod = React.useMemo(() => {
    if (!methods) return '';
    if (methods[preferredMethod]) return preferredMethod;
    return methodKeys[0] ?? '';
  }, [methods, preferredMethod, methodKeys]);

  const activeCommand = React.useMemo(() => {
    if (methods && activeMethod) return methods[activeMethod]!;
    return singleCommand ?? '';
  }, [methods, activeMethod, singleCommand]);

  const displayedCommand = useTypingEffect(activeCommand, {
    delay: typingDelay,
    enabled: typingEffect,
  });

  const [isCommandDone, setIsCommandDone] = React.useState(!typingEffect);

  React.useEffect(() => {
    setIsCommandDone(displayedCommand === activeCommand);
  }, [displayedCommand, activeCommand]);

  const displayedOutput = useTypingEffect(output ?? '', {
    delay: Math.max(10, typingDelay / 2),
    enabled: typingEffect && isCommandDone,
  });

  const commandContent = React.useMemo(() => {
    const prompt = showCommandSymbol ? '$ ' : '';
    return `${prompt}${displayedCommand}`;
  }, [displayedCommand, showCommandSymbol]);

  const [cmdStatus, setCmdStatus] = React.useState<{ copied: boolean; error: boolean }>({
    copied: false,
    error: false,
  });
  const [outStatus, setOutStatus] = React.useState<{ copied: boolean; error: boolean }>({
    copied: false,
    error: false,
  });

  const handleCopyAction = async (
    text: string,
    setStatus: React.Dispatch<React.SetStateAction<{ copied: boolean; error: boolean }>>,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ copied: true, error: false });
      setTimeout(() => setStatus({ copied: false, error: false }), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
      setStatus({ copied: false, error: true });
      setTimeout(() => setStatus({ copied: false, error: false }), 2000);
    }
  };

  return {
    methodKeys,
    preferredMethod,
    setPreferredMethod,
    activeMethod,
    activeCommand,
    displayedCommand,
    displayedOutput,
    commandContent,
    cmdStatus,
    outStatus,
    handleCopyAction,
    setCmdStatus,
    setOutStatus,
  };
}

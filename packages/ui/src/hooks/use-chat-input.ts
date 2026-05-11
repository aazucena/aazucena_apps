'use client';

import * as React from 'react';
import { useDropzone, type DropzoneState } from 'react-dropzone';
import type { Attachment } from '../components/ui/chat/chat-attachments';

export interface UseChatInputOptions {
  onSendMessage: (message: string, attachments?: Attachment[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  onFileChange?: (files: File[]) => void;
  globalDropzone?: boolean;
  autoReset?: boolean;
  commandPaletteTrigger?: string;
  onCommand?: (command: string) => void;
  isSending?: boolean;
}

export interface UseChatInputReturn {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: (e?: React.FormEvent) => void;
  handleRemoveAttachment: (id: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSpeechResult: (text: string) => void;
  dropzone: DropzoneState;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  formRef: React.RefObject<HTMLFormElement | null>;
  isDisabled: boolean;
}

export function useChatInput({
  onSendMessage,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024,
  acceptedFileTypes,
  onFileChange,
  globalDropzone = false,
  autoReset = true,
  commandPaletteTrigger = '/',
  onCommand,
  isSending = false,
}: UseChatInputOptions): UseChatInputReturn {
  const [message, setMessage] = React.useState('');
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isSending) {
      onSendMessage(
        message.trim(),
        attachments.filter((att) => att.status === 'uploaded'),
      );
      if (autoReset) {
        setMessage('');
        setAttachments([]);
      }
    }
  };

  // --- File Attachment Logic ---
  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > maxFiles) {
        console.error(`Too many files. Max allowed: ${maxFiles}`);
        return;
      }
      const newAttachments: Attachment[] = acceptedFiles.map((file) => ({
        id: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        status: 'uploaded',
        file,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
      onFileChange?.(acceptedFiles);
    },
    [maxFiles, onFileChange],
  );

  const dropzone = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles,
    maxSize: maxFileSize,
    accept: acceptedFileTypes
      ? acceptedFileTypes.reduce((acc: Record<string, string[]>, type) => {
          acc[type] = [];
          return acc;
        }, {})
      : undefined,
  });

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // --- Global Dropzone ---
  const handleGlobalDrop = React.useCallback(
    (event: DragEvent) => {
      if (!globalDropzone || !isInputFocused) return;
      event.preventDefault();
      event.stopPropagation();
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length > 0) handleDrop(files);
    },
    [globalDropzone, isInputFocused, handleDrop],
  );

  React.useEffect(() => {
    if (!globalDropzone) return;
    const dragOverHandler = (e: DragEvent) => {
      if (isInputFocused) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('drop', handleGlobalDrop);
    document.addEventListener('dragover', dragOverHandler);
    return () => {
      document.removeEventListener('drop', handleGlobalDrop);
      document.removeEventListener('dragover', dragOverHandler);
    };
  }, [globalDropzone, isInputFocused, handleGlobalDrop]);

  // --- Keyboard Shortcuts ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === commandPaletteTrigger && e.metaKey) {
      e.preventDefault();
      onCommand?.(commandPaletteTrigger);
    }
  };

  // --- Speech Recognition ---
  const handleSpeechResult = (text: string) => {
    setMessage((prev) => (prev ? `${prev} ` : '') + text);
    textareaRef.current?.focus();
  };

  const isDisabled = isSending || (!message.trim() && attachments.length === 0);

  return {
    message,
    setMessage,
    attachments,
    setAttachments,
    isInputFocused,
    setIsInputFocused,
    handleSendMessage,
    handleRemoveAttachment,
    handleKeyDown,
    handleSpeechResult,
    dropzone,
    textareaRef,
    formRef,
    isDisabled,
  };
}

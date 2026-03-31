'use client';

import { CircleNotch as Loader, Paperclip, Robot, Send } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '../button';
import { MicSelector } from '../mic-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import type { Attachment } from './chat-attachments';
import { ChatAttachments } from './chat-attachments';
import { useChatInput } from '../../../hooks/use-chat-input';

// --- Internal Sub-components ---

export const ChatInputContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-current/5 bg-current/5 p-6', className)}
    {...props}
  />
));
ChatInputContainer.displayName = 'ChatInputContainer';

export const ChatInputWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative flex items-end gap-3', className)} {...props} />
));
ChatInputWrapper.displayName = 'ChatInputWrapper';

export const ChatInputArea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof TextareaAutosize> & {
    variant?: 'default' | 'glass' | 'cyber';
    minRows?: number;
    maxRows?: number;
  }
>(({ className, variant = 'default', minRows = 1, maxRows = 8, ...props }, ref) => (
  <TextareaAutosize
    ref={ref}
    minRows={minRows}
    maxRows={maxRows}
    className={cn(
      'min-h-[56px] w-full resize-none py-4 pr-14 pl-6 text-sm shadow-inner',
      'border-input focus-visible:ring-ring bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      variant === 'cyber'
        ? 'rounded-xl font-mono text-xs shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
        : 'rounded-2xl',
      variant === 'glass' && 'glass-input',
      className,
    )}
    {...props}
  />
));
ChatInputArea.displayName = 'ChatInputArea';

export const ChatInputSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <div className="absolute right-3 bottom-3">
    <Button
      ref={ref}
      size="icon"
      className={cn('h-10 w-10 rounded-xl shadow-lg', className)}
      {...props}
    >
      <Send size={18} />
    </Button>
  </div>
));
ChatInputSubmit.displayName = 'ChatInputSubmit';

export const ChatInputFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-3 flex items-center justify-between px-2 font-mono text-[8px] tracking-widest uppercase opacity-40',
      className,
    )}
    {...props}
  />
));
ChatInputFooter.displayName = 'ChatInputFooter';

// --- Main ChatInput Component ---

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onSendMessage: (message: string, attachments?: Attachment[]) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  showToolbar?: boolean;
  showModelSelector?: boolean;
  showSpeechInput?: boolean;
  showAttachmentButton?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  onFileChange?: (files: File[]) => void;
  availableModels?: { id: string; name: string }[];
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
  isSending?: boolean;
  commandPaletteTrigger?: string;
  onCommand?: (command: string) => void;
  autoReset?: boolean;
  globalDropzone?: boolean;
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      onSendMessage,
      placeholder = 'Type a message...',
      minRows = 1,
      maxRows = 8,
      showToolbar = true,
      showModelSelector = true,
      showSpeechInput = true,
      showAttachmentButton = true,
      acceptedFileTypes,
      maxFiles = 5,
      maxFileSize = 10 * 1024 * 1024,
      onFileChange,
      availableModels,
      selectedModelId,
      onSelectModel,
      isSending = false,
      commandPaletteTrigger = '/',
      onCommand,
      autoReset = true,
      globalDropzone = false,
      ...props
    },
    ref,
  ) => {
    const {
      message,
      setMessage,
      attachments,
      isInputFocused,
      setIsInputFocused,
      handleSendMessage,
      handleRemoveAttachment,
      handleKeyDown,
      dropzone: { open },
      textareaRef,
      formRef,
      isDisabled,
    } = useChatInput({
      onSendMessage,
      maxFiles,
      maxFileSize,
      acceptedFileTypes,
      onFileChange,
      globalDropzone,
      autoReset,
      commandPaletteTrigger,
      onCommand,
      isSending,
    });

    const submitIcon = isSending ? (
      <Loader size={18} className="animate-spin" />
    ) : (
      <Send size={18} />
    );

    return (
      <ChatInputContainer ref={ref} {...props}>
        {attachments.length > 0 && (
          <div className="mb-4">
            <ChatAttachments
              attachments={attachments}
              onRemoveAttachment={handleRemoveAttachment}
            />
          </div>
        )}

        <form onSubmit={handleSendMessage} ref={formRef}>
          <ChatInputWrapper>
            {showToolbar && (
              <div className="absolute bottom-3 left-3 z-10 flex gap-2">
                {showAttachmentButton && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground h-8 w-8"
                    onClick={open}
                  >
                    <Paperclip size={18} />
                  </Button>
                )}
                {showSpeechInput && (
                  <MicSelector
                    selectedDeviceId=""
                    onSelectDevice={() => {}}
                    className="h-8 w-8 border-none bg-transparent p-0"
                  />
                )}
              </div>
            )}

            <ChatInputArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              minRows={minRows}
              maxRows={maxRows}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className={cn(showToolbar ? 'pl-14' : 'pl-6')}
              ref={textareaRef}
            />

            {showModelSelector && availableModels && onSelectModel && (
              <div className="absolute right-14 bottom-3 z-10">
                <Select value={selectedModelId} onValueChange={onSelectModel}>
                  <SelectTrigger className="hover:bg-muted/50 h-8 gap-1 rounded-lg border-none bg-transparent text-xs">
                    <Robot className="h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <ChatInputSubmit
              type="submit"
              disabled={isDisabled}
              className={cn(showModelSelector ? 'right-[unset] left-auto mr-1' : '')}
            >
              {submitIcon}
            </ChatInputSubmit>
          </ChatInputWrapper>
        </form>
      </ChatInputContainer>
    );
  },
);
ChatInput.displayName = 'ChatInput';

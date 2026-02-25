'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { FileText, Image as ImageIcon, XCircle, Download, CheckCircle } from '@aazucena/icons'; // Assuming these icons are available

const chatAttachmentsVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
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

export interface Attachment {
  id: string;
  name: string;
  type: string; // e.g., 'image/png', 'application/pdf', 'text/plain'
  url?: string; // URL for download or preview
  preview?: string; // Data URL or URL for image preview
  status?: 'pending' | 'uploading' | 'uploaded' | 'failed';
  progress?: number; // 0-100
  error?: string;
}

export interface ChatAttachmentsProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatAttachmentsVariants> {
  attachments: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  title?: string;
  emptyMessage?: string;
}

const getIconForAttachmentType = (type: string) => {
  if (type.startsWith('image/')) {
    return ImageIcon;
  }
  if (type.includes('pdf')) {
    return FileText; // Assuming FileText for PDFs
  }
  return FileText; // Default icon
};

const ChatAttachments = React.forwardRef<HTMLDivElement, ChatAttachmentsProps>(
  (
    {
      className,
      variant,
      attachments,
      onRemoveAttachment,
      title = 'Attachments',
      emptyMessage = 'No files attached.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatAttachmentsVariants({ variant }), className)} {...props}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {attachments.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">{emptyMessage}</p>
        )}
        <ul className="flex flex-col gap-2">
          {attachments.map((attachment) => {
            const Icon = getIconForAttachmentType(attachment.type);
            const statusColor = {
              pending: 'text-gray-500',
              uploading: 'text-blue-500',
              uploaded: 'text-green-500',
              failed: 'text-red-500',
            }[attachment.status || 'pending'];

            return (
              <li
                key={attachment.id}
                className="bg-muted/50 flex items-center gap-3 rounded-md p-2 text-sm"
              >
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt="Preview"
                    className="h-8 w-8 rounded-md object-cover"
                  />
                ) : (
                  <Icon className="h-5 w-5 shrink-0" />
                )}
                <div className="flex flex-grow flex-col">
                  <span className="truncate font-medium">{attachment.name}</span>
                  {attachment.status && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className={statusColor}>
                        {attachment.status.charAt(0).toUpperCase() + attachment.status.slice(1)}
                      </span>
                      {attachment.progress !== undefined && attachment.status === 'uploading' && (
                        <span className="text-muted-foreground">({attachment.progress}%)</span>
                      )}
                      {attachment.error && (
                        <span className="text-red-500"> - {attachment.error}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {attachment.url && attachment.status === 'uploaded' && (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  {onRemoveAttachment && attachment.status !== 'uploading' && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);
ChatAttachments.displayName = 'ChatAttachments';

export { ChatAttachments, chatAttachmentsVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Image } from './image';
import { Button } from './button';
import { File as FileIcon, Trash } from '@aazucena/icons'; // Assuming these icons are available

const filePreviewVariants = cva(
  'group flex items-center justify-between gap-4 p-3 rounded-control transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted/30 border border-border',
        glass: 'bg-state border-rule text-foreground',
        cyber: 'bg-signal/5 border border-signal/10 text-signal',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface FilePreviewData {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string; // For downloadable/viewable files
  preview?: string; // For image thumbnails
  status?: 'uploading' | 'uploaded' | 'failed' | 'pending';
  progress?: number; // 0-100
  error?: string;
}

export interface FilePreviewProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof filePreviewVariants> {
  file: FilePreviewData;
  onRemove?: (id: string) => void;
}

const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ className, variant, size, file, onRemove, ...props }, ref) => {
    const isImage = file.type.startsWith('image/') && file.preview;
    const isUploading = file.status === 'uploading';
    const isFailed = file.status === 'failed';

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div
        ref={ref}
        className={cn(
          filePreviewVariants({ variant, size }),
          isFailed && 'border-alert/50 bg-alert/5 text-alert group-hover:bg-alert/10',
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isImage ? (
            <Image
              src={file.preview!}
              alt={file.name}
              className="rounded-control size-10 flex-shrink-0 object-cover"
            />
          ) : (
            <div
              className={cn(
                'rounded-control flex size-10 flex-shrink-0 items-center justify-center',
                variant === 'cyber'
                  ? 'bg-signal/10 text-signal'
                  : variant === 'glass'
                    ? 'bg-state text-foreground'
                    : 'bg-background text-muted-foreground',
              )}
            >
              <FileIcon size={18} />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              className={cn(
                'truncate font-medium',
                isFailed && 'text-alert',
                variant === 'cyber' && 'text-signal font-mono',
                variant === 'glass' && 'text-foreground',
              )}
            >
              {file.name}
            </span>
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-2',
                size === 'lg' && 'text-sm',
                variant === 'glass' && 'text-foreground/60',
                variant === 'cyber' && 'text-muted-foreground font-mono text-[10px]',
              )}
            >
              <span>{formatFileSize(file.size)}</span>
              {isUploading && file.progress !== undefined && (
                <span>- {file.progress}% Uploading</span>
              )}
              {isFailed && file.error && (
                <span className="text-alert font-medium">{file.error}</span>
              )}
            </div>
          </div>
        </div>

        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(file.id)}
            className={cn(
              'flex-shrink-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
              variant === 'glass' && 'text-foreground/70 hover:bg-state',
              variant === 'cyber' && 'text-muted-foreground hover:bg-signal/10',
              isFailed && 'text-alert hover:bg-alert/10',
            )}
          >
            <Trash size={16} />
          </Button>
        )}
      </div>
    );
  },
);
FilePreview.displayName = 'FilePreview';

export { FilePreview, filePreviewVariants };

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Image } from './image';
import { Button } from './button';
import { File as FileIcon, Trash } from '@aazucena/icons'; // Assuming these icons are available

const filePreviewVariants = cva(
  'group flex items-center justify-between gap-4 p-3 rounded-lg transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted/30 border border-border',
        glass: 'bg-white/5 border-white/10 text-white',
        cyber: 'bg-cyan-500/5 border border-cyan-500/10 text-cyan-50',
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filePreviewVariants> {
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
          isFailed &&
            'border-rose-500/50 bg-rose-500/5 text-rose-300 group-hover:bg-rose-500/10',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isImage ? (
            <Image
              src={file.preview!}
              alt={file.name}
              className="size-10 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div
              className={cn(
                'size-10 rounded-md flex items-center justify-center flex-shrink-0',
                variant === 'cyber'
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : variant === 'glass'
                    ? 'bg-white/10 text-white'
                    : 'bg-background text-muted-foreground',
              )}
            >
              <FileIcon size={18} />
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span
              className={cn(
                'font-medium truncate',
                isFailed && 'text-rose-300',
                variant === 'cyber' && 'font-mono text-cyan-400',
                variant === 'glass' && 'text-white',
              )}
            >
              {file.name}
            </span>
            <div
              className={cn(
                'flex items-center gap-2 text-muted-foreground',
                size === 'lg' && 'text-sm',
                variant === 'glass' && 'text-white/60',
                variant === 'cyber' && 'text-cyan-500/60 font-mono text-[10px]',
              )}
            >
              <span>{formatFileSize(file.size)}</span>
              {isUploading && file.progress !== undefined && (
                <span>- {file.progress}% Uploading</span>
              )}
              {isFailed && file.error && (
                <span className="text-rose-300 font-medium">{file.error}</span>
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
              'flex-shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
              variant === 'glass' && 'text-white/70 hover:bg-white/10',
              variant === 'cyber' && 'text-cyan-500/60 hover:bg-cyan-500/10',
              isFailed && 'text-rose-300 hover:bg-rose-500/10',
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

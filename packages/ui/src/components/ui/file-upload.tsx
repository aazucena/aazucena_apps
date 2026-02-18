'use client';

import { X, FileText } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Dropzone } from './dropzone.js';

const fileUploadVariants = cva('w-full space-y-4', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export interface FileUploadProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof fileUploadVariants> {
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  showPreview?: boolean;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      variant,
      files: controlledFiles,
      onFilesChange,
      accept,
      multiple = true,
      maxFiles,
      maxSize,
      showPreview = true,
      ...props
    },
    ref,
  ) => {
    const [internalFiles, setInternalFiles] = React.useState<File[]>([]);
    const files = controlledFiles ?? internalFiles;
    const [error, setError] = React.useState<string | null>(null);

    const updateFiles = React.useCallback(
      (next: File[]) => {
        if (!controlledFiles) setInternalFiles(next);
        onFilesChange?.(next);
      },
      [controlledFiles, onFilesChange],
    );

    const handleFilesSelected = React.useCallback(
      (incoming: File[]) => {
        setError(null);
        const merged = multiple ? [...files, ...incoming] : incoming.slice(0, 1);

        if (maxFiles && merged.length > maxFiles) {
          setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
          return;
        }
        if (maxSize) {
          const oversized = merged.find((f) => f.size > maxSize);
          if (oversized) {
            setError(`"${oversized.name}" exceeds ${formatFileSize(maxSize)} limit`);
            return;
          }
        }
        updateFiles(merged);
      },
      [files, multiple, maxFiles, maxSize, updateFiles],
    );

    const removeFile = React.useCallback(
      (index: number) => {
        updateFiles(files.filter((_, i) => i !== index));
        setError(null);
      },
      [files, updateFiles],
    );

    return (
      <div ref={ref} className={cn(fileUploadVariants({ variant }), className)} {...props}>
        <Dropzone
          variant={variant}
          onFilesSelected={handleFilesSelected}
          accept={accept}
          multiple={multiple}
        />

        {error && <p className="text-destructive text-sm font-medium">{error}</p>}

        {showPreview && files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${file.size}-${i}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-2 text-sm',
                  variant === 'glass' && 'glass border-border/10',
                  variant === 'cyber' && 'border-cyan-500/20 bg-black/40 text-cyan-50',
                  variant === 'default' && 'border-border bg-muted/30',
                )}
              >
                {isImageFile(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
                    <FileText size={18} className="opacity-50" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-foreground shrink-0 rounded p-1 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
FileUpload.displayName = 'FileUpload';

export { FileUpload, fileUploadVariants };

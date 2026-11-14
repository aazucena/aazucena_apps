'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { UploadCloud, FileText, Globe, Plus, X } from '@aazucena/icons';
import { Button } from './button';
import { Input } from './input';
import { Progress } from './progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { useImport } from '../../hooks/use-import';

const importVariants = cva('flex flex-col gap-6 rounded-card border p-6', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-rule',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type ImportStatus = 'idle' | 'uploading' | 'parsing' | 'pending' | 'success' | 'error';

export interface ImportFileData {
  name: string;
  size: number;
  type: string;
  content: string | ArrayBuffer | null;
  status: ImportStatus;
}

export interface ImportProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof importVariants> {
  onFileImport?: (data: ImportFileData) => void;
  onUrlImport?: (url: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  enableDragAndDrop?: boolean;
  enableUrlImport?: boolean;
  clearOnSuccess?: boolean;
  uploadLabel?: string;
  urlImportLabel?: string;
  uploadIcon?: React.ReactNode;
  urlImportIcon?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  actionsClassName?: string;
  buttonClassName?: string;
}

/**
 * A specialized data import component inspired by Directus.
 * Features a primary dropzone and secondary actions for manual upload and URL import.
 */
const Import = React.forwardRef<HTMLDivElement, ImportProps>(
  (
    {
      className,
      variant = 'default',
      onFileImport,
      onUrlImport,
      allowedFileTypes,
      maxFileSize,
      enableDragAndDrop = true,
      enableUrlImport = true,
      clearOnSuccess = true,
      uploadLabel = 'Upload File',
      urlImportLabel = 'Import from URL',
      uploadIcon = <Plus className="size-4" />,
      urlImportIcon = <Globe className="size-4" />,
      orientation = 'horizontal',
      actionsClassName,
      buttonClassName,
      ...props
    },
    ref,
  ) => {
    const {
      status,
      error,
      fileName,
      progress,
      urlInput,
      setUrlInput,
      isUrlDialogOpen,
      setIsUrlDialogOpen,
      handleUrlSubmit,
      dropzone: { getRootProps, getInputProps, isDragActive, open: openFileBrowser },
    } = useImport({ onFileImport, onUrlImport, allowedFileTypes, maxFileSize, clearOnSuccess });

    const v = variant || 'default';

    return (
      <div ref={ref} className={cn(importVariants({ variant: v }), className)} {...props}>
        {/* Main Dropzone Area */}
        <div
          {...getRootProps()}
          className={cn(
            'rounded-control flex flex-col items-center justify-center border-2 border-dashed p-10 text-center transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/20 hover:border-muted-foreground/40 bg-muted/5',
            status === 'error' && 'border-alert bg-alert/5',
            status === 'success' && 'border-success bg-success/5',
            !enableDragAndDrop && 'pointer-events-none',
          )}
        >
          <input {...getInputProps()} />

          <div className="bg-muted/10 mb-4 rounded-full p-4">
            <UploadCloud
              className={cn(
                'size-8 opacity-50',
                isDragActive && 'text-primary animate-bounce opacity-100',
              )}
            />
          </div>

          <div className="space-y-1">
            <p className="font-bold tracking-tight">
              {isDragActive ? 'Drop files now' : 'Drag and drop files here'}
            </p>
            <p className="text-muted-foreground text-xs opacity-60">
              {allowedFileTypes?.length
                ? `Supported: ${allowedFileTypes.join(', ')}`
                : 'All formats supported'}
            </p>
          </div>

          {fileName && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-medium">
                <FileText className="size-3" />
                <span>{fileName}</span>
                {status === 'success' && <X className="text-success size-3" />}
              </div>
              {status === 'uploading' && <Progress value={progress} className="h-1 w-32" />}
            </div>
          )}

          {error && <p className="text-alert mt-4 text-xs font-medium">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex gap-3',
            orientation === 'horizontal' ? 'items-center justify-center' : 'flex-col',
            actionsClassName,
          )}
        >
          <Button
            variant={v === 'cyber' ? 'cyber' : 'outline'}
            className={cn('gap-2', orientation === 'vertical' && 'w-full', buttonClassName)}
            onClick={openFileBrowser}
          >
            {uploadIcon}
            {uploadLabel}
          </Button>

          {enableUrlImport && (
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={v === 'cyber' ? 'cyber' : 'outline'}
                  className={cn('gap-2', orientation === 'vertical' && 'w-full', buttonClassName)}
                >
                  {urlImportIcon}
                  {urlImportLabel}
                </Button>
              </DialogTrigger>
              <DialogContent variant={v === 'cyber' ? 'cyber' : 'default'}>
                <DialogHeader>
                  <DialogTitle>Import from URL</DialogTitle>
                  <DialogDescription>
                    Enter the public URL of the file you want to fetch and process.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="https://example.com/data.json"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    variant={v === 'cyber' ? 'cyber' : 'default'}
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsUrlDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUrlSubmit} variant={v === 'cyber' ? 'cyber' : 'default'}>
                    Import URL
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    );
  },
);
Import.displayName = 'Import';

export { Import, importVariants };

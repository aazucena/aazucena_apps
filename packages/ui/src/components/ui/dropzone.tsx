'use client';

import { CloudUpload } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const dropzoneVariants = cva(
  'w-full border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted/30 hover:border-primary/50 hover:glass bg-primary-100',
        glass: 'glass text-foreground dark:text-white',
        cyber:
          'glass bg-primary-100 border-cyan-500/30 text-foreground hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] dark:bg-background/40 dark:bg-black/40 dark:text-cyan-50',
      },
      isDragging: {
        true: 'scale-[1.02] border-primary bg-primary/10',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      isDragging: false,
    },
  },
);

export interface DropzoneProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dropzoneVariants> {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, variant, onFilesSelected, accept, multiple = true, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFilesSelected?.(files);
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) onFilesSelected?.(files);
    };

    return (
      <div
        ref={ref}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(dropzoneVariants({ variant, isDragging }), className)}
        {...props}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleSelect}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-current/5 transition-transform duration-500 group-hover:scale-110">
          <CloudUpload
            size={32}
            className="opacity-40 transition-opacity group-hover:opacity-100"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold tracking-widest uppercase opacity-90">
            Select or Drop Files
          </h3>
          <p className="font-mono text-[10px] uppercase opacity-40">
            Signal_Ingestion_Active // Max_Size: 50MB
          </p>
        </div>
      </div>
    );
  },
);
Dropzone.displayName = 'Dropzone';

export { Dropzone, dropzoneVariants };

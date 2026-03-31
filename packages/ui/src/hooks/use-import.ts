'use client';

import * as React from 'react';
import { useDropzone, type DropzoneState } from 'react-dropzone';
import type { ImportFileData, ImportStatus } from '../components/ui/import';

export interface UseImportOptions {
  onFileImport?: (data: ImportFileData) => void;
  onUrlImport?: (url: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  clearOnSuccess?: boolean;
}

export interface UseImportReturn {
  status: ImportStatus;
  error: string | null;
  fileName: string;
  progress: number;
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  isUrlDialogOpen: boolean;
  setIsUrlDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUrlSubmit: () => void;
  dropzone: DropzoneState;
}

export function useImport({
  onFileImport,
  onUrlImport,
  allowedFileTypes,
  maxFileSize,
  clearOnSuccess = true,
}: UseImportOptions): UseImportReturn {
  const [status, setStatus] = React.useState<ImportStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [urlInput, setUrlInput] = React.useState('');
  const [isUrlDialogOpen, setIsUrlDialogOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [progress, setProgress] = React.useState(0);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setError(null);
      setStatus('uploading');
      setProgress(0);

      const file = acceptedFiles[0]!;
      setFileName(file.name);

      if (maxFileSize && file.size > maxFileSize) {
        setError(`File exceeds ${maxFileSize / (1024 * 1024)}MB limit.`);
        setStatus('error');
        return;
      }

      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      };
      reader.onload = (event) => {
        setStatus('parsing');
        try {
          if (onFileImport) {
            onFileImport({
              name: file.name,
              size: file.size,
              type: file.type,
              content: event.target?.result ?? null,
              status: 'success',
            });
            setStatus('success');
            if (clearOnSuccess) {
              setTimeout(() => {
                setFileName('');
                setStatus('idle');
              }, 2000);
            }
          }
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : 'Failed to process file.');
          setStatus('error');
        }
      };
      reader.readAsText(file);
    },
    [onFileImport, maxFileSize, clearOnSuccess],
  );

  const dropzone = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedFileTypes
      ? allowedFileTypes.reduce(
          (acc: Record<string, string[]>, type) => ({ ...acc, [type]: [] }),
          {},
        )
      : undefined,
  });

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    onUrlImport?.(urlInput);
    setIsUrlDialogOpen(false);
    if (clearOnSuccess) setUrlInput('');
  };

  return {
    status,
    error,
    fileName,
    progress,
    urlInput,
    setUrlInput,
    isUrlDialogOpen,
    setIsUrlDialogOpen,
    handleUrlSubmit,
    dropzone,
  };
}

'use client';

import { cn } from '@aazucena/utils';
import * as React from 'react';

import { Button } from './button.js';

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between px-2 py-3 text-sm', className)}>
      <span className="text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
DataTablePagination.displayName = 'DataTablePagination';

export { DataTablePagination };

'use client';

import { ChevronUp, ChevronDown, Search } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { DataTablePagination } from './data-table-pagination';
import { Input } from './input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';

export * from './data-table-pagination';

const dataTableVariants = cva('w-full space-y-3', {
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

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

type SortDir = 'asc' | 'desc' | null;

export interface DataTableProps<T>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof dataTableVariants> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    className,
    variant,
    data,
    columns,
    pageSize = 10,
    searchable = false,
    searchPlaceholder = 'Search…',
    onRowClick,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [page, setPage] = React.useState(0);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const next: SortDir = sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc';
      setSortDir(next);
      if (!next) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const filtered = React.useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, search, columns]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <div ref={ref} className={cn(dataTableVariants({ variant }), className)} {...props}>
      {searchable && (
        <div className="relative">
          <Search
            size={14}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            variant={variant}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}

      <Table variant={variant}>
        <TableHeader variant={variant}>
          <TableRow variant={variant}>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                aria-sort={
                  !col.sortable
                    ? undefined
                    : sortKey !== col.key || !sortDir
                      ? 'none'
                      : sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                }
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="rounded-control focus-visible:outline-signal -mx-1 inline-flex cursor-pointer items-center gap-1 px-1 py-0.5 font-[inherit] select-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid"
                  >
                    {col.header}
                    {sortKey === col.key && sortDir === 'asc' && (
                      <ChevronUp size={14} aria-hidden="true" />
                    )}
                    {sortKey === col.key && sortDir === 'desc' && (
                      <ChevronDown size={14} aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow variant={variant}>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((row, ri) => (
              <TableRow
                key={ri}
                variant={variant}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                className={cn(
                  onRowClick &&
                    'focus-visible:outline-signal cursor-pointer focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-solid',
                )}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : (String(row[col.key] ?? '') as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataTablePagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

const DataTable = React.forwardRef(DataTableInner) as <T extends Record<string, unknown>>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement | null;

export { DataTable, dataTableVariants };

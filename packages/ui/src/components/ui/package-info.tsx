'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Package, GitFork, License, Code, Info, User } from '@aazucena/icons';

const packageInfoVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface PackageMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  repository?: { type: string; url: string };
  homepage?: string;
}

export interface PackageInfoProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof packageInfoVariants> {
  metadata: PackageMetadata;
  showDescription?: boolean;
  showAuthor?: boolean;
  showLicense?: boolean;
  showDependencies?: boolean;
  showDevDependencies?: boolean;
  showRepository?: boolean;
  showHomepage?: boolean;
}

const PackageInfo = React.forwardRef<HTMLDivElement, PackageInfoProps>(
  (
    {
      className,
      variant,
      size,
      metadata,
      showDescription = true,
      showAuthor = true,
      showLicense = true,
      showDependencies = false,
      showDevDependencies = false,
      showRepository = false,
      showHomepage = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(packageInfoVariants({ variant, size }), className)} {...props}>
        <div className="flex items-center gap-3">
          <Package className="text-primary h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-bold">{metadata.name}</span>
            <span className="text-muted-foreground">v{metadata.version}</span>
          </div>
        </div>

        {showDescription && metadata.description && (
          <p className="text-muted-foreground">{metadata.description}</p>
        )}

        <ul className="space-y-1">
          {showAuthor && metadata.author && (
            <li className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>Author: {metadata.author}</span>
            </li>
          )}
          {showLicense && metadata.license && (
            <li className="flex items-center gap-2">
              <License className="text-muted-foreground h-4 w-4" />
              <span>License: {metadata.license}</span>
            </li>
          )}
          {showRepository && metadata.repository?.url && (
            <li className="flex items-center gap-2">
              <GitFork className="text-muted-foreground h-4 w-4" />
              <a
                href={metadata.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Repository
              </a>
            </li>
          )}
          {showHomepage && metadata.homepage && (
            <li className="flex items-center gap-2">
              <Info className="text-muted-foreground h-4 w-4" />
              <a
                href={metadata.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Homepage
              </a>
            </li>
          )}
        </ul>

        {showDependencies && metadata.dependencies && (
          <div className="flex flex-col gap-1">
            <h4 className="flex items-center gap-2 font-semibold">
              <Code className="h-4 w-4" /> Dependencies
            </h4>
            <ul className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(metadata.dependencies).map(([dep, ver]) => (
                <li key={dep} className="flex items-center justify-between">
                  <span>{dep}</span>
                  <span>{ver}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showDevDependencies && metadata.devDependencies && (
          <div className="flex flex-col gap-1">
            <h4 className="flex items-center gap-2 font-semibold">
              <Code className="h-4 w-4" /> Dev Dependencies
            </h4>
            <ul className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(metadata.devDependencies).map(([dep, ver]) => (
                <li key={dep} className="flex items-center justify-between">
                  <span>{dep}</span>
                  <span>{ver}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
PackageInfo.displayName = 'PackageInfo';

export { PackageInfo, packageInfoVariants };

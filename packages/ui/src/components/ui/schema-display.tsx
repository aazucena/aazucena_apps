'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ChevronsUpDown, Braces, Info, Type, List } from '@aazucena/icons';

const schemaDisplayVariants = cva(
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

export interface SchemaProperty {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  isExpanded?: boolean;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

export interface SchemaDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof schemaDisplayVariants> {
  schema: SchemaProperty;
  title?: string;
  defaultExpanded?: boolean;
}

// --- Utils ---

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'object':
      return Braces;
    case 'array':
      return List;
    case 'string':
    case 'number':
    case 'boolean':
      return Type;
    default:
      return Info;
  }
};

// --- Component ---

const SchemaDisplay = React.forwardRef<HTMLDivElement, SchemaDisplayProps>(
  (
    { className, variant, size, schema, title = 'Data Schema', defaultExpanded = false, ...props },
    ref,
  ) => {
    const [expandedStates, setExpandedStates] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
      if (!defaultExpanded) return;
      const newStates: Record<string, boolean> = {};
      const collectExpanded = (node: SchemaProperty) => {
        if (node.type === 'object' && node.properties) {
          newStates[node.name] = true;
          node.properties.forEach(collectExpanded);
        }
        if (node.type === 'array' && node.items) {
          collectExpanded(node.items);
        }
      };
      collectExpanded(schema);
      setExpandedStates((prev) => ({ ...prev, ...newStates }));
    }, [schema, defaultExpanded]);

    const renderSchemaRecursive = (node: SchemaProperty, level: number) => {
      const isObject = node.type === 'object';
      const isArray = node.type === 'array';
      const TypeIcon = getTypeIcon(node.type);

      const isNodeExpanded =
        expandedStates[node.name] !== undefined
          ? expandedStates[node.name]!
          : isObject && defaultExpanded;

      return (
        <div key={node.name || `root-${level}`} className="flex flex-col">
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 py-1',
              level > 0 && variant === 'cyber' && 'text-cyan-400',
              level > 0 && variant === 'glass' && 'text-white/90',
              size === 'sm' && 'text-xs',
              size === 'lg' && 'text-base',
            )}
            onClick={() =>
              isObject && setExpandedStates((prev) => ({ ...prev, [node.name]: !isNodeExpanded }))
            }
          >
            {isObject && (
              <ChevronsUpDown
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-200',
                  isNodeExpanded ? 'rotate-90' : 'rotate-0',
                  variant === 'cyber' && 'text-cyan-500/60',
                  variant === 'glass' && 'text-white/50',
                )}
              />
            )}
            <TypeIcon className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className={cn('font-medium', node.required && 'font-bold')}>
              {node.name}
              {node.required && <span className="ml-1 text-red-500/80">*</span>}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">({node.type})</span>
            {node.enum && (
              <span className="text-muted-foreground ml-2 text-xs">
                [enum: {node.enum.join(', ')}]
              </span>
            )}
            {node.minimum !== undefined && (
              <span className="text-muted-foreground ml-2 text-xs">min: {node.minimum}</span>
            )}
            {node.maximum !== undefined && (
              <span className="text-muted-foreground ml-2 text-xs">max: {node.maximum}</span>
            )}
            {node.pattern && (
              <span className="text-muted-foreground ml-2 text-xs">pattern: {node.pattern}</span>
            )}
            {node.description && (
              <span className="text-muted-foreground ml-2 text-xs opacity-60">
                {node.description}
              </span>
            )}
          </div>

          {isObject && isNodeExpanded && node.properties && (
            <div className="ml-4 border-l border-gray-500/20 pl-4">
              {node.properties.map((prop) => renderSchemaRecursive(prop, level + 1))}
            </div>
          )}
          {isArray && isNodeExpanded && node.items && (
            <div className="ml-4 border-l border-gray-500/20 pl-4">
              <span className="text-muted-foreground text-xs">Items:</span>
              {renderSchemaRecursive(node.items, level + 1)}
            </div>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn(schemaDisplayVariants({ variant, size }), className)} {...props}>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {renderSchemaRecursive(schema, 0)}
      </div>
    );
  },
);
SchemaDisplay.displayName = 'SchemaDisplay';

export { SchemaDisplay, schemaDisplayVariants };

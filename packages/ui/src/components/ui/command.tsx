'use client';

/** @shadcn standard component */
import * as React from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { Dialog, DialogContent } from './dialog.js';
import { useCommandSearch, type CommandAction } from '@aazucena/hooks';

const commandVariants = cva('flex h-full w-full flex-col overflow-hidden rounded-md', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-xl border border-border/10 text-foreground shadow-2xl',
      cyber:
        'bg-background/90 dark:bg-black/90 border border-border dark:border-cyan-500/40 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Command = React.forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive> & VariantProps<typeof commandVariants>
>(({ className, variant, ...props }, ref) => (
  <CommandPrimitive ref={ref} className={cn(commandVariants({ variant }), className)} {...props} />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  variant?: VariantProps<typeof commandVariants>['variant'];
}

const CommandDialog = ({ children, variant, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        variant={variant === 'glass' ? 'glass' : variant === 'cyber' ? 'cyber' : 'default'}
        className="overflow-hidden p-0 shadow-2xl"
      >
        <Command
          variant={variant}
          className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-x-hidden overflow-y-auto', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('bg-border -mx-1 h-px', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

/**
 * CommandPalette
 * High-level component that provides a searchable command menu with categories and keyboard shortcut.
 */
export interface CommandPaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: CommandAction[];
  onNavigate?: (href: string) => void;
  onAction?: (actionId: string) => void;
  variant?: VariantProps<typeof commandVariants>['variant'];
}

const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ className, variant, actions, onNavigate, onAction, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const { search } = useCommandSearch(actions);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      };
      document.addEventListener('keydown', down);
      return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = React.useCallback(
      (action: CommandAction) => {
        setOpen(false);
        if (action.href && onNavigate) {
          onNavigate(action.href);
        } else if (onAction) {
          onAction(action.id);
        }
      },
      [onNavigate, onAction],
    );

    const filteredActions = search(query);
    const categories = Array.from(new Set(filteredActions.map((a) => a.category)));

    return (
      <CommandDialog open={open} onOpenChange={setOpen} variant={variant}>
        <CommandInput value={query} onValueChange={setQuery} placeholder="EXECUTE_COMMAND..." />
        <CommandList className="max-h-[400px] overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((category) => (
            <CommandGroup key={category} heading={`${category}_CORE`}>
              {filteredActions
                .filter((a) => a.category === category)
                .map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={() => handleSelect(action)}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg border transition-colors">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-bold tracking-wide uppercase">
                        {action.name}
                      </span>
                      <span className="truncate font-mono text-[10px] opacity-50">
                        {action.keywords}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    );
  },
);
CommandPalette.displayName = 'CommandPalette';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandPalette,
};

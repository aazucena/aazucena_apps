'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const editorVariants = cva('w-full overflow-hidden rounded-lg border transition-all', {
  variants: {
    variant: {
      default:
        'border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      glass: 'glass border-white/10',
      cyber:
        'border-cyan-500/30 bg-black/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const sizeMap: Record<string, string> = {
  sm: 'min-h-[120px] text-xs',
  md: 'min-h-[200px] text-sm',
  lg: 'min-h-[320px] text-base',
};

const toolbarStyles: Record<string, string> = {
  default: 'border-b border-input bg-muted/50',
  glass: 'border-b border-white/10 bg-white/5',
  cyber: 'border-b border-cyan-500/20 bg-black/30',
};

interface ToolbarButtonProps {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  variant: string;
  disabled?: boolean;
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
  variant,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded px-2 py-1 transition-colors disabled:opacity-50',
        active
          ? variant === 'cyber'
            ? 'bg-cyan-500/20 text-cyan-300'
            : 'bg-accent text-accent-foreground'
          : variant === 'cyber'
            ? 'text-cyan-500/60 hover:text-cyan-300'
            : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export interface RichEditorProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof editorVariants> {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  toolbar?: boolean;
  onEditorReady?: (editor: Editor) => void;
}

const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value,
      onChange,
      placeholder = 'Start writing...',
      disabled,
      toolbar = true,
      onEditorReady,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'md';

    const editor = useEditor({
      extensions: [StarterKit, Placeholder.configure({ placeholder })],
      content: value ?? '',
      editable: !disabled,
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm max-w-none px-4 py-3 outline-none',
            sizeMap[s],
            v === 'cyber' && 'prose-invert font-mono text-cyan-50',
            '[&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          ),
        },
      },
      onUpdate({ editor: e }) {
        onChange?.(e.getHTML());
      },
      onCreate({ editor: e }) {
        onEditorReady?.(e);
      },
    });

    return (
      <div
        ref={ref}
        className={cn(
          editorVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {toolbar && editor && (
          <div className={cn('flex flex-wrap gap-0.5 px-2 py-1.5', toolbarStyles[v])}>
            <ToolbarButton
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
              variant={v}
              disabled={disabled}
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
              variant={v}
              disabled={disabled}
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('strike')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
              variant={v}
              disabled={disabled}
            >
              <s>S</s>
            </ToolbarButton>
            <span className={cn('mx-1 w-px', v === 'cyber' ? 'bg-cyan-500/20' : 'bg-border')} />
            <ToolbarButton
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading"
              variant={v}
              disabled={disabled}
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
              variant={v}
              disabled={disabled}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 6h13" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <circle cx="3" cy="6" r="1" fill="currentColor" />
                <circle cx="3" cy="12" r="1" fill="currentColor" />
                <circle cx="3" cy="18" r="1" fill="currentColor" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Ordered List"
              variant={v}
              disabled={disabled}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 6h11" />
                <path d="M10 12h11" />
                <path d="M10 18h11" />
                <path d="M4 6h1v4" />
                <path d="M4 10h2" />
                <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
              variant={v}
              disabled={disabled}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
              </svg>
            </ToolbarButton>
            <span className={cn('mx-1 w-px', v === 'cyber' ? 'bg-cyan-500/20' : 'bg-border')} />
            <ToolbarButton
              active={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="Code Block"
              variant={v}
              disabled={disabled}
            >
              {'</>'}
            </ToolbarButton>
            <ToolbarButton
              active={false}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
              variant={v}
              disabled={disabled}
            >
              &#8212;
            </ToolbarButton>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    );
  },
);
RichEditor.displayName = 'RichEditor';

export { RichEditor, editorVariants };

/**
 * Simple Rich Text Renderer
 * Renders Strapi richtext blocks without external dependencies
 * Avoids React instance conflicts in Astro
 */

import type { JSX } from "react";

type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: "link";
  url: string;
  children: (TextNode | any)[];
};

type ListItemNode = {
  type: "list-item";
  children: any[];
};

type ListNode = {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemNode[];
};

type ParagraphNode = {
  type: "paragraph";
  children: (TextNode | LinkNode | any)[];
};

type HeadingNode = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: (TextNode | any)[];
};

type QuoteNode = {
  type: "quote";
  children: any[];
};

type CodeNode = {
  type: "code";
  children: TextNode[];
};

type BlockNode = ParagraphNode | HeadingNode | ListNode | QuoteNode | CodeNode;

interface SimpleRichTextRendererProps {
  content: BlockNode[];
  className?: string;
}

/**
 * Render inline text with formatting
 */
function renderText(node: TextNode): JSX.Element | string {
  let text: JSX.Element | string = node.text;

  if (node.code) {
    return (
      <code className="rounded bg-gray-900 px-1 py-0.5 font-mono text-sm text-cyan-400">
        {text}
      </code>
    );
  }

  if (node.bold) {
    text = <strong className="font-bold">{text}</strong>;
  }

  if (node.italic) {
    text = <em className="italic">{text}</em>;
  }

  if (node.underline) {
    text = <u>{text}</u>;
  }

  if (node.strikethrough) {
    text = <s>{text}</s>;
  }

  return text;
}

/**
 * Render inline children (text nodes, links, etc.)
 */
function renderInlineChildren(children: any[]): JSX.Element[] {
  return children
    .map((child, idx) => {
      if (child.type === "text") {
        return <span key={idx}>{renderText(child)}</span>;
      }

      if (child.type === "link") {
        const isExternal = child.url.startsWith("http");
        return (
          <a
            key={idx}
            href={child.url}
            className="text-cyan-400 underline decoration-cyan-400/30 transition-colors duration-200 hover:text-cyan-300 hover:decoration-cyan-300"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {child.children.map((c: any, i: number) => (
              <span key={i}>{c.type === "text" ? renderText(c) : c.text}</span>
            ))}
          </a>
        );
      }

      return null;
    })
    .filter(Boolean) as JSX.Element[];
}

/**
 * Render a single block
 */
function renderBlock(block: BlockNode, index: number): JSX.Element | null {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-relaxed text-gray-300 last:mb-0">
          {renderInlineChildren(block.children)}
        </p>
      );

    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const headingClasses = {
        1: "text-4xl md:text-5xl font-bold text-white mb-6 mt-8",
        2: "text-3xl md:text-4xl font-bold text-white mb-5 mt-7",
        3: "text-2xl md:text-3xl font-semibold text-white mb-4 mt-6",
        4: "text-xl md:text-2xl font-semibold text-white mb-3 mt-5",
        5: "text-lg md:text-xl font-semibold text-white mb-2 mt-4",
        6: "text-base md:text-lg font-semibold text-white mb-2 mt-3",
      };

      return (
        <Tag key={index} className={headingClasses[block.level]}>
          {renderInlineChildren(block.children)}
        </Tag>
      );
    }

    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      const className =
        block.format === "ordered"
          ? "list-decimal list-inside mb-4 space-y-2 text-gray-300"
          : "list-disc list-inside mb-4 space-y-2 text-gray-300";

      return (
        <Tag key={index} className={className}>
          {block.children.map((item, idx) => (
            <li key={idx} className="leading-relaxed text-gray-300">
              {renderInlineChildren(item.children)}
            </li>
          ))}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote
          key={index}
          className="mb-4 rounded-r-lg border-l-4 border-cyan-400 bg-white/5 py-2 pl-4 text-gray-300 italic"
        >
          {renderInlineChildren(block.children)}
        </blockquote>
      );

    case "code":
      return (
        <pre
          key={index}
          className="mb-4 overflow-x-auto rounded-lg border border-white/10 bg-gray-900 p-4"
        >
          <code className="font-mono text-sm text-cyan-400">
            {block.children.map((c) => c.text).join("")}
          </code>
        </pre>
      );

    default:
      return null;
  }
}

/**
 * Main renderer component
 */
export function SimpleRichTextRenderer({
  content,
  className = "",
}: SimpleRichTextRendererProps): JSX.Element {
  if (!content || !Array.isArray(content)) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

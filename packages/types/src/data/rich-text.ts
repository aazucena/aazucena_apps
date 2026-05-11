/**
 * [Types] : Rich_Text_Node_Definitions
 * Aligned with Strapi Blocks renderer schema.
 */

export type RichText_TextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type RichText_LinkNode = {
  type: 'link';
  url: string;
  children: (RichText_TextNode | unknown)[];
};

export type RichText_ListItemNode = {
  type: 'list-item';
  children: unknown[];
};

export type RichText_ListNode = {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: RichText_ListItemNode[];
};

export type RichText_ParagraphNode = {
  type: 'paragraph';
  children: (RichText_TextNode | RichText_LinkNode | unknown)[];
};

export type RichText_HeadingNode = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: (RichText_TextNode | unknown)[];
};

export type RichText_QuoteNode = {
  type: 'quote';
  children: unknown[];
};

export type RichText_CodeNode = {
  type: 'code';
  children: RichText_TextNode[];
};

export type RichText_BlockNode =
  | RichText_ParagraphNode
  | RichText_HeadingNode
  | RichText_ListNode
  | RichText_QuoteNode
  | RichText_CodeNode;

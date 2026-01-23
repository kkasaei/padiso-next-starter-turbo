'use client';

/**
 * SimpleEditorKit - Minimal editor plugins for basic text editing
 * 
 * Includes ONLY:
 * - Paragraphs & Headings (H1-H3)
 * - Basic marks (bold, italic, underline, inline code)
 * - Lists (bullet & numbered)
 * - Links
 * - Markdown autoformat shortcuts (# for headings, ** for bold, etc.)
 * - Markdown import/export
 */

import type { AutoformatRule } from '@platejs/autoformat';
import { AutoformatPlugin } from '@platejs/autoformat';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
} from '@platejs/basic-nodes/react';
import {
  H1Plugin,
  H2Plugin,
  H3Plugin,
  BlockquotePlugin,
} from '@platejs/basic-nodes/react';
import { LinkPlugin } from '@platejs/link/react';
import { ListPlugin } from '@platejs/list/react';
import { toggleList } from '@platejs/list';
import { MarkdownPlugin } from '@platejs/markdown';
import { KEYS, TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';
import { IndentPlugin } from '@platejs/indent/react';

import { CodeLeaf } from './code-node';
import { BlockquoteElement } from './blockquote-node';
import {
  H1Element,
  H2Element,
  H3Element,
} from './heading-node';
import { LinkElement } from './link-node';
import { LinkFloatingToolbar } from './link-toolbar';
import { ParagraphElement } from './paragraph-node';
import { BlockList } from './block-list';

// ============================================================
// AUTOFORMAT RULES - Markdown shortcuts
// ============================================================

const autoformatMarks: AutoformatRule[] = [
  {
    match: '**',
    mode: 'mark',
    type: KEYS.bold,
  },
  {
    match: '*',
    mode: 'mark',
    type: KEYS.italic,
  },
  {
    match: '_',
    mode: 'mark',
    type: KEYS.italic,
  },
  {
    match: '~~',
    mode: 'mark',
    type: KEYS.strikethrough,
  },
  {
    match: '`',
    mode: 'mark',
    type: KEYS.code,
  },
];

const autoformatBlocks: AutoformatRule[] = [
  {
    match: '# ',
    mode: 'block',
    type: KEYS.h1,
  },
  {
    match: '## ',
    mode: 'block',
    type: KEYS.h2,
  },
  {
    match: '### ',
    mode: 'block',
    type: KEYS.h3,
  },
  {
    match: '> ',
    mode: 'block',
    type: KEYS.blockquote,
  },
];

const autoformatLists: AutoformatRule[] = [
  {
    match: ['* ', '- '],
    mode: 'block',
    type: 'list',
    format: (editor) => {
      toggleList(editor, {
        listStyleType: KEYS.ul,
      });
    },
  },
  {
    match: [String.raw`^\d+\.$ `, String.raw`^\d+\)$ `],
    matchByRegex: true,
    mode: 'block',
    type: 'list',
    format: (editor, { matchString }) => {
      toggleList(editor, {
        listRestartPolite: Number(matchString) || 1,
        listStyleType: KEYS.ol,
      });
    },
  },
];

// ============================================================
// SIMPLE EDITOR KIT
// ============================================================

export const SimpleEditorKit = [
  // Basic Elements
  ParagraphPlugin.withComponent(ParagraphElement),
  H1Plugin.configure({
    node: { component: H1Element },
    rules: { break: { empty: 'reset' } },
  }),
  H2Plugin.configure({
    node: { component: H2Element },
    rules: { break: { empty: 'reset' } },
  }),
  H3Plugin.configure({
    node: { component: H3Element },
    rules: { break: { empty: 'reset' } },
  }),
  BlockquotePlugin.configure({
    node: { component: BlockquoteElement },
  }),

  // Basic Marks
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin.configure({
    node: { component: CodeLeaf },
  }),

  // Links
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),

  // Lists with Indent
  IndentPlugin.configure({
    inject: {
      targetPlugins: [KEYS.p, ...KEYS.heading, KEYS.blockquote],
    },
    options: {
      offset: 24,
    },
  }),
  ListPlugin.configure({
    inject: {
      targetPlugins: [KEYS.p, ...KEYS.heading, KEYS.blockquote],
    },
    render: {
      belowNodes: BlockList,
    },
  }),

  // Autoformat (markdown shortcuts)
  AutoformatPlugin.configure({
    options: {
      enableUndoOnDelete: true,
      rules: [...autoformatBlocks, ...autoformatMarks, ...autoformatLists].map(
        (rule): AutoformatRule => ({
          ...rule,
          query: (editor) =>
            !editor.api.some({
              match: { type: editor.getType(KEYS.codeBlock) },
            }),
        })
      ),
    },
  }),

  // Markdown import/export
  MarkdownPlugin,

  // Trailing block (ensures there's always a paragraph at the end)
  TrailingBlockPlugin,
];

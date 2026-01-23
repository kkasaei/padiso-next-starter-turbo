'use client';

/**
 * PromptEditorKit - Minimal editor plugins for prompt editing
 * 
 * Includes:
 * - Paragraphs only (no headings, lists, etc. - keep it simple for prompts)
 * - Basic marks (bold, italic) for emphasis
 * - Markdown import/export
 * - Variable placeholder detection and styling
 */

import type { AutoformatRule } from '@platejs/autoformat';
import { AutoformatPlugin } from '@platejs/autoformat';
import {
  BoldPlugin,
  ItalicPlugin,
} from '@platejs/basic-nodes/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { KEYS, TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';

import { ParagraphElement } from '@/components/editor/paragraph-node';

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
];

// ============================================================
// PROMPT EDITOR KIT
// ============================================================

export const PromptEditorKit = [
  // Basic Elements - Only paragraphs for prompts
  ParagraphPlugin.withComponent(ParagraphElement),

  // Basic Marks - Only bold and italic for emphasis
  BoldPlugin,
  ItalicPlugin,

  // Autoformat (markdown shortcuts)
  AutoformatPlugin.configure({
    options: {
      enableUndoOnDelete: true,
      rules: autoformatMarks.map(
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

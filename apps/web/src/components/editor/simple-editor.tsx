'use client';

/**
 * SimpleEditor - A minimal WYSIWYG editor for basic text editing
 *
 * Features:
 * - Headings (H1-H3), paragraphs, blockquotes
 * - Bold, italic, underline, strikethrough, inline code
 * - Bullet and numbered lists
 * - Links
 * - Markdown shortcuts (# for headings, ** for bold, etc.)
 * - Markdown import/export (AI content works seamlessly)
 */

import * as React from 'react';
import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, normalizeNodeId, type Value, KEYS } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { cn } from '@/lib/utils';

import { SimpleEditorKit } from './simple-editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { TurnIntoToolbarButton } from '@/components/ui/turn-into-toolbar-button';
import { BulletedListToolbarButton, NumberedListToolbarButton } from '@/components/ui/list-toolbar-button';
import { LinkToolbarButton } from '@/components/ui/link-toolbar-button';

export interface SimpleEditorProps {
  /** Markdown content to initialize the editor with */
  initialValue?: string;
  /** Callback when content changes (receives markdown string) */
  onContentChange?: (markdown: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Fixed height of the editor content area (default: 200px) */
  height?: string;
  /** @deprecated Use height instead */
  minHeight?: string;
}

/** Ref handle for external control of SimpleEditor */
export interface SimpleEditorRef {
  /** Set content from markdown string */
  setContent: (markdown: string) => void;
  /** Get current content as markdown */
  getContent: () => string;
}

/**
 * Deserialize markdown content to editor value
 */
function deserializeMarkdown(markdown: string) {
  try {
    const tempEditor = createSlateEditor({
      plugins: [...SimpleEditorKit],
    });
    const value = tempEditor.getApi(MarkdownPlugin).markdown.deserialize(markdown);
    return value;
  } catch {
    return [{ type: 'p', children: [{ text: markdown }] }];
  }
}

/**
 * Serialize editor value to markdown
 */
function serializeToMarkdown(editor: ReturnType<typeof usePlateEditor>) {
  if (!editor) return '';
  try {
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize();
    return markdown;
  } catch {
    return '';
  }
}

export const SimpleEditor = React.forwardRef<SimpleEditorRef, SimpleEditorProps>(
  function SimpleEditor(
    {
      initialValue = '',
      onContentChange,
      placeholder = 'Start typing...',
      className,
      height,
      minHeight,
    },
    ref
  ) {
    // Use height prop, fallback to minHeight for backward compatibility
    const editorHeight = height || minHeight || '400px';
    // Compute initial value from markdown
    const editorValue = React.useMemo(() => {
      if (initialValue) {
        return deserializeMarkdown(initialValue);
      }
      return defaultValue;
    }, [initialValue]);

    // Generate stable editor ID
    const editorId = React.useMemo(() => {
      if (initialValue) {
        return `simple-editor-${initialValue.slice(0, 30)}`;
      }
      return 'simple-editor-default';
    }, [initialValue]);

    const editor = usePlateEditor({
      plugins: SimpleEditorKit,
      value: editorValue,
      id: editorId,
    });

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      setContent: (markdown: string) => {
        try {
          const newValue = deserializeMarkdown(markdown);
          editor.tf.withoutNormalizing(() => {
            while (editor.children.length > 0) {
              editor.tf.removeNodes({ at: [0] });
            }
            editor.tf.insertNodes(newValue, { at: [0] });
          });
        } catch (error) {
          console.error('[SimpleEditor] Failed to set content:', error);
        }
      },
      getContent: () => serializeToMarkdown(editor),
    }), [editor]);

    // Handle content changes
    const handleChange = React.useCallback(
      ({ value }: { value: unknown }) => {
        if (value && onContentChange) {
          const markdown = serializeToMarkdown(editor);
          onContentChange(markdown);
        }
      },
      [editor, onContentChange]
    );

    return (
      <Plate editor={editor} onChange={handleChange}>
        <div className={cn('flex flex-col rounded-lg border overflow-hidden', className)}>
          {/* Simple Toolbar */}
          <FixedToolbar className="border-b border-border bg-muted/30 px-2 py-1 gap-0.5">
            <ToolbarGroup>
              <TurnIntoToolbarButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘B)">
                <span className="font-bold">B</span>
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘I)">
                <span className="italic">I</span>
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘U)">
                <span className="underline">U</span>
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Strikethrough">
                <span className="line-through">S</span>
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={KEYS.code} tooltip="Inline Code">
                <span className="font-mono text-xs">{`</>`}</span>
              </MarkToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <BulletedListToolbarButton />
              <NumberedListToolbarButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <LinkToolbarButton />
            </ToolbarGroup>
          </FixedToolbar>

          {/* Editor Content */}
          <EditorContainer
            variant="default"
            className="relative border-0 overflow-y-auto"
            style={{ height: editorHeight, maxHeight: editorHeight }}
          >
            <Editor
              variant="default"
              placeholder={placeholder}
            />
          </EditorContainer>
        </div>
      </Plate>
    );
  }
);

// Default empty value
const defaultValue = normalizeNodeId([
  {
    children: [{ text: '' }],
    type: 'p',
  },
]);

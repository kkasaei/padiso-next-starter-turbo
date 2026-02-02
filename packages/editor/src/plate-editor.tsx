'use client';

import * as React from 'react';

import type { VariantProps } from 'class-variance-authority';

import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, normalizeNodeId, type Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from './editor-kit';
import { SettingsDialog } from './settings-dialog';
import {
  discussionPlugin,
  type TDiscussion,
  type TDiscussionUser,
} from './plugins/discussion-kit';
import {
  Editor,
  EditorContainer,
  editorContainerVariants,
  editorVariants,
} from './editor';

export interface PlateEditorProps {
  /** Markdown content to initialize the editor with (legacy, fallback) */
  initialValue?: string;
  /** Raw Plate.js editor JSON to initialize with (preserves comment marks) */
  initialEditorState?: unknown;
  /** Container variant for styling */
  containerVariant?: VariantProps<typeof editorContainerVariants>['variant'];
  /** Editor variant for styling */
  variant?: VariantProps<typeof editorVariants>['variant'];
  /** Whether to show the settings dialog */
  showSettings?: boolean;
  /** Additional class names for the container */
  className?: string;
  /** Current user ID for comments */
  currentUserId?: string;
  /** Current user info for comments */
  currentUser?: TDiscussionUser;
  /** Initial discussions/comments */
  discussions?: TDiscussion[];
  /** Users map for displaying comment authors */
  users?: Record<string, TDiscussionUser>;
  /** Callback when discussions change */
  onDiscussionsChange?: (discussions: TDiscussion[]) => void;
  /** Callback when content changes (receives markdown string) */
  onContentChange?: (markdown: string) => void;
  /** Callback when editor state changes (receives raw JSON for persistence) */
  onEditorStateChange?: (editorState: unknown) => void;
}

/** Ref handle for external control of PlateEditor */
export interface PlateEditorRef {
  /** Set content from markdown string */
  setContent: (markdown: string, mode?: 'replace' | 'append' | 'prepend' | 'update-section', originalText?: string) => void;
  /** Get current content as markdown */
  getContent: () => string;
  /** Get the currently selected text */
  getSelectedText: () => string | null;
}

/**
 * Deserialize markdown content to Plate editor value
 */
function deserializeMarkdown(markdown: string) {
  try {
    // Create a temporary editor with MarkdownPlugin to deserialize
    const tempEditor = createSlateEditor({
      plugins: [...EditorKit],
    });
    const value = tempEditor.getApi(MarkdownPlugin).markdown.deserialize(markdown);
    return value;
  } catch {
    // Fallback to simple paragraph if markdown parsing fails
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

export const PlateEditor = React.forwardRef<PlateEditorRef, PlateEditorProps>(
  function PlateEditor(
    {
      initialValue,
      initialEditorState,
      containerVariant = 'demo',
      variant = 'demo',
      showSettings = true,
      className,
      currentUserId,
      currentUser,
      discussions,
      users,
      onDiscussionsChange,
      onContentChange,
      onEditorStateChange,
    },
    ref
  ) {
    // Compute the initial value - prefer raw editor state (JSON) over markdown
    // This preserves comment marks and other metadata that markdown strips out
    const editorValue = React.useMemo(() => {
      // If we have raw editor state (JSON), use it directly - preserves comment marks
      if (initialEditorState && Array.isArray(initialEditorState) && initialEditorState.length > 0) {
        return initialEditorState as typeof defaultValue;
      }
      // Fallback to markdown deserialization (loses comment marks)
      if (initialValue) {
        return deserializeMarkdown(initialValue);
      }
      return defaultValue;
    }, [initialEditorState, initialValue]);

    // Build users map including current user
    const usersMap = React.useMemo(() => {
      const map: Record<string, TDiscussionUser> = { ...users };
      if (currentUser && currentUserId) {
        map[currentUserId] = currentUser;
      }
      // Add any users from discussions that aren't in the map
      if (discussions) {
        discussions.forEach((discussion) => {
          discussion.comments.forEach((comment) => {
            if (!map[comment.userId]) {
              map[comment.userId] = {
                id: comment.userId,
                avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${comment.userId}`,
                name: comment.userId,
              };
            }
          });
        });
      }
      return map;
    }, [users, currentUser, currentUserId, discussions]);

    // Generate a stable editor ID based on content
    const editorId = React.useMemo(() => {
      if (initialEditorState && Array.isArray(initialEditorState)) {
        // Use a hash of the first element for stable ID
        return `editor-json-${JSON.stringify(initialEditorState[0]).slice(0, 30)}`;
      }
      if (initialValue) {
        return `editor-${initialValue.slice(0, 50)}`;
      }
      return 'editor-default';
    }, [initialEditorState, initialValue]);

    const editor = usePlateEditor({
      plugins: EditorKit,
      value: editorValue,
      // Use content-based id to force recreation when content changes
      id: editorId,
    });

    // Expose methods via ref for external control
    React.useImperativeHandle(ref, () => ({
      setContent: (markdown: string, mode: 'replace' | 'append' | 'prepend' | 'update-section' = 'replace', originalText?: string) => {
        try {
          const newValue = deserializeMarkdown(markdown);

          if (mode === 'replace') {
            // Replace all content while preserving undo/redo history
            // Use withoutNormalizing to batch operations
            editor.tf.withoutNormalizing(() => {
              // Remove all existing nodes
              while (editor.children.length > 0) {
                editor.tf.removeNodes({ at: [0] });
              }
              // Insert new content
              editor.tf.insertNodes(newValue, { at: [0] });
            });
          } else if (mode === 'append') {
            // Append at end - preserves history naturally
            const lastIndex = editor.children.length;
            editor.tf.insertNodes(newValue, { at: [lastIndex] });
          } else if (mode === 'prepend') {
            // Insert at beginning - preserves history naturally
            editor.tf.insertNodes(newValue, { at: [0] });
          } else if (mode === 'update-section') {
            // Update section mode - smarter approach:
            // 1. If there's a selection, replace it
            // 2. If originalText provided, find and replace it
            // 3. Otherwise fall back to replace
            const { selection } = editor;

            if (selection && !editor.api.isCollapsed()) {
              // There's a selection - replace just the selected text
              editor.tf.withoutNormalizing(() => {
                editor.tf.delete();
                editor.tf.insertNodes(newValue);
              });
            } else if (originalText) {
              // No selection but we have original text - find and replace
              // Get current content as markdown and do a text replacement
              const currentMarkdown = serializeToMarkdown(editor);

              // Clean up the original text (remove quotes that might have been added)
              const cleanOriginal = originalText
                .replace(/^["']/, '')
                .replace(/["']$/, '')
                .trim();

              if (currentMarkdown.includes(cleanOriginal)) {
                // Found the text - replace in markdown and reload
                const updatedMarkdown = currentMarkdown.replace(cleanOriginal, markdown);
                const updatedValue = deserializeMarkdown(updatedMarkdown);

                editor.tf.withoutNormalizing(() => {
                  while (editor.children.length > 0) {
                    editor.tf.removeNodes({ at: [0] });
                  }
                  editor.tf.insertNodes(updatedValue, { at: [0] });
                });
              } else {
                // Couldn't find exact match - fall back to replace
                console.warn('[PlateEditor] Could not find original text for section update, falling back to replace');
                editor.tf.withoutNormalizing(() => {
                  while (editor.children.length > 0) {
                    editor.tf.removeNodes({ at: [0] });
                  }
                  editor.tf.insertNodes(newValue, { at: [0] });
                });
              }
            } else {
              // No selection and no original text - fall back to replace
              editor.tf.withoutNormalizing(() => {
                while (editor.children.length > 0) {
                  editor.tf.removeNodes({ at: [0] });
                }
                editor.tf.insertNodes(newValue, { at: [0] });
              });
            }
          }
        } catch (error) {
          console.error('[PlateEditor] Failed to set content:', error);
        }
      },
      getContent: () => {
        return serializeToMarkdown(editor);
      },
      getSelectedText: () => {
        try {
          const { selection } = editor;
          if (!selection || editor.api.isCollapsed()) {
            return null;
          }
          // Get the selected text
          const fragment = editor.api.fragment();
          if (!fragment || fragment.length === 0) {
            return null;
          }
          // Serialize the fragment to markdown
          const tempEditor = createSlateEditor({
            plugins: [...EditorKit],
            value: fragment as Value,
          });
          return tempEditor.getApi(MarkdownPlugin).markdown.serialize();
        } catch {
          return null;
        }
      },
    }), [editor]);

    // Set discussion plugin options when user/discussions change
    React.useEffect(() => {
      if (currentUserId) {
        editor.setOption(discussionPlugin, 'currentUserId', currentUserId);
      }
      if (discussions) {
        editor.setOption(discussionPlugin, 'discussions', discussions);
      }
      if (Object.keys(usersMap).length > 0) {
        editor.setOption(discussionPlugin, 'users', usersMap);
      }
      if (onDiscussionsChange) {
        editor.setOption(discussionPlugin, 'onDiscussionsChange', onDiscussionsChange);
      }
    }, [editor, currentUserId, discussions, usersMap, onDiscussionsChange]);

    // Subscribe to discussions changes and call the callback
    React.useEffect(() => {
      if (!onDiscussionsChange) return;

      // Set up an interval to check for discussion changes
      // This is a workaround since the discussion plugin doesn't have a built-in change listener
      let lastDiscussionsJson = JSON.stringify(discussions || []);

      const checkChanges = () => {
        const currentDiscussions = editor.getOption(discussionPlugin, 'discussions');
        const currentJson = JSON.stringify(currentDiscussions);

        if (currentJson !== lastDiscussionsJson) {
          lastDiscussionsJson = currentJson;
          onDiscussionsChange(currentDiscussions);
        }
      };

      const interval = setInterval(checkChanges, 1000);
      return () => clearInterval(interval);
    }, [editor, discussions, onDiscussionsChange]);

    // Handle content changes - emit both markdown and raw editor state
    const handleChange = React.useCallback(
      ({ value }: { value: unknown }) => {
        if (value) {
          // Emit markdown for legacy/export purposes
          if (onContentChange) {
            const markdown = serializeToMarkdown(editor);
            onContentChange(markdown);
          }
          // Emit raw editor state (preserves comment marks and metadata)
          if (onEditorStateChange) {
            onEditorStateChange(value);
          }
        }
      },
      [editor, onContentChange, onEditorStateChange]
    );

    return (
      <Plate editor={editor} onChange={handleChange}>
        <EditorContainer variant={containerVariant} className={className}>
          <Editor variant={variant} />
        </EditorContainer>

        {showSettings && <SettingsDialog />}
      </Plate>
    );
  }
);

// Clean default value for new content - just H1 and empty paragraph
const defaultValue = normalizeNodeId([
  {
    children: [{ text: 'Your title here' }],
    type: 'h1',
  },
  {
    children: [{ text: 'Start writing your amazing content...' }],
    type: 'p',
  },
]);

// Legacy playground demo value (kept for reference)
const _playgroundDemoValue = normalizeNodeId([
  {
    children: [{ text: 'Welcome to the Plate Playground!' }],
    type: 'h1',
  },
  {
    children: [
      { text: 'Experience a modern rich-text editor built with ' },
      { children: [{ text: 'Slate' }], type: 'a', url: 'https://slatejs.org' },
      { text: ' and ' },
      { children: [{ text: 'React' }], type: 'a', url: 'https://reactjs.org' },
      {
        text: ". This playground showcases just a part of Plate's capabilities. ",
      },
      {
        children: [{ text: 'Explore the documentation' }],
        type: 'a',
        url: '/docs',
      },
      { text: ' to discover more.' },
    ],
    type: 'p',
  },
  // Suggestions & Comments Section
  {
    children: [{ text: 'Collaborative Editing' }],
    type: 'h2',
  },
  {
    children: [
      { text: 'Review and refine content seamlessly. Use ' },
      {
        children: [
          {
            suggestion: true,
            suggestion_playground1: {
              id: 'playground1',
              createdAt: Date.now(),
              type: 'insert',
              userId: 'alice',
            },
            text: 'suggestions',
          },
        ],
        type: 'a',
        url: '/docs/suggestion',
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: 'playground1',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'alice',
        },
        text: ' ',
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: 'playground1',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'alice',
        },
        text: 'like this added text',
      },
      { text: ' or to ' },
      {
        suggestion: true,
        suggestion_playground2: {
          id: 'playground2',
          createdAt: Date.now(),
          type: 'remove',
          userId: 'bob',
        },
        text: 'mark text for removal',
      },
      { text: '. Discuss changes using ' },
      {
        children: [
          { comment: true, comment_discussion1: true, text: 'comments' },
        ],
        type: 'a',
        url: '/docs/comment',
      },
      {
        comment: true,
        comment_discussion1: true,
        text: ' on many text segments',
      },
      { text: '. You can even have ' },
      {
        comment: true,
        comment_discussion2: true,
        suggestion: true,
        suggestion_playground3: {
          id: 'playground3',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'charlie',
        },
        text: 'overlapping',
      },
      { text: ' annotations!' },
    ],
    type: 'p',
  },
  // {
  //   children: [
  //     {
  //       text: 'Block-level suggestions are also supported for broader feedback.',
  //     },
  //   ],
  //   suggestion: {
  //     suggestionId: 'suggestionBlock1',
  //     type: 'block',
  //     userId: 'charlie',
  //   },
  //   type: 'p',
  // },
  // AI Section
  {
    children: [{ text: 'AI-Powered Editing' }],
    type: 'h2',
  },
  {
    children: [
      { text: 'Boost your productivity with integrated ' },
      {
        children: [{ text: 'AI SDK' }],
        type: 'a',
        url: '/docs/ai',
      },
      { text: '. Press ' },
      { kbd: true, text: '⌘+J' },
      { text: ' or ' },
      { kbd: true, text: 'Space' },
      { text: ' in an empty line to:' },
    ],
    type: 'p',
  },
  {
    children: [
      { text: 'Generate content (continue writing, summarize, explain)' },
    ],
    indent: 1,
    listStyleType: 'disc',
    type: 'p',
  },
  {
    children: [
      { text: 'Edit existing text (improve, fix grammar, change tone)' },
    ],
    indent: 1,
    listStyleType: 'disc',
    type: 'p',
  },
  // Core Features Section (Combined)
  {
    children: [{ text: 'Rich Content Editing' }],
    type: 'h2',
  },
  {
    children: [
      { text: 'Structure your content with ' },
      {
        children: [{ text: 'headings' }],
        type: 'a',
        url: '/docs/heading',
      },
      { text: ', ' },
      {
        children: [{ text: 'lists' }],
        type: 'a',
        url: '/docs/list',
      },
      { text: ', and ' },
      {
        children: [{ text: 'quotes' }],
        type: 'a',
        url: '/docs/blockquote',
      },
      { text: '. Apply ' },
      {
        children: [{ text: 'marks' }],
        type: 'a',
        url: '/docs/basic-marks',
      },
      { text: ' like ' },
      { bold: true, text: 'bold' },
      { text: ', ' },
      { italic: true, text: 'italic' },
      { text: ', ' },
      { text: 'underline', underline: true },
      { text: ', ' },
      { strikethrough: true, text: 'strikethrough' },
      { text: ', and ' },
      { code: true, text: 'code' },
      { text: '. Use ' },
      {
        children: [{ text: 'autoformatting' }],
        type: 'a',
        url: '/docs/autoformat',
      },
      { text: ' for ' },
      {
        children: [{ text: 'Markdown' }],
        type: 'a',
        url: '/docs/markdown',
      },
      { text: '-like shortcuts (e.g., ' },
      { kbd: true, text: '* ' },
      { text: ' for lists, ' },
      { kbd: true, text: '# ' },
      { text: ' for H1).' },
    ],
    type: 'p',
  },
  {
    children: [
      {
        children: [
          {
            text: 'Blockquotes are great for highlighting important information.',
          },
        ],
        type: 'p',
      },
    ],
    type: 'blockquote',
  },
  {
    children: [
      { children: [{ text: 'function hello() {' }], type: 'code_line' },
      {
        children: [{ text: "  console.info('Code blocks are supported!');" }],
        type: 'code_line',
      },
      { children: [{ text: '}' }], type: 'code_line' },
    ],
    lang: 'javascript',
    type: 'code_block',
  },
  {
    children: [
      { text: 'Create ' },
      {
        children: [{ text: 'links' }],
        type: 'a',
        url: '/docs/link',
      },
      { text: ', ' },
      {
        children: [{ text: '@mention' }],
        type: 'a',
        url: '/docs/mention',
      },
      { text: ' users like ' },
      { children: [{ text: '' }], type: 'mention', value: 'Alice' },
      { text: ', or insert ' },
      {
        children: [{ text: 'emojis' }],
        type: 'a',
        url: '/docs/emoji',
      },
      { text: ' ✨. Use the ' },
      {
        children: [{ text: 'slash command' }],
        type: 'a',
        url: '/docs/slash-command',
      },
      { text: ' (/) for quick access to elements.' },
    ],
    type: 'p',
  },
  // Table Section
  {
    children: [{ text: 'How Plate Compares' }],
    type: 'h3',
  },
  {
    children: [
      {
        text: 'Plate offers many features out-of-the-box as free, open-source plugins.',
      },
    ],
    type: 'p',
  },
  {
    children: [
      {
        children: [
          {
            children: [
              { children: [{ bold: true, text: 'Feature' }], type: 'p' },
            ],
            type: 'th',
          },
          {
            children: [
              {
                children: [{ bold: true, text: 'Plate (Free & OSS)' }],
                type: 'p',
              },
            ],
            type: 'th',
          },
          {
            children: [
              { children: [{ bold: true, text: 'Tiptap' }], type: 'p' },
            ],
            type: 'th',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [{ children: [{ text: 'AI' }], type: 'p' }],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [{ children: [{ text: 'Paid Extension' }], type: 'p' }],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [{ children: [{ text: 'Comments' }], type: 'p' }],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [{ children: [{ text: 'Paid Extension' }], type: 'p' }],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [{ children: [{ text: 'Suggestions' }], type: 'p' }],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [
              { children: [{ text: 'Paid (Comments Pro)' }], type: 'p' },
            ],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [{ children: [{ text: 'Emoji Picker' }], type: 'p' }],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [{ children: [{ text: 'Paid Extension' }], type: 'p' }],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [
              { children: [{ text: 'Table of Contents' }], type: 'p' },
            ],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [{ children: [{ text: 'Paid Extension' }], type: 'p' }],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [{ children: [{ text: 'Drag Handle' }], type: 'p' }],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [{ children: [{ text: 'Paid Extension' }], type: 'p' }],
            type: 'td',
          },
        ],
        type: 'tr',
      },
      {
        children: [
          {
            children: [
              { children: [{ text: 'Collaboration (Yjs)' }], type: 'p' },
            ],
            type: 'td',
          },
          {
            children: [
              {
                attributes: { align: 'center' },
                children: [{ text: '✅' }],
                type: 'p',
              },
            ],
            type: 'td',
          },
          {
            children: [
              { children: [{ text: 'Hocuspocus (OSS/Paid)' }], type: 'p' },
            ],
            type: 'td',
          },
        ],
        type: 'tr',
      },
    ],
    type: 'table',
  },
  // Media Section
  {
    children: [{ text: 'Images and Media' }],
    type: 'h3',
  },
  {
    children: [
      {
        text: 'Embed rich media like images directly in your content. Supports ',
      },
      {
        children: [{ text: 'Media uploads' }],
        type: 'a',
        url: '/docs/media',
      },
      {
        text: ' and ',
      },
      {
        children: [{ text: 'drag & drop' }],
        type: 'a',
        url: '/docs/dnd',
      },
      {
        text: ' for a smooth experience.',
      },
    ],
    type: 'p',
  },
  {
    attributes: { align: 'center' },
    caption: [
      {
        children: [{ text: 'Images with captions provide context.' }],
        type: 'p',
      },
    ],
    children: [{ text: '' }],
    type: 'img',
    url: 'https://images.unsplash.com/photo-1712688930249-98e1963af7bd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    width: '75%',
  },
  {
    children: [{ text: '' }],
    isUpload: true,
    name: 'sample.pdf',
    type: 'file',
    url: 'https://s26.q4cdn.com/900411403/files/doc_downloads/test.pdf',
  },
  {
    children: [{ text: '' }],
    type: 'audio',
    url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
  },
  {
    children: [{ text: 'Table of Contents' }],
    type: 'h3',
  },
  {
    children: [{ text: '' }],
    type: 'toc',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
]);

'use client'

import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { cn } from '@workspace/common/lib'
import '@workspace/ui/styles/tiptap.css'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

export interface TiptapEditorProps {
  /** Markdown or HTML content to initialize the editor with */
  initialValue?: string
  /** Callback when content changes (receives HTML string) */
  onContentChange?: (content: string) => void
  /** Placeholder text when editor is empty */
  placeholder?: string
  /** Additional class names */
  className?: string
  /** Fixed height of the editor content area (default: 400px) */
  height?: string
  /** Show the toolbar (default: true) */
  showToolbar?: boolean
  /** Read-only mode */
  readOnly?: boolean
}

/** Ref handle for external control of TiptapEditor */
export interface TiptapEditorRef {
  /** Set content from HTML or markdown string */
  setContent: (content: string) => void
  /** Get current content as HTML */
  getContent: () => string
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  function TiptapEditor(
    {
      initialValue = '',
      onContentChange,
      placeholder = 'Start typing...',
      className,
      height = '400px',
      showToolbar = true,
      readOnly = false,
    },
    ref
  ) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'tiptap-editor h-full w-full outline-none prose prose-sm max-w-none text-foreground px-4 py-3',
        },
      },
      content: initialValue,
      editable: !readOnly,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        if (onContentChange) {
          onContentChange(editor.getHTML())
        }
      },
    })

    // Sync external value changes
    useEffect(() => {
      if (!editor || editor.isDestroyed) return
      
      const currentContent = editor.getHTML()
      if (initialValue && initialValue !== currentContent) {
        editor.commands.setContent(initialValue)
      }
    }, [initialValue, editor])

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        setContent: (content: string) => {
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content)
          }
        },
        getContent: () => {
          if (editor && !editor.isDestroyed) {
            return editor.getHTML()
          }
          return ''
        },
      }),
      [editor]
    )

    if (!editor) {
      return null
    }

    return (
      <div className={cn('flex flex-col rounded-lg border overflow-hidden bg-background', className)}>
        {/* Toolbar */}
        {showToolbar && !readOnly && (
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
            {/* Text formatting */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('bold') && 'bg-muted'
              )}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('italic') && 'bg-muted'
              )}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('strike') && 'bg-muted'
              )}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('code') && 'bg-muted'
              )}
              title="Code"
            >
              <Code className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('heading', { level: 1 }) && 'bg-muted'
              )}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('heading', { level: 2 }) && 'bg-muted'
              )}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('heading', { level: 3 }) && 'bg-muted'
              )}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('bulletList') && 'bg-muted'
              )}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                'p-2 rounded hover:bg-muted',
                editor.isActive('orderedList') && 'bg-muted'
              )}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Editor Content */}
        <div
          className="relative overflow-y-auto bg-background"
          style={{ height, maxHeight: height }}
        >
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    )
  }
)

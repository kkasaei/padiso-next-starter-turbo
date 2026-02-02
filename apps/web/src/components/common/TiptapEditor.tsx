'use client'

import { useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Markdown } from '@tiptap/markdown'
import { cn } from '@workspace/common/lib'
import '@workspace/ui/styles/tiptap.css'
import type { LucideIcon } from 'lucide-react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link2,
  ImagePlus,
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

type ToolbarAction = 
  | { type: 'mark'; name: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: 'list'; variant: 'bullet' | 'ordered' }
  | { type: 'link' }
  | { type: 'image' }

interface ToolbarButton {
  icon: LucideIcon
  title: string
  action: ToolbarAction
}

const TOOLBAR_GROUPS: ToolbarButton[][] = [
  // Text formatting
  [
    { icon: Bold, title: 'Bold', action: { type: 'mark', name: 'bold' } },
    { icon: Italic, title: 'Italic', action: { type: 'mark', name: 'italic' } },
    { icon: Strikethrough, title: 'Strikethrough', action: { type: 'mark', name: 'strike' } },
    { icon: Code, title: 'Code', action: { type: 'mark', name: 'code' } },
  ],
  // Headings
  [
    { icon: Heading1, title: 'Heading 1', action: { type: 'heading', level: 1 } },
    { icon: Heading2, title: 'Heading 2', action: { type: 'heading', level: 2 } },
    { icon: Heading3, title: 'Heading 3', action: { type: 'heading', level: 3 } },
    { icon: Heading4, title: 'Heading 4', action: { type: 'heading', level: 4 } },
    { icon: Heading5, title: 'Heading 5', action: { type: 'heading', level: 5 } },
    { icon: Heading6, title: 'Heading 6', action: { type: 'heading', level: 6 } },
  ],
  // Lists
  [
    { icon: List, title: 'Bullet List', action: { type: 'list', variant: 'bullet' } },
    { icon: ListOrdered, title: 'Numbered List', action: { type: 'list', variant: 'ordered' } },
  ],
  // Media
  [
    { icon: Link2, title: 'Add Link', action: { type: 'link' } },
    { icon: ImagePlus, title: 'Add Image', action: { type: 'image' } },
  ],
]

function isActionActive(editor: ReturnType<typeof useEditor>, action: ToolbarAction): boolean {
  if (!editor) return false
  switch (action.type) {
    case 'mark':
      return editor.isActive(action.name)
    case 'heading':
      return editor.isActive('heading', { level: action.level })
    case 'list':
      return editor.isActive(action.variant === 'bullet' ? 'bulletList' : 'orderedList')
    case 'link':
      return editor.isActive('link')
    case 'image':
      return false
  }
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
        Markdown, // Must be first to properly handle markdown parsing
        StarterKit.configure({ 
          heading: { 
            levels: [1, 2, 3, 4, 5, 6] // Support all heading levels
          } 
        }),
        Placeholder.configure({ placeholder }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'tiptap-link',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'tiptap-image',
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: 'tiptap-editor h-full w-full outline-none max-w-none text-foreground px-4 py-3',
        },
      },
      content: initialValue,
      contentType: 'markdown', // Set default content type to markdown
      editable: !readOnly,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onContentChange?.(editor.getHTML())
      },
    })

    const handleAddLink = useCallback(() => {
      if (!editor) return
      
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt('Enter URL:', previousUrl || '')
      
      if (url === null) return // Cancelled
      
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const handleAddImage = useCallback(() => {
      if (!editor) return
      
      // Create a file input element
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        
        // Convert to base64 or use URL
        const reader = new FileReader()
        reader.onload = (event) => {
          const src = event.target?.result as string
          if (src) {
            editor.chain().focus().setImage({ src }).run()
          }
        }
        reader.readAsDataURL(file)
      }
      
      input.click()
    }, [editor])

    const handleToolbarAction = useCallback((action: ToolbarAction) => {
      if (!editor) return
      
      switch (action.type) {
        case 'mark':
          editor.chain().focus().toggleMark(action.name).run()
          break
        case 'heading':
          editor.chain().focus().toggleHeading({ level: action.level }).run()
          break
        case 'list':
          editor.chain().focus()[action.variant === 'bullet' ? 'toggleBulletList' : 'toggleOrderedList']().run()
          break
        case 'link':
          handleAddLink()
          break
        case 'image':
          handleAddImage()
          break
      }
    }, [editor, handleAddLink, handleAddImage])

    useEffect(() => {
      if (editor && !editor.isDestroyed && initialValue) {
        const currentContent = editor.getHTML()
        if (initialValue !== currentContent) {
          // Parse as markdown - TipTap's Markdown extension handles the conversion
          editor.commands.setContent(initialValue, { contentType: 'markdown' })
        }
      }
    }, [initialValue, editor])

    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(content, { contentType: 'markdown' })
        }
      },
      getContent: () => {
        if (editor && !editor.isDestroyed) {
          return editor.getHTML()
        }
        return ''
      },
    }), [editor])

    if (!editor) {
      return null
    }

    return (
      <div className={cn('flex flex-col rounded-lg border overflow-hidden bg-background', className)}>
        {showToolbar && !readOnly && (
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
            {TOOLBAR_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-1">
                {groupIndex > 0 && <div className="w-px h-6 bg-border mx-1" />}
                {group.map(({ icon: Icon, title, action }, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleToolbarAction(action)}
                    className={cn(
                      'p-2 rounded hover:bg-muted transition-colors',
                      isActionActive(editor, action) && 'bg-muted'
                    )}
                    title={title}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="relative overflow-y-auto bg-background" style={{ height, maxHeight: height }}>
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    )
  }
)

'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@workspace/common/lib'
import '@workspace/ui/styles/tiptap.css'

export interface TiptapPromptEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  availableVariables?: string[]
  projectId?: string
  height?: string
  className?: string
}

export function TiptapPromptEditor({
  value,
  onChange,
  placeholder = 'Enter prompt...',
  availableVariables = [],
  height = '200px',
  className,
}: TiptapPromptEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'tiptap-editor h-full w-full outline-none prose prose-sm max-w-none text-foreground px-3 py-2',
      },
    },
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getText())
    },
  })

  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return
    
    const currentText = editor.getText()
    if (value !== currentText) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Editor */}
      <div
        className="relative overflow-y-auto rounded-lg border border-border bg-background"
        style={{ height, maxHeight: height }}
      >
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Available Variables */}
      {availableVariables.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Variables:</span>
          {availableVariables.map((variable) => (
            <button
              key={variable}
              type="button"
              onClick={() => {
                editor.commands.insertContent(` ${variable} `)
              }}
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-mono hover:bg-muted/80"
            >
              {variable}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

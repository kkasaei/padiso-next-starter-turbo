"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/styles/tiptap.css"

interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PromptEditor({
  value,
  onChange,
  placeholder = "Enter prompt instructions...",
  className
}: PromptEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[150px] w-full outline-none max-w-none text-foreground px-4 py-3 prose prose-sm dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className={cn("rounded-lg border border-border bg-background overflow-hidden", className)}>
      <EditorContent editor={editor} />
    </div>
  )
}

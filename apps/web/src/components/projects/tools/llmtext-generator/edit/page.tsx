'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MarkdownPlugin } from '@platejs/markdown'
import { usePlateEditor, Plate } from 'platejs/react'
import { Button } from '@workspace/ui/components/button'
import { Editor, EditorContainer } from '@/components/editor/editor'
import { EditorKit } from '@/components/editor/editor-kit'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@workspace/ui/components/resizable'
// AI Assistant Panel placeholder - component may need to be created
interface ProjectContext {
  projectId: string
  projectName?: string
  websiteUrl?: string | null
  description?: string | null
  industry?: string
  icp?: string
  valueProposition?: string
  keywords?: string[]
  competitors?: string[]
  aiGuidelines?: string
  locations?: string[]
}

// Placeholder AI Assistant Panel component
function AIAssistantPanel(props: {
  onCollapse: () => void
  editorContent: string
  onUpdateContent: (content: string, mode: 'replace' | 'append' | 'prepend' | 'update-section', originalText?: string) => void
  context: string
  projectContext?: ProjectContext
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 dark:border-polar-700 bg-white dark:bg-polar-900 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-polar-700 px-4 py-3">
        <h2 className="text-lg font-medium">AI Assistant</h2>
        <button onClick={props.onCollapse} className="text-muted-foreground hover:text-foreground">×</button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground text-sm text-center">
        AI Assistant panel - Coming soon
      </div>
    </div>
  )
}
import { ArrowLeft, Cloud, CloudOff, Download, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ImperativePanelHandle } from 'react-resizable-panels'

// Types
interface ProjectSettings {
  llmText?: string
  keywords?: string | string[]
  competitors?: string | string[]
  locations?: string | string[]
  aiGuidelines?: string
}

// Default markdown content for new documents
const DEFAULT_MARKDOWN = `# llms.txt

Click **Generate with AI** and ask the AI to write your llms.txt content.

## What is llms.txt?

llms.txt is a standardized file that helps AI language models understand your website's content, purpose, and how to represent your business accurately.

---

**Example prompt:** "Write a complete llms.txt for my project based on the context"
`

export default function EditLLMTextPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [initialContent, setInitialContent] = useState<string | null>(null)
  const [currentSettings, setCurrentSettings] = useState<ProjectSettings | null>(null)
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null)

  // AI panel state
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [currentEditorContent, setCurrentEditorContent] = useState('')
  const aiPanelRef = useRef<ImperativePanelHandle>(null)

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedContentRef = useRef<string | null>(null)

  // Load project data
  const loadProject = useCallback(() => {
    setIsLoading(true)
    // TODO: Implement data fetching
    // Simulate loading with mock data
    setTimeout(() => {
      const mockSettings: ProjectSettings = {
        llmText: DEFAULT_MARKDOWN,
      }
      
      setCurrentSettings(mockSettings)
      setProjectContext({
        projectId,
        projectName: 'Sample Project',
        websiteUrl: 'https://example.com',
        description: 'A sample project description',
      })
      
      const llmText = mockSettings.llmText || DEFAULT_MARKDOWN
      setInitialContent(llmText)
      setCurrentEditorContent(llmText)
      lastSavedContentRef.current = llmText
      setIsLoading(false)
    }, 500)
  }, [projectId])

  // Save project settings
  const saveSettings = useCallback((content: string) => {
    // TODO: Implement save settings
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      setCurrentSettings((prev) => prev ? { ...prev, llmText: content } : { llmText: content })
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus((current) => (current === 'saved' ? 'idle' : current))
      }, 2000)
    }, 500)
  }, [])

  // Load project on mount
  useEffect(() => {
    loadProject()
  }, [loadProject])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: editor => editor.getApi(MarkdownPlugin).markdown.deserialize(initialContent || DEFAULT_MARKDOWN),
  })

  // Update editor value when initial content loads
  useEffect(() => {
    if (initialContent && editor) {
      const api = editor.getApi(MarkdownPlugin)
      const newValue = api.markdown.deserialize(initialContent)
      editor.tf.setValue(newValue)
    }
  }, [initialContent, editor])

  // Auto-save handler
  const handleAutoSave = useCallback(
    (content: string) => {
      if (!currentSettings) return
      if (content === lastSavedContentRef.current) return

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set saving status
      setSaveStatus('saving')

      // Debounce the save (1.5 seconds after user stops typing)
      saveTimeoutRef.current = setTimeout(() => {
        lastSavedContentRef.current = content
        saveSettings(content)
      }, 1500)
    },
    [currentSettings, saveSettings]
  )

  // Track editor content changes for AI assistant and auto-save
  const handleEditorChange = useCallback(() => {
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize()
    setCurrentEditorContent(markdown)
    handleAutoSave(markdown)
  }, [editor, handleAutoSave])

  // Toggle AI panel
  const toggleAIPanel = useCallback(() => {
    if (isAIPanelOpen) {
      aiPanelRef.current?.collapse()
    } else {
      aiPanelRef.current?.expand()
    }
    setIsAIPanelOpen(!isAIPanelOpen)
  }, [isAIPanelOpen])

  // Handle AI content update
  const handleUpdateEditorContent = useCallback(
    (content: string, mode: 'replace' | 'append' | 'prepend' | 'update-section', originalText?: string) => {
      const api = editor.getApi(MarkdownPlugin)
      
      if (mode === 'replace') {
        const newValue = api.markdown.deserialize(content)
        editor.tf.setValue(newValue)
      } else if (mode === 'append') {
        const currentMarkdown = api.markdown.serialize()
        const newContent = currentMarkdown + '\n\n' + content
        const newValue = api.markdown.deserialize(newContent)
        editor.tf.setValue(newValue)
      } else if (mode === 'prepend') {
        const currentMarkdown = api.markdown.serialize()
        const newContent = content + '\n\n' + currentMarkdown
        const newValue = api.markdown.deserialize(newContent)
        editor.tf.setValue(newValue)
      } else if (mode === 'update-section' && originalText) {
        const currentMarkdown = api.markdown.serialize()
        const newContent = currentMarkdown.replace(originalText, content)
        const newValue = api.markdown.deserialize(newContent)
        editor.tf.setValue(newValue)
      }
      
      // Trigger auto-save
      const updatedMarkdown = api.markdown.serialize()
      setCurrentEditorContent(updatedMarkdown)
      handleAutoSave(updatedMarkdown)
    },
    [editor, handleAutoSave]
  )

  const handleDownload = () => {
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize()
    
    if (!markdown.trim()) {
      toast.error('No content to download')
      return
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'llm-text.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded as Markdown!')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Main Editor Panel */}
        <ResizablePanel defaultSize={100} minSize={50}>
          <div className="relative flex h-full w-full min-w-0 flex-col rounded-2xl border border-gray-200 dark:border-polar-700 bg-white dark:bg-polar-900 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-polar-700 px-4 py-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/brands/${projectId}/tools/llmtext-generator`)}
                  className="h-9 w-9 shrink-0 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h1 className="text-lg font-medium">LLM Text Editor</h1>
                </div>
                {/* Auto-save status indicator */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
                  {saveStatus === 'saving' && (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <Cloud className="h-3.5 w-3.5 text-green-600" />
                      <span className="hidden sm:inline text-green-600">Saved</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <CloudOff className="h-3.5 w-3.5 text-red-500" />
                      <span className="hidden sm:inline text-red-500">Save failed</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 dark:border-polar-700 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                {/* Primary action - toggles AI panel */}
                <Button
                  variant="default"
                  onClick={toggleAIPanel}
                  className="h-9 shrink-0 gap-2 rounded-full px-3"
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isAIPanelOpen ? 'Hide AI' : 'Generate with AI'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-auto" onClick={handleEditorChange} onKeyUp={handleEditorChange}>
              <Plate editor={editor}>
                <EditorContainer variant="demo" className="h-full border-0">
                  <Editor variant="demo" />
                </EditorContainer>
              </Plate>
            </div>
          </div>
        </ResizablePanel>

        {/* Resize Handle */}
        {isAIPanelOpen && <ResizableHandle withHandle className="mx-1 w-0 bg-transparent" />}

        {/* AI Assistant Panel */}
        <ResizablePanel
          ref={aiPanelRef}
          defaultSize={0}
          minSize={25}
          maxSize={45}
          collapsible
          collapsedSize={0}
          onCollapse={() => setIsAIPanelOpen(false)}
          onExpand={() => setIsAIPanelOpen(true)}
          className={cn('h-full overflow-hidden', !isAIPanelOpen && 'hidden')}
        >
          <AIAssistantPanel
            onCollapse={toggleAIPanel}
            editorContent={currentEditorContent}
            onUpdateContent={handleUpdateEditorContent}
            context="llm-text"
            projectContext={projectContext ?? undefined}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

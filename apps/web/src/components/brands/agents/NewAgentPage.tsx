'use client'

import { useState, useRef, useCallback, useLayoutEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ReactFlowProvider, type Edge } from '@xyflow/react'
import {
  Workflow,
  Play,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  ArrowLeft,
  X,
  Sparkles,
  Download,
  Upload,
  Send,
  MoreHorizontal,
  Loader2,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@workspace/ui/components/resizable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import {
  WorkflowCanvas,
  WorkflowSidebar,
  NodeConfigPanel,
  type NodeUpdateFn,
  type WorkflowCanvasRef,
} from '@/components/brands/workflows'
import type { WorkflowNode } from '@/components/brands/workflows'
import { toast } from 'sonner'

// ============================================================
// RIGHT PANEL MODE TYPE
// ============================================================

type RightPanelMode = 'config' | 'ai-chat'

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function NewAgentPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  // State
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [workflowName, setWorkflowName] = useState('Untitled Agent')
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [nodeUpdateFn, setNodeUpdateFn] = useState<NodeUpdateFn | null>(null)
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode | null>(null)
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [aiChatInput, setAiChatInput] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)

  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<WorkflowCanvasRef>(null)
  const workflowNameInputRef = useRef<HTMLInputElement>(null)
  const workflowNameMeasureRef = useRef<HTMLSpanElement>(null)
  const [workflowNameWidth, setWorkflowNameWidth] = useState(200)
  const [isSaving, setIsSaving] = useState(false)

  // Handlers
  const toggleLeftPanel = () => {
    if (isLeftPanelCollapsed) {
      leftPanelRef.current?.expand()
    } else {
      leftPanelRef.current?.collapse()
    }
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed)
  }

  const handleNodeSelect = useCallback((node: WorkflowNode | null) => {
    setSelectedNode(node)
    if (node) {
      setRightPanelMode('config')
    }
  }, [])

  const handleRegisterUpdateFn = useCallback((fn: NodeUpdateFn) => {
    setNodeUpdateFn(() => fn)
  }, [])

  const handleNodeUpdate = useCallback((nodeId: string, data: Partial<WorkflowNode['data']>) => {
    setHasChanges(true)
    nodeUpdateFn?.(nodeId, data)
  }, [nodeUpdateFn])

  const handleCloseRightPanel = useCallback(() => {
    setSelectedNode(null)
    setRightPanelMode(null)
  }, [])

  const handleOpenAiChat = useCallback(() => {
    setSelectedNode(null)
    setRightPanelMode('ai-chat')
  }, [])

  const handleSendAiMessage = useCallback(async () => {
    if (!aiChatInput.trim()) return

    const userMessage = aiChatInput.trim()
    setAiChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setAiChatInput('')
    setIsAiThinking(true)

    // TODO: Implement actual AI call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setAiChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `I can help you with your workflow! Based on your question about "${userMessage.slice(0, 50)}...", here are some suggestions:\n\n1. You can add more nodes from the library\n2. Connect nodes by dragging from handles\n3. Configure each node by clicking on it\n\nWould you like me to help you with anything specific?`
    }])
    setIsAiThinking(false)
  }, [aiChatInput])

  const handleSave = useCallback(async () => {
    // Get the current workflow from the canvas
    const workflow = canvasRef.current?.getWorkflow()
    if (!workflow) {
      toast.error('Failed to get workflow data')
      return
    }

    setIsSaving(true)
    // TODO: Implement save functionality
    toast.success('Agent created successfully!')
    setHasChanges(false)
    setIsSaving(false)
  }, [])

  const handleBack = () => {
    router.push(`/dashboard/brands/${projectId}/studio/agents`)
  }

  // Measure workflow name width for dynamic input sizing
  useLayoutEffect(() => {
    if (workflowNameMeasureRef.current) {
      const measureWidth = workflowNameMeasureRef.current.offsetWidth
      const minWidth = 120
      const padding = 16 // px-2 on each side = 8px * 2
      const calculatedWidth = Math.max(minWidth, measureWidth + padding + 8) // Extra padding for safety
      setWorkflowNameWidth(calculatedWidth)
    } else {
      // Fallback to a reasonable default
      setWorkflowNameWidth(200)
    }
  }, [workflowName])

  const handleExportWorkflow = useCallback(() => {
    const workflow = canvasRef.current?.getWorkflow()
    if (!workflow) {
      toast.error('Failed to get workflow data')
      return
    }

    const workflowData = {
      name: workflowName,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      nodes: workflow.nodes,
      edges: workflow.edges,
    }

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}-workflow.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Workflow exported successfully!')
  }, [workflowName])

  const handleImportWorkflow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const workflowData = JSON.parse(content)

        if (workflowData.name) {
          setWorkflowName(workflowData.name)
        }

        // Apply imported workflow to canvas
        if (workflowData.nodes && workflowData.edges && canvasRef.current) {
          canvasRef.current.setWorkflow(workflowData.nodes, workflowData.edges)
        }

        toast.success('Workflow imported successfully!')
        setHasChanges(true)
      } catch {
        toast.error('Failed to import workflow. Invalid JSON file.')
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <ReactFlowProvider>
      <div className="inset-0 flex w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Left Panel - Node Library */}
          <ResizablePanel
            ref={leftPanelRef}
            defaultSize={22}
            minSize={18}
            maxSize={30}
            collapsible
            collapsedSize={0}
            onCollapse={() => setIsLeftPanelCollapsed(true)}
            onExpand={() => setIsLeftPanelCollapsed(false)}
            className={isLeftPanelCollapsed ? 'hidden' : 'h-full'}
          >
            <div className="relative dark:bg-polar-900 dark:border-polar-800 h-full w-full rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-polar-800">
                <div className="font-medium text-sm">Node Library</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLeftPanel}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Collapse panel"
                  title="Collapse panel"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>

              {/* Node Library - Scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <WorkflowSidebar
                  projectId={projectId}
                  onLoadTemplate={(template) => {
                    // Load template workflow into canvas
                    if (canvasRef.current) {
                      // Generate new IDs for nodes to avoid conflicts
                      const newNodes = template.nodes.map((node) => ({
                        ...node,
                        id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        position: {
                          x: node.position.x + 100, // Offset slightly
                          y: node.position.y + 100,
                        },
                      })) as WorkflowNode[]
                      // Generate new IDs for edges
                      const nodeIdMap = new Map(
                        template.nodes.map((oldNode, idx) => [oldNode.id, newNodes[idx]!.id])
                      )
                      const newEdges = template.edges.map((edge) => ({
                        ...edge,
                        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        source: nodeIdMap.get(edge.source) || edge.source,
                        target: nodeIdMap.get(edge.target) || edge.target,
                      })) as Edge[]
                      canvasRef.current.setWorkflow(newNodes, newEdges)
                      setWorkflowName(template.name)
                      setHasChanges(true)
                    }
                  }}
                />
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          {!isLeftPanelCollapsed && (
            <ResizableHandle withHandle className="mx-1 w-0 bg-transparent" />
          )}

          {/* Middle Panel - Canvas */}
          <ResizablePanel defaultSize={!rightPanelMode ? 78 : 56} minSize={40}>
            <div className="dark:bg-polar-900 dark:border-polar-800 relative h-full w-full rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div className="flex h-full w-full min-h-0 flex-col">
                {/* Canvas Header */}
                <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-200 dark:border-polar-800 px-3 md:px-4">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Back button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBack}
                      className="shrink-0 h-9 w-9 rounded-full"
                      title="Back to agents"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    {isLeftPanelCollapsed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLeftPanel}
                        className="shrink-0 h-9 w-9 rounded-full"
                        title="Show node library"
                      >
                        <PanelLeftOpen className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Agent name - editable */}
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-polar-700 min-w-0 flex-1">
                      <Workflow className="h-4 w-4 text-primary shrink-0" />
                      <div className="relative flex-1 min-w-0">
                        {/* Hidden span to measure text width */}
                        <span
                          ref={workflowNameMeasureRef}
                          className="invisible absolute whitespace-pre text-sm font-medium pointer-events-none"
                          aria-hidden="true"
                        >
                          {workflowName || 'Agent name...'}
                        </span>
                        <input
                          ref={workflowNameInputRef}
                          type="text"
                          value={workflowName}
                          onChange={(e) => {
                            setWorkflowName(e.target.value)
                            setHasChanges(true)
                          }}
                          className="text-sm font-medium bg-transparent border border-transparent rounded-md px-2 py-1 outline-none transition-all hover:border-gray-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:hover:border-polar-600 dark:hover:bg-polar-800 dark:focus:border-primary dark:focus:bg-polar-900 w-full min-w-[120px]"
                          placeholder="Agent name..."
                          style={{
                            width: workflowNameWidth > 0 ? `${workflowNameWidth}px` : 'auto',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* AI Assistant Button */}
                    <Button
                      variant={rightPanelMode === 'ai-chat' ? 'default' : 'outline'}
                      className="h-9 gap-2 rounded-full px-3"
                      onClick={handleOpenAiChat}
                      title="AI Assistant"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">AI</span>
                    </Button>

                    {/* More Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleExportWorkflow}>
                          <Download className="h-4 w-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Import from JSON
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                          <Play className="h-4 w-4 mr-2" />
                          Test Run (save first)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Hidden file input for import */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportWorkflow}
                      className="hidden"
                    />

                    <Button
                      className="h-9 gap-2 rounded-full px-3"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">
                        {isSaving ? 'Saving...' : 'Save'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 min-h-0">
                  <WorkflowCanvas
                    ref={canvasRef}
                    className="h-full w-full"
                    onNodesChange={() => setHasChanges(true)}
                    onEdgesChange={() => setHasChanges(true)}
                    onNodeSelect={handleNodeSelect}
                    onRegisterUpdateFn={handleRegisterUpdateFn}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle - Right (only show when right panel is open) */}
          {rightPanelMode && (
            <ResizableHandle withHandle className="mx-1 w-0 bg-transparent" />
          )}

          {/* Right Panel - Node Configuration or AI Chat */}
          {rightPanelMode && (
            <ResizablePanel
              defaultSize={22}
              minSize={18}
              maxSize={50}
              className="h-full"
            >
              <div className="relative dark:bg-polar-900 dark:border-polar-800 h-full w-full rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-polar-800">
                  <div className="flex items-center gap-2">
                    {rightPanelMode === 'ai-chat' && (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium text-sm">
                      {rightPanelMode === 'config' ? 'Node Configuration' : 'AI Assistant'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseRightPanel}
                    className="h-8 w-8 rounded-lg"
                    aria-label="Close panel"
                    title="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Panel Content */}
                {rightPanelMode === 'config' && selectedNode ? (
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <NodeConfigPanel
                      node={selectedNode}
                      onUpdate={handleNodeUpdate}
                      projectId={projectId}
                    />
                  </div>
                ) : rightPanelMode === 'ai-chat' ? (
                  <div className="flex-1 min-h-0 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {aiChatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                          <Sparkles className="h-10 w-10 text-primary/30 mb-4" />
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                            AI Workflow Assistant
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-polar-400">
                            Ask me anything about your workflow, get suggestions for improvements, or help building new automation flows.
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <button
                              onClick={() => setAiChatInput('How can I improve this workflow?')}
                              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-polar-400 hover:bg-gray-200 dark:hover:bg-polar-700 transition-colors"
                            >
                              How to improve?
                            </button>
                            <button
                              onClick={() => setAiChatInput('Add error handling to this workflow')}
                              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-polar-400 hover:bg-gray-200 dark:hover:bg-polar-700 transition-colors"
                            >
                              Add error handling
                            </button>
                            <button
                              onClick={() => setAiChatInput('Explain what this workflow does')}
                              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-polar-400 hover:bg-gray-200 dark:hover:bg-polar-700 transition-colors"
                            >
                              Explain workflow
                            </button>
                          </div>
                        </div>
                      ) : (
                        aiChatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100 dark:bg-polar-800 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      {isAiThinking && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-polar-800 rounded-2xl px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-polar-800">
                      <div className="flex gap-2">
                        <Input
                          value={aiChatInput}
                          onChange={(e) => setAiChatInput(e.target.value)}
                          placeholder="Ask about your workflow..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendAiMessage()
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          onClick={handleSendAiMessage}
                          disabled={!aiChatInput.trim() || isAiThinking}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </ReactFlowProvider>
  )
}

'use client'

import { useCallback, useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnNodesChange,
  type NodeMouseHandler,
  type ReactFlowInstance,
  BackgroundVariant,
  ConnectionLineType,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes } from './WorkflowNodes'
import type { WorkflowNode, WorkflowNodeType, WorkflowNodeData } from './workflow-types'

// ============================================================
// DEFAULT DATA
// ============================================================

const defaultNodeData: Record<WorkflowNodeType, Partial<WorkflowNodeData>> = {
  start: { label: 'Start', trigger: 'manual' },
  agent: { label: 'AI Agent', outputFormat: 'text', systemPrompt: '', userPrompt: '', outputVariable: '' },
  condition: { label: 'Condition', condition: '', operator: 'equals' },
  action: { label: 'Action', actionType: 'email' },
  transform: { label: 'Transform', transformType: 'get-first', inputVariable: '', outputVariable: '' },
  delay: { label: 'Delay', duration: 5, unit: 'minutes' },
  webhook: { label: 'Webhook', method: 'POST', url: '' },
  end: { label: 'End', notifyOnComplete: false },
  opportunities: { label: 'Opportunities', operation: 'list' },
  projects: { label: 'Projects', operation: 'get' },
  content: { label: 'Content', operation: 'create', contentType: 'blog' },
  // AI Sub-nodes
  'ai-model': { label: 'Chat Model', provider: 'openai', model: 'gpt-5o' },
  'ai-memory': { label: 'Memory', memoryType: 'buffer', windowSize: 10 },
  'ai-tool': { label: 'Tool', toolType: 'http' },
}

// Simple default workflow for new agents
const simpleStartNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 200 },
    data: { label: 'Start', trigger: 'manual' },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 550, y: 200 },
    data: { label: 'End', notifyOnComplete: false },
  },
]

const simpleStartEdges: Edge[] = [
  {
    id: 'e1',
    source: 'start-1',
    target: 'end-1',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
    style: { strokeWidth: 2 },
  },
]

// ============================================================
// INITIAL NODES & EDGES
// ============================================================

// Default workflow: Content generation from opportunities
// Node spacing: 280px horizontal gap between nodes
const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 300 },
    data: {
      label: 'Start',
      trigger: 'schedule',
      scheduleMode: 'simple',
      frequency: 'daily',
      time: '09:00',
      timezone: 'America/New_York',
    },
  },
  {
    id: 'opportunities-1',
    type: 'opportunities',
    position: { x: 330, y: 300 },
    data: {
      label: 'Get Opportunities',
      operation: 'list',
      filters: { status: 'NEW' },
      limit: 10,
    },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 610, y: 300 },
    data: { label: 'Take First', transformType: 'get-first', inputVariable: 'opportunities', outputVariable: 'opportunity' },
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 890, y: 300 },
    data: {
      label: 'Content Writer',
      systemPrompt: 'You are a professional content writer. Write engaging, SEO-optimized blog posts.',
      userPrompt: 'Write a blog post about {{opportunity.topic}}',
      outputFormat: 'markdown',
      outputVariable: 'blogContent',
      connectedModel: 'model-1',
    },
  },
  // AI Model connected to Content Writer
  {
    id: 'model-1',
    type: 'ai-model',
    position: { x: 750, y: 550 },
    data: {
      label: 'OpenAI GPT-5o',
      provider: 'openai',
      model: 'gpt-5o',
      temperature: 0.7,
    },
  },
  {
    id: 'content-1',
    type: 'content',
    position: { x: 1170, y: 200 },
    data: {
      label: 'Create Draft',
      operation: 'create',
      contentType: 'blog',
    },
  },
  {
    id: 'agent-2',
    type: 'agent',
    position: { x: 1170, y: 400 },
    data: {
      label: 'Asset Generator',
      systemPrompt: 'Generate image descriptions and alt text for blog posts.',
      userPrompt: 'Create a featured image description for: {{blogContent.title}}',
      outputFormat: 'json',
      outputVariable: 'assetMetadata',
      jsonSchema: '{"imagePrompt": "string", "altText": "string"}',
      connectedModel: 'model-2',
    },
  },
  // AI Model connected to Asset Generator
  {
    id: 'model-2',
    type: 'ai-model',
    position: { x: 1230, y: 620 },
    data: {
      label: 'GPT-5o Mini',
      provider: 'openai',
      model: 'gpt-5o-mini',
      temperature: 0.5,
    },
  },
  {
    id: 'content-2',
    type: 'content',
    position: { x: 1450, y: 300 },
    data: {
      label: 'Save Content',
      operation: 'update',
      contentType: 'blog',
    },
  },
  {
    id: 'opportunities-2',
    type: 'opportunities',
    position: { x: 1730, y: 300 },
    data: {
      label: 'Mark Complete',
      operation: 'get',
      description: 'Update opportunity status',
    },
  },
  {
    id: 'transform-2',
    type: 'transform',
    position: { x: 2010, y: 300 },
    data: { label: 'Format Output', transformType: 'format-text', inputVariable: 'content', outputVariable: 'payload', template: '{"title": "{{title}}", "body": "{{body}}"}' },
  },
  {
    id: 'webhook-1',
    type: 'webhook',
    position: { x: 2290, y: 300 },
    data: {
      label: 'Notify CMS',
      method: 'POST',
      url: 'https://api.cms.com/webhook',
    },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 2570, y: 300 },
    data: { label: 'End', notifyOnComplete: true },
  },
]

const initialEdges: Edge[] = [
  // Main workflow edges
  { id: 'e1', source: 'start-1', target: 'opportunities-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e2', source: 'opportunities-1', target: 'transform-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e3', source: 'transform-1', target: 'agent-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e4', source: 'agent-1', target: 'content-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e5', source: 'agent-1', target: 'agent-2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e6', source: 'content-1', target: 'content-2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e7', source: 'agent-2', target: 'content-2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e8', source: 'content-2', target: 'opportunities-2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e9', source: 'opportunities-2', target: 'transform-2', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e10', source: 'transform-2', target: 'webhook-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  { id: 'e11', source: 'webhook-1', target: 'end-1', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }, style: { strokeWidth: 2 } },
  // AI sub-node connections (bezier curves with dashed lines like N8N)
  // Only Chat Model is required by default - Memory and Tools are optional
  { id: 'ai-e1', source: 'model-1', target: 'agent-1', targetHandle: 'model', type: 'default', style: { strokeWidth: 1.5, strokeDasharray: '5,5', stroke: '#818cf8' } },
  { id: 'ai-e2', source: 'model-2', target: 'agent-2', targetHandle: 'model', type: 'default', style: { strokeWidth: 1.5, strokeDasharray: '5,5', stroke: '#818cf8' } },
]

// ============================================================
// WORKFLOW CANVAS COMPONENT
// ============================================================

// Type for the update function passed to parent
export type NodeUpdateFn = (nodeId: string, data: Partial<WorkflowNodeData>) => void

// Ref interface for external access to workflow state
export interface WorkflowCanvasRef {
  getWorkflow: () => { nodes: WorkflowNode[]; edges: Edge[] }
  setWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => void
}

interface WorkflowCanvasProps {
  className?: string
  initialNodes?: WorkflowNode[]
  initialEdges?: Edge[]
  onNodesChange?: (nodes: WorkflowNode[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  onNodeSelect?: (node: WorkflowNode | null) => void
  onRegisterUpdateFn?: (updateFn: NodeUpdateFn) => void
  readOnly?: boolean
}

export const WorkflowCanvas = forwardRef<WorkflowCanvasRef, WorkflowCanvasProps>(function WorkflowCanvas(
  {
    className,
    initialNodes: propInitialNodes,
    initialEdges: propInitialEdges,
    onNodesChange,
    onEdgesChange,
    onNodeSelect,
    onRegisterUpdateFn,
    readOnly = false,
  },
  ref
) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  // Use provided initial nodes/edges or fallback to simple start workflow
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(propInitialNodes ?? simpleStartNodes)
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(propInitialEdges ?? simpleStartEdges)

  // Expose methods via ref for parent to access workflow state
  useImperativeHandle(ref, () => ({
    getWorkflow: () => ({
      nodes: nodes as WorkflowNode[],
      edges: edges,
    }),
    setWorkflow: (newNodes: WorkflowNode[], newEdges: Edge[]) => {
      setNodes(newNodes)
      setEdges(newEdges)
    },
  }), [nodes, edges, setNodes, setEdges])
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  // Store callbacks in refs to avoid dependency issues
  const onNodeSelectRef = useRef(onNodeSelect)
  onNodeSelectRef.current = onNodeSelect

  // Update a specific node's data - stable function that doesn't change
  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          if (node.id === nodeId) {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
            // Notify parent that node was updated with new data
            setTimeout(() => {
              onNodeSelectRef.current?.(updatedNode as WorkflowNode)
            }, 0)
            return updatedNode
          }
          return node
        })
        return updatedNodes
      })
    },
    [setNodes]
  )

  // Register the update function with parent - only once on mount
  useEffect(() => {
    onRegisterUpdateFn?.(updateNodeData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Store other callbacks in refs
  const onNodesChangeRef = useRef(onNodesChange)
  onNodesChangeRef.current = onNodesChange
  const onEdgesChangeRef = useRef(onEdgesChange)
  onEdgesChangeRef.current = onEdgesChange

  // Track node changes
  const handleNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => {
      onNodesChangeInternal(changes as Parameters<typeof onNodesChangeInternal>[0])
      // Just notify parent that something changed
      onNodesChangeRef.current?.([] as WorkflowNode[])
    },
    [onNodesChangeInternal]
  )

  // Track edge changes
  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChangeInternal>[0]) => {
      onEdgesChangeInternal(changes)
      // Just notify parent that something changed
      onEdgesChangeRef.current?.([])
    },
    [onEdgesChangeInternal]
  )

  // Handle connection between nodes
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.sourceHandle || 'default'}-${connection.target}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
        },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  // Handle drag over for dropping nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Handle drop to add new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (readOnly) return

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          ...defaultNodeData[type],
        } as WorkflowNodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes, readOnly]
  )

  // Handle node selection
  const onNodeClick: NodeMouseHandler<Node> = useCallback(
    (_, node) => {
      onNodeSelect?.(node as WorkflowNode)
    },
    [onNodeSelect]
  )

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null)
  }, [onNodeSelect])

  return (
    <div ref={reactFlowWrapper} className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as NodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          style: {
            strokeWidth: 2,
          },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="bg-gray-50 dark:bg-polar-950"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="!bg-gray-50 dark:!bg-polar-950"
          color="rgba(0,0,0,0.1)"
        />
        <Controls
          className="!bg-white dark:!bg-polar-800 !border-gray-200 dark:!border-polar-700 !rounded-xl !shadow-md [&>button]:!bg-white dark:[&>button]:!bg-polar-800 [&>button]:!border-gray-200 dark:[&>button]:!border-polar-700 [&>button]:hover:!bg-gray-50 dark:[&>button]:hover:!bg-polar-700 [&>button]:!rounded-lg [&>button>svg]:!fill-gray-600 dark:[&>button>svg]:!fill-polar-300"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white dark:!bg-polar-800 !border-gray-200 dark:!border-polar-700 !rounded-xl !shadow-md"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#22c55e',
              agent: '#6366f1',
              condition: '#f59e0b',
              action: '#ec4899',
              transform: '#8b5cf6',
              delay: '#64748b',
              webhook: '#0ea5e9',
              end: '#ef4444',
              opportunities: '#f59e0b',
              projects: '#3b82f6',
              content: '#10b981',
            }
            return colors[node.type || ''] || '#6b7280'
          }}
          maskColor="rgba(0,0,0,0.1)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
})

export { initialNodes, initialEdges, simpleStartNodes, simpleStartEdges }


'use client'

import { memo, useEffect, useState } from 'react'
import {
  Play,
  Bot,
  GitBranch,
  Zap,
  Shuffle,
  Clock,
  Globe,
  Flag,
  GripVertical,
  Lightbulb,
  Folder,
  FileText,
  Sparkles,
  Brain,
  Wrench,
  Bookmark,
  Loader2,
} from 'lucide-react'
import { NODE_DEFINITIONS, NODE_CATEGORIES, type NodeDefinition } from './workflow-types'
import type { AgentDto } from '@workspace/common/lib/shcmea/types/agent'
import { toast } from 'sonner'

// ============================================================
// ICON MAP
// ============================================================

const iconMap: Record<string, React.ElementType> = {
  play: Play,
  bot: Bot,
  'git-branch': GitBranch,
  zap: Zap,
  shuffle: Shuffle,
  clock: Clock,
  globe: Globe,
  flag: Flag,
  lightbulb: Lightbulb,
  folder: Folder,
  'file-text': FileText,
  sparkles: Sparkles,
  brain: Brain,
  wrench: Wrench,
}

// ============================================================
// DRAGGABLE NODE ITEM
// ============================================================

interface DraggableNodeItemProps {
  node: NodeDefinition
}

const DraggableNodeItem = memo(function DraggableNodeItem({
  node,
}: DraggableNodeItemProps) {
  const Icon = iconMap[node.icon] || Zap
  const isSubNode = node.isSubNode

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', node.type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`flex items-center gap-3 p-3 border bg-white dark:bg-polar-800 cursor-grab hover:shadow-sm transition-all active:cursor-grabbing group ${
        isSubNode 
          ? 'rounded-full border-dashed border-gray-300 dark:border-polar-600 hover:border-gray-400 dark:hover:border-polar-500' 
          : 'rounded-xl border-gray-200 dark:border-polar-700 hover:border-gray-300 dark:hover:border-polar-600'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className={`flex shrink-0 items-center justify-center ${
            isSubNode ? 'h-7 w-7 rounded-full' : 'h-8 w-8 rounded-lg'
          }`}
          style={{ backgroundColor: `${node.color}15` }}
        >
          <Icon className={isSubNode ? 'h-3.5 w-3.5' : 'h-4 w-4'} style={{ color: node.color }} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`font-medium text-gray-900 dark:text-white truncate ${isSubNode ? 'text-xs' : 'text-sm'}`}>
            {node.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-polar-400 truncate">
            {node.description}
          </span>
        </div>
      </div>
      <GripVertical className="h-4 w-4 text-gray-300 dark:text-polar-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  )
})

// ============================================================
// DRAGGABLE TEMPLATE ITEM
// ============================================================

interface DraggableTemplateItemProps {
  template: AgentDto
  onLoadTemplate: (template: AgentDto) => void
}

const DraggableTemplateItem = memo(function DraggableTemplateItem({
  template,
  onLoadTemplate,
}: DraggableTemplateItemProps) {
  const handleClick = () => {
    onLoadTemplate(template)
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border bg-white dark:bg-polar-800 cursor-pointer hover:shadow-sm transition-all group rounded-xl border-gray-200 dark:border-polar-700 hover:border-primary dark:hover:border-primary"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="flex shrink-0 items-center justify-center h-8 w-8 rounded-lg"
          style={{ backgroundColor: '#6366f115' }}
        >
          <Bookmark className="h-4 w-4" style={{ color: '#6366f1' }} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-gray-900 dark:text-white truncate text-sm">
            {template.name}
          </span>
          {template.description && (
            <span className="text-xs text-gray-500 dark:text-polar-400 truncate">
              {template.description}
            </span>
          )}
        </div>
      </div>
      <GripVertical className="h-4 w-4 text-gray-300 dark:text-polar-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  )
})

// ============================================================
// WORKFLOW SIDEBAR
// ============================================================

interface WorkflowSidebarProps {
  className?: string
  projectId?: string
  onLoadTemplate?: (template: AgentDto) => void
}

export function WorkflowSidebar({ className, projectId, onLoadTemplate }: WorkflowSidebarProps) {
  const [templates, setTemplates] = useState<AgentDto[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

  useEffect(() => {
    if (projectId) {
      setIsLoadingTemplates(true)
      // TODO: Implement template fetching
      setIsLoadingTemplates(false)
    }
  }, [projectId])

  const handleLoadTemplate = (template: AgentDto) => {
    if (onLoadTemplate) {
      onLoadTemplate(template)
      toast.success(`Template "${template.name}" loaded`)
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        {/* Templates Section - First */}
        {projectId && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-polar-500 uppercase tracking-wider px-1">
              Templates
            </h3>
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : templates.length === 0 ? (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-polar-800/50 border border-gray-100 dark:border-polar-700">
                <p className="text-xs text-gray-500 dark:text-polar-400 text-center">
                  No templates yet. Save an agent as a template to get started.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {templates.map((template) => (
                  <DraggableTemplateItem
                    key={template.id}
                    template={template}
                    onLoadTemplate={handleLoadTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular Node Categories */}
        {NODE_CATEGORIES.map((category) => {
          const categoryNodes = NODE_DEFINITIONS.filter(
            (node) => node.category === category.id
          )

          if (categoryNodes.length === 0) return null

          return (
            <div key={category.id} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-polar-500 uppercase tracking-wider px-1">
                {category.label}
              </h3>
              <div className="flex flex-col gap-2">
                {categoryNodes.map((node) => (
                  <DraggableNodeItem key={node.type} node={node} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Help text */}
      <div className="mt-6 mb-2 p-3 rounded-xl bg-gray-50 dark:bg-polar-800/50 border border-gray-100 dark:border-polar-700">
        <p className="text-xs text-gray-500 dark:text-polar-400">
          Drag nodes onto the canvas to build your workflow. Connect nodes by
          dragging from output handles to input handles.
        </p>
      </div>
    </div>
  )
}

export { DraggableNodeItem }


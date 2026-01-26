'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Settings,
  MoreHorizontal,
  Trash2,
  Copy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@workspace/ui/components/dropdown-menu'
import { Badge } from '@workspace/ui/components/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { toast } from 'sonner'

import type { AgentDto, AgentStatus, AgentTrigger } from '@/lib/shcmea/types/agent'
import { formatDistanceToNow } from 'date-fns'

// Tab type
type AgentsTab = 'agents' | 'prompts'

// Page size options
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

// Local types
type SortKey = 'name' | 'status' | 'totalRuns' | 'lastRun' | 'successRate'
type StatusFilter = 'all' | AgentStatus
type TriggerFilter = 'all' | AgentTrigger

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Helper function to get status badge
const getStatusBadge = (status: AgentStatus) => {
  switch (status) {
    case 'ACTIVE':
      return {
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        label: 'Active',
      }
    case 'PAUSED':
      return {
        icon: Pause,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Paused',
      }
    case 'ERROR':
      return {
        icon: AlertCircle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        label: 'Error',
      }
    case 'IDLE':
    default:
      return {
        icon: Clock,
        color: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        label: 'Idle',
      }
  }
}

// Format last run date
const formatLastRun = (date: Date | null): string => {
  if (!date) return 'Never'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export default function AgentsPage({ projectId }: { projectId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get tab from URL query param
  const tabFromUrl = searchParams.get('tab') as AgentsTab | null
  const initialTab: AgentsTab = tabFromUrl && ['agents', 'prompts'].includes(tabFromUrl) ? tabFromUrl : 'agents'
  const [activeTab, setActiveTab] = useState<AgentsTab>(initialTab)

  // State
  const [agents, setAgents] = useState<AgentDto[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortKey, setSortKey] = useState<SortKey>('lastRun')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<{ id: string; name: string } | null>(null)

  // Load agents
  const loadAgents = useCallback(() => {
    setIsLoading(true)
    // TODO: Implement data fetching
    setIsLoading(false)
  }, [statusFilter, triggerFilter, projectId, searchQuery])

  // Load agents on mount and when filters change
  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  // Sort agents client-side
  const sortedAgents = [...agents].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'totalRuns':
        comparison = a.totalRuns - b.totalRuns
        break
      case 'successRate':
        comparison = a.successRate - b.successRate
        break
      case 'lastRun':
        const aDate = a.lastRunAt ? new Date(a.lastRunAt).getTime() : 0
        const bDate = b.lastRunAt ? new Date(b.lastRunAt).getTime() : 0
        comparison = aDate - bDate
        break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination calculations
  const totalItems = sortedAgents.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedAgents = sortedAgents.slice(startIndex, endIndex)

  // Bulk selection helpers
  const someSelected = selectedIds.size > 0
  const allSelected = paginatedAgents.length > 0 && paginatedAgents.every((a) => selectedIds.has(a.id))
  const checkboxState = allSelected ? true : someSelected ? 'indeterminate' : false

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleTriggerFilterChange = (trigger: TriggerFilter) => {
    setTriggerFilter(trigger)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    )
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (validCurrentPage > 3) pages.push('ellipsis')

      const start = Math.max(2, validCurrentPage - 1)
      const end = Math.min(totalPages - 1, validCurrentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (validCurrentPage < totalPages - 2) pages.push('ellipsis')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  // Bulk selection handlers
  const handleSelectOne = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(paginatedAgents.map((a) => a.id)))
    } else {
      setSelectedIds(new Set())
    }
  }, [paginatedAgents])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Bulk actions
  const handleBulkRun = useCallback(() => {
    // TODO: Implement bulk run
    toast.info('Running agents...')
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleBulkPause = useCallback(() => {
    // TODO: Implement bulk pause
    toast.info('Pausing agents...')
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size > 0) {
      setIsBulkDeleteModalOpen(true)
    }
  }, [selectedIds])

  const confirmBulkDelete = useCallback(() => {
    // TODO: Implement bulk delete
    toast.success('Agents deleted successfully')
    setIsBulkDeleteModalOpen(false)
    setSelectedIds(new Set())
  }, [selectedIds])

  // Single agent actions
  const handleRunAgent = (agentId: string) => {
    // TODO: Implement run agent
    toast.info('Running agent...')
  }

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    setAgentToDelete({ id: agentId, name: agentName })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = useCallback(() => {
    // TODO: Implement delete
    toast.success('Agent deleted successfully')
    setIsDeleteModalOpen(false)
    setAgentToDelete(null)
  }, [agentToDelete])

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== 'all' || triggerFilter !== 'all' || searchQuery.trim() !== ''

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTriggerFilter('all')
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="relative flex min-w-0 flex-2 flex-col md:overflow-y-auto h-full w-full">
      <div className="mx-auto flex w-full flex-col">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AgentsTab)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="agents"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Agents
              </TabsTrigger>
              <TabsTrigger
                value="prompts"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Prompts
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Agents Tab */}
          <TabsContent value="agents" className="mt-0">
            {/* Table Card */}
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-2">
                  <span className="text-lg font-semibold">AI Agents</span>
                  <p className="text-sm text-muted-foreground">Manage and monitor your automated AI agents.</p>
                </div>
                <div className="flex shrink-0 flex-row items-center gap-2">
                  <Button size="sm" onClick={() => router.push(`/dashboard/projects/${projectId}/agents/new`)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Agent
                  </Button>
                </div>
              </div>
          <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
            {/* Search Bar and Filters */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-polar-700 bg-white dark:bg-polar-800 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v) => handleStatusFilterChange(v as StatusFilter)}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                    <SelectItem value="IDLE">Idle</SelectItem>
                  </SelectContent>
                </Select>

                {/* Trigger Filter */}
                <Select value={triggerFilter} onValueChange={(v) => handleTriggerFilterChange(v as TriggerFilter)}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Triggers</SelectItem>
                    <SelectItem value="SCHEDULE">Automated</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-9 text-muted-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {/* Bulk Action Bar */}
            {someSelected && (
              <div className="flex items-center justify-between gap-4 px-6 py-3 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedIds.size} {selectedIds.size === 1 ? 'agent' : 'agents'} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkRun}
                    className="h-8 gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Run
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkPause}
                    className="h-8 gap-1.5"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="h-8 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-polar-800 bg-gray-50/50 dark:bg-polar-900/50">
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={checkboxState}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all"
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1.5">
                        Agent
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1.5">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Trigger
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('totalRuns')}
                    >
                      <div className="flex items-center gap-1.5">
                        Runs
                        {getSortIcon('totalRuns')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('successRate')}
                    >
                      <div className="flex items-center gap-1.5">
                        Success
                        {getSortIcon('successRate')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('lastRun')}
                    >
                      <div className="flex items-center gap-1.5">
                        Last Run
                        {getSortIcon('lastRun')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-polar-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">Loading agents...</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedAgents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Bot className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery || hasActiveFilters
                              ? 'No agents match your filters'
                              : 'No agents found. Create your first agent to get started.'}
                          </p>
                          {hasActiveFilters ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearFilters}
                              className="text-primary"
                            >
                              Clear filters
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => router.push(`/dashboard/projects/${projectId}/agents/new`)}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create Agent
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedAgents.map((agent) => {
                      const statusBadge = getStatusBadge(agent.status)
                      const StatusIcon = statusBadge.icon
                      return (
                        <tr
                          key={agent.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-polar-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Checkbox
                              checked={selectedIds.has(agent.id)}
                              onCheckedChange={(checked) => handleSelectOne(agent.id, !!checked)}
                              aria-label={`Select ${agent.name}`}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <Link
                                  href={`/dashboard/projects/${projectId}/studio/agents/${agent.id}`}
                                  className="font-medium text-sm truncate hover:text-primary hover:underline transition-colors"
                                >
                                  {agent.name}
                                </Link>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {agent.description || 'No description'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={`${statusBadge.bgColor} ${statusBadge.color} gap-1`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusBadge.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={
                                agent.trigger === 'SCHEDULE'
                                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                              }
                            >
                              {agent.trigger === 'SCHEDULE' ? 'Automated' : 'Manual'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatNumber(agent.totalRuns)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-sm font-medium ${
                                agent.successRate >= 90
                                  ? 'text-green-600 dark:text-green-400'
                                  : agent.successRate >= 70
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : agent.totalRuns === 0
                                  ? 'text-muted-foreground'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {agent.totalRuns === 0 ? '-' : `${agent.successRate}%`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatLastRun(agent.lastRunAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/projects/${projectId}/studio/agents/${agent.id}`)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRunAgent(agent.id)}
                                    className="cursor-pointer"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Run Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/projects/${projectId}/studio/agents/${agent.id}/configure`)}
                                    className="cursor-pointer"
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteAgent(agent.id, agent.name)}
                                    className="cursor-pointer text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-4 px-6 py-4 border-t border-gray-200 dark:border-polar-800 bg-gray-50/50 dark:bg-polar-900/50 sm:flex-row sm:items-center sm:justify-between">
              {/* Results info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Showing {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of{' '}
                  {totalItems} {totalItems === 1 ? 'agent' : 'agents'}
                </span>
              </div>

              {/* Pagination controls and page size */}
              <div className="flex items-center gap-4">
                {/* Page size selector */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Show</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => handlePageSizeChange(Number(value))}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="hidden sm:inline">per page</span>
                </div>

                {/* Page navigation */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={validCurrentPage === 1}
                      className="h-8 px-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {getPageNumbers().map((page, index) =>
                      page === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={validCurrentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={validCurrentPage === totalPages}
                      className="h-8 px-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="mt-0">
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                <div className="flex flex-col items-center justify-center gap-y-6 py-24 md:py-32">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex flex-col items-center gap-y-2 px-4">
                    <h3 className="text-lg font-semibold">No prompts yet</h3>
                    <p className="dark:text-polar-500 text-gray-500 text-center max-w-md text-sm">
                      Create and manage prompts for your AI agents. Define custom instructions, templates, and reusable content.
                    </p>
                  </div>
                  <Button onClick={() => toast.info('Add Prompt modal coming soon')} className="gap-2 mt-2">
                    <Plus className="h-4 w-4" />
                    Add Prompt
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Agent Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{agentToDelete?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Modal */}
      <AlertDialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Agent(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected agent(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
            >
              Delete {selectedIds.size} Agent(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

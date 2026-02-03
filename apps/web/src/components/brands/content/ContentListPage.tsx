'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Badge } from '@workspace/ui/components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import {
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  GripVertical,
  ArrowLeftRight,
  Lightbulb,
  Trash2,
  X,
  Clock,
  Tag,
  Upload,
  Link2,
  HelpCircle,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Textarea } from '@workspace/ui/components/textarea'
import { Label } from '@workspace/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { ViewOptionsPopover } from '@/components/brands/ViewOptionsPopover'
import { DEFAULT_VIEW_OPTIONS, type ViewOptions } from '@workspace/common/lib'
import { cn } from '@workspace/common/lib'

// ============================================================
// TYPES
// ============================================================
type ContentStatus = 'scheduled' | 'published' | 'draft'
type ContentType = 'Listicle' | 'How To' | 'Explainer' | 'Product Listicle' | 'Guide' | 'Tutorial'
type CalendarPeriod = 'day' | 'week' | 'month'

interface ContentItem {
  id: string
  title: string
  type: ContentType
  status: ContentStatus
  scheduledDate: Date
  keywordDifficulty?: number
  searchVolume?: number
  createdAt: Date
  updatedAt: Date
}

interface ContentFilterChip {
  key: 'status' | 'type'
  value: string
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Calendar helpers
function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  let startDayOfWeek = firstDay.getDay()
  // Convert to Monday-first (0 = Monday, 6 = Sunday)
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  
  // Add days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push(d)
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  
  // Add days from next month to complete the grid (6 rows)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear()
}

function isSameMonth(d1: Date, d2: Date): boolean {
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
}

// Get week days starting from Monday of the given date's week
function getWeekDays(date: Date): Date[] {
  const days: Date[] = []
  const dayOfWeek = date.getDay()
  // Convert to Monday-first (0 = Monday, 6 = Sunday)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + mondayOffset)
  
  for (let i = 0; i < 7; i++) {
    days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
  }
  return days
}

// Format week range
function formatWeekRange(date: Date): string {
  const weekDays = getWeekDays(date)
  const start = weekDays[0]
  const end = weekDays[6]
  
  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
  }
  return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`
}

// ============================================================
// SAMPLE DATA
// ============================================================
const SAMPLE_CONTENT: ContentItem[] = [
  {
    id: 'content-1',
    title: '7 Best Productivity Tools for Entrepreneurs to Build Faster',
    type: 'Listicle',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-26'),
    keywordDifficulty: 21,
    searchVolume: 190,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'content-2',
    title: 'How to Build a No-Code App for Small Businesses Easily',
    type: 'How To',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-27'),
    keywordDifficulty: 24,
    searchVolume: 220,
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-21'),
  },
  {
    id: 'content-3',
    title: 'types of no-code apps',
    type: 'Listicle',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-28'),
    keywordDifficulty: 21,
    searchVolume: 190,
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-22'),
  },
  {
    id: 'content-4',
    title: 'why use ai in business',
    type: 'Explainer',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-29'),
    keywordDifficulty: 19,
    searchVolume: 340,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-23'),
  },
  {
    id: 'content-5',
    title: 'firebase.google.com alternatives',
    type: 'Product Listicle',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-30'),
    keywordDifficulty: 24,
    searchVolume: 160,
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-24'),
  },
  {
    id: 'content-6',
    title: 'future of no-code platforms',
    type: 'Explainer',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-31'),
    keywordDifficulty: 15,
    searchVolume: 130,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: 'content-7',
    title: 'industry use cases for no-code',
    type: 'Explainer',
    status: 'scheduled',
    scheduledDate: new Date('2026-02-01'),
    keywordDifficulty: 20,
    searchVolume: 170,
    createdAt: new Date('2026-01-21'),
    updatedAt: new Date('2026-01-26'),
  },
  {
    id: 'content-8',
    title: 'Complete Guide to AI Content Optimization',
    type: 'Guide',
    status: 'published',
    scheduledDate: new Date('2026-01-15'),
    keywordDifficulty: 35,
    searchVolume: 580,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'content-9',
    title: 'SEO Best Practices for 2026',
    type: 'Tutorial',
    status: 'published',
    scheduledDate: new Date('2026-01-10'),
    keywordDifficulty: 42,
    searchVolume: 890,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-10'),
  },
]

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function ContentListPage() {
  const params = useParams()
  const projectId = params.id as string

  const [searchQuery, setSearchQuery] = useState('')
  const [content, setContent] = useState<ContentItem[]>(SAMPLE_CONTENT)
  const [isLoading] = useState(false)
  const [filters, setFilters] = useState<ContentFilterChip[]>([])

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false)
  const [changeTopicModalOpen, setChangeTopicModalOpen] = useState(false)
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)

  // Get selected content item
  const selectedContent = useMemo(() => {
    return content.find(c => c.id === selectedContentId) || null
  }, [content, selectedContentId])

  // Modal handlers
  const handleOpenDelete = (contentId: string) => {
    setSelectedContentId(contentId)
    setDeleteModalOpen(true)
  }

  const handleOpenInstructions = (contentId: string) => {
    setSelectedContentId(contentId)
    setInstructionsModalOpen(true)
  }

  const handleOpenChangeTopic = (contentId: string) => {
    setSelectedContentId(contentId)
    setChangeTopicModalOpen(true)
  }

  const handleDeleteContent = () => {
    if (selectedContentId) {
      setContent(prev => prev.filter(item => item.id !== selectedContentId))
      setDeleteModalOpen(false)
      setSelectedContentId(null)
      toast.success('Content deleted successfully')
    }
  }

  // Update content scheduled date (for drag and drop)
  const updateContentDate = (contentId: string, newDate: Date) => {
    setContent(prev => prev.map(item => 
      item.id === contentId 
        ? { ...item, scheduledDate: newDate, updatedAt: new Date() }
        : item
    ))
  }

  // Reorder content within a day (for day view drag and drop)
  const reorderContent = (contentId: string, newIndex: number) => {
    const dayContent = filteredContent.filter(c => isSameDay(c.scheduledDate, currentDate))
    const itemIndex = dayContent.findIndex(c => c.id === contentId)
    if (itemIndex === -1 || itemIndex === newIndex) return

    // Create new order by updating a virtual "order" field or just rearranging in state
    const newDayContent = [...dayContent]
    const [movedItem] = newDayContent.splice(itemIndex, 1)
    newDayContent.splice(newIndex, 0, movedItem)

    // Update the content array with new order (using updatedAt as a proxy for order)
    const baseTime = new Date().getTime()
    setContent(prev => {
      const otherContent = prev.filter(c => !isSameDay(c.scheduledDate, currentDate))
      const reorderedDayContent = newDayContent.map((item, idx) => ({
        ...item,
        updatedAt: new Date(baseTime + idx) // Use timestamp to preserve order
      }))
      return [...otherContent, ...reorderedDayContent]
    })
  }
  
  // View options - default to calendar view for content
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    ...DEFAULT_VIEW_OPTIONS,
    viewType: 'calendar',
  })

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)) // January 2026
  const [calendarPeriod, setCalendarPeriod] = useState<CalendarPeriod>('month')

  // Filter content based on search and filter chips
  const filteredContent = useMemo(() => {
    let result = content
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.type.toLowerCase().includes(query)
      )
    }
    
    // Apply filter chips
    if (filters.length > 0) {
      const statusFilters = filters.filter(f => f.key === 'status').map(f => f.value.toLowerCase())
      const typeFilters = filters.filter(f => f.key === 'type').map(f => f.value)
      
      if (statusFilters.length > 0) {
        result = result.filter(c => statusFilters.includes(c.status))
      }
      if (typeFilters.length > 0) {
        result = result.filter(c => typeFilters.includes(c.type))
      }
    }
    
    return result
  }, [content, searchQuery, filters])

  // Compute filter counts
  const filterCounts = useMemo(() => {
    return {
      status: {
        draft: content.filter(c => c.status === 'draft').length,
        scheduled: content.filter(c => c.status === 'scheduled').length,
        published: content.filter(c => c.status === 'published').length,
      },
      type: {
        'Listicle': content.filter(c => c.type === 'Listicle').length,
        'How To': content.filter(c => c.type === 'How To').length,
        'Explainer': content.filter(c => c.type === 'Explainer').length,
        'Product Listicle': content.filter(c => c.type === 'Product Listicle').length,
        'Guide': content.filter(c => c.type === 'Guide').length,
        'Tutorial': content.filter(c => c.type === 'Tutorial').length,
      }
    }
  }, [content])

  // Calendar navigation
  const goToPrevious = () => {
    if (calendarPeriod === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (calendarPeriod === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1))
    }
  }

  const goToNext = () => {
    if (calendarPeriod === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (calendarPeriod === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthDays = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
  }, [currentDate])

  const weekDays = useMemo(() => {
    return getWeekDays(currentDate)
  }, [currentDate])

  // Get display label based on period
  const getDateLabel = () => {
    if (calendarPeriod === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else if (calendarPeriod === 'week') {
      return formatWeekRange(currentDate)
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const getContentForDate = (date: Date): ContentItem[] => {
    return filteredContent.filter(c => isSameDay(c.scheduledDate, date))
  }

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header */}
      <header className="flex flex-col border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/70 h-[82px]">
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => toast.info('Google Drive import coming soon')}>
                  <Image 
                    src="/icons/google-drive.svg" 
                    alt="Google Drive" 
                    width={16} 
                    height={16} 
                    className="mr-2"
                  />
                  From Google Drive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('CSV import coming soon')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Bulk Import (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Markdown import coming soon')}>
                  <FileCode className="h-4 w-4 mr-2" />
                  From Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              size="sm"
              variant="ghost"
              className="rounded-full h-8 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => toast.info('Create content coming soon')}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            {/* Filter Popover */}
            <ContentFilterPopover
              filters={filters}
              onApply={setFilters}
              onClear={() => setFilters([])}
              counts={filterCounts}
            />
            
            {/* Filter chips */}
            {filters.length > 0 && (
              <div className="flex items-center gap-1.5">
                {filters.map((chip, idx) => (
                  <div
                    key={`${chip.key}-${chip.value}-${idx}`}
                    className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    <span>{chip.value}</span>
                    <button
                      onClick={() => setFilters(prev => prev.filter((_, i) => i !== idx))}
                      className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {viewOptions.viewType === 'calendar' && (
              <>
                {/* Period toggle */}
                <div className="flex items-center rounded-lg bg-muted p-1 ml-2">
                  <button
                    onClick={() => setCalendarPeriod('day')}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      calendarPeriod === 'day' 
                        ? "bg-background shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setCalendarPeriod('week')}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      calendarPeriod === 'week' 
                        ? "bg-background shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCalendarPeriod('month')}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      calendarPeriod === 'month' 
                        ? "bg-background shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Month
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <span className="text-lg font-medium ml-2">
                  {getDateLabel()}
                </span>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-2 h-8"
                  onClick={goToToday}
                >
                  Today
                </Button>
              </>
            )}
            {(viewOptions.viewType === 'card' || viewOptions.viewType === 'table' || viewOptions.viewType === 'kanban') && (
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search content..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-9 h-9 w-64" 
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* View Options Popover - same as projects page */}
            <ViewOptionsPopover 
              options={viewOptions} 
              onChange={setViewOptions}
              allowedViewTypes={["calendar", "card", "table", "kanban"]}
            />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {viewOptions.viewType === 'calendar' && calendarPeriod === 'month' && (
              <MonthCalendarView 
                days={monthDays}
                currentDate={currentDate}
                getContentForDate={getContentForDate}
                projectId={projectId}
                onContentDateChange={updateContentDate}
                onDeleteContent={handleOpenDelete}
                onAddInstructions={handleOpenInstructions}
                onChangeTopic={handleOpenChangeTopic}
              />
            )}
            {viewOptions.viewType === 'calendar' && calendarPeriod === 'week' && (
              <WeekCalendarView 
                days={weekDays}
                getContentForDate={getContentForDate}
                projectId={projectId}
                onContentDateChange={updateContentDate}
                onDeleteContent={handleOpenDelete}
                onAddInstructions={handleOpenInstructions}
                onChangeTopic={handleOpenChangeTopic}
              />
            )}
            {viewOptions.viewType === 'calendar' && calendarPeriod === 'day' && (
              <DayCalendarView 
                currentDate={currentDate}
                content={filteredContent.filter(c => isSameDay(c.scheduledDate, currentDate)).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())}
                projectId={projectId}
                onReorderContent={reorderContent}
                onDeleteContent={handleOpenDelete}
                onAddInstructions={handleOpenInstructions}
                onChangeTopic={handleOpenChangeTopic}
              />
            )}
            {viewOptions.viewType === 'card' && (
              <CardView 
                content={filteredContent}
                projectId={projectId}
              />
            )}
            {viewOptions.viewType === 'table' && (
              <TableView 
                content={filteredContent}
                projectId={projectId}
              />
            )}
            {viewOptions.viewType === 'kanban' && (
              <KanbanView 
                content={filteredContent}
                projectId={projectId}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedContent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Instructions Modal */}
      <AddInstructionsModal
        open={instructionsModalOpen}
        onOpenChange={setInstructionsModalOpen}
        contentTitle={selectedContent?.title || ''}
        onSave={(instructions, referenceUrl, productImage) => {
          // TODO: Save instructions to content
          console.log('Saving instructions:', { instructions, referenceUrl, productImage })
          toast.success('Instructions saved')
          setInstructionsModalOpen(false)
          setSelectedContentId(null)
        }}
      />

      {/* Change Topic Modal */}
      <ChangeTopicModal
        open={changeTopicModalOpen}
        onOpenChange={setChangeTopicModalOpen}
        onConfirm={(topic) => {
          if (selectedContentId) {
            setContent(prev => prev.map(item =>
              item.id === selectedContentId
                ? { ...item, title: topic.title, type: topic.type as ContentType, keywordDifficulty: topic.difficulty, searchVolume: topic.volume }
                : item
            ))
            toast.success('Topic changed successfully')
          }
          setChangeTopicModalOpen(false)
          setSelectedContentId(null)
        }}
      />
    </div>
  )
}

// ============================================================
// MONTH CALENDAR VIEW (Traditional grid with all days)
// ============================================================
interface MonthCalendarViewProps {
  days: Date[]
  currentDate: Date
  getContentForDate: (date: Date) => ContentItem[]
  projectId: string
  onContentDateChange: (contentId: string, newDate: Date) => void
  onDeleteContent: (contentId: string) => void
  onAddInstructions: (contentId: string) => void
  onChangeTopic: (contentId: string) => void
}

function MonthCalendarView({ days, currentDate, getContentForDate, projectId, onContentDateChange, onDeleteContent, onAddInstructions, onChangeTopic }: MonthCalendarViewProps) {
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const today = new Date()
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [draggedContentId, setDraggedContentId] = useState<string | null>(null)
  const [dropTargetDay, setDropTargetDay] = useState<number | null>(null)

  const handleAddContent = (date: Date) => {
    toast.info(`Create content for ${formatDate(date)} coming soon`)
  }

  const handleDragStart = (contentId: string) => {
    setDraggedContentId(contentId)
  }

  const handleDragEnd = () => {
    setDraggedContentId(null)
    setDropTargetDay(null)
  }

  const handleDragOver = (e: React.DragEvent, dayIdx: number) => {
    e.preventDefault()
    if (isSameMonth(days[dayIdx], currentDate)) {
      setDropTargetDay(dayIdx)
    }
  }

  const handleDragLeave = () => {
    setDropTargetDay(null)
  }

  const handleDrop = (e: React.DragEvent, targetDate: Date, dayIdx: number) => {
    e.preventDefault()
    if (draggedContentId && isSameMonth(targetDate, currentDate)) {
      onContentDateChange(draggedContentId, targetDate)
      toast.success(`Moved content to ${formatDate(targetDate)}`)
    }
    setDraggedContentId(null)
    setDropTargetDay(null)
  }

  return (
    <div className="p-4">
      {/* Week header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - all days of month */}
      <div className="grid grid-cols-7 bg-muted/40 rounded-xl">
        {days.map((day, idx) => {
          const dayContent = getContentForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, today)
          const isHovered = hoveredDay === idx
          const isDropTarget = dropTargetDay === idx && draggedContentId !== null

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[120px] p-2 transition-all relative",
                !isCurrentMonth && "opacity-30",
                isDropTarget && "bg-primary/10 ring-2 ring-primary/30 ring-inset rounded-lg"
              )}
              onMouseEnter={() => setHoveredDay(idx)}
              onMouseLeave={() => setHoveredDay(null)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day, idx)}
            >
              {/* Day number - just the number, no card */}
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-lg font-medium",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isToday && "text-primary font-semibold"
                )}>
                  {day.getDate()}
                </span>
                
                {/* Add button on hover */}
                {isHovered && isCurrentMonth && !draggedContentId && (
                  <button
                    onClick={() => handleAddContent(day)}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Content items - these have cards */}
              {dayContent.length > 0 && (
                <div className="space-y-1.5">
                  {dayContent.map((item) => (
                    <ContentCalendarItem
                      key={item.id}
                      content={item}
                      projectId={projectId}
                      isFirst={false}
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedContentId === item.id}
                      onDelete={() => onDeleteContent(item.id)}
                      onAddInstructions={() => onAddInstructions(item.id)}
                      onChangeTopic={() => onChangeTopic(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Compact content item for calendar cells
interface ContentCalendarItemProps {
  content: ContentItem
  projectId: string
  isFirst: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
  onDelete?: () => void
  onAddInstructions?: () => void
  onChangeTopic?: () => void
}

function ContentCalendarItem({ content, projectId, isFirst, onDragStart, onDragEnd, isDragging, onDelete, onAddInstructions, onChangeTopic }: ContentCalendarItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getTypeBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'Listicle': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'How To': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Explainer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'Product Listicle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Guide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'Tutorial': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const handleChangeTopic = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangeTopic?.()
  }

  const handleAddInstructions = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddInstructions?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', content.id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.()
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "rounded-2xl border border-border/60 bg-background p-3 transition-all aspect-square flex flex-col cursor-grab active:cursor-grabbing",
        isHovered && "shadow-sm border-border",
        isDragging && "opacity-50 scale-95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
          getTypeBadgeColor(content.type)
        )}>
          {content.type}
        </span>
        {isHovered && (
          <div className="p-0.5 text-muted-foreground">
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Title */}
      <Link
        href={`/dashboard/brands/${projectId}/content/${content.id}`}
        className={cn(
          "block text-sm font-medium line-clamp-3 flex-1",
          isHovered && "underline"
        )}
      >
        {content.title}
      </Link>

      {/* Stats or Actions */}
      {isHovered ? (
        <div className="flex items-center justify-center gap-1 pt-2 border-t border-border/40 mt-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleChangeTopic}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Change topic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleAddInstructions}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Add instructions</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        (content.keywordDifficulty || content.searchVolume) && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border/40 mt-2">
            {content.keywordDifficulty && <div>KD: {content.keywordDifficulty}</div>}
            {content.searchVolume && <div>Vol: {content.searchVolume}</div>}
          </div>
        )
      )}
    </div>
  )
}

// ============================================================
// WEEK CALENDAR VIEW
// ============================================================
interface WeekCalendarViewProps {
  days: Date[]
  getContentForDate: (date: Date) => ContentItem[]
  projectId: string
  onContentDateChange: (contentId: string, newDate: Date) => void
  onDeleteContent: (contentId: string) => void
  onAddInstructions: (contentId: string) => void
  onChangeTopic: (contentId: string) => void
}

function WeekCalendarView({ days, getContentForDate, projectId, onContentDateChange, onDeleteContent, onAddInstructions, onChangeTopic }: WeekCalendarViewProps) {
  const today = new Date()
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [draggedContentId, setDraggedContentId] = useState<string | null>(null)
  const [dropTargetDay, setDropTargetDay] = useState<number | null>(null)

  const handleAddContent = (date: Date) => {
    toast.info(`Create content for ${formatDate(date)} coming soon`)
  }

  const handleDragStart = (contentId: string) => {
    setDraggedContentId(contentId)
  }

  const handleDragEnd = () => {
    setDraggedContentId(null)
    setDropTargetDay(null)
  }

  const handleDragOver = (e: React.DragEvent, dayIdx: number) => {
    e.preventDefault()
    setDropTargetDay(dayIdx)
  }

  const handleDragLeave = () => {
    setDropTargetDay(null)
  }

  const handleDrop = (e: React.DragEvent, targetDate: Date, dayIdx: number) => {
    e.preventDefault()
    if (draggedContentId) {
      onContentDateChange(draggedContentId, targetDate)
      toast.success(`Moved content to ${formatDate(targetDate)}`)
    }
    setDraggedContentId(null)
    setDropTargetDay(null)
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const dayContent = getContentForDate(day)
          const isToday = isSameDay(day, today)
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
          const isHovered = hoveredDay === idx
          const isDropTarget = dropTargetDay === idx && draggedContentId !== null

          return (
            <div 
              key={idx} 
              className="flex flex-col"
              onMouseEnter={() => setHoveredDay(idx)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {/* Day header */}
              <div className={cn(
                "text-center py-3 rounded-t-xl border border-b-0 border-border/40",
                isToday ? "bg-primary/10" : "bg-muted/30"
              )}>
                <div className="text-xs font-medium text-muted-foreground">{dayName}</div>
                <div className={cn(
                  "text-2xl font-semibold mt-1",
                  isToday && "text-primary"
                )}>
                  {day.getDate()}
                </div>
              </div>

              {/* Content area */}
              <div 
                className={cn(
                  "flex-1 min-h-[400px] border border-border/40 rounded-b-xl p-2 bg-muted/40 transition-all",
                  isDropTarget && "bg-primary/10 ring-2 ring-primary/30 ring-inset"
                )}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day, idx)}
              >
                {/* Add button */}
                {isHovered && !draggedContentId && (
                  <button
                    onClick={() => handleAddContent(day)}
                    className="w-full mb-2 p-1.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-background/50 transition-colors flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                )}

                {/* Content cards */}
                <div className="space-y-2">
                  {dayContent.map((item) => (
                    <ContentCalendarItem
                      key={item.id}
                      content={item}
                      projectId={projectId}
                      isFirst={false}
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedContentId === item.id}
                      onDelete={() => onDeleteContent(item.id)}
                      onAddInstructions={() => onAddInstructions(item.id)}
                      onChangeTopic={() => onChangeTopic(item.id)}
                    />
                  ))}
                </div>

                {dayContent.length === 0 && !isHovered && (
                  <div className="text-xs text-muted-foreground text-center py-8">
                    No content
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// DAY CALENDAR VIEW
// ============================================================
interface DayCalendarViewProps {
  currentDate: Date
  content: ContentItem[]
  projectId: string
  onReorderContent: (contentId: string, newIndex: number) => void
  onDeleteContent: (contentId: string) => void
  onAddInstructions: (contentId: string) => void
  onChangeTopic: (contentId: string) => void
}

function DayCalendarView({ currentDate, content, projectId, onReorderContent, onDeleteContent, onAddInstructions, onChangeTopic }: DayCalendarViewProps) {
  const today = new Date()
  const isToday = isSameDay(currentDate, today)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)

  const handleAddContent = () => {
    toast.info(`Create content for ${formatDate(currentDate)} coming soon`)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDropTargetIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTargetIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      const draggedItem = content[draggedIndex]
      if (draggedItem) {
        onReorderContent(draggedItem.id, targetIndex)
        toast.success('Content order updated')
      }
    }
    setDraggedIndex(null)
    setDropTargetIndex(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Day header */}
      <div className={cn(
        "text-center py-6 rounded-2xl border border-border/40 mb-6",
        isToday ? "bg-primary/10" : "bg-muted/30"
      )}>
        <div className="text-sm font-medium text-muted-foreground">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div className={cn(
          "text-5xl font-bold mt-2",
          isToday && "text-primary"
        )}>
          {currentDate.getDate()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Add content button */}
      <button
        onClick={handleAddContent}
        className="w-full mb-4 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add Content
      </button>

      {/* Execution order hint */}
      {content.length > 1 && (
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Drag cards to reorder. Content is executed from top to bottom.
        </p>
      )}

      {/* Content list */}
      <div className="space-y-3">
        {content.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/40 rounded-2xl">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No content scheduled for this day</p>
            <p className="text-sm mt-1">Click "Add Content" above to schedule content</p>
          </div>
        ) : (
          content.map((item, index) => (
            <div
              key={item.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "transition-all",
                dropTargetIndex === index && "pt-16"
              )}
            >
              <DayContentCard
                content={item}
                projectId={projectId}
                index={index}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                onDelete={() => onDeleteContent(item.id)}
                onAddInstructions={() => onAddInstructions(item.id)}
                onChangeTopic={() => onChangeTopic(item.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Day view content card (larger, horizontal layout)
interface DayContentCardProps {
  content: ContentItem
  projectId: string
  index: number
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
  onDelete: () => void
  onAddInstructions: () => void
  onChangeTopic: () => void
}

function DayContentCard({ content, projectId, index, onDragStart, onDragEnd, isDragging, onDelete, onAddInstructions, onChangeTopic }: DayContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getTypeBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'Listicle': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'How To': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Explainer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'Product Listicle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Guide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'Tutorial': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const handleChangeTopic = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangeTopic()
  }

  const handleAddInstructions = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddInstructions()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  const handleDragStartEvent = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', content.id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStartEvent}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-2xl border border-border/60 bg-background p-4 transition-all cursor-grab active:cursor-grabbing",
        isHovered && "shadow-md border-border",
        isDragging && "opacity-50 scale-[0.98]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Order number and drag handle */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <span className="text-2xl font-bold text-muted-foreground/50">{index + 1}</span>
          {isHovered && (
            <div className="p-1 text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
              getTypeBadgeColor(content.type)
            )}>
              {content.type}
            </span>
            {(content.keywordDifficulty || content.searchVolume) && (
              <div className="flex gap-3 text-xs text-muted-foreground">
                {content.keywordDifficulty && <span>KD: {content.keywordDifficulty}</span>}
                {content.searchVolume && <span>Vol: {content.searchVolume.toLocaleString()}</span>}
              </div>
            )}
          </div>
          
          <Link
            href={`/dashboard/brands/${projectId}/content/${content.id}`}
            className={cn(
              "block text-base font-medium",
              isHovered && "underline"
            )}
          >
            {content.title}
          </Link>
        </div>

        {/* Actions */}
        {isHovered && (
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleChangeTopic}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Change topic</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleAddInstructions}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add instructions</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleDelete}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// CARD VIEW
// ============================================================
interface CardViewProps {
  content: ContentItem[]
  projectId: string
}

function CardView({ content, projectId }: CardViewProps) {
  if (content.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center text-center p-4">
        <div className="p-3 bg-muted rounded-md mb-4">
          <FileText className="h-6 w-6 text-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No content yet</h3>
        <p className="mb-6 text-sm text-muted-foreground">Create your first content to get started</p>
        <Button onClick={() => toast.info('Create content coming soon')}>
          <Plus className="mr-2 h-4 w-4" />
          Create new content
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {content.map(item => (
          <ContentCard key={item.id} content={item} projectId={projectId} />
        ))}
        <button
          className="rounded-2xl border border-dashed border-border/60 bg-background p-6 text-center text-sm text-muted-foreground hover:border-solid hover:border-border/80 hover:text-foreground transition-colors min-h-[200px] flex flex-col items-center justify-center cursor-pointer"
          onClick={() => toast.info('Create content coming soon')}
        >
          <Plus className="mb-2 h-5 w-5" />
          Create new content
        </button>
      </div>
    </div>
  )
}

function ContentCard({ content, projectId }: { content: ContentItem; projectId: string }) {
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published': return 'bg-emerald-500'
      case 'scheduled': return 'bg-amber-500'
      case 'draft': return 'bg-gray-400'
    }
  }

  const getTypeBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'Listicle': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'How To': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Explainer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'Product Listicle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Guide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'Tutorial': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Link 
      href={`/dashboard/brands/${projectId}/content/${content.id}`}
      className="block rounded-2xl border border-border/60 bg-background p-5 hover:border-border hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
          getTypeBadgeColor(content.type)
        )}>
          {content.type}
        </span>
        <span className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(content.status))} />
      </div>
      
      <h3 className="font-medium text-sm mb-3 line-clamp-2">{content.title}</h3>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(content.scheduledDate)}</span>
        <div className="flex gap-3">
          {content.keywordDifficulty && <span>KD: {content.keywordDifficulty}</span>}
          {content.searchVolume && <span>Vol: {content.searchVolume}</span>}
        </div>
      </div>
    </Link>
  )
}

// ============================================================
// KANBAN VIEW
// ============================================================
interface KanbanViewProps {
  content: ContentItem[]
  projectId: string
}

function KanbanView({ content, projectId }: KanbanViewProps) {
  const columns: { id: ContentStatus; title: string; color: string }[] = [
    { id: 'draft', title: 'Draft', color: 'border-t-gray-400' },
    { id: 'scheduled', title: 'Scheduled', color: 'border-t-amber-500' },
    { id: 'published', title: 'Published', color: 'border-t-emerald-500' },
  ]

  const getContentByStatus = (status: ContentStatus): ContentItem[] => {
    return content.filter(c => c.status === status)
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => {
          const columnContent = getContentByStatus(column.id)
          return (
            <div 
              key={column.id} 
              className={cn(
                "shrink-0 w-80 bg-muted/30 rounded-2xl border-t-4",
                column.color
              )}
            >
              {/* Column header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnContent.length}
                </Badge>
              </div>

              {/* Column content */}
              <div className="p-2 space-y-2 min-h-[200px]">
                {columnContent.map(item => (
                  <KanbanCard key={item.id} content={item} projectId={projectId} />
                ))}
                
                {/* Add button */}
                <button 
                  className="w-full p-3 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground hover:border-border hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  onClick={() => toast.info('Create content coming soon')}
                >
                  <Plus className="h-4 w-4" />
                  Add content
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KanbanCard({ content, projectId }: { content: ContentItem; projectId: string }) {
  const getTypeBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'Listicle': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'How To': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Explainer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'Product Listicle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Guide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'Tutorial': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Link 
      href={`/dashboard/brands/${projectId}/content/${content.id}`}
      className="block p-3 rounded-xl border border-border/60 bg-background hover:border-border hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium",
          getTypeBadgeColor(content.type)
        )}>
          {content.type}
        </span>
      </div>
      
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{content.title}</h4>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(content.scheduledDate)}</span>
        <div className="flex gap-2">
          {content.keywordDifficulty && <span>KD: {content.keywordDifficulty}</span>}
        </div>
      </div>
    </Link>
  )
}

// ============================================================
// TABLE VIEW
// ============================================================
interface TableViewProps {
  content: ContentItem[]
  projectId: string
}

function TableView({ content, projectId }: TableViewProps) {
  const getStatusConfig = (status: ContentStatus) => {
    switch (status) {
      case 'published': return { label: 'Published', dot: 'bg-emerald-500' }
      case 'scheduled': return { label: 'Scheduled', dot: 'bg-amber-500' }
      case 'draft': return { label: 'Draft', dot: 'bg-gray-400' }
    }
  }

  const getTypeBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'Listicle': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'How To': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'Explainer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'Product Listicle': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'Guide': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      case 'Tutorial': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <div className="p-3 bg-muted rounded-md mb-4">
          <FileText className="h-6 w-6 text-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No content found</h3>
        <p className="text-sm text-muted-foreground">Create your first content to get started</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="rounded-lg border border-border/60 bg-background overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Title</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">KD</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Volume</th>
            </tr>
          </thead>
          <tbody>
            {content.map(item => {
              const status = getStatusConfig(item.status)
              return (
                <tr
                  key={item.id}
                  onClick={() => window.location.href = `/dashboard/brands/${projectId}/content/${item.id}`}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  {/* Title */}
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
                      getTypeBadgeColor(item.type)
                    )}>
                      {item.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("inline-block size-2 rounded-full", status.dot)} />
                      <span className="text-xs text-muted-foreground">{status.label}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">{formatDate(item.scheduledDate)}</span>
                  </td>

                  {/* KD */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {item.keywordDifficulty ?? '—'}
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {item.searchVolume ?? '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================
// CONTENT FILTER POPOVER
// ============================================================
interface ContentFilterPopoverProps {
  filters: ContentFilterChip[]
  onApply: (chips: ContentFilterChip[]) => void
  onClear: () => void
  counts: {
    status: Record<string, number>
    type: Record<string, number>
  }
}

function ContentFilterPopover({ filters, onApply, onClear, counts }: ContentFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'status' | 'type'>('status')
  
  const [tempStatus, setTempStatus] = useState<Set<string>>(new Set())
  const [tempType, setTempType] = useState<Set<string>>(new Set())

  // Sync temp state with filters when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const statusSet = new Set<string>()
      const typeSet = new Set<string>()
      filters.forEach(f => {
        if (f.key === 'status') statusSet.add(f.value.toLowerCase())
        if (f.key === 'type') typeSet.add(f.value)
      })
      setTempStatus(statusSet)
      setTempType(typeSet)
    }
    setOpen(isOpen)
  }

  const statusOptions = [
    { id: 'draft', label: 'Draft', color: 'bg-gray-400' },
    { id: 'scheduled', label: 'Scheduled', color: 'bg-amber-500' },
    { id: 'published', label: 'Published', color: 'bg-emerald-500' },
  ]

  const typeOptions = [
    { id: 'Listicle', label: 'Listicle', color: 'bg-rose-500' },
    { id: 'How To', label: 'How To', color: 'bg-blue-500' },
    { id: 'Explainer', label: 'Explainer', color: 'bg-emerald-500' },
    { id: 'Product Listicle', label: 'Product Listicle', color: 'bg-purple-500' },
    { id: 'Guide', label: 'Guide', color: 'bg-amber-500' },
    { id: 'Tutorial', label: 'Tutorial', color: 'bg-cyan-500' },
  ]

  const categories = [
    { id: 'status' as const, label: 'Status', icon: Clock },
    { id: 'type' as const, label: 'Type', icon: Tag },
  ]

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(c => c.label.toLowerCase().includes(q))
  }, [query])

  const toggleSet = (set: Set<string>, value: string) => {
    const newSet = new Set(set)
    if (newSet.has(value)) newSet.delete(value)
    else newSet.add(value)
    return newSet
  }

  const handleApply = () => {
    const chips: ContentFilterChip[] = []
    tempStatus.forEach(v => chips.push({ key: 'status', value: v.charAt(0).toUpperCase() + v.slice(1) }))
    tempType.forEach(v => chips.push({ key: 'type', value: v }))
    onApply(chips)
    setOpen(false)
  }

  const handleClear = () => {
    setTempStatus(new Set())
    setTempType(new Set())
    onClear()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/60 px-3 bg-transparent">
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[560px] p-0 rounded-xl">
        <div className="grid grid-cols-[200px_minmax(0,1fr)]">
          {/* Categories sidebar */}
          <div className="p-3 border-r border-border/40">
            <div className="px-1 pb-2">
              <Input 
                placeholder="Search..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="h-8" 
              />
            </div>
            <div className="space-y-1">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent",
                    activeCategory === cat.id && "bg-accent"
                  )}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.id === 'status' 
                      ? Object.values(counts.status).reduce((a, b) => a + b, 0)
                      : Object.values(counts.type).reduce((a, b) => a + b, 0)
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Options panel */}
          <div className="p-3">
            {activeCategory === 'status' && (
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <span className={cn("h-2.5 w-2.5 rounded-full", opt.color)} />
                    <Checkbox
                      checked={tempStatus.has(opt.id)}
                      onCheckedChange={() => setTempStatus(s => toggleSet(s, opt.id))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{counts.status[opt.id] || 0}</span>
                  </label>
                ))}
              </div>
            )}

            {activeCategory === 'type' && (
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <span className={cn("h-2.5 w-2.5 rounded-full", opt.color)} />
                    <Checkbox
                      checked={tempType.has(opt.id)}
                      onCheckedChange={() => setTempType(s => toggleSet(s, opt.id))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{counts.type[opt.id] || 0}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
              <button onClick={handleClear} className="text-sm text-primary hover:underline">
                Clear
              </button>
              <Button size="sm" className="h-8 rounded-lg" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================
// ADD INSTRUCTIONS MODAL
// ============================================================
interface AddInstructionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentTitle: string
  onSave: (instructions: string, referenceUrl: string, productImage: string | null) => void
}

// Sample AI-generated instructions templates
const AI_INSTRUCTION_TEMPLATES = [
  `Focus on practical, actionable advice that readers can implement immediately. Include real-world examples and case studies from successful AI implementations. Highlight common pitfalls to avoid and best practices for maximizing ROI.`,
  `Write in a conversational yet authoritative tone. Target decision-makers (CTOs, CEOs, VPs) who are evaluating AI solutions. Include specific metrics and benchmarks where possible. Address common objections and concerns.`,
  `Structure the article with clear sections: Introduction, Key Considerations, Comparison Criteria, Top Recommendations, and Conclusion. Use bullet points for easy scanning. Include a summary table comparing options.`,
  `Emphasize the strategic value of AI consulting over DIY approaches. Include quotes or insights from industry experts. Reference recent trends and statistics from 2025-2026. Keep the tone professional but accessible.`,
]

function AddInstructionsModal({ open, onOpenChange, contentTitle, onSave }: AddInstructionsModalProps) {
  const [instructions, setInstructions] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const maxLength = 1000

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Pick a random template and customize it
    const template = AI_INSTRUCTION_TEMPLATES[Math.floor(Math.random() * AI_INSTRUCTION_TEMPLATES.length)]
    setInstructions(template)
    setIsGenerating(false)
    toast.success('Instructions generated')
  }

  const handleSave = () => {
    onSave(instructions, referenceUrl, productImage)
    // Reset form
    setInstructions('')
    setReferenceUrl('')
    setProductImage(null)
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setInstructions('')
    setReferenceUrl('')
    setProductImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProductImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Article Instructions for {contentTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Special Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Special Instructions</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Generate with AI
                </Button>
                <span className="text-xs text-muted-foreground">{instructions.length}/{maxLength}</span>
              </div>
            </div>
            <Textarea
              placeholder="Share any context, key points, or specific directions you'd like the model to use when generating this article."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, maxLength))}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Reference URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium">Reference URL</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a URL for reference material</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              placeholder="https://example.com/your-notes-or-brief"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
            />
          </div>

          {/* Integrate Product or Logo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Integrate Product or Logo</Label>
            <p className="text-xs text-muted-foreground">Select which product or logo you want to see in the article images.</p>
            <div className="flex gap-3 mt-3">
              {/* Upload button */}
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              
              {/* Uploaded image preview */}
              {productImage && (
                <div className="relative w-24 h-24 rounded-xl border-2 border-primary overflow-hidden">
                  <Image
                    src={productImage}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setProductImage(null)}
                    className="absolute top-1 right-1 p-0.5 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-lg bg-foreground text-background hover:bg-foreground/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// CHANGE TOPIC MODAL
// ============================================================
interface TopicSuggestion {
  id: string
  title: string
  difficulty: number
  volume: number
  type: string
}

interface ChangeTopicModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (topic: TopicSuggestion) => void
}

// Initial topic suggestions for AI Consulting
const INITIAL_TOPICS: TopicSuggestion[] = [
  { id: '1', title: 'AI consulting firms comparison', difficulty: 5, volume: 320, type: 'Product Listicle' },
  { id: '2', title: 'best AI implementation partners', difficulty: 4, volume: 280, type: 'Product Listicle' },
  { id: '3', title: 'enterprise AI strategy consultants', difficulty: 6, volume: 150, type: 'Product Listicle' },
  { id: '4', title: 'how to choose an AI consultant', difficulty: 3, volume: 420, type: 'How To' },
  { id: '5', title: 'AI transformation services guide', difficulty: 4, volume: 190, type: 'Guide' },
  { id: '6', title: 'top AI advisory firms 2026', difficulty: 5, volume: 510, type: 'Listicle' },
]

// Alternative topic sets for AI generation simulation
const AI_GENERATED_TOPICS: TopicSuggestion[][] = [
  [
    { id: '7', title: 'AI readiness assessment services', difficulty: 4, volume: 180, type: 'Product Listicle' },
    { id: '8', title: 'how to build an AI roadmap', difficulty: 3, volume: 340, type: 'How To' },
    { id: '9', title: 'machine learning consulting costs', difficulty: 5, volume: 290, type: 'Explainer' },
    { id: '10', title: 'AI consulting vs in-house teams', difficulty: 4, volume: 220, type: 'Explainer' },
    { id: '11', title: 'best generative AI consultants', difficulty: 6, volume: 480, type: 'Product Listicle' },
    { id: '12', title: 'enterprise AI adoption strategies', difficulty: 5, volume: 360, type: 'Guide' },
  ],
  [
    { id: '13', title: 'AI consulting ROI calculator', difficulty: 4, volume: 150, type: 'How To' },
    { id: '14', title: 'ChatGPT implementation services', difficulty: 5, volume: 620, type: 'Product Listicle' },
    { id: '15', title: 'AI integration best practices', difficulty: 3, volume: 410, type: 'Guide' },
    { id: '16', title: 'custom AI solution providers', difficulty: 6, volume: 180, type: 'Product Listicle' },
    { id: '17', title: 'AI consulting for startups', difficulty: 4, volume: 290, type: 'Guide' },
    { id: '18', title: 'LLM deployment consultants', difficulty: 7, volume: 240, type: 'Product Listicle' },
  ],
  [
    { id: '19', title: 'AI workflow automation consultants', difficulty: 4, volume: 320, type: 'Product Listicle' },
    { id: '20', title: 'how to prepare for AI consulting', difficulty: 2, volume: 180, type: 'How To' },
    { id: '21', title: 'AI strategy consulting frameworks', difficulty: 5, volume: 260, type: 'Explainer' },
    { id: '22', title: 'best AI consultants for healthcare', difficulty: 6, volume: 190, type: 'Product Listicle' },
    { id: '23', title: 'AI consulting engagement models', difficulty: 4, volume: 140, type: 'Explainer' },
    { id: '24', title: 'enterprise AI pilot programs', difficulty: 5, volume: 210, type: 'Guide' },
  ],
]

function ChangeTopicModal({ open, onOpenChange, onConfirm }: ChangeTopicModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<TopicSuggestion[]>(INITIAL_TOPICS)
  const [generationIndex, setGenerationIndex] = useState(0)

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics
    const query = searchQuery.toLowerCase()
    return topics.filter(t => t.title.toLowerCase().includes(query))
  }, [searchQuery, topics])

  const handleGenerateWithAI = async () => {
    setIsLoading(true)
    setSelectedTopic(null)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Cycle through different topic sets
    const newTopics = AI_GENERATED_TOPICS[generationIndex % AI_GENERATED_TOPICS.length]
    setTopics(newTopics)
    setGenerationIndex(prev => prev + 1)
    setIsLoading(false)
    toast.success('Generated new topic suggestions')
  }

  const handleConfirm = () => {
    if (selectedTopic) {
      onConfirm(selectedTopic)
      setSelectedTopic(null)
      setSearchQuery('')
      setTopics(INITIAL_TOPICS)
      setGenerationIndex(0)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedTopic(null)
    setSearchQuery('')
    setTopics(INITIAL_TOPICS)
    setGenerationIndex(0)
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-emerald-600'
    if (difficulty <= 5) return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Choose Alternative Topic</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose among our topic recommendations or insert your own.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          {/* Search input and Generate AI button */}
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Search or insert your own topic (e.g. 'AI implementation')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleGenerateWithAI}
              disabled={isLoading}
              className="shrink-0 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate with AI
            </Button>
          </div>

          {/* Topics table */}
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Topic</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Difficulty</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Search Volume</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Article Type</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredTopics.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                      No topics found. Try a different search term.
                    </td>
                  </tr>
                ) : (
                  filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={cn(
                        "border-b last:border-0 cursor-pointer transition-colors",
                        selectedTopic?.id === topic.id 
                          ? "bg-primary/5 hover:bg-primary/10" 
                          : "hover:bg-muted/30"
                      )}
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm">{topic.title}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn("text-sm font-medium", getDifficultyColor(topic.difficulty))}>
                          {topic.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{topic.volume}</span>
                          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{topic.type}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="p-6 gap-2">
          <Button variant="outline" onClick={handleCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedTopic}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
} from 'lucide-react'
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
  const [content] = useState<ContentItem[]>(SAMPLE_CONTENT)
  const [isLoading] = useState(false)
  
  // View options - default to calendar view for content
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    ...DEFAULT_VIEW_OPTIONS,
    viewType: 'calendar',
  })

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)) // January 2026
  const [calendarPeriod, setCalendarPeriod] = useState<CalendarPeriod>('month')

  // Filter content based on search
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return content
    const query = searchQuery.toLowerCase()
    return content.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.type.toLowerCase().includes(query)
    )
  }, [content, searchQuery])

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
            {viewOptions.viewType === 'calendar' && (
              <>
                {/* Period toggle */}
                <div className="flex items-center rounded-lg bg-muted p-1 mr-4">
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
            {(viewOptions.viewType === 'card' || viewOptions.viewType === 'kanban') && (
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
              allowedViewTypes={["calendar", "card", "kanban"]}
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
              />
            )}
            {viewOptions.viewType === 'calendar' && calendarPeriod === 'week' && (
              <WeekCalendarView 
                days={weekDays}
                getContentForDate={getContentForDate}
                projectId={projectId}
              />
            )}
            {viewOptions.viewType === 'calendar' && calendarPeriod === 'day' && (
              <DayCalendarView 
                currentDate={currentDate}
                content={filteredContent.filter(c => isSameDay(c.scheduledDate, currentDate))}
                projectId={projectId}
              />
            )}
            {viewOptions.viewType === 'card' && (
              <CardView 
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
    </div>
  )
}

// ============================================================
// MONTH CALENDAR VIEW
// ============================================================
interface MonthCalendarViewProps {
  days: Date[]
  currentDate: Date
  getContentForDate: (date: Date) => ContentItem[]
  projectId: string
}

function MonthCalendarView({ days, currentDate, getContentForDate, projectId }: MonthCalendarViewProps) {
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const today = new Date()

  return (
    <div className="p-4">
      {/* Week header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l border-border/40">
        {days.map((day, idx) => {
          const dayContent = getContentForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, today)

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[140px] border-r border-b border-border/40 p-2",
                !isCurrentMonth && "bg-muted/30"
              )}
            >
              {/* Day number */}
              <div className={cn(
                "text-sm font-medium mb-2",
                !isCurrentMonth && "text-muted-foreground/50",
                isToday && "text-primary"
              )}>
                {day.getDate().toString().padStart(2, '0')}
              </div>

              {/* Content items */}
              <div className="space-y-1.5">
                {dayContent.slice(0, 2).map(item => (
                  <ContentCalendarCard key={item.id} content={item} projectId={projectId} />
                ))}
                {dayContent.length > 2 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dayContent.length - 2} more
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
// WEEK CALENDAR VIEW
// ============================================================
interface WeekCalendarViewProps {
  days: Date[]
  getContentForDate: (date: Date) => ContentItem[]
  projectId: string
}

function WeekCalendarView({ days, getContentForDate, projectId }: WeekCalendarViewProps) {
  const today = new Date()

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => {
          const dayContent = getContentForDate(day)
          const isToday = isSameDay(day, today)
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

          return (
            <div key={idx} className="flex flex-col">
              {/* Day header */}
              <div className={cn(
                "text-center py-3 rounded-t-lg border border-b-0 border-border/40",
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
              <div className="flex-1 min-h-[400px] border border-border/40 rounded-b-lg p-2 space-y-2">
                {dayContent.map(item => (
                  <ContentCalendarCard key={item.id} content={item} projectId={projectId} />
                ))}
                {dayContent.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
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
}

function DayCalendarView({ currentDate, content, projectId }: DayCalendarViewProps) {
  const today = new Date()
  const isToday = isSameDay(currentDate, today)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Day header */}
      <div className={cn(
        "text-center py-6 rounded-xl border border-border/40 mb-6",
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

      {/* Content list */}
      <div className="space-y-3">
        {content.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No content scheduled for this day</p>
            <p className="text-sm mt-1">Content scheduled for this date will appear here</p>
          </div>
        ) : (
          content.map(item => (
            <ContentCard key={item.id} content={item} projectId={projectId} />
          ))
        )}
      </div>
    </div>
  )
}

// Calendar content card
function ContentCalendarCard({ content, projectId }: { content: ContentItem; projectId: string }) {
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
      className="block p-2 rounded-lg border border-border/60 bg-background hover:border-border transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
          getTypeBadgeColor(content.type)
        )}>
          {content.type}
        </span>
      </div>
      <p className="text-xs font-medium line-clamp-2 mb-1.5">{content.title}</p>
      {(content.keywordDifficulty || content.searchVolume) && (
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          {content.keywordDifficulty && <span>KD: {content.keywordDifficulty}</span>}
          {content.searchVolume && <span>Vol: {content.searchVolume}</span>}
        </div>
      )}
    </Link>
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
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
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

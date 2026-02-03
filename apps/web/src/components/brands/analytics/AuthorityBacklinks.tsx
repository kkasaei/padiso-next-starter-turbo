'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import {
  Sheet,
  SheetContent,
} from '@workspace/ui/components/sheet'
import { Button } from '@workspace/ui/components/button'
import { HelpCircle, ExternalLink, Globe, Link2, ChevronRight, GripVertical } from 'lucide-react'
import { cn } from '@workspace/common/lib'
import type { AuthorityMetrics, ReferringDomain, Backlink } from './types'

// ============================================================
// Resizable Sheet Hook
// ============================================================
function useResizableSheet(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [width])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = startX.current - e.clientX
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [minWidth, maxWidth])

  return { width, handleMouseDown }
}

interface MetricDisplayProps {
  label: string
  value: number | string
  helpText: string
  historyData: { date: string; value: number }[]
  color: string
  onClick?: () => void
  clickable?: boolean
}

function MetricDisplay({
  label,
  value,
  helpText,
  historyData,
  color,
  onClick,
  clickable = false,
}: MetricDisplayProps) {
  const chartData = useMemo(() => {
    return historyData.slice(-30)
  }, [historyData])

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={cn(
        'flex flex-col gap-3 p-6 rounded-xl border border-gray-200 dark:border-polar-800 bg-white dark:bg-polar-900 text-left w-full',
        clickable && 'hover:bg-gray-50 dark:hover:bg-polar-800 transition-colors cursor-pointer group'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {clickable && (
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      
      <div className="flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        
        {chartData.length > 0 && (
          <div className="h-8 w-24 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${label})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </button>
  )
}

// Resizable Sheet Content Wrapper
interface ResizableSheetContentProps {
  children: React.ReactNode
  width: number
  onResizeStart: (e: React.MouseEvent) => void
}

function ResizableSheetContent({ children, width, onResizeStart }: ResizableSheetContentProps) {
  return (
    <SheetContent 
      className="p-0 flex flex-col border-l"
      style={{ width: `${width}px`, maxWidth: '90vw' }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={onResizeStart}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/20 transition-colors group z-50 flex items-center"
      >
        <div className="absolute left-0 w-4 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {children}
    </SheetContent>
  )
}

// Referring Domains Sheet
interface ReferringDomainsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  domains: ReferringDomain[]
}

function ReferringDomainsSheet({ open, onOpenChange, domains }: ReferringDomainsSheetProps) {
  const { width, handleMouseDown } = useResizableSheet(540, 400, 900)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <ResizableSheetContent width={width} onResizeStart={handleMouseDown}>
        <div className="flex flex-col gap-y-6 px-8 py-10 flex-1 overflow-hidden">
          {/* Header */}
          <div>
            <h2 className="text-lg font-medium">Referring Domains</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Unique websites linking to your site
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pb-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{domains.length} domains</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {domains.reduce((acc, d) => acc + d.backlinks, 0)} total backlinks
              </span>
            </div>
          </div>

          {/* Domains List */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 -mx-2 px-2">
            {domains.map((domain, idx) => (
              <a
                key={idx}
                href={`https://${domain.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-colors',
                  'border-gray-200 dark:border-polar-700',
                  'hover:border-gray-300 dark:hover:border-polar-600',
                  'hover:bg-gray-50 dark:hover:bg-polar-800'
                )}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{domain.domain}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    First seen {new Date(domain.firstSeen).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-medium">{domain.backlinks}</div>
                    <div className="text-xs text-muted-foreground">links</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{domain.domainRating}</div>
                    <div className="text-xs text-muted-foreground">DR</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-row items-center justify-between gap-x-4 pt-2 border-t border-gray-100 dark:border-polar-800">
            <p className="text-xs text-muted-foreground">
              Sorted by domain rating
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </ResizableSheetContent>
    </Sheet>
  )
}

// Backlinks Sheet
interface BacklinksSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  backlinks: Backlink[]
}

function BacklinksSheet({ open, onOpenChange, backlinks }: BacklinksSheetProps) {
  const { width, handleMouseDown } = useResizableSheet(540, 400, 900)
  const doFollowCount = backlinks.filter((b) => b.isDoFollow).length
  const noFollowCount = backlinks.length - doFollowCount

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <ResizableSheetContent width={width} onResizeStart={handleMouseDown}>
        <div className="flex flex-col gap-y-6 px-8 py-10 flex-1 overflow-hidden">
          {/* Header */}
          <div>
            <h2 className="text-lg font-medium">Backlinks</h2>
            <p className="text-sm text-muted-foreground mt-1">
              All links pointing to your website
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">{doFollowCount} DoFollow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm font-medium">{noFollowCount} NoFollow</span>
            </div>
          </div>

          {/* Backlinks List */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 -mx-2 px-2">
            {backlinks.map((backlink, idx) => (
              <a
                key={idx}
                href={backlink.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex flex-col gap-3 p-4 rounded-xl border transition-colors',
                  'border-gray-200 dark:border-polar-700',
                  'hover:border-gray-300 dark:hover:border-polar-600',
                  'hover:bg-gray-50 dark:hover:bg-polar-800'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{backlink.sourceDomain}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      DR {backlink.domainRating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        backlink.isDoFollow
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      )}
                    >
                      {backlink.isDoFollow ? 'DoFollow' : 'NoFollow'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0">Anchor:</span>
                    <span className="font-medium text-foreground truncate">"{backlink.anchorText}"</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0">Target:</span>
                    <span className="truncate">{backlink.targetUrl}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-row items-center justify-between gap-x-4 pt-2 border-t border-gray-100 dark:border-polar-800">
            <p className="text-xs text-muted-foreground">
              {backlinks.length} backlink{backlinks.length !== 1 ? 's' : ''} total
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </ResizableSheetContent>
    </Sheet>
  )
}

interface AuthorityBacklinksProps {
  metrics: AuthorityMetrics
  referringDomains?: ReferringDomain[]
  backlinks?: Backlink[]
}

export function AuthorityBacklinks({ metrics, referringDomains = [], backlinks = [] }: AuthorityBacklinksProps) {
  const [referringDomainsSheetOpen, setReferringDomainsSheetOpen] = useState(false)
  const [backlinksSheetOpen, setBacklinksSheetOpen] = useState(false)

  // Sort referring domains by DR
  const sortedDomains = useMemo(() => {
    return [...referringDomains].sort((a, b) => b.domainRating - a.domainRating)
  }, [referringDomains])

  // Sort backlinks by DR
  const sortedBacklinks = useMemo(() => {
    return [...backlinks].sort((a, b) => b.domainRating - a.domainRating)
  }, [backlinks])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Authority & Backlinks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricDisplay
          label="Domain Rating"
          value={metrics.domainRating}
          helpText="Domain Rating (DR) measures the strength of a website's backlink profile on a scale from 0 to 100. Higher scores indicate stronger link profiles."
          historyData={metrics.domainRatingHistory}
          color="#71717a"
        />
        
        <MetricDisplay
          label="Referring Domains"
          value={metrics.referringDomains}
          helpText="The number of unique domains (websites) that link to your site. Click to view the list."
          historyData={metrics.referringDomainsHistory}
          color="#a1a1aa"
          clickable={referringDomains.length > 0}
          onClick={() => setReferringDomainsSheetOpen(true)}
        />
        
        <MetricDisplay
          label="Current Backlinks"
          value={metrics.currentBacklinks}
          helpText="The total number of backlinks pointing to your website. Click to view the list."
          historyData={metrics.backlinksHistory}
          color="#d4d4d8"
          clickable={backlinks.length > 0}
          onClick={() => setBacklinksSheetOpen(true)}
        />
      </div>

      <ReferringDomainsSheet
        open={referringDomainsSheetOpen}
        onOpenChange={setReferringDomainsSheetOpen}
        domains={sortedDomains}
      />

      <BacklinksSheet
        open={backlinksSheetOpen}
        onOpenChange={setBacklinksSheetOpen}
        backlinks={sortedBacklinks}
      />
    </div>
  )
}

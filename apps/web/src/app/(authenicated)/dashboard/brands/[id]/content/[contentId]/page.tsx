'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { ArrowLeft, Pencil, Send } from 'lucide-react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@workspace/ui/components/resizable'
import { ContentDetailSidebar } from '@/components/brands/content/ContentDetailSidebar'
import { ArticleContent } from '@/components/brands/content/ArticleContent'
import { mockContentData, type ContentData } from './_mockData'

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const contentId = params.contentId as string

  const content = mockContentData[contentId]

  if (!content) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">Content not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: ContentData['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      archived: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    }
    return variants[status]
  }

  const getTypeBadge = (type: ContentData['type']) => {
    const variants = {
      blog: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      article: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      landing_page: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    }
    return variants[type]
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border h-[82px]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={getTypeBadge(content.type)}>
              {content.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge className={getStatusBadge(content.status)}>
              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className='rounded-2xl'>
            <Link href={`/dashboard/brands/${projectId}/content/${contentId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          {content.status === 'draft' && (
            <Button size="sm" className='rounded-2xl'>
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Content with Sidebar */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Main Content Panel - 70% */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full overflow-auto">
            <ArticleContent content={content} />
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Sidebar Panel - 30% */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <ContentDetailSidebar content={content} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

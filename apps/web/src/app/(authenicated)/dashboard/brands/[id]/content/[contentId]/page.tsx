'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { ArrowLeft, Pencil, Send, Copy, Trash2, MoreHorizontal } from 'lucide-react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@workspace/ui/components/resizable'
import { toast } from 'sonner'
import { ContentDetailSidebar } from '@/components/brands/content/ContentDetailSidebar'
import { ArticleContent } from '@/components/brands/content/ArticleContent'
import { PublishModal } from '@/components/brands/content/PublishModal'
import { mockContentData } from './_mockData'

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const contentId = params.contentId as string
  const [showPublishModal, setShowPublishModal] = useState(false)

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

  const handleCopy = () => {
    toast('Content duplicated')
  }

  const handleDelete = () => {
    toast('Content deleted')
    router.back()
  }

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border h-[82px]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => router.back()}>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <h1 className="text-lg font-medium">Content Details</h1>
        </div>
        
        {/* Action Button Group */}
        <div className="flex items-center">
          <div className="flex items-center border border-border rounded-full overflow-hidden">
            {/* Publish - Primary action */}
            <Button 
              size="sm" 
              className="rounded-none border-0 bg-foreground text-background hover:bg-foreground/90 px-4"
              onClick={() => setShowPublishModal(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-border" />
            
            {/* Edit */}
            <Button variant="ghost" size="sm" className="rounded-none border-0 px-3">
              <Pencil className="h-4 w-4" />
            </Button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-border" />
            
            {/* More actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-none border-0 px-3">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Publish Modal */}
      <PublishModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        brandId={projectId}
      />

      {/* Content with Sidebar */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
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
          <div className="h-full">
            <ContentDetailSidebar content={content} brandId={projectId} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

import { useMemo } from 'react'
import { Calendar, User, Clock } from 'lucide-react'
import { marked } from 'marked'
import type { ContentData } from '@/app/(authenicated)/dashboard/brands/[id]/content/[contentId]/_mockData'

type ArticleContentProps = {
  content: ContentData
}

const formatDate = (date: Date | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
})

const normalizeMarkdown = (value: string) => {
  return value.replace(/\r\n/g, '\n').replace(/\\n/g, '\n')
}

export function ArticleContent({ content }: ArticleContentProps) {
  const html = useMemo(() => {
    return marked.parse(normalizeMarkdown(content.content)) as string
  }, [content.content])

  return (
    <article className="mx-auto py-12 px-6 max-h-[calc(100vh-82px)] overflow-y-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
        {content.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{content.author}</span>
        </div>
        {content.publishedAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(content.publishedAt)}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{content.readTime}</span>
        </div>
      </div>

      {/* Body */}
      <div 
        className="markdown-content max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: html
        }}
      />
    </article>
  )
}

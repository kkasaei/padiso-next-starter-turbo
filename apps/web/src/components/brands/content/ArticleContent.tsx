import { Calendar, User, Clock } from 'lucide-react'
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

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
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
        className="prose prose-gray dark:prose-invert max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-base prose-p:leading-7 prose-p:mb-4
          prose-li:text-base prose-li:leading-7
          prose-strong:font-semibold
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ 
          __html: content.content
            .replace(/^## /gm, '<h2>')
            .replace(/^### /gm, '<h3>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/<h2>/g, '</p><h2>')
            .replace(/<h3>/g, '</p><h3>')
            .replace(/<\/h2>\n/g, '</h2><p>')
            .replace(/<\/h3>\n/g, '</h3><p>')
            .replace(/^- /gm, '<li>')
            .replace(/<li>([^<]+)(?=<li>|<\/p>|<h|$)/g, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
            .replace(/---/g, '<hr>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        }}
      />
    </article>
  )
}

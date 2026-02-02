'use client'

import { useEffect, useImperativeHandle, forwardRef, useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Markdown } from '@tiptap/markdown'
import { FigureImage } from './extensions/figure-image'
import { cn } from '@workspace/common/lib'
import '@workspace/ui/styles/tiptap.css'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { toast } from 'sonner'
import type { LucideIcon } from 'lucide-react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link2,
  ImagePlus,
  Trash2,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  WandSparkles,
} from 'lucide-react'

export interface TiptapEditorProps {
  /** Markdown or HTML content to initialize the editor with */
  initialValue?: string
  /** Callback when content changes (receives HTML string) */
  onContentChange?: (content: string) => void
  /** Placeholder text when editor is empty */
  placeholder?: string
  /** Additional class names */
  className?: string
  /** Fixed height of the editor content area (default: 400px) */
  height?: string
  /** Show the toolbar (default: true) */
  showToolbar?: boolean
  /** Read-only mode */
  readOnly?: boolean
  /** Brand ID for organizing uploaded images in R2 */
  brandId?: string
  /** Workspace ID for metadata tracking */
  workspaceId?: string
}

/** Ref handle for external control of TiptapEditor */
export interface TiptapEditorRef {
  /** Set content from HTML or markdown string */
  setContent: (content: string) => void
  /** Get current content as HTML */
  getContent: () => string
}

type ToolbarAction = 
  | { type: 'mark'; name: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: 'list'; variant: 'bullet' | 'ordered' }
  | { type: 'link' }
  | { type: 'image' }
  | { type: 'align'; alignment: 'left' | 'center' | 'right' | 'justify' }

interface ToolbarButton {
  icon: LucideIcon
  title: string
  action: ToolbarAction
}

const TOOLBAR_GROUPS: ToolbarButton[][] = [
  // Text formatting
  [
    { icon: Bold, title: 'Bold', action: { type: 'mark', name: 'bold' } },
    { icon: Italic, title: 'Italic', action: { type: 'mark', name: 'italic' } },
    { icon: Strikethrough, title: 'Strikethrough', action: { type: 'mark', name: 'strike' } },
    { icon: Code, title: 'Code', action: { type: 'mark', name: 'code' } },
  ],
  // Headings
  [
    { icon: Heading1, title: 'Heading 1', action: { type: 'heading', level: 1 } },
    { icon: Heading2, title: 'Heading 2', action: { type: 'heading', level: 2 } },
    { icon: Heading3, title: 'Heading 3', action: { type: 'heading', level: 3 } },
    { icon: Heading4, title: 'Heading 4', action: { type: 'heading', level: 4 } },
    { icon: Heading5, title: 'Heading 5', action: { type: 'heading', level: 5 } },
    { icon: Heading6, title: 'Heading 6', action: { type: 'heading', level: 6 } },
  ],
  // Alignment
  [
    { icon: AlignLeft, title: 'Align Left', action: { type: 'align', alignment: 'left' } },
    { icon: AlignCenter, title: 'Align Center', action: { type: 'align', alignment: 'center' } },
    { icon: AlignRight, title: 'Align Right', action: { type: 'align', alignment: 'right' } },
    { icon: AlignJustify, title: 'Align Justify', action: { type: 'align', alignment: 'justify' } },
  ],
  // Lists
  [
    { icon: List, title: 'Bullet List', action: { type: 'list', variant: 'bullet' } },
    { icon: ListOrdered, title: 'Numbered List', action: { type: 'list', variant: 'ordered' } },
  ],
  // Media
  [
    { icon: Link2, title: 'Add Link', action: { type: 'link' } },
    { icon: ImagePlus, title: 'Add Image', action: { type: 'image' } },
  ],
]

function isActionActive(editor: ReturnType<typeof useEditor>, action: ToolbarAction): boolean {
  if (!editor) return false
  switch (action.type) {
    case 'mark':
      return editor.isActive(action.name)
    case 'heading':
      return editor.isActive('heading', { level: action.level })
    case 'list':
      return editor.isActive(action.variant === 'bullet' ? 'bulletList' : 'orderedList')
    case 'link':
      return editor.isActive('link')
    case 'image':
      return false
    case 'align':
      return editor.isActive({ textAlign: action.alignment })
  }
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  function TiptapEditor(
    {
      initialValue = '',
      onContentChange,
      placeholder = 'Start typing...',
      className,
      height = '400px',
      showToolbar = true,
      readOnly = false,
      brandId,
      workspaceId,
    },
    ref
  ) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false)
    const [isEditingExistingLink, setIsEditingExistingLink] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [imageCaption, setImageCaption] = useState('')
    const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'right'>('center')
    
    const editor = useEditor({
      extensions: [
        Markdown, // Must be first to properly handle markdown parsing
        StarterKit.configure({ 
          heading: { 
            levels: [1, 2, 3, 4, 5, 6] // Support all heading levels
          } 
        }),
        Placeholder.configure({ placeholder }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'tiptap-link',
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
        FigureImage,
      ],
      editorProps: {
        attributes: {
          class: 'tiptap-editor h-full w-full outline-none max-w-none text-foreground px-4 py-3',
        },
      },
      content: initialValue,
      contentType: 'markdown', // Set default content type to markdown
      editable: !readOnly,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onContentChange?.(editor.getHTML())
      },
    })

    const handleAddLink = useCallback(() => {
      if (!editor) return
      
      const previousUrl = editor.getAttributes('link').href
      const previousTarget = editor.getAttributes('link').target
      
      setLinkUrl(previousUrl || '')
      setLinkOpenInNewTab(previousTarget === '_blank')
      setIsEditingExistingLink(!!previousUrl)
      setLinkDialogOpen(true)
    }, [editor])
    
    const handleSaveLink = useCallback(() => {
      if (!editor) return
      
      if (!linkUrl) {
        setLinkDialogOpen(false)
        return
      }
      
      // Ensure URL has a protocol
      let finalUrl = linkUrl
      if (!/^https?:\/\//i.test(linkUrl)) {
        finalUrl = `https://${linkUrl}`
      }
      
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ 
          href: finalUrl,
          target: linkOpenInNewTab ? '_blank' : null,
          rel: linkOpenInNewTab ? 'noopener noreferrer' : null,
        })
        .run()
      
      setLinkDialogOpen(false)
      setLinkUrl('')
      setLinkOpenInNewTab(false)
      setIsEditingExistingLink(false)
    }, [editor, linkUrl, linkOpenInNewTab])
    
    const handleRemoveLink = useCallback(() => {
      if (!editor) return
      
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setLinkDialogOpen(false)
      setLinkUrl('')
      setLinkOpenInNewTab(false)
      setIsEditingExistingLink(false)
    }, [editor])

    const handleAddImage = useCallback(() => {
      if (!editor) return
      
      // Create a file input element
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        
        // If no brandId provided, fall back to base64 (not recommended)
        if (!brandId) {
          console.warn('[TipTap] No brandId provided, using base64 fallback. This is not recommended for production.')
          const reader = new FileReader()
          reader.onload = (event) => {
            const src = event.target?.result as string
            if (src) {
              setImageUrl(src)
              setImageCaption('')
              setImageAlignment('center')
              setImageDialogOpen(true)
            }
          }
          reader.readAsDataURL(file)
          return
        }
        
        try {
          setIsUploadingImage(true)
          
          // Create FormData
          const formData = new FormData()
          formData.append('file', file)
          formData.append('brandId', brandId)
          if (workspaceId) {
            formData.append('workspaceId', workspaceId)
          }
          
          // Upload to R2 via API
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to upload image')
          }
          
          const data = await response.json()
          
          // Open dialog to add caption and alignment
          setImageUrl(data.url)
          setImageCaption('')
          setImageAlignment('center')
          setImageDialogOpen(true)
          
          toast.success('Image uploaded successfully')
        } catch (error) {
          console.error('[TipTap] Image upload failed:', error)
          toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setIsUploadingImage(false)
        }
      }
      
      input.click()
    }, [editor, brandId, workspaceId])
    
    const handleSaveImage = useCallback(() => {
      if (!editor || !imageUrl) return
      
      // Insert figure with image and caption as content node
      editor.chain().focus().insertContent({
        type: 'figureImage',
        attrs: {
          src: imageUrl,
          alt: imageCaption || '',
          caption: imageCaption,
          align: imageAlignment,
        },
      }).run()
      
      setImageDialogOpen(false)
      setImageUrl('')
      setImageCaption('')
      setImageAlignment('center')
    }, [editor, imageUrl, imageCaption, imageAlignment])

    const handleAutoFormat = useCallback(() => {
      if (!editor) return
      
      try {
        // Get the raw text content from the editor
        const textContent = editor.getText()
        
        // Check if it contains markdown syntax
        const hasMarkdownSyntax = /#{1,6}\s|\*\*|__|\[.*?\]\(.*?\)|^\s*[-*+]\s|^\s*\d+\.\s/m.test(textContent)
        
        if (!hasMarkdownSyntax) {
          toast.info('No markdown formatting detected')
          return
        }
        
        // Force re-parse the text content as markdown
        // This will convert ## to H2, ** to bold, etc.
        editor.commands.clearContent()
        editor.commands.setContent(textContent, { contentType: 'markdown' })
        
        toast.success('Content formatted successfully')
      } catch (error) {
        console.error('[TipTap] Auto-format failed:', error)
        toast.error('Failed to format content')
      }
    }, [editor])

    const handleToolbarAction = useCallback((action: ToolbarAction) => {
      if (!editor) return
      
      switch (action.type) {
        case 'mark':
          editor.chain().focus().toggleMark(action.name).run()
          break
        case 'heading':
          editor.chain().focus().toggleHeading({ level: action.level }).run()
          break
        case 'list':
          editor.chain().focus()[action.variant === 'bullet' ? 'toggleBulletList' : 'toggleOrderedList']().run()
          break
        case 'align':
          editor.chain().focus().setTextAlign(action.alignment).run()
          break
        case 'link':
          handleAddLink()
          break
        case 'image':
          handleAddImage()
          break
      }
    }, [editor, handleAddLink, handleAddImage])

    useEffect(() => {
      if (editor && !editor.isDestroyed && initialValue) {
        const currentContent = editor.getHTML()
        if (initialValue !== currentContent) {
          // Parse as markdown - TipTap's Markdown extension handles the conversion
          editor.commands.setContent(initialValue, { contentType: 'markdown' })
        }
      }
    }, [initialValue, editor])

    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(content, { contentType: 'markdown' })
        }
      },
      getContent: () => {
        if (editor && !editor.isDestroyed) {
          return editor.getHTML()
        }
        return ''
      },
    }), [editor])

    if (!editor) {
      return null
    }

    return (
      <>
        <div className={cn('flex flex-col rounded-lg border bg-background', className)}>
        {showToolbar && !readOnly && (
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
            {TOOLBAR_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-1">
                {groupIndex > 0 && <div className="w-px h-6 bg-border mx-1" />}
                {group.map(({ icon: Icon, title, action }, index) => {
                  const isImageButton = action.type === 'image'
                  const isDisabled = isImageButton && isUploadingImage
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleToolbarAction(action)}
                      disabled={isDisabled}
                      className={cn(
                        'p-2 rounded hover:bg-muted transition-colors',
                        isActionActive(editor, action) && 'bg-muted',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                      title={isImageButton && isUploadingImage ? 'Uploading...' : title}
                    >
                      {isImageButton && isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}

            <div className="w-px h-6 bg-border mx-1" />

            {/* Auto-format button */}
            <button
              type="button"
              onClick={handleAutoFormat}
              className="p-2 rounded hover:bg-muted transition-colors"
              title="Convert markdown syntax to formatted content"
            >
              <WandSparkles className="h-4 w-4" />
            </button>
          </div>
        )}

          <div 
            className="overflow-y-scroll bg-background"
            style={{ height }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Link Dialog */}
        <Dialog 
          open={linkDialogOpen} 
          onOpenChange={(open) => {
            setLinkDialogOpen(open)
            if (!open) {
              // Reset state when dialog is closed
              setLinkUrl('')
              setLinkOpenInNewTab(false)
              setIsEditingExistingLink(false)
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>
                Add or edit a link in your content
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSaveLink()
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="link-new-tab"
                  checked={linkOpenInNewTab}
                  onCheckedChange={(checked) => setLinkOpenInNewTab(checked === true)}
                />
                <Label htmlFor="link-new-tab" className="text-sm font-normal cursor-pointer">
                  Open in new tab
                </Label>
              </div>
            </div>

            <DialogFooter className={cn(
              "flex-row",
              isEditingExistingLink ? "justify-between sm:justify-between" : "justify-end sm:justify-end"
            )}>
              {isEditingExistingLink && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemoveLink}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Link
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLinkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveLink}
                  disabled={!linkUrl}
                >
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog 
          open={imageDialogOpen} 
          onOpenChange={(open) => {
            setImageDialogOpen(open)
            if (!open) {
              setImageUrl('')
              setImageCaption('')
              setImageAlignment('center')
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>
                Add caption and choose alignment for your image
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Image Preview */}
              {imageUrl && (
                <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-48 rounded-md object-contain"
                  />
                </div>
              )}
              
              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="image-caption">Caption (optional)</Label>
                <Input
                  id="image-caption"
                  placeholder="Enter image caption..."
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                />
              </div>
              
              {/* Alignment */}
              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageAlignment === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageAlignment('left')}
                    className="flex-1"
                  >
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Left
                  </Button>
                  <Button
                    type="button"
                    variant={imageAlignment === 'center' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageAlignment('center')}
                    className="flex-1"
                  >
                    <AlignCenter className="h-4 w-4 mr-2" />
                    Center
                  </Button>
                  <Button
                    type="button"
                    variant={imageAlignment === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageAlignment('right')}
                    className="flex-1"
                  >
                    <AlignRight className="h-4 w-4 mr-2" />
                    Right
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setImageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveImage}
                disabled={!imageUrl}
              >
                Insert Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

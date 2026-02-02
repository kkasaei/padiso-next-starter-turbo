'use client'

import { NodeViewWrapper } from '@tiptap/react'
import { X, AlignLeft, AlignCenter, AlignRight, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'

interface FigureImageViewProps {
  node: {
    attrs: {
      src: string
      alt?: string
      align?: 'left' | 'center' | 'right'
      caption?: string
    }
  }
  updateAttributes: (attrs: Record<string, unknown>) => void
  deleteNode: () => void
  selected: boolean
  editor: {
    isEditable: boolean
  }
}

export function FigureImageView({ node, updateAttributes, deleteNode, selected, editor }: FigureImageViewProps) {
  const [captionText, setCaptionText] = useState(node.attrs.caption || '')
  const [showControls, setShowControls] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUrl, setEditUrl] = useState(node.attrs.src)
  const [editAlt, setEditAlt] = useState(node.attrs.alt || '')
  
  const handleCaptionChange = (e: React.FormEvent<HTMLElement>) => {
    const text = e.currentTarget.textContent || ''
    setCaptionText(text)
    updateAttributes({ caption: text })
  }

  const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
    updateAttributes({ align })
  }

  const handleOpenEdit = () => {
    setEditUrl(node.attrs.src)
    setEditAlt(node.attrs.alt || '')
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    updateAttributes({
      src: editUrl,
      alt: editAlt,
    })
    setEditDialogOpen(false)
  }

  if (!editor.isEditable) {
    return (
      <NodeViewWrapper
        as="figure"
        data-type="image"
        data-align={node.attrs.align || 'center'}
      >
        <img src={node.attrs.src} alt={node.attrs.alt || ''} />
        {node.attrs.caption && <figcaption>{node.attrs.caption}</figcaption>}
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      as="figure"
      data-type="image"
      data-align={node.attrs.align || 'center'}
      className="not-prose"
    >
      {/* Image Wrapper with Controls */}
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Image */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          draggable={false}
          className={`transition-all rounded-lg ${selected ? 'ring-2 ring-primary' : ''}`}
        />

        {/* Image Controls Overlay - ON THE IMAGE */}
        {showControls && (
          <>
            {/* Alignment controls - top left ON IMAGE */}
            <div className="absolute top-2 left-2 flex gap-1 bg-background/95 backdrop-blur-sm rounded-md shadow-lg border border-border p-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleAlignmentChange('left')
                }}
                className={`p-1.5 rounded hover:bg-muted transition-colors ${node.attrs.align === 'left' ? 'bg-primary text-primary-foreground' : ''}`}
                title="Align left"
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleAlignmentChange('center')
                }}
                className={`p-1.5 rounded hover:bg-muted transition-colors ${node.attrs.align === 'center' ? 'bg-primary text-primary-foreground' : ''}`}
                title="Align center"
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleAlignmentChange('right')
                }}
                className={`p-1.5 rounded hover:bg-muted transition-colors ${node.attrs.align === 'right' ? 'bg-primary text-primary-foreground' : ''}`}
                title="Align right"
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Action buttons - top right ON IMAGE */}
            <div className="absolute top-2 right-2 flex gap-1 bg-background/95 backdrop-blur-sm rounded-md shadow-lg border border-border p-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenEdit()
                }}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                title="Edit image"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  deleteNode()
                }}
                className="p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                title="Delete image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Caption - editable (below image) */}
      <figcaption
        contentEditable
        suppressContentEditableWarning
        onInput={handleCaptionChange}
        onBlur={handleCaptionChange}
        data-placeholder="Add caption..."
        className="outline-none"
      >
        {captionText}
      </figcaption>

      {/* Edit Image Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update the image URL and alt text
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Image Preview */}
            <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
              <img 
                src={editUrl} 
                alt={editAlt || 'Preview'} 
                className="max-h-48 rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EInvalid URL%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image-url">Image URL</Label>
              <Input
                id="edit-image-url"
                placeholder="https://example.com/image.jpg"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image-alt">Alt Text (optional)</Label>
              <Input
                id="edit-image-alt"
                placeholder="Description for accessibility"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={!editUrl}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  )
}


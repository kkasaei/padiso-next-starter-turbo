import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FigureImageView } from '../FigureImageView'

export interface FigureImageOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figureImage: {
      setFigureImage: (options: { src: string; alt?: string; caption?: string; align?: 'left' | 'center' | 'right' }) => ReturnType
    }
  }
}

export const FigureImage = Node.create<FigureImageOptions>({
  name: 'figureImage',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      align: {
        default: 'center',
      },
      caption: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image"]',
        getAttrs: element => {
          const img = (element as HTMLElement).querySelector('img')
          const figcaption = (element as HTMLElement).querySelector('figcaption')
          
          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            align: (element as HTMLElement).getAttribute('data-align') || 'center',
            caption: figcaption?.textContent || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'image',
        'data-align': HTMLAttributes.align,
      }),
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
      ['figcaption', HTMLAttributes.caption || ''],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureImageView)
  },

  addCommands() {
    return {
      setFigureImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || '',
              align: options.align || 'center',
              caption: options.caption || '',
            },
          })
        },
    }
  },
})

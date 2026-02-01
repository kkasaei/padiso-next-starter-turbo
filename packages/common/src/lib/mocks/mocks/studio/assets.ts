// ============================================================
// STUDIO ASSETS MOCK DATA
// ============================================================

// Asset types
export type AssetType = 'image' | 'video' | 'audio'
export type AssetStatus = 'processing' | 'ready' | 'failed'

export interface Asset {
  id: string
  name: string
  type: AssetType
  url: string
  thumbnailUrl: string
  size: number // in bytes
  width?: number
  height?: number
  duration?: number // in seconds for video/audio
  status: AssetStatus
  altText?: string
  tags: string[]
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

// Valid Unsplash image IDs for mock data
export const UNSPLASH_IMAGES = [
  'photo-1677442136019-21780ecad995', // AI dashboard
  'photo-1460925895917-afdab827c52f', // Analytics
  'photo-1522071820081-009f0129c71c', // Team
  'photo-1551434678-e076c223a692', // Office
  'photo-1498050108023-c5249f4df085', // Code
  'photo-1504868584819-f8e8b4b6d7e3', // Dashboard
  'photo-1551288049-bebda4e38f71', // Charts
  'photo-1460925895917-afdab827c52f', // Data
  'photo-1531482615713-2afd69097998', // Meeting
  'photo-1542744173-8e7e53415bb0', // Conference
  'photo-1553877522-43269d4ea984', // Workspace
  'photo-1497215728101-856f4ea42174', // Desk
  'photo-1556761175-b413da4baf72', // Laptop
  'photo-1517245386807-bb43f82c33c4', // Presentation
  'photo-1552664730-d307ca884978', // Teamwork
  'photo-1600880292203-757bb62b4baf', // Remote work
  'photo-1454165804606-c3d57bc86b40', // Business
  'photo-1507003211169-0a1dd7228f2d', // Professional
  'photo-1573497019940-1c28c88b4f3e', // Portrait
  'photo-1560472354-b33ff0c44a43', // Creative
]

// Mock assets data
export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'hero-banner-ai-generated.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop',
    size: 2450000,
    width: 1920,
    height: 1080,
    status: 'ready',
    altText: 'AI-powered analytics dashboard showing SEO metrics',
    tags: ['hero', 'banner', 'ai'],
    aiGenerated: true,
    createdAt: '2 hours ago',
    updatedAt: '1 hour ago',
  },
  {
    id: '2',
    name: 'product-demo-video.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
    size: 15000000,
    width: 1920,
    height: 1080,
    duration: 596,
    status: 'ready',
    altText: 'Product demo video showcasing main features',
    tags: ['demo', 'product', 'video'],
    aiGenerated: false,
    createdAt: '1 day ago',
    updatedAt: '12 hours ago',
  },
  {
    id: '3',
    name: 'podcast-episode-intro.mp3',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailUrl: '',
    size: 5200000,
    duration: 372,
    status: 'ready',
    altText: 'Podcast episode intro music',
    tags: ['podcast', 'audio', 'intro'],
    aiGenerated: true,
    createdAt: '3 days ago',
    updatedAt: '2 days ago',
  },
  {
    id: '4',
    name: 'infographic-seo-guide.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
    size: 1800000,
    width: 1080,
    height: 1920,
    status: 'ready',
    altText: 'SEO guide infographic with step-by-step instructions',
    tags: ['infographic', 'seo', 'guide'],
    aiGenerated: true,
    createdAt: '4 days ago',
    updatedAt: '3 days ago',
  },
  {
    id: '5',
    name: 'team-photo.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
    size: 980000,
    width: 1600,
    height: 900,
    status: 'ready',
    altText: 'Team collaboration meeting in modern office',
    tags: ['team', 'photo', 'office'],
    aiGenerated: false,
    createdAt: '1 week ago',
    updatedAt: '5 days ago',
  },
  {
    id: '6',
    name: 'processing-asset.png',
    type: 'image',
    url: '',
    thumbnailUrl: '',
    size: 0,
    status: 'processing',
    tags: ['processing'],
    aiGenerated: true,
    createdAt: '5 minutes ago',
    updatedAt: '5 minutes ago',
  },
  // Generate more mock assets with valid Unsplash URLs (100 total assets)
  ...Array.from({ length: 94 }, (_, i) => {
    const index = i + 7
    const types: AssetType[] = ['image', 'image', 'image', 'video', 'audio']
    const type = types[i % types.length]
    const statuses: AssetStatus[] = ['ready', 'ready', 'ready', 'ready', 'processing']
    const imageId = UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]
    return {
      id: index.toString(),
      name: `asset-${index}.${type === 'image' ? 'png' : type === 'video' ? 'mp4' : 'mp3'}`,
      type,
      url: type === 'image' ? `https://images.unsplash.com/${imageId}?w=1200&h=800&fit=crop` : '',
      thumbnailUrl: type === 'image' ? `https://images.unsplash.com/${imageId}?w=100&h=100&fit=crop` : '',
      size: 500000 + (index * 100000),
      width: type !== 'audio' ? 1920 : undefined,
      height: type !== 'audio' ? 1080 : undefined,
      duration: type !== 'image' ? 30 + (index % 120) : undefined,
      status: statuses[i % statuses.length],
      altText: `Asset ${index} description`,
      tags: ['asset', `tag-${index % 5}`],
      aiGenerated: index % 3 === 0,
      createdAt: `${Math.floor(index / 5) + 1} days ago`,
      updatedAt: `${Math.floor(index / 10)} days ago`,
    }
  }),
]


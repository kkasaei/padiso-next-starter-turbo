/**
 * Image Upload API Route
 * 
 * Uploads images to Cloudflare R2 for use in TipTap editor content.
 * 
 * POST /api/upload-image
 * Body: FormData with 'file', 'brandId', 'workspaceId' fields
 * Returns: { url: string } - CDN URL of uploaded image
 */

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadAssetToR2 } from '@workspace/cloudflare'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export async function POST(req: Request): Promise<Response> {
  try {
    // Verify authentication
    const { userId, orgId } = await auth()
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse FormData
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const brandId = formData.get('brandId') as string | null
    const workspaceId = formData.get('workspaceId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!brandId) {
      return NextResponse.json({ error: 'brandId is required' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique asset ID
    const assetId = randomUUID()

    // Upload to R2
    const result = await uploadAssetToR2({
      orgId,
      projectId: brandId, // Using brandId as projectId
      assetId,
      buffer,
      mimeType: file.type,
      fileName: file.name,
      metadata: {
        'x-user-id': userId,
        'x-workspace-id': workspaceId || 'unknown',
        'x-upload-source': 'tiptap-editor',
      },
    })

    console.log(`[Upload] Image uploaded successfully: ${result.cdnUrl}`)

    return NextResponse.json({
      url: result.cdnUrl,
      size: result.size,
      assetId,
    })
  } catch (error) {
    console.error('[Upload] Failed to upload image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    )
  }
}

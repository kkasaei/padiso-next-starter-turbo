'use client'

import { BacklinkExchangePage } from './BacklinkExchangePage'

interface BacklinkPageProps {
  brandId?: string
}

export default function BacklinkPage({ brandId }: BacklinkPageProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <BacklinkExchangePage brandId={brandId} />
    </div>
  )
}

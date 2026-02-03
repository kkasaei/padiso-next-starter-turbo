import BacklinkPage from '@/components/brands/backlinks/BacklinkPage'
import { BacklinkPageHeader } from '@/components/brands/backlinks/BacklinkPageHeader'

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-8 h-[82px] border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight">Backlink Exchange</h1>
        <BacklinkPageHeader />
      </div>
      <div className="flex flex-1 px-4">
        <BacklinkPage />
      </div>
    </div>
  )
}

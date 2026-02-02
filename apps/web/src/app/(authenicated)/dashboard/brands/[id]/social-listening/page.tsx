import SocialListeningPage from '@/components/brands/social-listening/SocialListeningPage'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight px-4">Social Listening</h1>
      </div>
      <div className="flex flex-1 px-4">
        <SocialListeningPage />
      </div>
    </div>
  )
}

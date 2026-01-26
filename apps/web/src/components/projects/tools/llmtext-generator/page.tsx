'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { Type, CheckCircle2, Info, Sparkles, Zap } from 'lucide-react'

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const handleStartGenerating = () => {
    router.push(`/dashboard/projects/${projectId}/tools/llmtext-generator/edit`)
  }

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center py-8">
      <div className="h-[500px]">
        {/* Introduction Card */}
        <div className="dark:bg-polar-800 flex w-full max-w-7xl flex-col gap-12 rounded-4xl bg-gray-100 p-4 md:flex-row">
          {/* Left Side - Description */}
          <div className="flex w-full flex-col gap-6 p-6 md:max-w-sm">
            <div className="flex flex-col gap-y-2">
              <div className="mb-2 flex items-center gap-2">
                <Type className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl dark:text-white">LLM Text Generator</h2>
              </div>
            </div>
            <div className="flex grow flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="dark:text-polar-300 text-gray-700">
                  Generate high-quality, AEO-optimized content using advanced Large Language Models. Create blog posts,
                  articles, product descriptions, and more that are specifically tailored for AI search engine
                  visibility.
                </p>
                <p className="dark:text-polar-300 text-gray-700">
                  Our LLM-powered generator understands context, maintains brand voice, and structures content to rank
                  better in ChatGPT, Perplexity, Gemini, and other AI-powered search platforms.
                </p>
              </div>
              <Button className="gap-2 rounded-xl" onClick={handleStartGenerating}>
                <Sparkles className="h-4 w-4" />
                Start Generating
              </Button>
            </div>
          </div>

          {/* Right Side - What We Offer */}
          <div className="dark:bg-polar-900 flex flex-1 shrink flex-col gap-y-4 overflow-auto rounded-3xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">Generation Features</h3>

            <div className="flex flex-col gap-4">
              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">AEO-Optimized Content</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Generate content structured for AI search engines with proper headings, context, and answer formats
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Multi-Format Generation</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Create blog posts, FAQs, product descriptions, meta descriptions, and more in various formats
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Brand Voice Consistency</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Maintain consistent tone, style, and messaging aligned with your brand guidelines
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Context-Aware Writing</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    AI understands your project context, keywords, and target audience for relevant content
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Real-Time Editing & Refinement</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Iterate on generated content with AI assistance, refine sections, and adjust tone instantly
                  </p>
                </div>
              </div>
            </div>

            {/* Content Types */}
            <div className="dark:bg-polar-800 mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-polar-700">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Supported Content Types</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Blog Posts & Articles</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Product Descriptions</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">FAQ & Help Content</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Meta Descriptions & Tags</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Social Media Posts</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

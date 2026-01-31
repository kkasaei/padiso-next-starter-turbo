'use client'

import { Button } from '@workspace/ui/components/button'
import { Link2, CheckCircle2, Sparkles, Coins, ArrowUpDown, Shield, TrendingUp, Bell, Zap } from 'lucide-react'

export default function BacklinkPage() {
  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center py-8">
      <div className="h-auto">
        {/* Introduction Card */}
        <div className="dark:bg-polar-800 flex w-full max-w-7xl flex-col gap-12 rounded-4xl bg-gray-100 p-4 md:flex-row">
          {/* Left Side - Description */}
          <div className="flex w-full flex-col gap-6 p-6 md:max-w-sm">
            <div className="flex flex-col gap-y-2">
              <div className="mb-2 flex items-center gap-2">
                <Link2 className="h-6 w-6 text-emerald-500" />
                <h2 className="text-2xl dark:text-white">Backlink Exchange</h2>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <div className="flex grow flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="dark:text-polar-300 text-gray-700">
                  Grow your <strong>domain authority</strong> and <strong>AI visibility</strong> through our credit-based backlink exchange network. Get quality dofollow backlinks naturally integrated into relevant content.
                </p>
                <p className="dark:text-polar-300 text-gray-700">
                  Track incoming and outgoing links, monitor your credits, and verify link quality — all from one dashboard. No subscriptions required to get started.
                </p>
              </div>
              <Button className="gap-2 rounded-xl" disabled>
                <Bell className="h-4 w-4" />
                Notify Me When Available
              </Button>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="dark:bg-polar-900 flex flex-1 shrink flex-col gap-y-4 overflow-auto rounded-3xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">How It Works</h3>

            <div className="flex flex-col gap-4">
              {/* Feature Item - Credits */}
              <div className="flex items-start gap-3">
                <Coins className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Credit-Based System</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Start with 100 free credits. Earn more by giving backlinks (1 DR = 1 credit, capped at 20). Spend credits to receive backlinks.
                  </p>
                </div>
              </div>

              {/* Feature Item - Exchange */}
              <div className="flex items-start gap-3">
                <ArrowUpDown className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Automatic Exchange</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Links are naturally integrated into daily articles on participating websites in your niche. All links are dofollow.
                  </p>
                </div>
              </div>

              {/* Feature Item - Quality */}
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Quality Verification</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Each link is contextually placed where it adds genuine value. Monitor and verify all backlinks from your dashboard.
                  </p>
                </div>
              </div>

              {/* Feature Item - Authority */}
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Grow Domain Authority</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Quality backlinks improve authority signals that both search engines and AI systems consider when citing sources.
                  </p>
                </div>
              </div>

              {/* Feature Item - AI Visibility */}
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">AI Visibility Boost</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Improve your chances of being cited by ChatGPT, Perplexity, and other AI systems through stronger authority signals.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="dark:bg-polar-800 mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-polar-700">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard Metrics</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Backlink Credits Balance</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Total Backlinks Received</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Estimated Backlinks Value</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Outgoing Links Given</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Link Quality Verification</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Planned</span>
                </div>
              </div>
            </div>

            {/* Requirements Note */}
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Requirements:</strong> Publish regularly, keep articles in your sitemap, no paywalls, and maintain a positive credit balance for automatic placements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

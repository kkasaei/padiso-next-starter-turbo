'use client'

import { Button } from '@workspace/ui/components/button'
import { MessageCircle, CheckCircle2, Sparkles, Target, Clock, MapPin, MessageSquare, TrendingUp, Bell } from 'lucide-react'

export default function RedditPage() {
  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center py-8">
      <div className="h-[500px]">
        {/* Introduction Card */}
        <div className="dark:bg-polar-800 flex w-full max-w-7xl flex-col gap-12 rounded-4xl bg-gray-100 p-4 md:flex-row">
          {/* Left Side - Description */}
          <div className="flex w-full flex-col gap-6 p-6 md:max-w-sm">
            <div className="flex flex-col gap-y-2">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl dark:text-white">Reddit Agent</h2>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <div className="flex grow flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="dark:text-polar-300 text-gray-700">
                  Increase your brand visibility on Reddit with AI-powered intelligence. Know exactly <strong>when</strong> to engage, <strong>where</strong> to participate, and <strong>what</strong> to say to build authentic presence.
                </p>
                <p className="dark:text-polar-300 text-gray-700">
                  Our Reddit Agent monitors relevant conversations, identifies high-impact opportunities, and helps you craft responses that resonate with communities—without coming across as promotional.
                </p>
              </div>
              <Button className="gap-2 rounded-xl" disabled>
                <Bell className="h-4 w-4" />
                Notify Me When Available
              </Button>
            </div>
          </div>

          {/* Right Side - What We Offer */}
          <div className="dark:bg-polar-900 flex flex-1 shrink flex-col gap-y-4 overflow-auto rounded-3xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">How It Works</h3>

            <div className="flex flex-col gap-4">
              {/* Feature Item - When */}
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Know When to Engage</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Get real-time alerts when relevant discussions emerge. Engage while threads are active and gaining traction
                  </p>
                </div>
              </div>

              {/* Feature Item - Where */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Know Where to Participate</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Discover the right subreddits, threads, and conversations where your expertise adds genuine value
                  </p>
                </div>
              </div>

              {/* Feature Item - What */}
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Know What to Say</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    AI-crafted response suggestions that match subreddit culture and add value without being promotional
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Brand Mention Tracking</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Monitor when your brand or competitors are mentioned and respond to shape the conversation
                  </p>
                </div>
              </div>

              {/* Feature Item */}
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h4 className="mb-1 font-semibold dark:text-white">Visibility Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-polar-400">
                    Track your Reddit presence growth, engagement rates, and brand sentiment over time
                  </p>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="dark:bg-polar-800 mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-polar-700">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Planned Capabilities</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Subreddit Discovery & Monitoring</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Real-time Conversation Alerts</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">AI Response Suggestions</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Competitor Mention Tracking</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-polar-400">Engagement Analytics Dashboard</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

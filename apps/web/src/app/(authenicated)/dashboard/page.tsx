'use client'

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Package,
  Settings,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Users,
  Lightbulb,
  BarChart,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { BrandWizard } from "@/components/brands/brand-wizard/BrandWizard"
import { useBrands } from "@/hooks/use-brands"

function OnboardingCard({ hasBrands, onCreateBrand }: { hasBrands: boolean; onCreateBrand: () => void }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-border rounded-3xl border border-border bg-card lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {/* Create a brand */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              hasBrands
                ? "bg-emerald-100 dark:bg-emerald-950"
                : "border border-border bg-muted"
            }`}
          >
            <Package
              className={`h-5 w-5 ${
                hasBrands
                  ? "text-emerald-600 dark:text-emerald-400"
                  : ""
              }`}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-lg font-medium md:text-xl">Create a Brand</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Create your first brand to start AI tracking and optimization
            </p>
          </div>
          {hasBrands ? (
            <Button variant="secondary" className="w-full" disabled>
              Completed
            </Button>
          ) : (
            <Button className="w-full" onClick={onCreateBrand}>
              Create Brand
            </Button>
          )}
        </div>
      </div>

      {/* Connect with Us */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
            <Settings className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-lg font-medium md:text-xl">Connect with Us</h3>
              <p className="text-sm text-muted-foreground md:text-base">
                We are humans and we are here to help you.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="https://discord.gg/3SQYZGdy"
                className="flex items-start gap-3 rounded-xl bg-muted p-4 transition-all hover:bg-muted/50"
                target="_blank"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/10 dark:bg-[#5865F2]/20">
                  <svg
                    className="h-5 w-5 text-[#5865F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">Join the community</h4>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Join our Discord server to get help from the community.
                  </p>
                </div>
              </Link>
              <Link
                href="https://x.com/searchfitai"
                className="flex items-start gap-3 rounded-xl bg-muted p-4 transition-all hover:bg-muted/50"
                target="_blank"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                  <svg
                    className="h-5 w-5 text-black dark:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">Follow us on X</h4>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Follow us on X to get the latest news and updates.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Learn how to use */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-lg font-medium md:text-xl">
              Learn how to use the platform
            </h3>
            <p className="text-sm text-muted-foreground md:text-base">
              5 Minutes to get you started with the dashboard.
            </p>
          </div>
          <Button 
            className="w-full" 
            asChild
          >
            <a 
              href="https://www.youtube.com/@searchfitai" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Watch the video
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrainingCard() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const trainingTopics = [
    {
      id: 1,
      icon: BookOpen,
      title: "Getting Started",
      description:
        "Learn the fundamentals of brand management and how to navigate the dashboard",
      duration: "10 min read",
      difficulty: "Beginner",
      color: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Tracking Progress",
      description:
        "Discover how to monitor brand milestones and track team performance",
      duration: "15 min read",
      difficulty: "Beginner",
      color:
        "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: 3,
      icon: FileText,
      title: "Task Management",
      description:
        "Master the art of organizing tasks and setting up effective workflows",
      duration: "12 min read",
      difficulty: "Intermediate",
      color:
        "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
    },
    {
      id: 4,
      icon: Users,
      title: "Team Collaboration",
      description:
        "Understand how to work effectively with your team members on brands",
      duration: "20 min read",
      difficulty: "Intermediate",
      color:
        "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    },
    {
      id: 5,
      icon: BarChart,
      title: "Analytics & Reports",
      description:
        "Track and analyze your brand performance with key metrics and KPIs",
      duration: "18 min read",
      difficulty: "Advanced",
      color: "bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400",
    },
    {
      id: 6,
      icon: Lightbulb,
      title: "Advanced Features",
      description:
        "Implement cutting-edge techniques to maximize your productivity",
      duration: "25 min read",
      difficulty: "Advanced",
      color:
        "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
    },
  ]

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollLeftFn = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = scrollContainerRef.current.clientWidth / 3
    scrollContainerRef.current.scrollBy({
      left: -cardWidth * 3,
      behavior: "smooth",
    })
  }

  const scrollRightFn = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = scrollContainerRef.current.clientWidth / 3
    scrollContainerRef.current.scrollBy({
      left: cardWidth * 3,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()
    container.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      container.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [])

  return (
    <div className="relative rounded-3xl border border-border bg-card">
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={scrollLeftFn}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all hover:bg-muted"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          onClick={scrollRightFn}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all hover:bg-muted"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex snap-x snap-mandatory divide-x divide-border overflow-x-auto rounded-3xl scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {trainingTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <div
              key={topic.id}
              className="flex min-w-[calc(100%/3)] max-w-[calc(100%/3)] snap-start flex-col gap-6 p-6 md:p-8 lg:p-10"
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${topic.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {topic.difficulty}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-lg font-medium md:text-xl">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {topic.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">
                    {topic.duration}
                  </span>
                  <Button asChild className="w-full">
                    <Link href="#">Start Learning</Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: brands = [] } = useBrands()
  const [showWizard, setShowWizard] = useState(false)
  
  // Mark as completed if user has at least one brand
  const hasBrands = brands.length >= 1

  return (
    <div className="mt-10">
      {/* Content */}
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        <OnboardingCard 
          hasBrands={hasBrands} 
          onCreateBrand={() => setShowWizard(true)}
        />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Training Resources</h2>
          <TrainingCard />
        </div>
      </div>

      {/* Brand Wizard Modal */}
      {showWizard && (
        <BrandWizard 
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  )
}

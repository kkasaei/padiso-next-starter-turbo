'use client'

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { TrackedPrompt } from "@/components/modules/prompts/types"
import { useState } from "react"

type ProjectTrackingBreadcrumbsProps = {
    projectId: string
}

export default function ProjectTrackingBreadcrumbs({ projectId }: ProjectTrackingBreadcrumbsProps) {

    const [prompt] = useState<TrackedPrompt | null>({
        id: 'prompt-001',
        projectId: 'project-001',
        prompt: 'Best project management software for remote teams',
        notes: 'Tracking visibility for our main product keyword',
        lastVisibilityScore: 78,
        lastMentionPosition: 3,
        lastScanDate: new Date('2026-01-25'),
        isActive: true,
        targetLocation: 'United States',
        targetLanguage: 'en',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-25'),
    })


    return (
         <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
            <Link
                href={`/dashboard/projects/${projectId}/tracking?tab=prompts`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                Tracking
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
                href={`/dashboard/projects/${projectId}/tracking?tab=prompts`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                Prompts
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-xs">
                {prompt?.prompt}
            </span>
            </div>
       </div>
    )
}
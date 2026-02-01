'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Loader2, Trash2, Pencil, Eye } from 'lucide-react'
import type { TrackedPrompt } from './types'

interface PromptsTableProps {
  prompts: TrackedPrompt[]
  isLoading: boolean
  onEdit: (prompt: TrackedPrompt) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, currentStatus: boolean) => void
}

export function PromptsTable({
  prompts,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: PromptsTableProps) {
  const params = useParams()
  const projectId = params.projectId as string

  return (
    <div className="dark:border-polar-700 overflow-hidden rounded-2xl border border-gray-200">
      <div className="relative w-full overflow-auto">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="dark:bg-polar-800 bg-gray-50">
              <TableHead style={{ width: '350px' }}>
                <span>Prompt</span>
              </TableHead>
              <TableHead style={{ width: '100px' }}>
                <span>Status</span>
              </TableHead>
              <TableHead style={{ width: '100px' }}>
                <span>Visibility</span>
              </TableHead>
              <TableHead style={{ width: '120px' }}>
                <span>Last Scan</span>
              </TableHead>
              <TableHead style={{ width: '100px' }}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : prompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No prompts yet. Click &ldquo;New Prompt&rdquo; to add one.
                </TableCell>
              </TableRow>
            ) : (
              prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium max-w-[350px]" title={prompt.prompt}>
                    <Link 
                      href={`/dashboard/brands/${projectId}/prompts/${prompt.id}`}
                      className="truncate block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {prompt.prompt}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onToggleActive(prompt.id, prompt.isActive)}
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${
                        prompt.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {prompt.isActive ? 'Active' : 'Paused'}
                    </button>
                  </TableCell>
                  <TableCell>
                    {prompt.lastVisibilityScore !== null ? (
                      <span className={`font-medium ${
                        prompt.lastVisibilityScore >= 70 ? 'text-green-600' :
                        prompt.lastVisibilityScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {prompt.lastVisibilityScore}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-polar-500 text-sm">
                    {prompt.lastScanDate
                      ? new Date(prompt.lastScanDate).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/brands/${projectId}/prompts/${prompt.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(prompt)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(prompt.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


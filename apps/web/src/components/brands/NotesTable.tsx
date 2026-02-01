"use client"

import { useState } from "react"
import { MoreHorizontal as DotsThree, Search as MagnifyingGlass, Plus } from "lucide-react"
import { format } from "date-fns"

import type { ProjectNote, NoteStatus } from "@workspace/common/lib/mocks/legacy-project-details"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"

type NotesTableProps = {
    notes: ProjectNote[]
    onAddNote?: () => void
    onEditNote?: (noteId: string) => void
    onDeleteNote?: (noteId: string) => void
    onNoteClick?: (note: ProjectNote) => void
}

export function NotesTable({ notes, onAddNote, onEditNote, onDeleteNote, onNoteClick }: NotesTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedNotes, setSelectedNotes] = useState<string[]>([])

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleSelectAll = () => {
        if (selectedNotes.length === filteredNotes.length) {
            setSelectedNotes([])
        } else {
            setSelectedNotes(filteredNotes.map((note) => note.id))
        }
    }

    const toggleSelectNote = (noteId: string) => {
        setSelectedNotes((prev) =>
            prev.includes(noteId)
                ? prev.filter((id) => id !== noteId)
                : [...prev, noteId]
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button variant="ghost" size="sm" onClick={onAddNote}>
                    <Plus className="h-4 w-4" />
                    Add notes
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        filteredNotes.length > 0 &&
                                        selectedNotes.length === filteredNotes.length
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Added by</TableHead>
                            <TableHead>Added date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNotes.map((note) => (
                            <TableRow key={note.id} className="cursor-pointer" onClick={() => onNoteClick?.(note)}>
                                <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedNotes.includes(note.id)}
                                        onCheckedChange={() => toggleSelectNote(note.id)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{note.title}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {note.addedBy.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(note.addedDate, "d MMM")}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={note.status} />
                                </TableCell>
                                <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            >
                                                <DotsThree className="h-4 w-4 stroke-[3]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEditNote?.(note.id)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDeleteNote?.(note.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: NoteStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "text-xs font-normal capitalize",
                status === "completed"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-yellow-200 bg-yellow-50 text-yellow-700"
            )}
        >
            {status}
        </Badge>
    )
}

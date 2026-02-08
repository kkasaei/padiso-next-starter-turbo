"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Badge } from "@workspace/ui/components/badge"
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Copy, 
  Trash2, 
  Star,
  Bot,
  Loader2,
  FileText,
} from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { AdminPrompt } from "@workspace/db"

type PromptFormData = {
  name: string
  description: string
  prompt: string
  purpose: string
  aiProvider: string
  isMaster: boolean
  isActive: boolean
}

const initialFormData: PromptFormData = {
  name: "",
  description: "",
  prompt: "",
  purpose: "custom",
  aiProvider: "claude",
  isMaster: false,
  isActive: true,
}

const purposeOptions = [
  { value: "master", label: "Master Prompt" },
  { value: "content_creation", label: "Content Creation" },
  { value: "seo_optimization", label: "SEO Optimization" },
  { value: "social_media", label: "Social Media" },
  { value: "blog_writing", label: "Blog Writing" },
  { value: "product_description", label: "Product Description" },
  { value: "email_marketing", label: "Email Marketing" },
  { value: "ad_copy", label: "Ad Copy" },
  { value: "meta_description", label: "Meta Description" },
  { value: "reddit_agent", label: "Reddit Agent" },
  { value: "custom", label: "Custom" },
]

const providerOptions = [
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "gemini", label: "Gemini (Google)" },
  { value: "perplexity", label: "Perplexity" },
  { value: "grok", label: "Grok (X.AI)" },
]

export default function PromptsPage() {
  const { user } = useUser()
  const utils = trpc.useUtils()

  const { data: prompts, isLoading } = trpc.adminPrompts.getAll.useQuery()
  
  const createMutation = trpc.adminPrompts.create.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      toast.success("Prompt created successfully")
    },
    onError: () => {
      toast.error("Failed to create prompt")
    },
  })

  const updateMutation = trpc.adminPrompts.update.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      toast.success("Prompt updated successfully")
    },
    onError: () => {
      toast.error("Failed to update prompt")
    },
  })

  const deleteMutation = trpc.adminPrompts.delete.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      toast.success("Prompt deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const duplicateMutation = trpc.adminPrompts.duplicate.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      toast.success("Prompt duplicated successfully")
    },
    onError: () => {
      toast.error("Failed to duplicate prompt")
    },
  })

  const setMasterMutation = trpc.adminPrompts.setAsMaster.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      utils.adminPrompts.getMaster.invalidate()
      toast.success("Master prompt updated successfully")
    },
    onError: () => {
      toast.error("Failed to set master prompt")
    },
  })

  const toggleActiveMutation = trpc.adminPrompts.toggleActive.useMutation({
    onSuccess: () => {
      utils.adminPrompts.getAll.invalidate()
      toast.success("Prompt status updated")
    },
    onError: () => {
      toast.error("Failed to update prompt status")
    },
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<AdminPrompt | null>(null)
  const [formData, setFormData] = useState<PromptFormData>(initialFormData)

  const openCreateDialog = () => {
    setEditingPrompt(null)
    setFormData(initialFormData)
    setIsDialogOpen(true)
  }

  const openEditDialog = (prompt: AdminPrompt) => {
    setEditingPrompt(prompt)
    setFormData({
      name: prompt.name,
      description: prompt.description ?? "",
      prompt: prompt.prompt,
      purpose: prompt.purpose,
      aiProvider: prompt.aiProvider ?? "claude",
      isMaster: prompt.isMaster,
      isActive: prompt.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingPrompt) {
        await updateMutation.mutateAsync({
          id: editingPrompt.id,
          ...formData,
          updatedByUserId: user?.id,
        })
      } else {
        await createMutation.mutateAsync({
          ...formData,
          createdByUserId: user?.id,
        })
      }
      setIsDialogOpen(false)
      setFormData(initialFormData)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      await deleteMutation.mutateAsync({ id })
    }
  }

  const handleDuplicate = async (id: string) => {
    await duplicateMutation.mutateAsync({ id, createdByUserId: user?.id })
  }

  const handleSetMaster = async (id: string) => {
    if (confirm("Set this as the master prompt? The current master will be deactivated.")) {
      await setMasterMutation.mutateAsync({ id, updatedByUserId: user?.id })
    }
  }

  const handleToggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id, updatedByUserId: user?.id })
  }

  const getPurposeLabel = (purpose: string) => {
    return purposeOptions.find(p => p.value === purpose)?.label ?? purpose
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "claude": return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
      case "openai": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      case "gemini": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Prompts</h1>
            <p className="text-muted-foreground mt-1">
              Manage system-wide AI prompts and templates
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Prompt
          </Button>
        </div>

        {/* Prompts Table */}
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No prompts found. Create your first prompt to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                prompts?.map((prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell>
                      {prompt.isMaster && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{prompt.name}</span>
                        {prompt.description && (
                          <span className="text-sm text-muted-foreground">
                            {prompt.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPurposeLabel(prompt.purpose)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getProviderColor(prompt.aiProvider ?? "claude")}`}>
                        <Bot className="h-3 w-3 mr-1" />
                        {prompt.aiProvider}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={prompt.isActive ? "default" : "secondary"}>
                        {prompt.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {prompt.usageCount ?? 0} uses
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(prompt)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(prompt.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {!prompt.isMaster && (
                            <DropdownMenuItem onClick={() => handleSetMaster(prompt.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              Set as Master
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleActive(prompt.id)}>
                            {prompt.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(prompt.id)}
                            className="text-destructive"
                            disabled={prompt.isMaster}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
              </DialogTitle>
              <DialogDescription>
                {editingPrompt 
                  ? "Update the prompt details below" 
                  : "Create a new AI prompt template for your platform"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g., SEO Blog Article Generator"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this prompt does"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Select 
                    value={formData.purpose} 
                    onValueChange={(v) => setFormData({ ...formData, purpose: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiProvider">AI Provider *</Label>
                  <Select 
                    value={formData.aiProvider} 
                    onValueChange={(v) => setFormData({ ...formData, aiProvider: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Content *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Enter the prompt instructions. Use {{variable}} for dynamic values."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use variables like {`{{topic}}`}, {`{{keywords}}`}, {`{{tone}}`} for dynamic content
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMaster}
                    onChange={(e) => setFormData({ ...formData, isMaster: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Set as Master Prompt</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending || !formData.name || !formData.prompt}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingPrompt ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

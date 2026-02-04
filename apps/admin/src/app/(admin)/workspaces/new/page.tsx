"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Layers,
  User,
  Mail,
  Building,
  Globe,
  Check,
  Loader2,
} from "lucide-react"
import { createWorkspace } from "@/lib/actions/workspaces"
import { toast } from "sonner"

export default function NewWorkspacePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    ownerName: "",
    ownerEmail: "",
    plan: "growth",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      const result = await createWorkspace(formData)
      
      if (result.success) {
        toast.success("Workspace created successfully!")
        router.push("/workspaces")
      } else {
        toast.error(result.error || "Failed to create workspace")
      }
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/workspaces">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create New Workspace</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new client workspace
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            {/* Workspace Details Section */}
            <div className="border-b border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                  <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="font-medium">Workspace Details</h2>
                  <p className="text-sm text-muted-foreground">Basic information about the workspace</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Workspace Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        })
                      }}
                      placeholder="Acme Corporation"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Workspace Slug
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="acme-corp"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    This will be used in URLs and as a unique identifier
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
            <div className="border-b border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-medium">Workspace Owner</h2>
                  <p className="text-sm text-muted-foreground">Primary contact for this workspace</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Owner Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="John Smith"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Owner Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      placeholder="john@acmecorp.com"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    An invitation will be sent to this email
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-medium">Initial Plan</h2>
                  <p className="text-sm text-muted-foreground">Select the starting plan for this workspace</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    id: "growth", 
                    name: "Growth", 
                    price: "$99/mo", 
                    features: ["5 brands", "Unlimited users", "AI tracking", "7-day trial"] 
                  },
                  { 
                    id: "custom", 
                    name: "Custom / Enterprise", 
                    price: "Custom", 
                    features: ["Unlimited brands", "Dedicated support", "Custom features", "No trial"] 
                  },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    disabled={isPending}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      formData.plan === plan.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-lg font-semibold mt-1">{plan.price}</span>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" asChild disabled={isPending}>
              <Link href="/workspaces">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

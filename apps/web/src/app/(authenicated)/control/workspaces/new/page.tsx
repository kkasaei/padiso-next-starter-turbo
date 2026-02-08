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
  Loader2,
  UserPlus,
  X,
  CreditCard,
  Check,
  HelpCircle,
} from "lucide-react"
import { createWorkspace } from "@/lib/admin-actions/workspaces"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion"

export default function NewWorkspacePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    plan: "custom",
  })
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [currentRole, setCurrentRole] = useState<"org:admin" | "org:member">("org:member")
  const [memberRoles, setMemberRoles] = useState<Record<string, "org:admin" | "org:member">>({})
  const [billingDetails, setBillingDetails] = useState({
    stripeCustomerId: "",
    stripeSubscriptionId: "",
  })
  const [slugError, setSlugError] = useState("")
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate slug before submission
    if (slugError) {
      toast.error("Please fix the slug error before submitting")
      return
    }

    const validationError = validateSlug(formData.slug)
    if (validationError) {
      setSlugError(validationError)
      toast.error("Please fix the slug error before submitting")
      return
    }

    startTransition(async () => {
      const result = await createWorkspace({
        ...formData,
        inviteEmails,
        memberRoles,
        stripeCustomerId: billingDetails.stripeCustomerId || undefined,
        stripeSubscriptionId: billingDetails.stripeSubscriptionId || undefined,
      })

      if (result.success) {
        toast.success("Workspace created successfully!")
        router.push("/control/workspaces")
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

  const validateSlug = (slug: string): string | null => {
    if (!slug) return "Slug is required"
    if (slug.length < 3) return "Slug must be at least 3 characters"
    if (slug.length > 50) return "Slug must be less than 50 characters"
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens (no consecutive hyphens)"
    }
    if (slug.startsWith("-") || slug.endsWith("-")) {
      return "Slug cannot start or end with a hyphen"
    }
    return null
  }

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return
    
    const validationError = validateSlug(slug)
    if (validationError) {
      setSlugError(validationError)
      setSlugAvailable(false)
      return
    }

    setIsCheckingSlug(true)
    setSlugError("")
    setSlugAvailable(false)

    try {
      const response = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      
      if (!data.available) {
        setSlugError("This slug is already taken")
        setSlugAvailable(false)
      } else {
        setSlugError("")
        setSlugAvailable(true)
      }
    } catch (error) {
      console.error("Error checking slug:", error)
      setSlugError("Failed to check slug availability")
      setSlugAvailable(false)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  const handleSlugChange = (newSlug: string) => {
    const sanitized = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setFormData({ ...formData, slug: sanitized })
    setSlugAvailable(false)
    
    const validationError = validateSlug(sanitized)
    if (validationError) {
      setSlugError(validationError)
    } else {
      setSlugError("")
    }
  }

  const handleSlugBlur = () => {
    if (formData.slug) {
      checkSlugAvailability(formData.slug)
    }
  }

  const handleAddEmail = () => {
    const email = currentEmail.trim()
    if (email && email.includes("@") && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email])
      setMemberRoles({ ...memberRoles, [email]: currentRole })
      setCurrentEmail("")
      setCurrentRole("org:member") // Reset to default
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter(email => email !== emailToRemove))
    const newRoles = { ...memberRoles }
    delete newRoles[emailToRemove]
    setMemberRoles(newRoles)
  }

  const handleRoleChange = (email: string, role: "org:admin" | "org:member") => {
    setMemberRoles({ ...memberRoles, [email]: role })
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/control/workspaces">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create a Custom Workspace</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new enterprise client workspace
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-8 items-start">
          {/* Left Column - Form */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
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
                      onChange={(e) => handleSlugChange(e.target.value)}
                      onBlur={handleSlugBlur}
                      placeholder="acme-corp"
                      className={`w-full rounded-lg border ${slugError ? 'border-destructive' : slugAvailable ? 'border-green-500' : 'border-border'} bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 ${slugError ? 'focus:ring-destructive' : slugAvailable ? 'focus:ring-green-500' : 'focus:ring-ring'}`}
                      required
                      disabled={isPending}
                    />
                    {isCheckingSlug && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {!isCheckingSlug && slugAvailable && !slugError && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {slugError ? (
                    <p className="text-xs text-destructive mt-1.5">{slugError}</p>
                  ) : slugAvailable ? (
                    <p className="text-xs text-green-600 mt-1.5">This slug is available!</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      This will be used in URLs and as a unique identifier (lowercase letters, numbers, and hyphens only)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Invite Members Section */}
            <div className="border-b border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                  <UserPlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="font-medium">Invite Team Members</h2>
                  <p className="text-sm text-muted-foreground">Add team members who will have access to this workspace</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Team Member Email
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        placeholder="teammate@example.com"
                        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={isPending}
                      />
                    </div>
                    <select
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value as "org:admin" | "org:member")}
                      className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isPending}
                    >
                      <option value="org:member">Member</option>
                      <option value="org:admin">Admin</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddEmail}
                      disabled={isPending || !currentEmail.trim() || !currentEmail.includes("@")}
                      className="h-[42px] px-4"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Press Enter or click Add to invite team members. You can add as many as needed (optional)
                  </p>
                </div>

                {inviteEmails.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Invited Members ({inviteEmails.length})
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {inviteEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
                        >
                          <span className="text-sm truncate mr-2">{email}</span>
                          <div className="flex items-center gap-2">
                            <select
                              value={memberRoles[email] || "org:member"}
                              onChange={(e) => handleRoleChange(email, e.target.value as "org:admin" | "org:member")}
                              className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              disabled={isPending}
                            >
                              <option value="org:member">Member</option>
                              <option value="org:admin">Admin</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              disabled={isPending}
                              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Details Section */}
            <div className="px-6 md:px-8 py-6 md:py-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="billing" className="border-b-0">
                  <AccordionTrigger className="py-0 px-0 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
                        <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="text-left flex-1">
                        <h2 className="font-medium">Billing Details (Optional)</h2>
                        <p className="text-sm text-muted-foreground">Link existing Stripe customer and subscription</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-6 px-0">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Stripe Customer ID
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={billingDetails.stripeCustomerId}
                            onChange={(e) => setBillingDetails({ ...billingDetails, stripeCustomerId: e.target.value })}
                            placeholder="cus_xxxxxxxxxxxxx"
                            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={isPending}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Optional - You can add this after creating the workspace
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Stripe Subscription ID
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={billingDetails.stripeSubscriptionId}
                            onChange={(e) => setBillingDetails({ ...billingDetails, stripeSubscriptionId: e.target.value })}
                            placeholder="sub_xxxxxxxxxxxxx"
                            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={isPending}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Optional - You can add this after creating the workspace
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" asChild disabled={isPending}>
              <Link href="/control/workspaces">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending || !!slugError}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Custom Workspace"
              )}
            </Button>
          </div>
        </form>

        {/* Right Column - Help & Guidance */}
        <div className="hidden lg:block w-80 shrink-0 space-y-6 sticky top-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Quick Guide
          </h3>
          
          <div className="space-y-6 text-sm">
            {/* Workspace Details */}
            <div>
              <h4 className="font-medium mb-2 text-foreground">Workspace Details</h4>
              <p className="text-muted-foreground leading-relaxed">
                Choose a clear name for your client's workspace. The slug will be used in URLs and must be unique across all workspaces.
              </p>
            </div>

            {/* Team Members */}
            <div>
              <h4 className="font-medium mb-2 text-foreground">Invite Team Members</h4>
              <p className="text-muted-foreground leading-relaxed">
                Add team member emails who should have access. They'll receive invitations via email and can join as members (not admins).
              </p>
            </div>

            {/* Billing Details */}
            <div>
              <h4 className="font-medium mb-2 text-foreground">Billing Details (Optional)</h4>
              <p className="text-muted-foreground leading-relaxed">
                Link existing Stripe customer and subscription IDs if available. This is optional and can be added later from the workspace settings.
              </p>
            </div>

            {/* Tips */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium mb-2 text-foreground">Tips</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>All workspaces are created on the Custom plan with unlimited resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Team member invitations are sent automatically via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>You can manage billing and team members later from workspace settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="rounded-2xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold mb-2 text-sm">Need Help?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Contact the admin team if you encounter any issues or need assistance with workspace setup.
          </p>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}

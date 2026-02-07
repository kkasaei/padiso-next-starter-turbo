"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  Search,
  Check,
  MoreHorizontal,
  Settings,
  Plus,
  ChevronDown,
} from "lucide-react"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { cn } from "@workspace/common/lib"
import { routes } from "@workspace/common"
import { useSubscriptionStatus } from "@/hooks/use-subscription"

type WorkspaceSwitcherProps = {
  expanded?: boolean
}

export function WorkspaceSwitcher({ expanded }: WorkspaceSwitcherProps) {
  const router = useRouter()
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)
  const [search, setSearch] = useState("")
  const prevOrgIdRef = useRef<string | null>(null)

  const { organization: activeOrg } = useOrganization()
  const { data: subscription } = useSubscriptionStatus(activeOrg?.id)
  const planName = subscription?.planName ?? subscription?.plan?.name ?? "Growth"

  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      pageSize: 50,
    },
  })

  // Revalidate membership list when active organization changes
  // This ensures newly created workspaces appear in the list
  useEffect(() => {
    if (activeOrg?.id && activeOrg.id !== prevOrgIdRef.current) {
      prevOrgIdRef.current = activeOrg.id
      // Revalidate the membership list to include new workspaces
      userMemberships.revalidate?.()
    }
  }, [activeOrg?.id, userMemberships])

  const filteredOrgs = userMemberships.data?.filter((membership) =>
    membership.organization.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleOrgSwitch = async (orgId: string) => {
    await setActive?.({ organization: orgId })
    setOrgSwitcherOpen(false)
    // Navigate to dashboard — the BrandAccessGuard will handle
    // redirecting to the first brand or showing the welcome modal
    router.push(routes.dashboard.Home)
  }

  const handleCreateOrg = () => {
    setOrgSwitcherOpen(false)
    router.push(routes.dashboard.WorkspaceSetup)
  }

  return (
      <Popover open={orgSwitcherOpen} onOpenChange={setOrgSwitcherOpen}>
        <PopoverTrigger asChild>
          <button 
            className={cn(
              "flex items-center gap-3 hover:opacity-90 transition-all",
              expanded && "w-full rounded-xl border border-border px-2 py-1.5 hover:bg-accent/40"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold overflow-hidden",
                !activeOrg?.imageUrl && "bg-primary text-primary-foreground shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)]"
              )}
            >
              {activeOrg?.imageUrl ? (
                <img
                  src={activeOrg.imageUrl}
                  alt={activeOrg.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                activeOrg?.name?.charAt(0).toUpperCase() ?? "W"
              )}
            </div>
            {expanded && (
              <>
                <div className="flex flex-1 flex-col min-w-0 text-left">
                  <span className="text-sm font-semibold truncate">
                    {activeOrg?.name ?? "Workspace"}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {planName} plan
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[240px] p-0 rounded-xl shadow-lg"
          align="start"
          side={expanded ? "bottom" : "right"}
          sideOffset={expanded ? 8 : 12}
        >
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm border-0 bg-muted/50 focus-visible:ring-0"
              />
            </div>
          </div>

          <Separator />

          {/* Organization List */}
          <div className="p-1 max-h-[200px] overflow-auto">
            {userMemberships.isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : filteredOrgs.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No workspaces found
              </div>
            ) : (
              filteredOrgs.map((membership) => {
                const org = membership.organization
                const isActive = org.id === activeOrg?.id

                return (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSwitch(org.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent",
                      isActive && "bg-accent/50"
                    )}
                  >
                    <div 
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold overflow-hidden",
                        !org.imageUrl && "bg-primary text-primary-foreground"
                      )}
                    >
                      {org.imageUrl ? (
                        <img
                          src={org.imageUrl}
                          alt={org.name}
                          className="h-6 w-6 rounded-md object-cover"
                        />
                      ) : (
                        org.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="flex-1 text-left truncate">{org.name}</span>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                    )}
                  </button>
                )
              })
            )}

            {/* All Workspaces */}
            <button
              onClick={() => {
                setOrgSwitcherOpen(false)
                router.push(routes.dashboard.Workspaces)
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <MoreHorizontal className="h-6 w-6 text-muted-foreground" strokeWidth={3} />
              <span>All workspaces</span>
            </button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="p-1">
            <button
              onClick={() => {
                setOrgSwitcherOpen(false)
                window.location.href = routes.dashboard.Settings
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Workspace settings</span>
            </button>

            <button
              onClick={handleCreateOrg}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span>Add workspace</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
  )
}


"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  Search,
  Check,
  MoreHorizontal,
  Settings,
  Plus,
} from "lucide-react"
import { useOrganization, useOrganizationList, CreateOrganization } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { routes } from "@/routes"

export function WorkspaceSwitcher() {
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)
  const [createOrgOpen, setCreateOrgOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { organization: activeOrg } = useOrganization()
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      pageSize: 50,
    },
  })

  const filteredOrgs = userMemberships.data?.filter((membership) =>
    membership.organization.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  console.log(userMemberships.data)

  const handleOrgSwitch = async (orgId: string) => {
    await setActive?.({ organization: orgId })
    setOrgSwitcherOpen(false)
  }

  const handleCreateOrg = () => {
    setOrgSwitcherOpen(false)
    setCreateOrgOpen(true)
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Popover open={orgSwitcherOpen} onOpenChange={setOrgSwitcherOpen}>
        <PopoverTrigger asChild>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity">
            {activeOrg?.imageUrl ? (
              <img
                src={activeOrg.imageUrl}
                alt={activeOrg.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              activeOrg?.name?.charAt(0).toUpperCase() ?? "W"
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[240px] p-0 rounded-xl shadow-lg"
          align="start"
          side="right"
          sideOffset={12}
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
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
              onClick={() => setOrgSwitcherOpen(false)}
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

      {/* Create Organization Dialog */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent className="p-0 w-[432px] max-w-[432px] border-0 gap-0 [&>button]:hidden">
          <CreateOrganization 
            afterCreateOrganizationUrl={routes.dashboard.Home}
            skipInvitationScreen={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { SidebarHeader } from "@workspace/ui/components/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { 
  ChevronsUpDown, 
  Search, 
  Check, 
  MoreHorizontal, 
  Settings, 
  Plus 
} from "lucide-react"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function SidebarHeaderContent() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  
  const { organization: activeOrg } = useOrganization()
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  const filteredOrgs = userMemberships.data?.filter((membership) =>
    membership.organization.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleOrgSwitch = async (orgId: string) => {
    await setActive?.({ organization: orgId })
    setOpen(false)
  }

  return (
    <SidebarHeader className="p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center justify-between rounded-lg hover:bg-accent/50 transition-colors p-1 -m-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-[inset_0_-5px_6.6px_0_rgba(0,0,0,0.25)]">
                {activeOrg?.imageUrl ? (
                  <img 
                    src={activeOrg.imageUrl} 
                    alt={activeOrg.name} 
                    className="h-8 w-8 rounded-lg object-cover" 
                  />
                ) : (
                  activeOrg?.name?.charAt(0).toUpperCase() ?? "W"
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {activeOrg?.name ?? "Workspace"}
                </span>
                <span className="text-xs text-muted-foreground">Pro plan</span>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-[240px] p-0 rounded-xl shadow-lg" 
          align="start" 
          sideOffset={8}
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
          <div className="p-1">
            {!isLoaded ? (
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-xs font-semibold">
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
                      <Check className="h-4 w-4 text-blue-600" strokeWidth={3} />
                    )}
                  </button>
                )
              })
            )}

            {/* All Workspaces */}
            <button
              onClick={() => setOpen(false)}
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
                setOpen(false)
                window.location.href = `/organization/${activeOrg?.slug ?? "settings"}`
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Workspace settings</span>
            </button>
            
            <button
              onClick={() => {
                setOpen(false)
                window.location.href = "/create-organization"
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span>Add workspace</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </SidebarHeader>
  )
}

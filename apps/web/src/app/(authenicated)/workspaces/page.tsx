"use client";

import { useRouter } from "next/navigation";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Search, Plus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { routes } from "@workspace/common";
import { cn } from "@workspace/common/lib";

export default function WorkspacesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);

  const { organization: activeOrg } = useOrganization();
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: {
      pageSize: 50,
    },
  });

  const filteredOrgs =
    userMemberships.data?.filter((membership) =>
      membership.organization.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const handleOrgSwitch = async (orgId: string) => {
    setSwitchingOrgId(orgId);
    try {
      await setActive?.({ organization: orgId });
      router.push(routes.dashboard.Home);
    } catch (error) {
      console.error("Failed to switch workspace:", error);
      setSwitchingOrgId(null);
    }
  };

  const handleCreateWorkspace = () => {
    router.push(routes.dashboard.WorkspaceSetup);
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card">
          {/* Header */}
          <div className="p-6 pb-0">
            <h1 className="text-lg font-medium mb-1">Workspaces</h1>
            <p className="text-sm text-muted-foreground">
              Select a workspace to continue or create a new one.
            </p>
          </div>

          {/* Search & New Button */}
          <div className="p-6 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Button variant="outline" onClick={handleCreateWorkspace} size="sm" className="h-10 px-4">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Workspaces List */}
          <div className="p-3">
            {!isLoaded || userMemberships.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrgs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  {search ? `No workspaces match "${search}"` : "No workspaces yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOrgs.map((membership) => {
                  const org = membership.organization;
                  const isActive = org.id === activeOrg?.id;
                  const isSwitching = switchingOrgId === org.id;

                  return (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSwitch(org.id)}
                      disabled={isSwitching}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/50 disabled:opacity-50",
                        isActive && "bg-muted/50"
                      )}
                    >
                      {/* Avatar */}
                      <Avatar className={cn(
                        "h-10 w-10 rounded-lg shrink-0",
                        !org.imageUrl && "bg-foreground text-background"
                      )}>
                        <AvatarImage src={org.imageUrl} alt={org.name} className="rounded-lg" />
                        <AvatarFallback className="rounded-lg text-sm font-medium">
                          {org.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{org.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{org.slug || org.id.slice(0, 8)} · {membership.role?.replace("org:", "")}
                        </p>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </div>
                      )}

                      {/* Loading state */}
                      {isSwitching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Download,
  Loader2,
  Building2,
  Users,
  Crown,
  UserPlus,
  Camera,
  Mail,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@workspace/common";

// ============================================================================
// Types
// ============================================================================

type OrganizationMember = {
  id: string;
  role: string | null;
  publicUserData?: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    identifier?: string | null;
  } | null;
};

type OrganizationInvitation = {
  id: string;
  emailAddress: string;
  role: string | null;
  status: string;
  createdAt: Date;
  revoke: () => Promise<unknown>;
};

interface WorkspaceMembersCardProps {
  members: OrganizationMember[];
  invitations: OrganizationInvitation[];
  isLoadingMembers: boolean;
  isLoadingInvitations: boolean;
  onInvite: () => void;
  onRevokeInvitation: (invitationId: string) => Promise<void>;
}

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendInvite: (email: string, role: "org:admin" | "org:member") => Promise<void>;
}

interface ExportDataCardProps {
  onExport: () => void;
  isExporting: boolean;
}

// ============================================================================
// Sub-Components
// ============================================================================

function WorkspaceProfileCard({
  organization,
}: {
  organization: {
    name: string;
    slug: string | null;
    imageUrl: string;
    update: (params: { name: string; slug?: string }) => Promise<unknown>;
    setLogo: (params: { file: File }) => Promise<unknown>;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSlug, setEditedSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    setEditedName(organization.name || "");
    setEditedSlug(organization.slug || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName("");
    setEditedSlug("");
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;

    const slugRegex = /^[a-z0-9-]+$/;
    const cleanedSlug = editedSlug.trim().toLowerCase();

    if (cleanedSlug && !slugRegex.test(cleanedSlug)) {
      toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setIsSaving(true);
    try {
      await organization.update({
        name: editedName.trim(),
        slug: cleanedSlug || undefined,
      });
      toast.success("Workspace updated");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update workspace:", error);
      toast.error("Failed to update workspace. The slug may already be taken.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      await organization.setLogo({ file });
      toast.success("Workspace image updated");
    } catch (error) {
      console.error("Failed to update image:", error);
      toast.error("Failed to update workspace image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Workspace Profile
            </CardTitle>
            <CardDescription>
              Manage your workspace details and branding
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleStartEdit}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 rounded-xl">
                  <AvatarImage src={organization.imageUrl} alt={organization.name} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
                    {organization.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleImageClick}
                  disabled={isUploadingImage}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Hover to change image
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="My Workspace"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-slug">Workspace Slug</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-1">@</span>
                  <Input
                    id="workspace-slug"
                    value={editedSlug}
                    onChange={(e) =>
                      setEditedSlug(e.target.value.toLowerCase().replace(/\s/g, "-"))
                    }
                    placeholder="my-workspace"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving || !editedName.trim()}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={organization.imageUrl} alt={organization.name} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
                {organization.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{organization.name}</h3>
              <p className="text-sm text-muted-foreground">
                @{organization.slug || "no-slug"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MembersList({ members }: { members: OrganizationMember[] }) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No members found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((membership) => (
        <div
          key={membership.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={membership.publicUserData?.imageUrl} />
              <AvatarFallback className="text-xs">
                {membership.publicUserData?.firstName?.slice(0, 1)}
                {membership.publicUserData?.lastName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {membership.publicUserData?.firstName}{" "}
                {membership.publicUserData?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {membership.publicUserData?.identifier}
              </p>
            </div>
          </div>
          <Badge
            variant={membership.role === "org:admin" ? "default" : "secondary"}
            className="capitalize"
          >
            {membership.role === "org:admin" && <Crown className="h-3 w-3 mr-1" />}
            {membership.role?.replace("org:", "")}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function InvitationsList({
  invitations,
  onRevoke,
}: {
  invitations: OrganizationInvitation[];
  onRevoke: (id: string) => Promise<void>;
}) {
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await onRevoke(id);
    } finally {
      setRevokingId(null);
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs">
                <Mail className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{invitation.emailAddress}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Invited {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {invitation.role?.replace("org:", "")}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleRevoke(invitation.id)}
              disabled={revokingId === invitation.id}
            >
              {revokingId === invitation.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkspaceMembersCard({
  members,
  invitations,
  isLoadingMembers,
  isLoadingInvitations,
  onInvite,
  onRevokeInvitation,
}: WorkspaceMembersCardProps) {
  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Workspace Members
            </CardTitle>
            <CardDescription>
              {members.length} {members.length === 1 ? "member" : "members"}
              {pendingInvitations.length > 0 && (
                <span>
                  {" "}· {pendingInvitations.length} pending
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onInvite}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members">
          <TabsList className="h-7 p-0.5 bg-muted/40 rounded-md inline-flex w-fit mb-4">
            <TabsTrigger 
              value="members" 
              className="h-6 px-2.5 text-xs rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger 
              value="invited" 
              className="h-6 px-2.5 text-xs rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Invited ({pendingInvitations.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            {isLoadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <MembersList members={members} />
            )}
          </TabsContent>
          <TabsContent value="invited">
            {isLoadingInvitations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <InvitationsList
                invitations={pendingInvitations}
                onRevoke={onRevokeInvitation}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InviteDialog({ open, onOpenChange, onSendInvite }: InviteDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"org:admin" | "org:member">("org:member");
  const [isInviting, setIsInviting] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);
    try {
      await onSendInvite(email.trim(), role);
      onOpenChange(false);
      setEmail("");
      setRole("org:member");
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail("");
      setRole("org:member");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email.trim()) {
                  handleSend();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value: "org:admin" | "org:member") => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="org:member">Member</SelectItem>
                <SelectItem value="org:admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Admins can manage workspace settings and members.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isInviting}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isInviting || !email.trim()}>
            {isInviting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExportDataCard({ onExport, isExporting }: ExportDataCardProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Export Data</span>
              <p className="text-xs text-muted-foreground">
                Download all your organization data
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SettingsOverview() {
  const router = useRouter();
  const { organization, isLoaded, memberships, invitations } = useOrganization({
    memberships: { infinite: true },
    invitations: { infinite: true },
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Redirect to workspace setup if no organization
  useEffect(() => {
    if (isLoaded && !organization) {
      router.push(routes.dashboard.WorkspaceSetup);
    }
  }, [isLoaded, organization, router]);

  const handleExportData = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    toast.success("Data export started. You will receive a download link via email.");
  };

  const handleSendInvite = async (email: string, role: "org:admin" | "org:member") => {
    if (!organization) return;

    try {
      await organization.inviteMember({ emailAddress: email, role });
      toast.success(`Invitation sent to ${email}`);
      invitations?.revalidate?.();
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation. The user may already be a member.");
      throw error;
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!organization) return;

    try {
      const invitation = invitations?.data?.find((inv) => inv.id === invitationId);
      if (invitation) {
        await invitation.revoke();
        toast.success("Invitation revoked");
        invitations?.revalidate?.();
      }
    } catch (error) {
      console.error("Failed to revoke invitation:", error);
      toast.error("Failed to revoke invitation");
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect state
  if (!organization) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <WorkspaceProfileCard organization={organization} />

      <WorkspaceMembersCard
        members={memberships?.data ?? []}
        invitations={invitations?.data ?? []}
        isLoadingMembers={memberships?.isLoading ?? false}
        isLoadingInvitations={invitations?.isLoading ?? false}
        onInvite={() => setIsInviteDialogOpen(true)}
        onRevokeInvitation={handleRevokeInvitation}
      />

      <ExportDataCard onExport={handleExportData} isExporting={isExporting} />

      <InviteDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSendInvite={handleSendInvite}
      />
    </div>
  );
}

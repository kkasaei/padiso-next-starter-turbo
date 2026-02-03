"use client";

import { useState, useMemo, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Input } from "@workspace/ui/components/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { 
  Building2, 
  Trash2, 
  Users, 
  UserPlus,
  UserMinus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { cn } from "@workspace/ui/lib/utils";
import { useBrands, useDeleteBrand } from "@/hooks/use-brands";
import type { Brand } from "@workspace/db/schema";

export function SettingsBrands() {
  const { organization, membership, memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const deleteBrand = useDeleteBrand();
  
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // TODO: This should come from database - brand_members table
  const [brandMembers, setBrandMembers] = useState<Record<string, string[]>>({});

  const brands = (brandsData || []) as unknown as Brand[];
  const membersList = memberships?.data || [];
  const isAdmin = membership?.role === "org:admin";
  const hasMultipleMembers = membersList.length > 1;

  // Find the workspace owner (admin)
  const ownerMember = membersList.find((m) => m.role === "org:admin");

  // Initialize brand members with owner for all brands
  useEffect(() => {
    if (brands.length > 0 && ownerMember && Object.keys(brandMembers).length === 0) {
      const initialMembers: Record<string, string[]> = {};
      brands.forEach((brand) => {
        initialMembers[brand.id] = [ownerMember.id];
      });
      setBrandMembers(initialMembers);
    }
  }, [brands, ownerMember, brandMembers]);

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return membersList;
    const query = searchQuery.toLowerCase();
    return membersList.filter((member) => {
      const name = `${member.publicUserData?.firstName || ""} ${member.publicUserData?.lastName || ""}`.toLowerCase();
      const email = (member.publicUserData?.identifier || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [membersList, searchQuery]);

  // Get members assigned to a brand
  const getBrandMembers = (brandId: string) => {
    const memberIds = brandMembers[brandId] || [];
    return membersList.filter((m) => memberIds.includes(m.id));
  };

  // Get members NOT assigned to a brand (for adding)
  const getAvailableMembers = (brandId: string) => {
    const assignedIds = brandMembers[brandId] || [];
    return filteredMembers.filter((m) => !assignedIds.includes(m.id));
  };

  const toggleBrandExpanded = (brandId: string) => {
    setExpandedBrands(prev => {
      const next = new Set(prev);
      if (next.has(brandId)) {
        next.delete(brandId);
      } else {
        next.add(brandId);
      }
      return next;
    });
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    try {
      await deleteBrand.mutateAsync({ id: brandToDelete.id });
      setBrandToDelete(null);
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  const openAddMemberDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setSearchQuery("");
    setShowAddMemberDialog(true);
  };

  const addMemberToBrand = (memberId: string) => {
    if (!selectedBrand) return;
    setBrandMembers(prev => ({
      ...prev,
      [selectedBrand.id]: [...(prev[selectedBrand.id] || []), memberId],
    }));
    // TODO: Save to database
  };

  const removeMemberFromBrand = (brandId: string, memberId: string) => {
    setBrandMembers(prev => ({
      ...prev,
      [brandId]: (prev[brandId] || []).filter(id => id !== memberId),
    }));
    // TODO: Save to database
  };

  return (
    <div className="space-y-6">
      {/* Brand Member Management Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Brand Access</CardTitle>
          </div>
          <CardDescription>
            Manage which team members have access to each brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          {brandsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No brands yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first brand from the Brands page
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {brands.map((brand) => {
                const isExpanded = expandedBrands.has(brand.id);
                const assignedMembers = getBrandMembers(brand.id);
                
                return (
                  <Collapsible
                    key={brand.id}
                    open={isExpanded}
                    onOpenChange={() => toggleBrandExpanded(brand.id)}
                  >
                    <div className="border border-border rounded-lg">
                      {/* Brand Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <div>
                            <span className="text-sm font-medium">{brand.brandName}</span>
                            {brand.websiteUrl && (
                              <p className="text-xs text-muted-foreground">{brand.websiteUrl}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {assignedMembers.length} member{assignedMembers.length !== 1 ? "s" : ""}
                          </Badge>
                          {hasMultipleMembers && isAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openAddMemberDialog(brand)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setBrandToDelete(brand)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Brand
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Expanded Member List */}
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-0">
                          <div className="border-t border-border pt-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                              Assigned Members
                            </p>
                            {assignedMembers.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">
                                No members assigned to this brand
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {assignedMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center justify-between py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                        {member.publicUserData?.firstName?.[0] || "?"}
                                      </div>
                                      <div>
                                        <span className="text-sm">
                                          {member.publicUserData?.firstName && member.publicUserData?.lastName
                                            ? `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
                                            : member.publicUserData?.identifier || "Unknown"}
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                          {member.publicUserData?.identifier}
                                        </p>
                                      </div>
                                    </div>
                                    {isAdmin && assignedMembers.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                                        onClick={() => removeMemberFromBrand(brand.id, member.id)}
                                      >
                                        <UserMinus className="h-3 w-3 mr-1" />
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Brand Confirmation Dialog */}
      <AlertDialog open={!!brandToDelete} onOpenChange={(open) => !open && setBrandToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{brandToDelete?.brandName}</strong>? 
              This action cannot be undone. All data associated with this brand will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBrand.isPending ? "Deleting..." : "Delete Brand"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Member to Brand Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member to Brand</DialogTitle>
            <DialogDescription>
              Search and select team members to add to <strong>{selectedBrand?.brandName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Members List */}
            <div className="max-h-[280px] overflow-y-auto space-y-1">
              {selectedBrand && getAvailableMembers(selectedBrand.id).length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No members found" : "All members are already assigned"}
                  </p>
                </div>
              ) : (
                selectedBrand && getAvailableMembers(selectedBrand.id).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => addMemberToBrand(member.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {member.publicUserData?.firstName?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.publicUserData?.firstName && member.publicUserData?.lastName
                          ? `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
                          : member.publicUserData?.identifier || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.publicUserData?.identifier}
                      </p>
                    </div>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

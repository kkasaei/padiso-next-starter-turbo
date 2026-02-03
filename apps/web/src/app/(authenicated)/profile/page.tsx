"use client";

import { useUser } from "@clerk/nextjs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Label } from "@workspace/ui/components/label";
import { Loader2, Mail, Calendar, Shield, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Initialize form values when user loads
  if (isLoaded && user && !firstName && !lastName) {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
  }

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManageAccount = () => {
    // Open Clerk's user profile modal or redirect to account management
    if (user) {
      window.open("https://accounts.clerk.dev/user", "_blank");
    }
  };

  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card">
          {/* Header */}
          <div className="p-6 pb-0">
            <h1 className="text-lg font-medium mb-1">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </div>

          {!isLoaded ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <>
              {/* Avatar Section */}
              <div className="p-6 flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} className="rounded-xl" />
                  <AvatarFallback className="rounded-xl text-lg font-medium bg-foreground text-background">
                    {user.firstName?.charAt(0) || user.primaryEmailAddress?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{user.fullName || "User"}</p>
                  <p className="text-sm text-muted-foreground truncate">{primaryEmail}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Form */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-border bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{primaryEmail}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email can be changed in account settings
                  </p>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleUpdateProfile} 
                  disabled={isUpdating}
                  className="w-full rounded-full"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Account Info */}
              <div className="p-6 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Account Info</p>
                
                <div className="space-y-2">
                  {createdAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
                    </div>
                  )}
                  {user.twoFactorEnabled && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Shield className="h-4 w-4" />
                      <span>Two-factor authentication enabled</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleManageAccount}
                  className="w-full rounded-full mt-4"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Account Settings
                </Button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>Unable to load user information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

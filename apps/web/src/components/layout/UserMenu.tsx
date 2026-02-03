"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { LogOut, Settings, User, Map, History, Headphones, Send } from "lucide-react"
import { footerItems, type SidebarFooterItemId } from "@workspace/common"

const footerItemIcons: Record<SidebarFooterItemId, React.ComponentType<{ className?: string }>> = {
  roadmap: Map,
  changelog: History,
  support: Headphones,
  feedbacks: Send,
}

type UserMenuProps = {
  variant?: "full" | "compact"
  className?: string
}

export function UserMenu({ variant = "full", className }: UserMenuProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const contentSide = variant === "compact" ? "right" : "top"
  const contentOffset = variant === "compact" ? 12 : 5

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "compact" ? (
          <button
            className={`rounded-full ring-2 ring-transparent hover:ring-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className ?? ""}`}
            aria-label="User menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <button
            className={`mt-2 flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className ?? ""}`}
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col min-w-0">
              <span className="text-sm font-medium truncate">{user?.fullName}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.emailAddresses[0]?.emailAddress ?? "No email"}
              </span>
            </div>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={contentSide}
        className="w-56"
        sideOffset={contentOffset}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress ?? "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {footerItems.map((item) => {
          const Icon = footerItemIcons[item.id]
          return (
            <DropdownMenuItem 
              key={item.label} 
              onClick={() => item.href && window.open(item.href, "_blank")}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/common/lib"
import { isNavItemActive } from "@workspace/common/lib"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { workspaceSidebarNavItems } from "@workspace/common"
import { UserMenu } from "./UserMenu"
import {
  LifeBuoyIcon,
  Gift,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  PanelLeftClose,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Sidebar item – icon-only when collapsed, icon + label when open   */
/* ------------------------------------------------------------------ */

function SidebarItem({
  icon: Icon,
  label,
  expanded,
  href,
  onClick,
  disabled,
  isActive,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  expanded: boolean
  href?: string
  onClick?: () => void
  disabled?: boolean
  isActive?: boolean
}) {
  const classes = cn(
    "flex items-center rounded-lg transition-colors",
    expanded ? "h-10 gap-3 px-3 w-full" : "h-10 w-10 justify-center",
    disabled
      ? "text-muted-foreground/50 cursor-not-allowed"
      : isActive
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
  )

  const inner = (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </>
  )

  const element = href ? (
    <Link href={href} className={classes} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  )

  if (expanded) return element

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------------------------------------------ */
/*  Main workspace sidebar                                             */
/* ------------------------------------------------------------------ */

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  /* Hover handlers — small delay on leave to prevent flicker */
  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setExpanded(true)
  }

  const close = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setExpanded(false), 300)
  }

  const collapse = () => setExpanded(false)

  /* Theme helpers */
  const cycleTheme = () => {
    if (theme === "system") setTheme("light")
    else if (theme === "light") setTheme("dark")
    else setTheme("system")
  }

  const ThemeIcon =
    !mounted || theme === "light"
      ? SunIcon
      : theme === "dark"
        ? MoonIcon
        : MonitorIcon

  const themeLabel =
    !mounted
      ? "Theme"
      : theme === "light"
        ? "Light mode"
        : theme === "dark"
          ? "Dark mode"
          : "System theme"

  return (
    <TooltipProvider delayDuration={0}>
      {/* Layout spacer — keeps main content width stable */}
      <div className="w-20 shrink-0" />

      {/* Click-away overlay (invisible, just catches clicks) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={collapse}
            className="fixed inset-0 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel — fixed, overlays content when expanded */}
      <motion.div
        onMouseEnter={open}
        onMouseLeave={close}
        animate={{ width: expanded ? 240 : 80 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col bg-sidebar z-40 overflow-hidden",
          expanded && "shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]"
        )}
      >
        {/* -------- Header: workspace switcher + collapse button -------- */}
        <div className="flex items-center gap-2 p-4">
          <WorkspaceSwitcher expanded={expanded} />
          <AnimatePresence>
            {expanded && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={collapse}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                <PanelLeftClose className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* -------- Navigation -------- */}
        <nav
          className={cn(
            "flex flex-col gap-1 p-2",
            !expanded && "items-center"
          )}
        >
          {workspaceSidebarNavItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              expanded={expanded}
              isActive={isNavItemActive(item.href, pathname)}
              onClick={collapse}
            />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* -------- Footer: theme / docs / referral -------- */}
        <div
          className={cn(
            "flex flex-col gap-1 p-2",
            !expanded && "items-center"
          )}
        >
          <SidebarItem
            icon={ThemeIcon}
            label={themeLabel}
            expanded={expanded}
            onClick={cycleTheme}
          />
          <SidebarItem
            icon={LifeBuoyIcon}
            label="Docs"
            expanded={expanded}
            href="/docs"
            onClick={collapse}
          />
          <SidebarItem
            icon={Gift}
            label="Referral — Coming Soon"
            expanded={expanded}
            disabled
          />
        </div>

        {/* -------- User menu -------- */}
        <div
          className={cn(
            "flex items-center p-4",
            !expanded && "justify-center"
          )}
        >
          <UserMenu variant={expanded ? "full" : "compact"} />
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

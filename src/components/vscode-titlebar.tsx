"use client"

import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { isTauri } from "@/lib/tauri"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TerminalIcon as Terminal,
  SearchIcon as Search,
  SunIcon as Sun,
  MoonIcon as Moon,
  InfoIcon as Info,
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
  MinusIcon as Minus,
  SquareIcon as Square,
  XIcon as X,
  PanelLeftCloseIcon as PanelLeftClose,
  PanelLeftIcon as PanelLeft,
  GitBranchIcon as Github,
  GlobeIcon as Globe
} from "lucide-react"

interface VSCodeTitleBarProps {
  onOpenCommandPalette: () => void
}

export function VSCodeTitleBar({ onOpenCommandPalette }: VSCodeTitleBarProps) {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar, state } = useSidebar()
  const [isMaximized, setIsMaximized] = React.useState(false)

  // Native Tauri Window handlers
  const handleMinimize = async () => {
    if (isTauri()) {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        await getCurrentWindow().minimize()
      } catch (err) {
        console.error("Failed to minimize window:", err)
      }
    } else {
      toast.info("Minimize is only supported in desktop app mode")
    }
  }

  const handleMaximize = async () => {
    if (isTauri()) {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        const win = getCurrentWindow()
        const maximized = await win.isMaximized()
        if (maximized) {
          await win.unmaximize()
          setIsMaximized(false)
        } else {
          await win.maximize()
          setIsMaximized(true)
        }
      } catch (err) {
        console.error("Failed to toggle maximize window:", err)
      }
    } else {
      toast.info("Maximize is only supported in desktop app mode")
      setIsMaximized(!isMaximized)
    }
  }

  const handleClose = async () => {
    if (isTauri()) {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        await getCurrentWindow().close()
      } catch (err) {
        console.error("Failed to close window:", err)
      }
    } else {
      toast.info("Close is only supported in desktop app mode")
    }
  }

  // Hook to check initial maximize state in Tauri
  React.useEffect(() => {
    if (isTauri()) {
      import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
        getCurrentWindow().isMaximized().then(setIsMaximized)
      }).catch(console.error)
    }
  }, [])

  const openGitHub = () => {
    const url = "https://github.com/neondeveloperz/Server-Tools"
    if (isTauri()) {
      import("@tauri-apps/plugin-opener").then(({ openUrl }) => {
        openUrl(url).catch(() => window.open(url, "_blank"))
      })
    } else {
      window.open(url, "_blank")
    }
    toast.success("Opening GitHub Repository")
  }

  return (
    <div
      data-tauri-drag-region
      className="flex h-9 w-full select-none items-center justify-between border-b border-sidebar-border/40 bg-sidebar px-2 text-xs text-sidebar-foreground/85"
      style={{ height: "36px" }}
    >
      {/* LEFT SECTION: Logo and Menu Items */}
      <div className="flex items-center gap-1.5" data-no-drag="true">
        {/* Branding Icon */}
        <div className="flex size-5 items-center justify-center rounded bg-primary/10 text-primary transition-colors hover:bg-primary/20 ml-1">
          <Terminal className="size-3.5" />
        </div>

        {/* VS Code Menu Items */}
        <div className="flex items-center">
          {/* FILE */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => toast.info("Provision Server Node wizard triggered")}>
                New Server Node
                <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Open Clusters Config import dialog")}>
                Import Clusters Config...
                <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Server Registry configuration saved successfully!")}>
                Save Active Registry
                <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClose} variant="destructive">
                Exit App
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* EDIT */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuItem onClick={() => toast.success("Host IP Address copied to clipboard!")}>
                Copy Host IP
                <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("SSH Private Connection Key loaded!")}>
                Paste Connection Key
                <DropdownMenuShortcut>Ctrl+V</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SELECTION */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Selection
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuItem onClick={() => toast.info("All server nodes selected")}>
                Select All Nodes
                <DropdownMenuShortcut>Ctrl+A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("All server nodes deselected")}>
                Deselect All Nodes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* VIEW */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={toggleSidebar}>
                {state === "expanded" ? "Close Primary Side Bar" : "Open Primary Side Bar"}
                <DropdownMenuShortcut>Ctrl+B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                Toggle Color Theme
                <DropdownMenuShortcut>Alt+D</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GO */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Go
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onOpenCommandPalette}>
                Command Palette...
                <DropdownMenuShortcut>Ctrl+Shift+P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenCommandPalette}>
                Search Server Nodes...
                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* RUN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Run
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    {
                      loading: "Performing global ping sweep across all nodes...",
                      success: "Global ping sweep completed! (8 Online, 2 Offline)",
                      error: "Failed to ping cluster nodes."
                    }
                  )
                }}
              >
                Ping All Cluster Nodes
                <DropdownMenuShortcut>F5</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 1500)),
                    {
                      loading: "Syncing active monitoring agent metrics...",
                      success: "Monitoring metrics synchronized successfully!",
                      error: "Failed to sync agent metrics."
                    }
                  )
                }}
              >
                Sync Active Agents Load
                <DropdownMenuShortcut>Ctrl+F5</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* TERMINAL */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Terminal
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => toast.success("SSH Connection Shell tunnel opened!")}>
                Open SSH Shell Terminal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Pings & health check diagnostics complete!")}>
                Run System Health Check
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                console.clear()
                toast.success("Console logs cleared")
              }}>
                Clear Console logs
                <DropdownMenuShortcut>Ctrl+L</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* HELP */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded px-2.5 py-1 text-xs font-normal outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default">
              Help
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={openGitHub}>
                <Github className="mr-2 size-3.5" />
                GitHub Repository
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const url = "https://tauri.app"
                if (isTauri()) {
                  import("@tauri-apps/plugin-opener").then(({ openUrl }) => openUrl(url))
                } else {
                  window.open(url, "_blank")
                }
              }}>
                <Globe className="mr-2 size-3.5" />
                Tauri Documentation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast.info("Server Tools v0.1.0", {
                    description: "A premium administration dashboard utility built with Tauri & React.",
                    action: {
                      label: "Close",
                      onClick: () => {}
                    }
                  })
                }}
              >
                <Info className="mr-2 size-3.5 text-blue-500" />
                About Server Tools
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* CENTER SECTION: Global Navigation and Search Pill */}
      <div className="flex items-center gap-1.5" data-no-drag="true">
        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5 mr-2">
          <button className="flex size-6 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors" disabled>
            <ArrowLeft className="size-3.5" />
          </button>
          <button className="flex size-6 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors" disabled>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* Global Search Pill Bar */}
        <div
          onClick={onOpenCommandPalette}
          className="flex h-6 w-[360px] max-w-[35vw] cursor-pointer items-center justify-between rounded-md border border-sidebar-border bg-sidebar-accent/50 px-2.5 text-[11px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:border-border/60 transition-all duration-150"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Search className="size-3 text-muted-foreground" />
            <span className="truncate font-sans font-normal">server-tools</span>
          </div>
          <kbd className="pointer-events-none select-none rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground border border-border/30">
            Ctrl+P
          </kbd>
        </div>
      </div>

      {/* RIGHT SECTION: Layout Actions and System Window Controls */}
      <div className="flex items-center gap-1" data-no-drag="true">
        {/* Sidebar layouts controller toggle */}
        <button
          onClick={toggleSidebar}
          title={state === "expanded" ? "Collapse Primary Sidebar (Ctrl+B)" : "Expand Primary Sidebar (Ctrl+B)"}
          className="flex size-6 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mr-1.5"
        >
          {state === "expanded" ? (
            <PanelLeftClose className="size-3.5" />
          ) : (
            <PanelLeft className="size-3.5" />
          )}
        </button>

        {/* Quick Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
          className="flex size-6 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mr-2.5"
        >
          {theme === "dark" ? (
            <Sun className="size-3.5 text-amber-500" />
          ) : (
            <Moon className="size-3.5 text-indigo-400" />
          )}
        </button>

        {/* Separator line */}
        <div className="h-4 w-px bg-sidebar-border/60 mr-2" />

        {/* NATIVE WINDOW CONTROLS */}
        <div className="flex items-center gap-0.5">
          {/* Minimize button */}
          <button
            onClick={handleMinimize}
            title="Minimize"
            className="flex size-6 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Minus className="size-3.5" />
          </button>

          {/* Maximize button */}
          <button
            onClick={handleMaximize}
            title="Maximize"
            className="flex size-6 items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Square className="size-3" />
          </button>

          {/* Close button */}
          <button
            onClick={handleClose}
            title="Close"
            className="flex size-6 items-center justify-center rounded hover:bg-rose-500 hover:text-white transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { toast } from "sonner"
import { 
  CommandIcon as Command, 
  SearchIcon as Search, 
  TerminalIcon as Terminal, 
  SunIcon as Sun, 
  MoonIcon as Moon, 
  GitBranchIcon as Github, 
  SparklesIcon as Sparkles, 
  InfoIcon as Info,
  LayersIcon as Layers,
  FlameIcon as Flame,
  GlobeIcon as Globe
} from "lucide-react"
import { isTauri } from "@/lib/tauri"

interface CommandItem {
  id: string
  name: string
  shortcut?: string
  category: string
  icon: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()

  // Handle auto-focus when opened
  React.useEffect(() => {
    if (isOpen) {
      setSearch("")
      setActiveIndex(0)
      // Small timeout to ensure the element is visible
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const commands: CommandItem[] = React.useMemo(() => [
    {
      id: "toggle-sidebar",
      name: "View: Toggle Primary Side Bar",
      shortcut: "Ctrl+B",
      category: "View",
      icon: <Layers className="size-4" />,
      action: () => {
        toggleSidebar()
        toast.success("Toggled Primary Sidebar")
      }
    },
    {
      id: "toggle-theme",
      name: `Preferences: Color Theme (Current: ${theme})`,
      shortcut: "Alt+D / Shift+T",
      category: "Preferences",
      icon: theme === "dark" ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-indigo-400" />,
      action: () => {
        const nextTheme = theme === "dark" ? "light" : "dark"
        setTheme(nextTheme)
        toast.success(`Theme switched to ${nextTheme}`)
      }
    },
    {
      id: "greet-rust",
      name: "Tauri: Run Rust Greet Command",
      shortcut: "Ctrl+G",
      category: "Developer",
      icon: <Sparkles className="size-4 text-emerald-500" />,
      action: () => {
        toast.info("Try typing a name in the Rust Bridge box below, or invoke the greeting API!")
        // Call global click on button if exists or trigger direct mock greet
        import("@/lib/tauri").then(({ trackedInvoke }) => {
          trackedInvoke<string>("greet", { name: "VS Code User" })
            .then((res) => {
              toast.success(`Rust Greet: ${res}`)
            })
            .catch(() => {
              toast.success("Rust Greet: Hello, VS Code User! (Fallback)")
            })
        })
      }
    },
    {
      id: "open-github",
      name: "Help: Open GitHub Repository",
      shortcut: "Ctrl+Shift+H",
      category: "Help",
      icon: <Github className="size-4" />,
      action: () => {
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
    },
    {
      id: "clear-console",
      name: "Developer: Clear App Console Logs",
      shortcut: "Ctrl+L",
      category: "Developer",
      icon: <Terminal className="size-4 text-rose-500" />,
      action: () => {
        console.clear()
        toast.success("Developer Console cleared")
      }
    },
    {
      id: "trigger-confetti",
      name: "Fun: Trigger Sparkles & Effects",
      shortcut: "Ctrl+Shift+E",
      category: "Fun",
      icon: <Flame className="size-4 text-orange-500" />,
      action: () => {
        toast("✨ Sparkles activated! Have an amazing coding session! 🚀", {
          icon: "🚀"
        })
      }
    },
    {
      id: "about-app",
      name: "Help: About Server Tools",
      shortcut: "F12",
      category: "Help",
      icon: <Info className="size-4 text-blue-500" />,
      action: () => {
        toast.info("Server Tools v0.1.0 - Premium VS Code Menu Bar Integration", {
          description: "Built with React, Vite, Tailwind CSS, and Tauri."
        })
      }
    },
    {
      id: "view-docs",
      name: "Help: Documentation & Learning Resources",
      category: "Help",
      icon: <Globe className="size-4 text-cyan-500" />,
      action: () => {
        const url = "https://tauri.app"
        if (isTauri()) {
          import("@tauri-apps/plugin-opener").then(({ openUrl }) => {
            openUrl(url).catch(() => window.open(url, "_blank"))
          })
        } else {
          window.open(url, "_blank")
        }
        toast.success("Opening Tauri documentation")
      }
    }
  ], [theme, setTheme, toggleSidebar])

  // Filter commands
  const filteredCommands = React.useMemo(() => {
    if (!search.trim()) return commands
    const query = search.toLowerCase()
    return commands.filter(
      (cmd) => 
        cmd.name.toLowerCase().includes(query) || 
        cmd.category.toLowerCase().includes(query)
    )
  }, [search, commands])

  // Reset active index when search changes
  React.useEffect(() => {
    setActiveIndex(0)
  }, [search])

  // Handle keyboard navigation inside the list
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action()
        onClose()
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    }
  }, [filteredCommands, activeIndex, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs pt-16">
      <div 
        ref={containerRef}
        className="w-[600px] max-w-[90vw] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Section */}
        <div className="flex items-center gap-3 border-b border-border/80 px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            className="flex h-6 w-full rounded-md bg-transparent text-sm outline-hidden placeholder:text-muted-foreground select-text"
            placeholder="Type a command to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="pointer-events-none select-none rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* List of Commands */}
        <div className="max-h-[330px] overflow-y-auto p-1.5">
          {filteredCommands.length > 0 ? (
            <div className="space-y-0.5">
              {filteredCommands.map((cmd, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action()
                      onClose()
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs outline-hidden select-none transition-colors ${
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-foreground/80 hover:bg-accent/40"
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? "text-accent-foreground" : "text-muted-foreground"}`}>
                      {cmd.icon}
                    </span>
                    <span className="flex-1 truncate font-medium">
                      {cmd.name}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="pointer-events-none select-none rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground border border-border/30">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground select-none">
          <div className="flex items-center gap-1.5">
            <Command className="size-3 text-muted-foreground" />
            <span>Use Arrow keys to navigate, Enter to select</span>
          </div>
          <span>Server Tools Command Palette</span>
        </div>
      </div>
    </div>
  )
}

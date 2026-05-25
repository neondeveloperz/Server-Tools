import { useState, useEffect, type CSSProperties } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { VSCodeTitleBar } from "@/components/vscode-titlebar"
import { CommandPalette } from "@/components/command-palette"

// Import custom page views
import { DashboardView } from "@/components/views/dashboard-view"
import { NodesView } from "@/components/views/nodes-view"
import { SSHView } from "@/components/views/ssh-view"
import { CronView } from "@/components/views/cron-view"
import { NetworkView } from "@/components/views/network-view"
import { SettingsView } from "@/components/views/settings-view"
import { ApiKeysView } from "@/components/views/api-keys-view"
import { CloudStatusView } from "@/components/views/cloud-view"
import { SSHAccessKeysView } from "@/components/views/keys-view"
import { StoragePoolsView } from "@/components/views/storage-view"
import { SecurityPoliciesView } from "@/components/views/security-view"

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Listen for global shortcut commands to trigger command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+P, Ctrl+Shift+P, or F1
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      } else if (e.key === "F1") {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />
      case "nodes":
        return <NodesView />
      case "ssh":
        return <SSHView />
      case "cron":
        return <CronView />
      case "network":
        return <NetworkView />
      case "settings":
        return <SettingsView />
      case "api-keys":
        return <ApiKeysView />
      case "cloud":
        return <CloudStatusView />
      case "keys":
        return <SSHAccessKeysView />
      case "storage":
        return <StoragePoolsView />
      case "security":
        return <SecurityPoliciesView />
      default:
        return <DashboardView />
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 11)",
          } as CSSProperties
        }
        className="flex flex-col h-screen w-screen overflow-hidden bg-background"
      >
        {/* VS Code Title & Menu Bar */}
        <VSCodeTitleBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Main Application Sidebar & Body Container underneath Title Bar */}
        <div className="flex flex-1 w-full overflow-hidden relative">
          <AppSidebar variant="inset" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <SiteHeader activeTab={activeTab} />
            {/* Scrollable Main Content wrapper to lock page scrolling to desktop viewport */}
            <div className="flex-1 overflow-y-auto bg-background/35">
              {renderView()}
            </div>
          </SidebarInset>
        </div>

        {/* Global Search Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}



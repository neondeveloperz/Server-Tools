import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ServerIcon,
  TerminalIcon,
  ClockIcon,
  NetworkIcon,
  KeyIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  Settings2Icon,
  CloudIcon,
  CpuIcon,
} from "lucide-react"

const data = {
  user: {
    name: "ServerAdmin",
    email: "admin@servertools.io",
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='24' fill='%231e293b'/%3E%3Ccircle cx='48' cy='34' r='18' fill='%230ea5e9'/%3E%3Cpath d='M18 82c6-14 18-22 30-22s24 8 30 22' fill='%230ea5e9'/%3E%3C/svg%3E",
  },
  navMain: [
    {
      title: "Main Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
      id: "dashboard"
    },
    {
      title: "Cluster Nodes",
      url: "#",
      icon: <ServerIcon />,
      id: "nodes"
    },
    {
      title: "SSH Shell Tunnels",
      url: "#",
      icon: <TerminalIcon />,
      id: "ssh"
    },
    {
      title: "Cron Scheduler",
      url: "#",
      icon: <ClockIcon />,
      id: "cron"
    },
    {
      title: "Network Monitor",
      url: "#",
      icon: <NetworkIcon />,
      id: "network"
    },
  ],
  navSecondary: [
    {
      title: "Global Settings",
      url: "#",
      icon: <Settings2Icon />,
      id: "settings"
    },
    {
      title: "API Keys & Access",
      url: "#",
      icon: <KeyIcon />,
      id: "api-keys"
    },
    {
      title: "Cloud Status",
      url: "#",
      icon: <CloudIcon />,
      id: "cloud"
    },
  ],
  documents: [
    {
      name: "SSH Access Keys",
      url: "#",
      icon: <KeyIcon />,
      id: "keys"
    },
    {
      name: "Storage Pools",
      url: "#",
      icon: <DatabaseIcon />,
      id: "storage"
    },
    {
      name: "Security Policies",
      url: "#",
      icon: <ShieldCheckIcon />,
      id: "security"
    },
  ],
}

export function AppSidebar({ 
  activeTab,
  setActiveTab,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CpuIcon className="size-5! text-sky-500" />
                <span className="text-base font-bold tracking-wide text-foreground">Server Tools</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavDocuments items={data.documents} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavSecondary items={data.navSecondary} activeTab={activeTab} setActiveTab={setActiveTab} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}

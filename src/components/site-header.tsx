import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader({ activeTab }: { activeTab: string }) {
  const tabNames: Record<string, string> = {
    dashboard: "dashboard",
    nodes: "cluster-nodes",
    ssh: "ssh-tunnels",
    cron: "cron-scheduler",
    network: "network-monitor",
    settings: "global-settings",
    "api-keys": "api-keys-access",
    cloud: "cloud-status",
    keys: "ssh-access-keys",
    storage: "storage-pools",
    security: "security-policies",
  }

  const currentTabName = tabNames[activeTab] || activeTab

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) select-none">
      <div className="flex w-full items-center gap-1.5 lg:gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* VS Code Breadcrumb Bar */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList className="text-[11px] font-normal tracking-wide text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="hover:text-foreground">
                server-tools
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="hover:text-foreground">
                src
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="hover:text-foreground">
                views
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground/90">
                {currentTabName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Small screen indicator */}
        <span className="sm:hidden text-xs font-semibold text-foreground">
          {currentTabName}
        </span>
      </div>
    </header>
  )
}



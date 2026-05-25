"use client"

import { useState } from "react"
import { toast } from "sonner"
import { 
  CloudIcon, 
  RefreshCwIcon, 
  ExternalLinkIcon, 
  DollarSignIcon,
  ServerIcon,
  ShieldCheckIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CloudIntegration {
  id: string
  provider: "Amazon Web Services" | "Google Cloud Platform" | "DigitalOcean" | "Microsoft Azure"
  alias: string
  vmCount: number
  billingCurrent: number
  billingLimit: number
  lastSync: string
  status: "connected" | "syncing" | "error"
}

const initialProviders: CloudIntegration[] = [
  { id: "prov-1", provider: "Amazon Web Services", alias: "aws-prod-southeast-1", vmCount: 18, billingCurrent: 242.50, billingLimit: 500, lastSync: "2026-05-25 03:20:00", status: "connected" },
  { id: "prov-2", provider: "Google Cloud Platform", alias: "gcp-developer-sandbox", vmCount: 7, billingCurrent: 78.20, billingLimit: 150, lastSync: "2026-05-25 03:15:00", status: "connected" },
  { id: "prov-3", provider: "DigitalOcean", alias: "do-personal-droplets", vmCount: 4, billingCurrent: 42.00, billingLimit: 60, lastSync: "2026-05-25 03:00:00", status: "connected" },
  { id: "prov-4", provider: "Microsoft Azure", alias: "azure-enterprise-core", vmCount: 0, billingCurrent: 0.00, billingLimit: 1000, lastSync: "Never synced", status: "error" }
]

export function CloudStatusView() {
  const [providers, setProviders] = useState<CloudIntegration[]>(initialProviders)
  const [isSyncAll, setIsSyncAll] = useState(false)

  const triggerSync = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1800)),
          {
            loading: `Contacting ${p.provider} REST API and pulling metadata...`,
            success: `${p.provider} metadata successfully compiled!`,
            error: `Failed to contact provider API.`
          }
        )
        return {
          ...p,
          status: "syncing" as const
        }
      }
      return p
    }))

    // Restore state after mock timer
    setTimeout(() => {
      setProviders(prev => prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: "connected" as const,
            lastSync: new Date().toISOString().replace("T", " ").slice(0, 19)
          }
        }
        return p
      }))
    }, 1800)
  }

  const syncAllProviders = () => {
    setIsSyncAll(true)
    toast.info("Queueing API metadata synchronizations for all clusters...")
    
    providers.forEach(p => {
      if (p.status === "connected") {
        triggerSync(p.id)
      }
    })

    setTimeout(() => {
      setIsSyncAll(false)
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CloudIcon className="size-6 text-sky-500" />
            Cloud Integrations Status
          </h1>
          <p className="text-sm text-muted-foreground">Monitor remote third-party virtual machine metrics, sync status APIs, and active budgets.</p>
        </div>
        <button
          onClick={syncAllProviders}
          disabled={isSyncAll}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 focus:outline-none cursor-pointer disabled:opacity-50"
        >
          <RefreshCwIcon className={`size-3.5 ${isSyncAll ? "animate-spin" : ""}`} />
          Force Sync All Providers
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Integrated Clouds</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground font-mono">3 / 4</span>
              <span className="text-xs text-emerald-500 font-bold">Online</span>
            </div>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
            <ShieldCheckIcon className="size-5" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Total Cloud VMs Scraped</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground font-mono">29</span>
              <span className="text-xs text-muted-foreground">Instances</span>
            </div>
          </div>
          <div className="rounded-full bg-sky-500/10 p-3 text-sky-500">
            <ServerIcon className="size-5" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Aggregate Budget Limit</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground font-mono">$362.70 <span className="text-sm font-semibold text-muted-foreground">/ $1,710</span></span>
            </div>
          </div>
          <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
            <DollarSignIcon className="size-5 font-bold" />
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {providers.map((p) => {
          const billingPercent = Math.min(100, (p.billingCurrent / (p.billingLimit || 1)) * 100)
          
          return (
            <div key={p.id} className="bg-card border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md hover:border-sky-500/30 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider block">{p.provider}</span>
                    <h3 className="text-base font-bold text-foreground font-mono">{p.alias}</h3>
                  </div>

                  <Badge className={
                    p.status === "connected"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize"
                      : p.status === "syncing"
                      ? "bg-sky-500/10 text-sky-500 border border-sky-500/20 capitalize animate-pulse"
                      : "bg-red-500/10 text-red-500 border border-red-500/20 capitalize"
                  }>
                    {p.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Active Instances</span>
                    <span className="font-bold text-foreground">{p.vmCount} VMs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Last Synced On</span>
                    <span className="text-foreground truncate block">{p.lastSync}</span>
                  </div>
                </div>

                {/* Billing progress */}
                {p.billingLimit > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSignIcon className="size-3 text-emerald-500" /> Quota Budget Usage
                      </span>
                      <span className="text-foreground">${p.billingCurrent.toFixed(2)} / ${p.billingLimit}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          billingPercent > 80 
                            ? "bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" 
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${billingPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/20">
                <button
                  onClick={() => toast.info(`Opening developer dashboard panel for ${p.provider}`)}
                  className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Configure Keys <ExternalLinkIcon className="size-3" />
                </button>

                <button
                  onClick={() => triggerSync(p.id)}
                  disabled={p.status === "syncing" || p.status === "error"}
                  className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 disabled:opacity-30 disabled:pointer-events-none text-sky-500 rounded px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <RefreshCwIcon className={`size-3 ${p.status === "syncing" ? "animate-spin" : ""}`} /> Sync Now
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

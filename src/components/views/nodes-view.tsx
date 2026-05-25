"use client"

import { useState } from "react"
import { toast } from "sonner"
import { 
  ServerIcon, 
  SearchIcon, 
  CpuIcon, 
  HardDriveIcon, 
  RefreshCwIcon,
  PlayIcon,
  SquareIcon,
  PlusIcon,
  TerminalIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface Node {
  id: string
  name: string
  ip: string
  provider: "AWS" | "GCP" | "DigitalOcean" | "On-Premise"
  status: "running" | "stopped" | "maintenance"
  cpu: number
  ram: number
  region: string
  latency: number
}

const initialNodes: Node[] = [
  { id: "node-1", name: "ap-southeast-production-01", ip: "13.250.48.91", provider: "AWS", status: "running", cpu: 42, ram: 58, region: "Singapore (ap-southeast-1)", latency: 12 },
  { id: "node-2", name: "us-east-compute-web-gateway", ip: "34.120.211.5", provider: "GCP", status: "running", cpu: 78, ram: 84, region: "N. Virginia (us-east4)", latency: 124 },
  { id: "node-3", name: "db-replica-mariadb-ha", ip: "159.203.88.21", provider: "DigitalOcean", status: "running", cpu: 15, ram: 92, region: "New York (nyc3)", latency: 85 },
  { id: "node-4", name: "onprem-hpc-cluster-rack07", ip: "192.168.10.150", provider: "On-Premise", status: "maintenance", cpu: 0, ram: 12, region: "Bangkok Data Center", latency: 2 },
  { id: "node-5", name: "eu-west-backup-rsync-target", ip: "54.194.200.12", provider: "AWS", status: "stopped", cpu: 0, ram: 0, region: "Ireland (eu-west-1)", latency: 999 },
  { id: "node-6", name: "staging-kubernetes-worker-01", ip: "35.240.160.78", provider: "GCP", status: "running", cpu: 94, ram: 71, region: "Singapore (asia-southeast1)", latency: 18 }
]

export function NodesView() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [search, setSearch] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string>("All")

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase()) || node.ip.includes(search)
    const matchesProvider = selectedProvider === "All" || node.provider === selectedProvider
    return matchesSearch && matchesProvider
  })

  const toggleNodeStatus = (id: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        const nextStatus = n.status === "running" ? "stopped" : "running"
        toast.success(`${n.name} has been ${nextStatus === "running" ? "started" : "gracefully stopped"}`)
        return {
          ...n,
          status: nextStatus,
          cpu: nextStatus === "running" ? 25 : 0,
          ram: nextStatus === "running" ? 40 : 0
        }
      }
      return n
    }))
  }

  const simulateLoad = (id: string, cpuValue: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, cpu: cpuValue }
      }
      return n
    }))
  }

  const rebootNode = (name: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Sending ACPI reboot command to ${name}...`,
        success: `${name} has rebooted successfully!`,
        error: "Failed to reboot node"
      }
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cluster Nodes</h1>
          <p className="text-sm text-muted-foreground">Manage and simulate server nodes across all active cloud registry zones.</p>
        </div>
        <button 
          onClick={() => toast.info("Provisioning pipeline wizard initiated.")}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 focus:outline-none cursor-pointer"
        >
          <PlusIcon className="size-4" />
          Provision New Node
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-card border rounded-xl p-4 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by node name or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border bg-background/50 pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/20"
          />
        </div>
        <div className="flex gap-2">
          {["All", "AWS", "GCP", "DigitalOcean", "On-Premise"].map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                selectedProvider === provider
                  ? "bg-sky-600/10 border-sky-500/50 text-sky-500"
                  : "bg-background/40 hover:bg-muted text-muted-foreground border-border"
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredNodes.map((node) => {
          const isSpiking = node.cpu > 80
          const statusColors = {
            running: "bg-emerald-500",
            stopped: "bg-slate-400",
            maintenance: "bg-amber-500"
          }

          return (
            <Card key={node.id} className="relative overflow-hidden border bg-card/65 transition-all duration-300 hover:shadow-md hover:border-sky-500/30">
              {/* Top Accent Gradient reflecting status */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                node.status === "running" 
                  ? isSpiking ? "bg-gradient-to-r from-red-500 to-amber-500" : "bg-sky-500" 
                  : node.status === "maintenance" ? "bg-amber-500" : "bg-slate-500"
              }`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-sky-500/10 p-2 text-sky-500">
                      <ServerIcon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold truncate max-w-[170px] text-foreground">{node.name}</CardTitle>
                      <CardDescription className="font-mono text-[10px] text-muted-foreground">{node.ip}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex size-2">
                      {node.status === "running" && (
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                          isSpiking ? "bg-red-400" : "bg-emerald-400"
                        }`} />
                      )}
                      <span className={`relative inline-flex size-2 rounded-full ${statusColors[node.status]}`} />
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                      {node.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 pb-4">
                {/* Latency and Region */}
                <div className="grid grid-cols-2 gap-2 text-xs border-b border-border/40 pb-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Region</span>
                    <span className="font-medium text-foreground text-[11px] truncate block">{node.region}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Ping Latency</span>
                    <span className={`font-mono font-medium text-[11px] block ${
                      node.latency > 150 ? "text-amber-500" : "text-emerald-500"
                    }`}>
                      {node.status === "running" ? `${node.latency} ms` : "Offline"}
                    </span>
                  </div>
                </div>

                {/* Resource Stats */}
                <div className="space-y-3">
                  {/* CPU Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CpuIcon className="size-3 text-sky-500" /> CPU Load
                      </span>
                      <span className={isSpiking ? "text-red-500 font-bold" : "text-foreground"}>
                        {node.cpu}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSpiking ? "bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" : "bg-sky-500"
                        }`}
                        style={{ width: `${node.cpu}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <HardDriveIcon className="size-3 text-emerald-500" /> RAM Allocated
                      </span>
                      <span className="text-foreground">{node.ram}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${node.ram}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Slider for Spike Simulation */}
                {node.status === "running" && (
                  <div className="bg-background/60 p-2.5 rounded-lg border border-border/30 space-y-1">
                    <label className="text-[10px] text-sky-500 font-semibold block uppercase">Simulate load spike:</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      value={node.cpu} 
                      onChange={(e) => simulateLoad(node.id, parseInt(e.target.value))}
                      className="w-full accent-sky-600 h-1 rounded-lg cursor-pointer bg-muted"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-0 bg-muted/20 border-t border-border/10 p-3 rounded-b-lg">
                <button
                  onClick={() => toggleNodeStatus(node.id)}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-bold transition-all border cursor-pointer ${
                    node.status === "running"
                      ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                  }`}
                >
                  {node.status === "running" ? (
                    <>
                      <SquareIcon className="size-2.5 fill-current" /> Stop
                    </>
                  ) : (
                    <>
                      <PlayIcon className="size-2.5 fill-current" /> Start
                    </>
                  )}
                </button>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => rebootNode(node.name)}
                    disabled={node.status !== "running"}
                    className="flex size-7 items-center justify-center rounded border border-border bg-background/50 text-muted-foreground hover:text-foreground active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    title="Send Reboot ACPI"
                  >
                    <RefreshCwIcon className="size-3.5" />
                  </button>
                  <button
                    onClick={() => toast.info(`Initializing secure direct SSH channel to ${node.ip}...`)}
                    disabled={node.status !== "running"}
                    className="flex size-7 items-center justify-center rounded border border-border bg-background/50 text-muted-foreground hover:text-foreground active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    title="Open terminal window"
                  >
                    <TerminalIcon className="size-3.5" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

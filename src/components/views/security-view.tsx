"use client"

import { useState, useEffect, type FormEvent } from "react"
import { toast } from "sonner"
import { 
  ShieldCheckIcon, 
  Trash2Icon, 
  GlobeIcon, 
  ActivityIcon, 
  FingerprintIcon, 
  LockIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FirewallRule {
  id: string
  protocol: "TCP" | "UDP" | "ANY"
  port: string
  source: string
  action: "ALLOW" | "DENY"
  status: "active" | "inactive"
}

interface BlockedLog {
  timestamp: string
  ip: string
  country: string
  port: number
  reason: string
}

const initialRules: FirewallRule[] = [
  { id: "rule-1", protocol: "TCP", port: "22 (SSH)", source: "13.250.48.91/32", action: "ALLOW", status: "active" },
  { id: "rule-2", protocol: "TCP", port: "80 (HTTP)", source: "0.0.0.0/0", action: "ALLOW", status: "active" },
  { id: "rule-3", protocol: "TCP", port: "443 (HTTPS)", source: "0.0.0.0/0", action: "ALLOW", status: "active" },
  { id: "rule-4", protocol: "ANY", port: "3306 (MariaDB)", source: "192.168.1.0/24", action: "ALLOW", status: "active" },
  { id: "rule-5", protocol: "TCP", port: "ALL PORTS", source: "185.220.101.0/24", action: "DENY", status: "active" }
]

const initialLogs: BlockedLog[] = [
  { timestamp: "03:38:12", ip: "185.220.101.44", country: "Tor Exit Node", port: 22, reason: "SSH Brute-force credentials limit exceeded" },
  { timestamp: "03:37:45", ip: "45.143.203.118", country: "Russian Federation", port: 8080, reason: "Crawler directory path traversal probe block" },
  { timestamp: "03:36:02", ip: "91.240.118.52", country: "Netherlands", port: 23, reason: "Telnet socket handshake sweep" }
]

const mockCountries = ["Germany", "China", "United States", "Brazil", "Tor Exit Node", "Ukraine", "Romania"]
const mockIps = ["185.220.101.99", "121.40.85.12", "88.190.222.14", "190.2.142.150", "45.143.203.22", "91.240.118.3"]
const mockPorts = [22, 23, 8080, 21, 3389, 5900]
const mockReasons = ["Brute force credentials sweep", "Direct socket sweep block", "Port scan trigger", "SQL injection exploit probe block"]

export function SecurityPoliciesView() {
  const [rules, setRules] = useState<FirewallRule[]>(initialRules)
  const [logs, setLogs] = useState<BlockedLog[]>(initialLogs)
  
  // Rule creator states
  const [customPort, setCustomPort] = useState("")
  const [customSource, setCustomSource] = useState("0.0.0.0/0")
  const [customProto, setCustomProto] = useState<"TCP" | "UDP" | "ANY">("TCP")
  const [customAction, setCustomAction] = useState<"ALLOW" | "DENY">("ALLOW")

  // Simulate incoming rolling logs of security sweeps
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIp = mockIps[Math.floor(Math.random() * mockIps.length)]
      const randomCountry = mockCountries[Math.floor(Math.random() * mockCountries.length)]
      const randomPort = mockPorts[Math.floor(Math.random() * mockPorts.length)]
      const randomReason = mockReasons[Math.floor(Math.random() * mockReasons.length)]
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

      const newLog: BlockedLog = {
        timestamp: nowStr,
        ip: randomIp,
        country: randomCountry,
        port: randomPort,
        reason: randomReason
      }

      setLogs(prev => [newLog, ...prev.slice(0, 7)])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCreateRule = (e: FormEvent) => {
    e.preventDefault()
    if (!customPort.trim()) {
      toast.warning("Please enter a valid target port.")
      return
    }

    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      protocol: customProto,
      port: customPort,
      source: customSource,
      action: customAction,
      status: "active"
    }

    setRules(prev => [...prev, newRule])
    setCustomPort("")
    toast.success(`Firewall policy blocking/allow rule successfully configured.`)
  }

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
    toast.error("Firewall policy deleted successfully.")
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LockIcon className="size-6 text-sky-500" />
            Security & Firewall Policies
          </h1>
          <p className="text-sm text-muted-foreground">Audit cluster vulnerabilities, configure network firewall policies, and check live port scan block feeds.</p>
        </div>
      </div>

      {/* Security Audit Rating */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between col-span-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Audit Rating Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-500 font-mono">94</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold block leading-tight">Excellent (Fully Hardened)</span>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-500">
            <ShieldCheckIcon className="size-6 shrink-0" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between col-span-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Ports sweep Protected</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground font-mono">65,535</span>
            </div>
            <span className="text-[9px] text-muted-foreground block leading-tight">Inbound network sweeps protected</span>
          </div>
          <div className="rounded-full bg-sky-500/10 p-3.5 text-sky-500">
            <GlobeIcon className="size-6 shrink-0" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between col-span-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Host IDS Scanner</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-emerald-500">100% Secure</span>
            </div>
            <span className="text-[9px] text-muted-foreground block leading-tight">Intrusion detection filters synced</span>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-500">
            <FingerprintIcon className="size-6 shrink-0" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Policy creator Wizard panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground">Configure Firewall Rule</h2>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Port / Service</label>
                <input 
                  type="text" 
                  value={customPort}
                  onChange={(e) => setCustomPort(e.target.value)}
                  placeholder="e.g. 8080 or 23 (Telnet)"
                  className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Source Range (CIDR)</label>
                <input 
                  type="text" 
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full font-mono rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground block">Protocol</label>
                  <select 
                    value={customProto}
                    onChange={(e) => setCustomProto(e.target.value as any)}
                    className="w-full rounded-md border bg-card px-2 py-1.5 outline-none cursor-pointer text-foreground"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ANY">ANY</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground block">Policy Action</label>
                  <select 
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value as any)}
                    className="w-full rounded-md border bg-card px-2 py-1.5 outline-none cursor-pointer text-foreground"
                  >
                    <option value="ALLOW">ALLOW</option>
                    <option value="DENY">DENY</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                Apply Firewall Rule
              </button>
            </form>
          </div>
        </div>

        {/* Existing Firewall Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/10">
              <h2 className="text-sm font-bold text-foreground">Configured Network Policies</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-semibold text-muted-foreground border-b bg-muted/5 uppercase">
                    <th className="py-3 px-4">Protocol</th>
                    <th>Port Range</th>
                    <th>Source Range</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th className="text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs select-none">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-muted/10">
                      <td className="py-3 px-4 font-mono font-bold text-foreground">{rule.protocol}</td>
                      <td className="font-mono text-foreground font-semibold">{rule.port}</td>
                      <td className="font-mono text-muted-foreground">{rule.source}</td>
                      <td>
                        <Badge className={
                          rule.action === "ALLOW"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }>
                          {rule.action}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0 select-none">
                          {rule.status}
                        </Badge>
                      </td>
                      <td className="text-right pr-4">
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-1.5 border border-red-500/30 hover:bg-red-500/10 rounded text-red-500 transition-all cursor-pointer"
                          title="Revoke Network Policy"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Rolling Block Log Feed */}
      <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <ActivityIcon className="size-4 text-sky-500 animate-pulse" />
          Rolling Intrusion Detection Block Logs (Real-time Feed)
        </h2>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
          {logs.map((log, idx) => (
            <div key={idx} className="bg-background/80 border p-3 rounded-lg flex items-center justify-between text-xs font-mono border-l-4 border-l-red-500 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-red-500 font-bold">[BLOCKED]</span>
                  <span className="text-zinc-500 font-semibold">{log.timestamp}</span>
                  <span className="text-foreground font-bold">{log.ip}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-zinc-700 text-muted-foreground select-none">
                    {log.country}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                  Targeted Port: <span className="font-mono text-foreground font-semibold">{log.port}</span> | Reason: <span className="font-mono text-red-400/90">{log.reason}</span>
                </p>
              </div>

              <div className="text-right text-[10px] text-zinc-500 self-start">
                IDS Active
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

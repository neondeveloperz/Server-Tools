"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  NetworkIcon, 
  ActivityIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ZapIcon, 
  ShieldCheckIcon,
  PlayIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts"

interface NetworkInterface {
  name: string
  ipv4: string
  mac: string
  rxTotal: string
  txTotal: string
  status: "up" | "down"
}

interface OpenPort {
  port: number
  protocol: "TCP" | "UDP"
  service: string
  pid: number
  state: "LISTEN" | "ESTABLISHED"
}

export function NetworkView() {
  const [rxSpeed, setRxSpeed] = useState(12.4)
  const [txSpeed, setTxSpeed] = useState(4.8)
  const [chartData, setChartData] = useState<{ time: string; rx: number; tx: number }[]>([])
  
  // Stress test states
  const [isTesting, setIsTesting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testSpeed, setTestSpeed] = useState(0)

  // Interfaces list
  const interfaces: NetworkInterface[] = [
    { name: "eth0", ipv4: "13.250.48.91", mac: "02:42:ac:11:00:02", rxTotal: "482 GB", txTotal: "291 GB", status: "up" },
    { name: "eth1", ipv4: "192.168.10.150", mac: "02:42:ac:11:00:03", rxTotal: "1.2 TB", txTotal: "982 GB", status: "up" },
    { name: "lo", ipv4: "127.0.0.1", mac: "00:00:00:00:00:00", rxTotal: "8.4 GB", txTotal: "8.4 GB", status: "up" }
  ]

  // Port states
  const ports: OpenPort[] = [
    { port: 22, protocol: "TCP", service: "sshd", pid: 912, state: "LISTEN" },
    { port: 80, protocol: "TCP", service: "nginx: master", pid: 4218, state: "LISTEN" },
    { port: 443, protocol: "TCP", service: "nginx: master", pid: 4218, state: "LISTEN" },
    { port: 3306, protocol: "TCP", service: "mariadbd", pid: 1102, state: "LISTEN" },
    { port: 5432, protocol: "TCP", service: "postgres", pid: 1014, state: "LISTEN" },
    { port: 6379, protocol: "TCP", service: "redis-server", pid: 1318, state: "ESTABLISHED" }
  ]

  // Simulate streaming network graph
  useEffect(() => {
    // Fill initial chart data
    const initial = Array.from({ length: 15 }).map((_, idx) => {
      const now = new Date()
      now.setSeconds(now.getSeconds() - (15 - idx) * 3)
      return {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rx: parseFloat((Math.random() * 15 + 5).toFixed(1)),
        tx: parseFloat((Math.random() * 8 + 2).toFixed(1))
      }
    })
    setChartData(initial)

    const interval = setInterval(() => {
      // Dynamic scaling
      const baseRx = isTesting ? testSpeed : Math.random() * 20 + 8
      const baseTx = isTesting ? testSpeed * 0.4 : Math.random() * 10 + 3
      
      const rxVal = parseFloat(baseRx.toFixed(1))
      const txVal = parseFloat(baseTx.toFixed(1))
      
      setRxSpeed(rxVal)
      setTxSpeed(txVal)

      setChartData((prev) => {
        const copy = [...prev.slice(1)]
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        return [...copy, { time: timeStr, rx: rxVal, tx: txVal }]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isTesting, testSpeed])

  // Stress test process triggers
  const startStressTest = () => {
    if (isTesting) return
    setIsTesting(true)
    setTestProgress(0)
    setTestSpeed(0)
    toast.info("Network packet flooding stress-test simulation initiated.")

    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setTestProgress(progress)
      
      // Speed spikes rapidly then drops down
      if (progress < 50) {
        setTestSpeed(prev => Math.min(prev + 120, 850 + Math.random() * 100))
      } else if (progress < 90) {
        setTestSpeed(920 + Math.random() * 50)
      } else {
        setTestSpeed(prev => Math.max(prev - 200, 10))
      }

      if (progress >= 100) {
        clearInterval(interval)
        setIsTesting(false)
        toast.success("Network stress-test finished! Port links healthy under peak load.")
      }
    }, 250)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <NetworkIcon className="size-6 text-sky-500" />
            Network Monitor
          </h1>
          <p className="text-sm text-muted-foreground">Real-time socket data streams, listener ports, and virtual bandwidth load tests.</p>
        </div>
      </div>

      {/* Overview dials cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">RX Inbound Speed</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground font-mono">{rxSpeed}</span>
              <span className="text-xs text-muted-foreground">Mbps</span>
            </div>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
            <ArrowDownIcon className="size-5 shrink-0" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">TX Outbound Speed</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground font-mono">{txSpeed}</span>
              <span className="text-xs text-muted-foreground">Mbps</span>
            </div>
          </div>
          <div className="rounded-full bg-sky-500/10 p-3 text-sky-500">
            <ArrowUpIcon className="size-5 shrink-0" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Socket Status</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-500">No Packet Loss</span>
            </div>
          </div>
          <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
            <ShieldCheckIcon className="size-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dynamic graph panel */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ActivityIcon className="size-4 text-sky-500" />
              Continuous Bandwidth Throughput
            </h2>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-emerald-500" /> RX</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-sky-500" /> TX</span>
            </div>
          </div>

          <div className="h-[250px] w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-rx, #10b981)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-rx, #10b981)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-tx, #0ea5e9)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-tx, #0ea5e9)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="time" className="fill-muted-foreground" />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.95)", border: "1px solid #333", borderRadius: "8px", fontSize: "11px", color: "#fff" }} 
                />
                <Area type="monotone" dataKey="rx" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRx)" />
                <Area type="monotone" dataKey="tx" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Load Stress Tester */}
        <div className="lg:col-span-1 bg-card border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ZapIcon className="size-4 text-sky-500 animate-bounce" />
              Bandwidth Stress Tester
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify if the application cluster handles unexpected spikes gracefully by generating fake network load packets.
            </p>
          </div>

          <div className="bg-background/80 border rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-4 py-8 relative overflow-hidden">
            {isTesting && (
              <div className="absolute inset-0 bg-sky-500/[0.02] animate-pulse" />
            )}
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Stress Load Generated</span>
              <span className="text-3xl font-black font-mono text-foreground">{testSpeed.toFixed(0)} <span className="text-sm font-medium text-muted-foreground">Mbps</span></span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative size-24">
              <svg className="size-full -rotate-90">
                <circle cx="48" cy="48" r="40" className="stroke-muted fill-none" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" className="stroke-sky-500 fill-none transition-all duration-300" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - testProgress / 100)}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground font-mono">{testProgress}%</span>
            </div>

            <button
              onClick={startStressTest}
              disabled={isTesting}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 disabled:bg-muted disabled:text-muted-foreground text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all select-none cursor-pointer"
            >
              <PlayIcon className="size-3 fill-current" />
              {isTesting ? "Stress Testing..." : "Start Stress Test"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Interface Interfaces Table */}
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Available Network Interfaces</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-semibold text-muted-foreground border-b uppercase">
                  <th className="py-2.5">Name</th>
                  <th>IP Address</th>
                  <th>Total Sent/Recv</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {interfaces.map((iface) => (
                  <tr key={iface.name} className="hover:bg-muted/10">
                    <td className="py-3 font-semibold text-foreground font-mono">{iface.name}</td>
                    <td className="font-mono text-muted-foreground">{iface.ipv4}</td>
                    <td className="font-mono text-foreground">{iface.rxTotal} / {iface.txTotal}</td>
                    <td>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize px-2 py-0">
                        {iface.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Listeners Table */}
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Open Listening Ports Registry</h2>
          <div className="overflow-x-auto font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-semibold text-muted-foreground border-b uppercase">
                  <th className="py-2.5">Port</th>
                  <th>Protocol</th>
                  <th>Associated Service</th>
                  <th>PID</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {ports.map((port) => (
                  <tr key={port.port} className="hover:bg-muted/10">
                    <td className="py-3 font-bold text-foreground">{port.port}</td>
                    <td className="text-muted-foreground">{port.protocol}</td>
                    <td className="text-sky-500 font-semibold">{port.service}</td>
                    <td className="text-muted-foreground">{port.pid}</td>
                    <td>
                      <Badge className={
                        port.state === "LISTEN" 
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0 text-[10px]"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0 text-[10px]"
                      }>
                        {port.state}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { 
  Settings2Icon, 
  SaveIcon, 
  ShieldAlertIcon
} from "lucide-react"

export function SettingsView() {
  // Option preferences states
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState("3")
  const [enableSound, setEnableSound] = useState(false)
  const [debugLogging, setDebugLogging] = useState(true)
  
  // Alert thresholds
  const [cpuThreshold, setCpuThreshold] = useState(80)
  const [ramThreshold, setRamThreshold] = useState(85)
  
  // Inputs configuration
  const [clusterName, setClusterName] = useState("Production Asia-Pacific Core")
  const [defaultSshPort, setDefaultSshPort] = useState("22")

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault()
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Saving global configs to server database...",
        success: "Configuration successfully deployed across all cluster nodes!",
        error: "Failed to persist configurations."
      }
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings2Icon className="size-6 text-sky-500" />
          Global Settings
        </h1>
        <p className="text-sm text-muted-foreground">Adjust telemetry reporting parameters, notification alerts, and secure cluster default values.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid gap-6 max-w-4xl">
        {/* Core preferences group */}
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-foreground pb-2 border-b">Telemetry & Auto-Refresh</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-foreground">Auto-Refresh Telemetry</label>
                <p className="text-[10px] text-muted-foreground">Updates dashboard monitors dynamically.</p>
              </div>
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-foreground">Refresh Frequency</label>
                <p className="text-[10px] text-muted-foreground">Specifies interval between data pulls.</p>
              </div>
              <select 
                disabled={!autoRefresh}
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="rounded-md border bg-card px-2.5 py-1 text-xs text-foreground outline-none cursor-pointer"
              >
                <option value="1">1 second</option>
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-foreground">Audio Alerts on Warnings</label>
                <p className="text-[10px] text-muted-foreground">Play standard alert sound when thresholds spike.</p>
              </div>
              <input 
                type="checkbox" 
                checked={enableSound}
                onChange={(e) => setEnableSound(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-foreground">Console Debug Mode</label>
                <p className="text-[10px] text-muted-foreground">Streams rust diagnostics to terminal window.</p>
              </div>
              <input 
                type="checkbox" 
                checked={debugLogging}
                onChange={(e) => setDebugLogging(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Warning Threshold meters */}
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-foreground pb-2 border-b flex items-center gap-1.5">
            <ShieldAlertIcon className="size-4 text-sky-500" />
            Warning Trigger Thresholds
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1">CPU Load Limit Alert</span>
                <span className="font-mono text-sky-500 font-bold">{cpuThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="98" 
                value={cpuThreshold} 
                onChange={(e) => setCpuThreshold(parseInt(e.target.value))}
                className="w-full accent-sky-600 h-1.5 rounded-lg cursor-pointer bg-muted"
              />
              <p className="text-[9px] text-muted-foreground">Launches high priority toast notification and sound warnings when active node CPU exceeds limits.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1">RAM Allocated Warning Alert</span>
                <span className="font-mono text-sky-500 font-bold">{ramThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="98" 
                value={ramThreshold} 
                onChange={(e) => setRamThreshold(parseInt(e.target.value))}
                className="w-full accent-sky-600 h-1.5 rounded-lg cursor-pointer bg-muted"
              />
              <p className="text-[9px] text-muted-foreground">Warns database administrators to flush caches and run garbage collection tasks.</p>
            </div>
          </div>
        </div>

        {/* Cluster Default Setup configs */}
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground pb-2 border-b">Master Node Defaults</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Cluster Registry Title</label>
              <input 
                type="text" 
                value={clusterName}
                onChange={(e) => setClusterName(e.target.value)}
                className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Global Port Listener Default</label>
              <input 
                type="number" 
                value={defaultSshPort}
                onChange={(e) => setDefaultSshPort(e.target.value)}
                className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Save button block */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs py-2.5 px-6 transition-all self-end cursor-pointer shadow-sm"
        >
          <SaveIcon className="size-4" />
          Deploy Configurations
        </button>
      </form>
    </div>
  )
}

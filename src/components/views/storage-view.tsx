"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  DatabaseIcon, 
  HardDriveIcon, 
  FolderOpenIcon,
  WrenchIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StoragePool {
  id: string
  name: string
  raidType: "RAID-10" | "RAID-5" | "RAID-1" | "Single Disk"
  capacityTotal: number // in GB
  capacityUsed: number // in GB
  diskCount: number
  health: "healthy" | "scrubbing" | "warning"
}

interface DiskDevice {
  name: string
  model: string
  type: "NVMe SSD" | "SATA SSD" | "Mechanical HDD"
  mountPoint: string
  readSpeed: number // in MB/s
  writeSpeed: number // in MB/s
  temp: number // in °C
}

export function StoragePoolsView() {
  const [pools, setPools] = useState<StoragePool[]>([
    { id: "pool-1", name: "nvme-ssd-fast-pool", raidType: "RAID-10", capacityTotal: 1024, capacityUsed: 412, diskCount: 4, health: "healthy" },
    { id: "pool-2", name: "sata-bulk-cold-storage", raidType: "RAID-5", capacityTotal: 4096, capacityUsed: 3120, diskCount: 3, health: "healthy" },
    { id: "pool-3", name: "local-backup-mirror", raidType: "RAID-1", capacityTotal: 512, capacityUsed: 498, diskCount: 2, health: "warning" }
  ])

  const [disks, setDisks] = useState<DiskDevice[]>([
    { name: "/dev/nvme0n1", model: "Samsung SSD 990 Pro 1TB", type: "NVMe SSD", mountPoint: "/mnt/fast-storage", readSpeed: 1.2, writeSpeed: 0.4, temp: 41 },
    { name: "/dev/sda", model: "Crucial MX500 SATA SSD 2TB", type: "SATA SSD", mountPoint: "/mnt/cold-storage", readSpeed: 0.1, writeSpeed: 0, temp: 34 },
    { name: "/dev/sdb", model: "Seagate IronWolf NAS HDD 4TB", type: "Mechanical HDD", mountPoint: "/backup-mirror", readSpeed: 0, writeSpeed: 8.5, temp: 38 }
  ])

  // Simulate active disk I/O metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setDisks((prev) => 
        prev.map((disk) => {
          const isIdle = Math.random() > 0.6
          return {
            ...disk,
            readSpeed: isIdle ? 0 : parseFloat((Math.random() * 25 + 0.5).toFixed(1)),
            writeSpeed: isIdle ? 0 : parseFloat((Math.random() * 12 + 0.2).toFixed(1)),
            temp: disk.temp + (Math.random() > 0.5 ? 1 : -1)
          }
        })
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const runScrubbing = (id: string, name: string) => {
    setPools(prev => prev.map(p => {
      if (p.id === id) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 3000)),
          {
            loading: `Scrubbing disk checksum indices for ${name}...`,
            success: `RAID block integrity healthy! 0 corrupted sectors found.`,
            error: `Integrity scrubbing failed.`
          }
        )
        return {
          ...p,
          health: "scrubbing" as const
        }
      }
      return p
    }))

    setTimeout(() => {
      setPools(prev => prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            health: "healthy" as const
          }
        }
        return p
      }))
    }, 3000)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DatabaseIcon className="size-6 text-sky-500" />
            Storage Pools Manager
          </h1>
          <p className="text-sm text-muted-foreground">Monitor physical hard disk arrays, RAID file systems health, partition maps, and active I/O speed dials.</p>
        </div>
      </div>

      {/* Storage Pools Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {pools.map((p) => {
          const usedPercent = Math.min(100, (p.capacityUsed / p.capacityTotal) * 100)

          return (
            <div key={p.id} className="bg-card border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md hover:border-sky-500/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider block">{p.raidType} Array</span>
                    <h3 className="text-sm font-bold text-foreground font-mono truncate max-w-[150px]">{p.name}</h3>
                  </div>

                  <Badge className={
                    p.health === "healthy"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize"
                      : p.health === "scrubbing"
                      ? "bg-sky-500/10 text-sky-500 border border-sky-500/20 capitalize animate-pulse"
                      : "bg-red-500/10 text-red-500 border border-red-500/20 capitalize"
                  }>
                    {p.health}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 py-2">
                  {/* Gauge indicator */}
                  <div className="relative size-20 shrink-0">
                    <svg className="size-full -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-muted fill-none" strokeWidth="6" />
                      <circle cx="40" cy="40" r="32" className={`fill-none transition-all duration-500 ${
                        usedPercent > 85 ? "stroke-red-500" : "stroke-sky-500"
                      }`} strokeWidth="6" strokeDasharray={`${2 * Math.PI * 32}`} strokeDashoffset={`${2 * Math.PI * 32 * (1 - usedPercent / 100)}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground font-mono">{usedPercent.toFixed(0)}%</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs text-muted-foreground flex-1">
                    <div>
                      <span className="text-[10px] block">Capacity Used:</span>
                      <span className="font-bold text-foreground">{p.capacityUsed} GB / {p.capacityTotal} GB</span>
                    </div>
                    <div>
                      <span className="text-[10px] block">Disks bound:</span>
                      <span className="font-semibold text-foreground">{p.diskCount} Physical Drives</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-2">
                <button
                  onClick={() => toast.info(`Mount mapping inspector not implemented.`)}
                  className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <FolderOpenIcon className="size-3" /> Mount Configs
                </button>

                <button
                  onClick={() => runScrubbing(p.id, p.name)}
                  disabled={p.health === "scrubbing"}
                  className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 disabled:opacity-30 disabled:pointer-events-none text-sky-500 rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <WrenchIcon className="size-3" /> Scrub Array
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Disks Table list */}
      <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <HardDriveIcon className="size-4 text-sky-500" />
          Active Physical Disk Health & Throughput
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-semibold text-muted-foreground border-b uppercase">
                <th className="py-2.5">Disk mount Path</th>
                <th>Device Model</th>
                <th>Hardware Interface</th>
                <th>Mount Target</th>
                <th>Read Rate</th>
                <th>Write Rate</th>
                <th>Temp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-mono select-none">
              {disks.map((d) => (
                <tr key={d.name} className="hover:bg-muted/10">
                  <td className="py-3.5 font-bold text-foreground">{d.name}</td>
                  <td className="text-muted-foreground font-sans">{d.model}</td>
                  <td>
                    <Badge variant="outline" className="text-[10px] font-semibold select-none px-1.5 py-0">
                      {d.type}
                    </Badge>
                  </td>
                  <td className="text-sky-500 font-semibold">{d.mountPoint}</td>
                  <td className={d.readSpeed > 0.5 ? "text-emerald-500 font-bold" : "text-muted-foreground"}>
                    {d.readSpeed} MB/s
                  </td>
                  <td className={d.writeSpeed > 0.5 ? "text-emerald-500 font-bold" : "text-muted-foreground"}>
                    {d.writeSpeed} MB/s
                  </td>
                  <td>
                    <span className={`font-semibold ${d.temp > 45 ? "text-red-500 animate-pulse font-bold" : "text-foreground"}`}>
                      {d.temp} °C
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, type FormEvent } from "react"
import { toast } from "sonner"
import { 
  ClockIcon, 
  PlayIcon, 
  Trash2Icon, 
  SparklesIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CronJob {
  id: string
  name: string
  expression: string
  description: string
  targetNode: string
  status: "active" | "paused"
  lastRun: string
  nextRun: string
}

const initialJobs: CronJob[] = [
  { id: "cron-1", name: "automated-s3-database-backup", expression: "0 0 * * *", description: "Dumps postgres database and uploads compressed snapshot to AWS S3 storage pool.", targetNode: "ap-southeast-production-01", status: "active", lastRun: "2026-05-25 00:00:02", nextRun: "2026-05-26 00:00:00" },
  { id: "cron-2", name: "let-encrypt-ssl-auto-renewal", expression: "0 12 1 * *", description: "Performs check on nginx SSL certificates and initiates ACME renewal if remaining duration < 30 days.", targetNode: "us-east-compute-web-gateway", status: "active", lastRun: "2026-05-01 12:00:15", nextRun: "2026-06-01 12:00:00" },
  { id: "cron-3", name: "syslog-archive-logrotate", expression: "30 2 * * *", description: "Compresses log files under /var/log/syslog, archives backups, and cleans system disk space.", targetNode: "db-replica-mariadb-ha", status: "active", lastRun: "2026-05-25 02:30:00", nextRun: "2026-05-26 02:30:00" },
  { id: "cron-4", name: "cache-redis-garbage-collection", expression: "*/15 * * * *", description: "Triggers flush-expired command keys on primary Redis clusters to reclaim transient RAM allocated.", targetNode: "ap-southeast-production-01", status: "paused", lastRun: "2026-05-25 03:15:00", nextRun: "Suspended" }
]

export function CronView() {
  const [jobs, setJobs] = useState<CronJob[]>(initialJobs)
  const [customName, setCustomName] = useState("")
  const [customExpr, setCustomExpr] = useState("*/5 * * * *")
  const [customDesc, setCustomDesc] = useState("")
  const [activeExprText, setActiveExprText] = useState("Every 5 minutes")

  // Simple reactive cron translator
  useEffect(() => {
    const expr = customExpr.trim()
    if (expr === "*/5 * * * *") {
      setActiveExprText("Every 5 minutes, on every hour, day, month and week day")
    } else if (expr === "0 0 * * *") {
      setActiveExprText("Daily at midnight (00:00)")
    } else if (expr === "0 * * * *") {
      setActiveExprText("Hourly at the beginning of the hour (:00)")
    } else if (expr === "0 12 1 * *") {
      setActiveExprText("Monthly at noon (12:00) on day 1 of the month")
    } else if (expr === "30 2 * * *") {
      setActiveExprText("Daily at 02:30 AM")
    } else if (expr.startsWith("*/")) {
      const num = expr.split(" ")[0].replace("*/", "")
      setActiveExprText(`Every ${num} minutes, on every hour, day, month and week day`)
    } else {
      setActiveExprText("Valid Cron format detected. Custom execution interval.")
    }
  }, [customExpr])

  const toggleJobStatus = (id: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        const nextStatus = job.status === "active" ? "paused" : "active"
        toast.info(`Job scheduler ${job.name} status switched to ${nextStatus}`)
        return {
          ...job,
          status: nextStatus,
          nextRun: nextStatus === "active" ? "2026-05-25 03:45:00" : "Suspended"
        }
      }
      return job
    }))
  }

  const deleteJob = (id: string, name: string) => {
    setJobs(prev => prev.filter(job => job.id !== id))
    toast.error(`Cron Job '${name}' successfully deleted.`)
  }

  const triggerJobNow = (name: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Spawning shell script for ${name}...`,
        success: `${name} executed successfully! Exit status: 0 (OK)`,
        error: "Cron job failed to run"
      }
    )
  }

  const handleCreateJob = (e: FormEvent) => {
    e.preventDefault()
    if (!customName.trim()) {
      toast.warning("Please enter a unique name for the cron job.")
      return
    }

    const newJob: CronJob = {
      id: `cron-${Date.now()}`,
      name: customName.toLowerCase().replace(/\s+/g, "-"),
      expression: customExpr,
      description: customDesc || "Custom provisioning script automated using cron task runner.",
      targetNode: "ap-southeast-production-01",
      status: "active",
      lastRun: "Never",
      nextRun: "2026-05-25 04:00:00"
    }

    setJobs(prev => [newJob, ...prev])
    setCustomName("")
    setCustomDesc("")
    toast.success(`Cron Job '${newJob.name}' has been created and activated!`)
  }

  const selectTemplate = (expr: string) => {
    setCustomExpr(expr)
    toast.info(`Template expression loaded: ${expr}`)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClockIcon className="size-6 text-sky-500" />
            Cron Scheduler
          </h1>
          <p className="text-sm text-muted-foreground">Automate repeating background commands, log sweeps, and cluster backups.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Provision Form and Cron helper */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <SparklesIcon className="size-4 text-sky-500" />
              Provision Cron Task
            </h2>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Job Identifier</label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. system-cleanup-temp-files"
                  className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Cron Expression</label>
                <input 
                  type="text" 
                  value={customExpr}
                  onChange={(e) => setCustomExpr(e.target.value)}
                  className="w-full font-mono rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              {/* Reactive parser helper */}
              <div className="bg-sky-500/5 border border-sky-500/10 rounded-lg p-3 space-y-1">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider block">Expression Translated:</span>
                <p className="text-xs font-medium text-foreground leading-relaxed">{activeExprText}</p>
              </div>

              {/* Express Templates */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">Quick Presets</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Every 5 mins", expr: "*/5 * * * *" },
                    { label: "Hourly", expr: "0 * * * *" },
                    { label: "Daily Midnight", expr: "0 0 * * *" },
                    { label: "Monthly Noon", expr: "0 12 1 * *" }
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => selectTemplate(preset.expr)}
                      className="text-[10px] rounded border bg-background hover:bg-muted py-1.5 px-2 text-foreground font-semibold cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea 
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Task responsibility details..."
                  rows={2}
                  className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                Create Scheduled Job
              </button>
            </form>
          </div>
        </div>

        {/* Current Schedulers Table */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/10">
              <h2 className="text-sm font-bold text-foreground">Current Active Schedulers ({jobs.length})</h2>
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">System Running</Badge>
            </div>
            
            <div className="divide-y divide-border/60">
              {jobs.map((job) => (
                <div key={job.id} className="p-5 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-foreground">{job.name}</span>
                        <Badge variant="outline" className="font-mono text-[10px] tracking-wide px-2 py-0.5">
                          {job.expression}
                        </Badge>
                        <Badge className={
                          job.status === "active" 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-slate-400/10 text-slate-500 border-slate-400/20"
                        }>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[500px]">
                        {job.description}
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 pt-1.5 font-mono text-[10px] text-muted-foreground">
                        <div>
                          <span>Target Host: </span>
                          <span className="font-semibold text-foreground">{job.targetNode}</span>
                        </div>
                        <div>
                          <span>Last Run: </span>
                          <span className="font-semibold text-foreground">{job.lastRun}</span>
                        </div>
                        <div>
                          <span>Next Run: </span>
                          <span className="font-semibold text-foreground">{job.nextRun}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0 self-start">
                      <button
                        onClick={() => triggerJobNow(job.name)}
                        className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-sky-500 rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <PlayIcon className="size-2.5 fill-current" /> Run Now
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          className="flex-1 text-center text-muted-foreground hover:text-foreground border rounded py-1 px-2 text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          {job.status === "active" ? "Pause" : "Resume"}
                        </button>
                        <button
                          onClick={() => deleteJob(job.id, job.name)}
                          className="p-1 border border-red-500/30 hover:bg-red-500/10 rounded text-red-500 transition-all cursor-pointer"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

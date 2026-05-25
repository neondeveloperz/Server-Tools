"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { toast } from "sonner"
import { 
  TerminalIcon, 
  PlayIcon, 
  Trash2Icon, 
  ChevronRightIcon, 
  WifiIcon
} from "lucide-react"

interface TerminalLine {
  text: string
  type: "input" | "output" | "system" | "error"
}

export function SSHView() {
  const [activeHost, setActiveHost] = useState("ap-southeast-production-01")
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: `Welcome to Server Tools SSH Shell v2.4.1`, type: "system" },
    { text: `Authorized keys synced. Secure session initialized under TLS 1.3.`, type: "system" },
    { text: `Last login: Mon May 25 03:12:05 2026 from 27.55.62.190`, type: "system" },
    { text: `admin@${activeHost}:~$ `, type: "input" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const writeLinesSlowly = async (lines: string[], lineIndex = 0) => {
    if (lineIndex >= lines.length) {
      setHistory(prev => [...prev, { text: `admin@${activeHost}:~$ `, type: "input" }])
      setIsTyping(false)
      return
    }

    setHistory(prev => [...prev, { text: lines[lineIndex], type: lines[lineIndex].startsWith("error:") ? "error" : "output" }])
    
    // Simulate slight network delay between outputs
    setTimeout(() => {
      writeLinesSlowly(lines, lineIndex + 1)
    }, 150)
  }

  const runCommand = async (commandText: string) => {
    if (isTyping) return
    setIsTyping(true)

    // Remove the trailing input line temporarily to show clean history
    setHistory(prev => {
      const copy = [...prev]
      if (copy[copy.length - 1].type === "input") {
        copy.pop()
      }
      return [...copy, { text: `admin@${activeHost}:~$ ${commandText}`, type: "input" }]
    })

    // Simulate server execution latency
    setTimeout(() => {
      let outputs: string[] = []

      switch (commandText.trim()) {
        case "docker ps":
          outputs = [
            "CONTAINER ID   IMAGE                 COMMAND                  CREATED        STATUS        PORTS                    NAMES",
            "a5c88f18d7b3   nginx:alpine          \"/docker-entrypoint.…\"   2 hours ago    Up 2 hours    0.0.0.0:80->80/tcp       web-nginx",
            "d10bb244ac5e   postgres:15-alpine   \"docker-entrypoint.s…\"   2 days ago     Up 2 days     0.0.0.0:5432->5432/tcp   db-postgres",
            "f99c27ee98e2   redis:7-alpine        \"docker-entrypoint.s…\"   5 days ago     Up 5 days     6379/tcp                 cache-redis"
          ]
          break
        case "sudo apt update":
          outputs = [
            "Hit:1 http://ap-southeast-1.ec2.archive.ubuntu.com/ubuntu noble InRelease",
            "Get:2 http://ap-southeast-1.ec2.archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]",
            "Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]",
            "Fetched 252 kB in 1s (220 kB/s)",
            "Reading package lists... Done",
            "Building dependency tree... Done",
            "All packages are up to date."
          ]
          break
        case "netstat -plnt":
          outputs = [
            "Active Internet connections (only servers)",
            "Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name",
            "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      4218/nginx: master ",
            "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      912/sshd: default  ",
            "tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      1014/postgres      ",
            "tcp6       0      0 :::80                   :::*                    LISTEN      4218/nginx: master "
          ]
          break
        case "top -b -n 1":
          outputs = [
            "top - 03:36:12 up 5 days, 12:44,  1 user,  load average: 0.15, 0.08, 0.03",
            "Tasks: 114 total,   1 running, 113 sleeping,   0 stopped,   0 zombie",
            "%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 94.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st",
            "MiB Mem :   3936.4 total,   1104.2 free,   1520.1 used,   1312.1 buff/cache",
            "MiB Swap:      0.0 total,      0.0 free,      0.0 used.   2144.5 avail Mem ",
            "",
            "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
            " 4218 root      20   0  114256  24152  18204 S   2.2   0.6   0:15.82 nginx  ",
            " 1014 postgres  20   0  352410  94120  85420 S   1.5   2.3   8:44.20 postgres",
            "  912 root      20   0   71240   8120   6140 S   0.2   0.2   0:02.14 sshd   "
          ]
          break
        case "clear":
          setHistory([{ text: `admin@${activeHost}:~$ `, type: "input" }])
          setIsTyping(false)
          return
        default:
          if (commandText.trim() === "") {
            outputs = []
          } else {
            outputs = [
              `bash: ${commandText.split(" ")[0]}: command not found.`,
              `error: Available visual sandbox commands are: 'docker ps', 'sudo apt update', 'netstat -plnt', 'top -b -n 1', 'clear'`
            ]
          }
      }

      writeLinesSlowly(outputs)
    }, 400)
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return
    const cmd = inputValue
    setInputValue("")
    runCommand(cmd)
  }

  const handleQuickCommand = (cmd: string) => {
    if (isTyping) return
    runCommand(cmd)
  }

  const clearHistory = () => {
    setHistory([
      { text: `Terminal registry reset. Secure connection to admin@${activeHost} active.`, type: "system" },
      { text: `admin@${activeHost}:~$ `, type: "input" }
    ])
    toast.success("Terminal display history cleared.")
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 p-4 md:p-6 overflow-hidden h-[calc(100vh-100px)]">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <TerminalIcon className="size-6 text-sky-500" />
            SSH Shell Tunnels
          </h1>
          <p className="text-sm text-muted-foreground">Open encrypted terminal tunnels directly over standard secure sockets.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <WifiIcon className="size-3.5 animate-pulse" /> Connected
          </span>
          
          <select 
            value={activeHost}
            onChange={(e) => {
              setActiveHost(e.target.value)
              toast.info(`Switched terminal tunnel session to ${e.target.value}`)
              setHistory([
                { text: `Switched session to admin@${e.target.value}`, type: "system" },
                { text: `Synched virtual environment key mappings.`, type: "system" },
                { text: `admin@${e.target.value}:~$ `, type: "input" }
              ])
            }}
            className="rounded-lg border bg-card/65 px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 cursor-pointer"
          >
            <option value="ap-southeast-production-01">ap-southeast-production-01</option>
            <option value="us-east-compute-web-gateway">us-east-compute-web-gateway</option>
            <option value="db-replica-mariadb-ha">db-replica-mariadb-ha</option>
          </select>
        </div>
      </div>

      {/* Quick Command Toolbar */}
      <div className="bg-card border rounded-xl p-4 shadow-sm shrink-0">
        <h2 className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-2">Simulate Quick Diagnostic Commands:</h2>
        <div className="flex flex-wrap gap-2">
          {["docker ps", "sudo apt update", "netstat -plnt", "top -b -n 1", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleQuickCommand(cmd)}
              disabled={isTyping}
              className="flex items-center gap-1.5 rounded-md bg-background hover:bg-sky-500/10 hover:border-sky-500/40 border text-xs px-3 py-1.5 font-mono text-foreground transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <PlayIcon className="size-2.5 fill-current text-sky-500" />
              {cmd}
            </button>
          ))}
          
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 rounded-md bg-background hover:bg-red-500/10 hover:border-red-500/40 border text-xs px-3 py-1.5 font-mono text-red-500 transition-all duration-200 ml-auto cursor-pointer"
          >
            <Trash2Icon className="size-3.5" />
            Clear Visuals
          </button>
        </div>
      </div>

      {/* Interactive Monospace Terminal Screen */}
      <div className="flex-1 min-h-0 bg-black/95 rounded-xl border border-border/80 shadow-2xl p-4 font-mono text-sm overflow-hidden flex flex-col relative">
        <div className="absolute top-3 right-4 flex items-center gap-2 select-none">
          <span className="size-3 rounded-full bg-red-500/50" />
          <span className="size-3 rounded-full bg-yellow-500/50" />
          <span className="size-3 rounded-full bg-emerald-500/50" />
        </div>
        
        {/* Terminal Line Logs Container */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
          {history.map((line, idx) => {
            if (line.type === "system") {
              return (
                <div key={idx} className="text-zinc-500 text-[12px] flex items-center gap-1.5">
                  <span className="text-sky-500 font-bold select-none">&gt;&gt;</span>
                  {line.text}
                </div>
              )
            }
            if (line.type === "input") {
              return (
                <div key={idx} className="text-white flex items-center">
                  <ChevronRightIcon className="size-4 shrink-0 text-emerald-400 select-none mr-0.5" />
                  <span className="whitespace-pre-wrap">{line.text.replace(`admin@${activeHost}:~$ `, "")}</span>
                  {idx === history.length - 1 && isTyping && (
                    <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </div>
              )
            }
            if (line.type === "error") {
              return (
                <div key={idx} className="text-red-400 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              )
            }
            return (
              <div key={idx} className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed text-[13px]">
                {line.text}
              </div>
            )
          })}
          
          <div ref={terminalEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="mt-3 pt-3 border-t border-zinc-900 flex items-center shrink-0">
          <span className="text-emerald-400 select-none mr-1.5 shrink-0 flex items-center gap-0.5 font-bold">
            admin@{activeHost}:~$
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Type 'docker ps', 'sudo apt update', or press quick play buttons..."
            className="flex-1 bg-transparent text-white outline-none border-none focus:ring-0 placeholder-zinc-700 text-sm font-mono w-full"
            autoFocus
          />
          {inputValue && (
            <button 
              type="submit"
              className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1 rounded font-bold cursor-pointer"
            >
              RUN
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

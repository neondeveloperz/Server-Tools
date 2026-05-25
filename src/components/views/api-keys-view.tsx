"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { 
  KeyIcon, 
  Trash2Icon, 
  CopyIcon, 
  CheckIcon, 
  LockIcon, 
  ShieldCheckIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ApiKey {
  id: string
  name: string
  keySnippet: string
  scopes: string[]
  created: string
  status: "active" | "revoked"
}

const initialKeys: ApiKey[] = [
  { id: "key-1", name: "prometheus-metrics-scraper", keySnippet: "st_live_a71f...882e", scopes: ["read:nodes", "read:network"], created: "2026-04-12 10:15:30", status: "active" },
  { id: "key-2", name: "github-actions-deployer-node", keySnippet: "st_live_58c2...d912", scopes: ["write:nodes", "write:cron", "read:nodes"], created: "2026-05-02 18:42:00", status: "active" },
  { id: "key-3", name: "legacy-billing-syncer-key", keySnippet: "st_live_b94a...924f", scopes: ["read:cloud"], created: "2025-12-01 09:00:00", status: "revoked" }
]

export function ApiKeysView() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Create state inputs
  const [tokenName, setTokenName] = useState("")
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:nodes"])
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev => 
      prev.includes(scope)
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    )
  }

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenName.trim()) {
      toast.warning("Please enter an API Token description name.")
      return
    }

    setIsGenerating(true)
    
    // Simulate generation math
    setTimeout(() => {
      const entropy = Array.from({ length: 24 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
      const mockToken = `st_live_${entropy}`

      const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        name: tokenName.toLowerCase().replace(/\s+/g, "-"),
        keySnippet: `st_live_${entropy.slice(0, 4)}...${entropy.slice(-4)}`,
        scopes: selectedScopes,
        created: new Date().toISOString().replace("T", " ").slice(0, 19),
        status: "active"
      }

      setKeys(prev => [newKey, ...prev])
      setGeneratedSecret(mockToken)
      setIsGenerating(false)
      setHasCopied(false)
      setTokenName("")
      toast.success("Security Access API Token successfully generated!")
    }, 1500)
  }

  const revokeKey = (id: string, name: string) => {
    setKeys(prev => prev.map(key => {
      if (key.id === id) {
        toast.error(`Token '${name}' has been immediately revoked!`)
        return { ...key, status: "revoked" }
      }
      return key
    }))
  }

  const copyToClipboard = async (secret: string) => {
    await navigator.clipboard.writeText(secret)
    setHasCopied(true)
    toast.success("API Token copied safely to secure clipboard.")
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <KeyIcon className="size-6 text-sky-500" />
            API Keys & Access
          </h1>
          <p className="text-sm text-muted-foreground">Provision secure integration tokens to allow automated metrics collectors or Git branches to query node states.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Token provision Wizard panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <LockIcon className="size-4 text-sky-500" />
              Generate API Token
            </h2>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Token Label Name</label>
                <input 
                  type="text" 
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. datadog-collector-agent"
                  className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              {/* Scopes picker group */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Select Associated Scopes</label>
                <div className="space-y-2">
                  {[
                    { scope: "read:nodes", desc: "Read virtual machine CPU/RAM diagnostics." },
                    { scope: "write:nodes", desc: "Allows starting, stopping, and rebooting nodes." },
                    { scope: "write:cron", desc: "Allows modification and creation of cron tasks." },
                    { scope: "read:cloud", desc: "Read connected AWS, GCP and cloud state statistics." }
                  ].map((item) => (
                    <div 
                      key={item.scope}
                      onClick={() => toggleScope(item.scope)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                        selectedScopes.includes(item.scope)
                          ? "bg-sky-500/[0.03] border-sky-500/40"
                          : "bg-background/20 border-border/30 hover:bg-muted/10"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedScopes.includes(item.scope)}
                        onChange={() => {}} // handled by click container
                        className="w-3.5 h-3.5 text-sky-600 rounded border-gray-300 mt-0.5"
                      />
                      <div>
                        <span className="font-mono text-[11px] font-bold text-foreground block">{item.scope}</span>
                        <span className="text-[9px] text-muted-foreground leading-normal block">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-muted disabled:text-muted-foreground text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                {isGenerating ? "Generating secure entropy..." : "Generate Security Token"}
              </button>
            </form>

            {/* Generated secrete card displayed ONCE */}
            {generatedSecret && (
              <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl p-4 space-y-2.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <ShieldCheckIcon className="size-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Secret Token Provisioned:</span>
                </div>
                <p className="text-[9px] text-muted-foreground">Copy this key now. For your security, this key will not be shown again.</p>
                
                <div className="flex items-center gap-2 bg-background p-2 rounded-md border font-mono text-[11px] text-foreground select-text relative">
                  <span className="truncate pr-8">{generatedSecret}</span>
                  <button
                    onClick={() => copyToClipboard(generatedSecret)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {hasCopied ? <CheckIcon className="size-3.5 text-emerald-500 font-bold" /> : <CopyIcon className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Keys Table */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/80 bg-muted/10">
              <h2 className="text-sm font-bold text-foreground">Current Active Keys</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-semibold text-muted-foreground border-b bg-muted/5 uppercase">
                    <th className="py-3 px-4">Token Name</th>
                    <th>Public Snippet</th>
                    <th>Assigned Scopes</th>
                    <th>Created On</th>
                    <th>Status</th>
                    <th className="text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs select-none">
                  {keys.map((key) => (
                    <tr key={key.id} className="hover:bg-muted/10">
                      <td className="py-3.5 px-4 font-bold text-foreground truncate max-w-[150px]">{key.name}</td>
                      <td className="font-mono text-muted-foreground">{key.keySnippet}</td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {key.scopes.map(scope => (
                            <Badge key={scope} variant="outline" className="font-mono text-[9px] px-1 py-0 select-none">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="font-mono text-muted-foreground">{key.created}</td>
                      <td>
                        <Badge className={
                          key.status === "active" 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20 capitalize"
                        }>
                          {key.status}
                        </Badge>
                      </td>
                      <td className="text-right pr-4">
                        <button
                          onClick={() => revokeKey(key.id, key.name)}
                          disabled={key.status === "revoked"}
                          className="p-1.5 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-30 disabled:pointer-events-none rounded text-red-500 transition-all cursor-pointer"
                          title="Revoke Token IMMEDIATELY"
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
    </div>
  )
}

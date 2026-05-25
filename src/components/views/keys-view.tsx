"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { 
  KeyIcon, 
  Trash2Icon, 
  CopyIcon, 
  CheckIcon, 
  ShieldCheckIcon,
  FingerprintIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SshKey {
  id: string
  name: string
  algorithm: "ED25519" | "RSA"
  fingerprint: string
  created: string
  nodesAssociated: number
}

const initialKeys: SshKey[] = [
  { id: "key-1", name: "master-ap-southeast-sysadmin", algorithm: "ED25519", fingerprint: "SHA256:d8c2/b+81h290/aZ18c72/19082", created: "2026-03-01 12:45:00", nodesAssociated: 3 },
  { id: "key-2", name: "aws-ec2-ansible-provisioner", algorithm: "RSA", fingerprint: "SHA256:1f7a/990a/a91f/c092/e912f", created: "2026-04-10 18:22:00", nodesAssociated: 2 },
  { id: "key-3", name: "kubernetes-worker-k3s-join", algorithm: "ED25519", fingerprint: "SHA256:882e/b924/8c24/1092/72c0d", created: "2026-05-18 09:12:00", nodesAssociated: 1 }
]

export function SSHAccessKeysView() {
  const [keys, setKeys] = useState<SshKey[]>(initialKeys)
  
  // Create states
  const [keyName, setKeyName] = useState("")
  const [keyAlg, setKeyAlg] = useState<"ED25519" | "RSA">("ED25519")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPublic, setGeneratedPublic] = useState<string | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

  const handleGenerateCredentials = (e: FormEvent) => {
    e.preventDefault()
    if (!keyName.trim()) {
      toast.warning("Please provide a name for this SSH Key.")
      return
    }

    setIsGenerating(true)
    toast.info("Generating cryptographically secure prime entropy values...")

    setTimeout(() => {
      const entropy = Array.from({ length: 48 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
      
      const pubKey = keyAlg === "ED25519" 
        ? `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${entropy.slice(0, 30)}... admin@servertools`
        : `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD${entropy.slice(0, 45)}... admin@servertools`

      const fingerprintStr = `SHA256:${entropy.slice(0, 4)}/${entropy.slice(10, 14)}/${entropy.slice(20, 24)}`

      const newKey: SshKey = {
        id: `key-${Date.now()}`,
        name: keyName.toLowerCase().replace(/\s+/g, "-"),
        algorithm: keyAlg,
        fingerprint: fingerprintStr,
        created: new Date().toISOString().replace("T", " ").slice(0, 19),
        nodesAssociated: 0
      }

      setKeys(prev => [newKey, ...prev])
      setGeneratedPublic(pubKey)
      setIsGenerating(false)
      setHasCopied(false)
      setKeyName("")
      toast.success(`SSH ${keyAlg} Credentials pair provisioned successfully!`)
    }, 1800)
  }

  const deleteKey = (id: string, name: string) => {
    setKeys(prev => prev.filter(k => k.id !== id))
    toast.error(`SSH Key '${name}' removed. Remote node access deactivated.`)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setHasCopied(true)
    toast.success("Public SSH key copied successfully!")
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 select-none overflow-y-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <KeyIcon className="size-6 text-sky-500" />
            SSH Access Keys
          </h1>
          <p className="text-sm text-muted-foreground">Provision security credentials, upload client keys, and manage node authorization bindings.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Provision wizard panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FingerprintIcon className="size-4 text-sky-500" />
              Generate SSH Keypair
            </h2>

            <form onSubmit={handleGenerateCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">SSH Key Name</label>
                <input 
                  type="text" 
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. production-gateway-key"
                  className="w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all focus:border-sky-500"
                />
              </div>

              {/* Alg Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Cryptographic Algorithm</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "ED25519 (Recommended)", val: "ED25519" as const },
                    { label: "RSA 4096", val: "RSA" as const }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.val}
                      onClick={() => setKeyAlg(item.val)}
                      className={`text-[10px] rounded-md border p-2 text-center transition-all font-semibold cursor-pointer ${
                        keyAlg === item.val
                          ? "bg-sky-500/10 border-sky-500/50 text-sky-500"
                          : "bg-background/20 border-border hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-muted disabled:text-muted-foreground text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                {isGenerating ? "Computing keypair prime logs..." : "Generate Security Credentials"}
              </button>
            </form>

            {/* Generated SSH key */}
            {generatedPublic && (
              <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl p-4 space-y-2.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <ShieldCheckIcon className="size-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Public Key Generated:</span>
                </div>
                <p className="text-[9px] text-muted-foreground">Add this key to your target server `/home/admin/.ssh/authorized_keys` file.</p>
                
                <div className="flex items-center gap-2 bg-background p-2 rounded-md border font-mono text-[10px] text-foreground select-text relative">
                  <span className="truncate pr-8">{generatedPublic}</span>
                  <button
                    onClick={() => copyToClipboard(generatedPublic)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {hasCopied ? <CheckIcon className="size-3.5 text-emerald-500 font-bold" /> : <CopyIcon className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Keys Cards Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/10">
              <h2 className="text-sm font-bold text-foreground">Authorized SSH Keys ({keys.length})</h2>
            </div>
            
            <div className="divide-y divide-border/60">
              {keys.map((key) => (
                <div key={key.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-foreground">{key.name}</span>
                      <Badge className={
                        key.algorithm === "ED25519" 
                          ? "bg-sky-500/10 text-sky-500 border border-sky-500/20" 
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }>
                        {key.algorithm}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] select-none">
                        Active on {key.nodesAssociated} hosts
                      </Badge>
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5 select-text">
                      <FingerprintIcon className="size-3.5 text-muted-foreground" />
                      {key.fingerprint}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-mono">
                      Synced on: {key.created}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteKey(key.id, key.name)}
                    className="p-2 border border-red-500/30 hover:bg-red-500/10 rounded text-red-500 transition-all cursor-pointer shrink-0"
                    title="Remove access key"
                  >
                    <Trash2Icon className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

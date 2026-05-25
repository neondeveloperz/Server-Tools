"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* CARD 1: Total Servers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Servers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-mono">
            10 Nodes
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
              <TrendingUpIcon />
              8 Online
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cluster health status optimal{" "}
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground text-xs">
            2 offline, 0 maintenance nodes
          </div>
        </CardFooter>
      </Card>

      {/* CARD 2: CPU Avg Load */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>CPU Avg Load</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-mono">
            26.2%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
              Normal
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Core loads optimal levels{" "}
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground text-xs">
            Peak load reached 85% on Gateway
          </div>
        </CardFooter>
      </Card>

      {/* CARD 3: Memory Avg Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Memory Avg Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-mono">
            63.1%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/5 animate-pulse">
              Heavy Cache
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Buffer pools saturated{" "}
            <TrendingUpIcon className="size-4 text-amber-500" />
          </div>
          <div className="text-muted-foreground text-xs">
            Redis cluster consuming 89% RAM
          </div>
        </CardFooter>
      </Card>

      {/* CARD 4: Network Inbound/Outbound */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Network Throughput</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-mono">
            2.4 GB/s
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
              +14.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active replication channels{" "}
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground text-xs">
            Stable inbound/outbound packets sync
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

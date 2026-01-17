"use client"

import { useRouter } from "next/navigation"
import { api } from "../../lib/api"

export function WatchlistRemoveButton({ symbol }: { symbol: string }) {
  const router = useRouter()

  return (
    <button
      className="rounded-lg border px-3 py-1 text-xs hover:bg-zinc-50"
      onClick={async () => {
        await api.watchlistPurge(symbol)
        router.refresh()
      }}
    >
      Remove
    </button>
  )
}

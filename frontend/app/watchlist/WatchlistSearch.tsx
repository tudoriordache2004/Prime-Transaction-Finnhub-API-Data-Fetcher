"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { api } from "../../lib/api"

type Props = {
  existingSymbols: string[]
  onChanged?: () => void
}

export function WatchlistSearch({ existingSymbols, onChanged }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const existing = useMemo(() => new Set(existingSymbols), [existingSymbols])

  // Close dropdown when clicking outside + on Escape
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setItems([])
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setItems([])
    }

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  // Search debounce
  useEffect(() => {
    const query = q.trim()
    if (query.length < 2) {
      setItems([])
      return
    }

    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.search(query)
        setItems(res?.result ?? [])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(t)
  }, [q])

  return (
    <div ref={containerRef} className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Search symbols (e.g. apple, tsla, spy)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {loading && <span className="text-xs text-zinc-500">Loading…</span>}
      </div>

      {items.length > 0 && (
        <ul className="mt-3 divide-y rounded-lg border">
          {items.slice(0, 10).map((it) => {
            const sym = (it.symbol ?? "").toUpperCase()
            const inWl = existing.has(sym)

            return (
              <li
                key={sym}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium">{sym}</div>
                  <div className="text-zinc-600">{it.description ?? "-"}</div>
                </div>

                <button
                  className="rounded-lg border px-3 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50"
                  disabled={!sym}
                  onClick={async () => {
                    if (inWl) {
                      await api.watchlistPurge(sym)
                    } else {
                      await api.watchlistAdd(sym)
                      await api.refreshSymbol(sym)
                      setItems([])
                      onChanged?.()
                    }
                    setItems([])
                    onChanged?.()
                  }}
                >
                  {inWl ? "Remove" : "Add"}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

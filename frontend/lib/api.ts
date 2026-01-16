import type { QuoteLatest, Stock, Watchlist } from "./types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }

  return (await res.json()) as T
}

export const api = {
  watchlist: () => getJson<Watchlist>("/watchlist"),
  watchlistStocks: () => getJson<Stock[]>("/watchlist/stocks"),
  stocks: () => getJson<Stock[]>("/stocks"),
  stock: (symbol: string) =>
    getJson<Stock>(`/stocks/${encodeURIComponent(symbol)}`),

  quotesLatestAll: () => getJson<QuoteLatest[]>("/quotes/latest"),
  quoteLatest: (symbol: string) =>
    getJson<QuoteLatest>(`/quotes/latest/${encodeURIComponent(symbol)}`),
}

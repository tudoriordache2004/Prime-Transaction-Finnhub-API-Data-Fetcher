export type Stock = {
  symbol: string
  name: string | null
  currency: string | null
  exchange: string | null
  industry: string | null
  updated_at: string
}

export type QuoteLatest = {
  symbol: string
  current_price: number | null
  high_price: number | null
  low_price: number | null
  open_price: number | null
  previous_close: number | null
  quote_ts: number
  updated_at: string
}

export type Watchlist = {
  symbols: string[]
  source: string
}

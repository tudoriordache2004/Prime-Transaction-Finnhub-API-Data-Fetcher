import Link from "next/link"
import { api } from "../../lib/api"

export default async function StocksPage() {
  const stocks = await api.stocks()

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Stocks</h1>
          <Link className="text-sm underline" href="/watchlist">
            Watchlist
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-white">
          <ul className="divide-y">
            {stocks.map((s) => (
              <li key={s.symbol} className="px-4 py-3">
                <Link
                  className="underline font-medium"
                  href={`/stocks/${s.symbol}`}
                >
                  {s.symbol}
                </Link>
                <span className="ml-3 text-zinc-700">{s.name ?? "-"}</span>
              </li>
            ))}
            {stocks.length === 0 && (
              <li className="px-4 py-6 text-zinc-600">
                No stocks in DB yet. Run ingest and refresh.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}

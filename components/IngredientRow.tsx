'use client'

import Link from 'next/link'
import type { BarItem, StockStatus } from '@/lib/types'
import { useUserBar, effectiveStatus } from '@/lib/useUserBar'

const STATUS_DOT_CLS: Record<StockStatus, { bg: string; title: string }> = {
  ok: { bg: 'bg-emerald-500', title: 'En stock' },
  low: { bg: 'bg-gold-500', title: 'Bientôt fini' },
  out: { bg: 'bg-wine-700', title: 'Épuisé' },
}

export function IngredientRow({
  amount,
  item,
  bottle,
}: {
  amount: string
  item: string
  bottle: BarItem | null
}) {
  const { entry, hydrated } = useUserBar()
  const stockStatus: StockStatus | null = bottle
    ? hydrated
      ? effectiveStatus(bottle.defaultStatus, entry(bottle.id))
      : bottle.defaultStatus
    : null
  const dot = stockStatus ? STATUS_DOT_CLS[stockStatus] : null

  return (
    <li className="grid grid-cols-[5rem_1fr_auto] items-baseline gap-x-4 py-2.5">
      <span className="score-mono text-wine-700 font-semibold tabular-nums text-sm">
        {amount}
      </span>
      <span className="text-ink-900 flex items-center gap-2 min-w-0">
        {dot && (
          <span
            className={`w-2 h-2 rounded-full ${dot.bg} shrink-0`}
            title={dot.title}
            aria-label={dot.title}
          />
        )}
        <span className="truncate">{item}</span>
      </span>
      {bottle ? (
        <Link
          href={`/bar#${bottle.category}`}
          className="text-[10px] uppercase tracking-widest text-ink-400 hover:text-wine-700 font-mono"
          title={`${bottle.name} dans le bar`}
        >
          → {bottle.id}
        </Link>
      ) : (
        <span className="text-[10px] uppercase tracking-widest text-ink-300 font-mono">
          ext
        </span>
      )}
    </li>
  )
}

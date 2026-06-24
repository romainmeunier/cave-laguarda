'use client'

import type { BarItem, StockStatus } from '@/lib/types'
import { useUserBar, effectiveStatus } from '@/lib/useUserBar'

export function BarStats({ items }: { items: BarItem[] }) {
  const { entry, hydrated } = useUserBar()

  let ok = 0
  let low = 0
  let out = 0
  let modified = 0
  for (const item of items) {
    const e = hydrated ? entry(item.id) : {}
    const s: StockStatus = hydrated ? effectiveStatus(item.defaultStatus, e) : item.defaultStatus
    if (s === 'ok') ok++
    else if (s === 'low') low++
    else out++
    if (e.status && e.status !== item.defaultStatus) modified++
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      <Stat label="Références" value={String(items.length)} />
      <Stat label="En stock" value={hydrated ? String(ok) : '—'} accent="ok" />
      <Stat label="Bientôt fini" value={hydrated ? String(low) : '—'} accent="low" />
      <Stat label="Épuisé" value={hydrated ? String(out) : '—'} accent="out" />
      <Stat label="Modifs perso" value={hydrated ? String(modified) : '—'} />
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: StockStatus
}) {
  const accentCls =
    accent === 'ok'
      ? 'border-emerald-500'
      : accent === 'low'
      ? 'border-gold-500'
      : accent === 'out'
      ? 'border-wine-700'
      : 'border-ink-900/15'
  const valueCls =
    accent === 'ok'
      ? 'text-emerald-700'
      : accent === 'low'
      ? 'text-gold-600'
      : accent === 'out'
      ? 'text-wine-700'
      : 'text-ink-900'
  return (
    <div className={`border-l-2 pl-4 py-1 ${accentCls}`}>
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</div>
      <div className={`font-display text-2xl sm:text-3xl leading-tight tabular-nums ${valueCls}`}>
        {value}
      </div>
    </div>
  )
}

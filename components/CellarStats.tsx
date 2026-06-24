'use client'

import { useUserCellar } from '@/lib/useUserCellar'
import type { Wine } from '@/lib/types'
import { bestShopPrice } from '@/lib/data'

export function CellarStats({ wines }: { wines: Wine[] }) {
  const { cellar, hydrated } = useUserCellar()

  const totalBudget = wines.reduce((acc, w) => acc + bestShopPrice(w).price, 0)
  const deals = wines.filter((w) => w.dealFlag === 'deal').length
  const owned = Object.values(cellar).filter((e) => e.bought).length
  const tasted = Object.values(cellar).filter((e) => e.personalScore != null).length
  const avgScore = (() => {
    const scores = Object.values(cellar)
      .map((e) => e.personalScore)
      .filter((s): s is number => typeof s === 'number')
    if (!scores.length) return null
    return scores.reduce((a, b) => a + b, 0) / scores.length
  })()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
      <Stat label="Bouteilles" value={String(wines.length)} />
      <Stat label="Budget total" value={`$${totalBudget.toFixed(0)}`} />
      <Stat label="Affaires" value={String(deals)} accent />
      <Stat label="En cave" value={hydrated ? String(owned) : '—'} />
      <Stat
        label="Dégustées"
        value={
          hydrated
            ? avgScore != null
              ? `${tasted} · ${avgScore.toFixed(1)}/20`
              : String(tasted)
            : '—'
        }
      />
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border-l-2 pl-4 py-1 ${accent ? 'border-wine-700' : 'border-ink-900/15'}`}>
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</div>
      <div className={`font-display text-2xl sm:text-3xl leading-tight tabular-nums ${accent ? 'text-wine-700' : 'text-ink-900'}`}>
        {value}
      </div>
    </div>
  )
}

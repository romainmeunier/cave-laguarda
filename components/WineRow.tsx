import Link from 'next/link'
import type { Wine } from '@/lib/types'
import { bestShopPrice, countryFlags, shortCriticLabel } from '@/lib/data'
import { PriceTag } from './PriceTag'
import { UserStatusDot } from './UserStatusDot'

export function WineRow({ wine }: { wine: Wine }) {
  const price = bestShopPrice(wine)
  return (
    <Link
      href={`/wines/${wine.id}`}
      className="group grid grid-cols-[2.5rem_1.25rem_1fr_auto] sm:grid-cols-[2.5rem_1.25rem_minmax(0,1fr)_minmax(0,11rem)_5.25rem_auto] items-center gap-x-4 py-2.5 px-3 -mx-3 border-b border-ink-900/8 hover:bg-cream-100/70 transition relative odd:bg-cream-50/40"
    >
      <span className="font-mono text-[10px] uppercase text-ink-400 tabular-nums">
        {wine.id}
      </span>

      <span className="text-base leading-none" aria-hidden>
        {countryFlags[wine.country]}
      </span>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-display text-[17px] sm:text-lg leading-tight text-ink-900 group-hover:text-wine-700 truncate">
            {wine.name}
          </h3>
          {wine.vintage && (
            <span className="font-mono text-[11px] text-ink-500 tabular-nums shrink-0">
              {wine.vintage}
            </span>
          )}
          {wine.isHeadliner && (
            <span className="bg-wine-700 text-cream-50 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-medium shrink-0">
              ★
            </span>
          )}
        </div>
        <p className="text-xs text-ink-500 truncate mt-0.5">
          <span className="text-ink-700">{wine.producer}</span>
          <span className="text-ink-300 mx-1.5">·</span>
          <span>{wine.region}</span>
          {wine.appellation && wine.appellation !== wine.region && (
            <>
              <span className="text-ink-300 mx-1.5">·</span>
              <span>{wine.appellation}</span>
            </>
          )}
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap items-baseline gap-x-3 gap-y-0.5 min-w-0">
        {wine.criticScores.length === 0 ? (
          <span className="text-ink-300 font-mono text-xs">—</span>
        ) : (
          wine.criticScores.slice(0, 3).map((s, i) => (
            <span key={i} className="score-mono text-[12.5px] inline-flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-ink-400 text-[10.5px]">{shortCriticLabel(s.critic)}</span>
              <span className="text-wine-700 font-semibold tabular-nums">
                {s.scoreRange ?? s.score}
              </span>
              {s.label && (
                <span className="text-gold-600 text-[9.5px] uppercase tracking-widest">
                  {s.label === 'Best Buy' ? 'BB' : s.label}
                </span>
              )}
            </span>
          ))
        )}
      </div>

      <div className="hidden sm:flex items-center gap-1.5 justify-end">
        <CompactCategory category={wine.category} />
        {wine.dealFlag === 'deal' && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-wine-700 text-cream-50 text-[10px] font-bold" title="Affaire">
            ★
          </span>
        )}
        <UserStatusDot wineId={wine.id} />
      </div>

      <div className="text-right shrink-0 min-w-[5rem]">
        <PriceTag price={price} compact />
      </div>

      <div className="sm:hidden col-span-4 -mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <CompactCategory category={wine.category} />
        {wine.dealFlag === 'deal' && (
          <span className="text-[10px] uppercase tracking-widest text-wine-700 font-medium">
            ★ Affaire
          </span>
        )}
        {wine.criticScores.slice(0, 2).map((s, i) => (
          <span key={i} className="score-mono text-[11px] text-ink-500">
            {shortCriticLabel(s.critic)}{' '}
            <span className="text-wine-700 font-semibold">{s.scoreRange ?? s.score}</span>
          </span>
        ))}
      </div>
    </Link>
  )
}

function CompactCategory({ category }: { category: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    everyday: { label: 'Quotidien', cls: 'text-ink-500 border-ink-300' },
    'everyday+': { label: 'Quotidien +', cls: 'text-ink-700 border-ink-400' },
    mid: { label: 'Milieu', cls: 'text-gold-600 border-gold-500/60' },
    'mid-high': { label: 'Mi/Haut', cls: 'text-gold-600 border-gold-500' },
    high: { label: 'Pointu', cls: 'text-wine-700 border-wine-700/40' },
    keeper: { label: 'Garde', cls: 'text-cream-50 bg-wine-700 border-wine-700' },
  }
  const c = map[category] ?? map.everyday
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9.5px] uppercase tracking-widest font-medium border ${c.cls}`}>
      {c.label}
    </span>
  )
}

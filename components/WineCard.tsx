import Link from 'next/link'
import type { Wine } from '@/lib/types'
import { bestShopPrice, countryFlags } from '@/lib/data'
import { CriticScoresInline } from './CriticScores'
import { DealBadge, CategoryBadge } from './Badge'
import { PriceTag } from './PriceTag'
import { UserStatusDot } from './UserStatusDot'

export function WineCard({ wine }: { wine: Wine }) {
  const price = bestShopPrice(wine)
  return (
    <Link
      href={`/wines/${wine.id}`}
      className={`group block relative bg-cream-50 border border-ink-900/10 rounded-sm p-5 hover:border-wine-700/40 hover:shadow-[0_8px_28px_-12px_rgba(91,29,29,0.25)] transition ${wine.isHeadliner ? 'headliner-glow' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none" aria-hidden>{countryFlags[wine.country]}</span>
          <span className="text-[10px] uppercase tracking-widest text-ink-500 font-mono">
            {wine.id}
          </span>
          <CategoryBadge category={wine.category} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <UserStatusDot wineId={wine.id} />
          <DealBadge flag={wine.dealFlag} />
        </div>
      </div>

      <h3 className="font-display text-lg sm:text-xl text-ink-900 leading-tight tracking-tight group-hover:text-wine-700 transition">
        {wine.name}
      </h3>
      <p className="text-xs text-ink-500 uppercase tracking-widest mt-1 mb-3">
        {wine.producer} {wine.vintage ? `· ${wine.vintage}` : ''}
      </p>

      <p className="text-sm text-ink-700 mb-2">
        <span className="text-ink-500">{wine.region}</span>
        {wine.appellation && wine.appellation !== wine.region && (
          <span className="text-ink-500"> · {wine.appellation}</span>
        )}
      </p>

      <p className="text-[11px] uppercase tracking-widest text-ink-400 mb-4 font-mono">
        {wine.varietals.slice(0, 3).join(' · ')}
        {wine.varietals.length > 3 && ' …'}
      </p>

      <hr className="editorial-rule-thin mb-3" />

      <div className="flex items-end justify-between gap-3">
        <PriceTag price={price} />
        <CriticScoresInline scores={wine.criticScores} max={2} />
      </div>

      {wine.isHeadliner && (
        <span className="absolute -top-2 -right-2 bg-wine-700 text-cream-50 text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm font-medium">
          ★ La pioche
        </span>
      )}
    </Link>
  )
}

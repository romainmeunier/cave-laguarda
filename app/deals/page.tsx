import Link from 'next/link'
import { wines, bestShopPrice, countryFlags } from '@/lib/data'
import { CriticScoresInline } from '@/components/CriticScores'
import { PriceTag } from '@/components/PriceTag'
import { CategoryBadge } from '@/components/Badge'

export default function DealsPage() {
  const deals = wines.filter((w) => w.dealFlag === 'deal')
  const headliner = deals.find((w) => w.isHeadliner)
  const others = deals.filter((w) => !w.isHeadliner)

  const ranked = [...others].sort((a, b) => {
    const sa = Math.max(...(a.criticScores.map((s) => s.score).concat([0])))
    const sb = Math.max(...(b.criticScores.map((s) => s.score).concat([0])))
    const ratioA = sa / bestShopPrice(a).price
    const ratioB = sb / bestShopPrice(b).price
    return ratioB - ratioA
  })

  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          La chasse aux affaires · Quito
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          Les bonnes <span className="text-wine-700 italic">trouvailles</span>
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed">
          Vins où le rapport notes critiques / prix est exceptionnel,
          promotions agressives sur des cuvées notées, ou références à pedigree absent du marché local.
        </p>
      </section>

      {headliner && (
        <section className="mb-16">
          <p className="text-[11px] uppercase tracking-widest text-wine-700 mb-4 font-mono">
            La pioche du moment
          </p>
          <Link
            href={`/wines/${headliner.id}`}
            className="block headliner-glow bg-wine-700 text-cream-50 p-8 sm:p-12 rounded-sm group"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>{countryFlags[headliner.country]}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest opacity-60">
                  {headliner.id} · {headliner.region}
                </span>
              </div>
              <span className="bg-gold-500/90 text-wine-700 text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-bold">
                ★ Headliner
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl leading-[0.95] tracking-tight mb-3">
              {headliner.name}
            </h2>
            <p className="text-cream-100 italic mb-6">
              {headliner.producer} · {headliner.vintage}
            </p>
            <p className="text-cream-100/90 leading-relaxed mb-6 max-w-2xl">
              {headliner.curatorNotes}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4 pt-5 border-t border-cream-50/20">
              <div className="text-cream-50 score-mono">
                <span className="text-3xl sm:text-4xl font-semibold tabular-nums">
                  ${bestShopPrice(headliner).price.toFixed(2)}
                </span>
                {bestShopPrice(headliner).originalPrice && (
                  <span className="ml-3 line-through opacity-60 text-base tabular-nums">
                    ${bestShopPrice(headliner).originalPrice?.toFixed(2)}
                  </span>
                )}
                {bestShopPrice(headliner).promoPercent && (
                  <span className="ml-3 text-base">−{bestShopPrice(headliner).promoPercent}%</span>
                )}
              </div>
              <div className="text-cream-50">
                <CriticScoresInline scores={headliner.criticScores} />
              </div>
            </div>
          </Link>
        </section>
      )}

      <section>
        <p className="text-[11px] uppercase tracking-widest text-ink-500 mb-4 font-mono">
          Classées par rapport notes ÷ prix
        </p>
        <div className="space-y-1">
          {ranked.map((w, i) => (
            <Link
              key={w.id}
              href={`/wines/${w.id}`}
              className="group flex flex-col sm:flex-row sm:items-baseline gap-x-6 gap-y-2 py-5 border-b border-ink-900/10 hover:bg-cream-100/50 px-3 -mx-3 transition"
            >
              <div className="flex items-baseline gap-3 shrink-0 w-12">
                <span className="font-display text-2xl text-wine-700 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-base" aria-hidden>{countryFlags[w.country]}</span>
                  <h3 className="font-display text-xl text-ink-900 group-hover:text-wine-700 transition">
                    {w.name}
                  </h3>
                  <CategoryBadge category={w.category} />
                </div>
                <p className="text-xs text-ink-500 uppercase tracking-widest">
                  {w.producer} · {w.region}
                </p>
              </div>
              <div className="flex items-baseline gap-6">
                <CriticScoresInline scores={w.criticScores} max={3} />
                <PriceTag price={bestShopPrice(w)} compact />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

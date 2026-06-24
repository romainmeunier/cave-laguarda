import { notFound } from 'next/navigation'
import Link from 'next/link'
import { wines, getWine, getShop, countryFlags, countryLabels } from '@/lib/data'
import { CriticScoresTable } from '@/components/CriticScores'
import { DealBadge, CategoryBadge } from '@/components/Badge'
import { PriceTag } from '@/components/PriceTag'
import { WineActions } from '@/components/WineActions'

export function generateStaticParams() {
  return wines.map((w) => ({ id: w.id }))
}

export default function WinePage({ params }: { params: { id: string } }) {
  const wine = getWine(params.id)
  if (!wine) notFound()

  return (
    <article>
      <Link href="/" className="text-xs uppercase tracking-widest text-ink-500 hover:text-wine-700">
        ← Retour à la cave
      </Link>

      <header className="mt-6 mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
            {wine.id}
          </span>
          <span className="text-base" aria-hidden>{countryFlags[wine.country]}</span>
          <span className="text-xs uppercase tracking-widest text-ink-500">{countryLabels[wine.country]}</span>
          <CategoryBadge category={wine.category} />
          <DealBadge flag={wine.dealFlag} />
          {wine.isHeadliner && (
            <span className="bg-wine-700 text-cream-50 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-medium">
              ★ La pioche
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight mb-3">
          {wine.name}
        </h1>
        <p className="text-ink-500 text-lg italic">
          {wine.producer}
          {wine.vintage && <span className="not-italic text-ink-700"> · {wine.vintage}</span>}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <SectionTitle>Origine</SectionTitle>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 text-sm">
              <Field label="Région" value={wine.region} />
              <Field label="Appellation" value={wine.appellation ?? '—'} />
              <Field label="Type" value={wine.type === 'rosé' ? 'Rosé' : wine.type === 'red' ? 'Rouge' : wine.type === 'white' ? 'Blanc' : wine.type} />
              <Field label="Millésime" value={wine.vintage ?? 'À confirmer'} />
            </dl>
            <p className="text-[11px] uppercase tracking-widest text-ink-500 mt-5 mb-1.5">Cépages</p>
            <p className="text-ink-900 text-sm">{wine.varietals.join(' · ')}</p>
          </section>

          <section>
            <SectionTitle>Notes critiques</SectionTitle>
            <CriticScoresTable scores={wine.criticScores} />
          </section>

          {wine.tastingNotes && (
            <section>
              <SectionTitle>Dégustation</SectionTitle>
              <p className="text-ink-900 leading-relaxed">{wine.tastingNotes}</p>
            </section>
          )}

          {wine.foodPairings && wine.foodPairings.length > 0 && (
            <section>
              <SectionTitle>Accords mets</SectionTitle>
              <ul className="flex flex-wrap gap-2">
                {wine.foodPairings.map((f, i) => (
                  <li key={i} className="px-3 py-1.5 bg-cream-100 border border-ink-900/10 rounded-sm text-sm text-ink-900">
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {wine.drinkingWindow && (
            <section>
              <SectionTitle>Garde</SectionTitle>
              <p className="text-ink-900">{wine.drinkingWindow}</p>
            </section>
          )}

          {wine.curatorNotes && (
            <section>
              <SectionTitle>Note du curateur</SectionTitle>
              <p className="text-ink-700 italic leading-relaxed border-l-2 border-wine-700 pl-4">
                {wine.curatorNotes}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
            <h3 className="font-display text-lg text-ink-900 mb-3">Prix · cavistes</h3>
            <div className="space-y-3">
              {wine.shopPrices.map((sp, i) => {
                const shop = getShop(sp.shopId)
                return (
                  <div key={i} className="flex items-start justify-between gap-3 pb-3 border-b border-ink-900/10 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <Link
                        href={`/shops#${sp.shopId}`}
                        className="text-sm font-medium text-ink-900 hover:text-wine-700"
                      >
                        {shop?.name ?? sp.shopId}
                      </Link>
                      <p className="text-[10px] uppercase tracking-widest text-ink-400 font-mono mt-0.5">
                        Vérifié {sp.lastChecked}
                      </p>
                    </div>
                    <PriceTag price={sp} compact />
                  </div>
                )
              })}
            </div>
          </div>

          <WineActions wineId={wine.id} />
        </aside>
      </div>
    </article>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-widest text-ink-500 mb-3 pb-2 border-b border-ink-900/10 font-mono">
      {children}
    </h2>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </div>
  )
}

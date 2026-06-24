import Link from 'next/link'
import { shops, wines } from '@/lib/data'

export default function ShopsPage() {
  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          Cavistes · Quito & alentours
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          Où acheter
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed">
          Les cavistes sourcés pour cette cave. À étendre au fur et à mesure des découvertes locales (La Cava, Wine House, Cellar Ecuador, Quitovino…).
        </p>
      </section>

      <div className="space-y-12">
        {shops.map((shop) => {
          const carried = wines.filter((w) => w.shopPrices.some((p) => p.shopId === shop.id))
          return (
            <section key={shop.id} id={shop.id} className="scroll-mt-24">
              <header className="flex flex-wrap items-baseline justify-between gap-4 mb-6 pb-4 border-b border-ink-900/15">
                <div>
                  <h2 className="font-display text-3xl text-ink-900 leading-tight">{shop.name}</h2>
                  <p className="text-xs text-ink-500 uppercase tracking-widest mt-1">
                    {carried.length} bouteilles référencées
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {shop.website && (
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-3 py-1.5 border border-ink-900/15 rounded-sm hover:border-wine-700/40 hover:text-wine-700"
                    >
                      Site officiel ↗
                    </a>
                  )}
                  {shop.phone && (
                    <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="px-3 py-1.5 border border-ink-900/15 rounded-sm hover:border-wine-700/40 hover:text-wine-700">
                      {shop.phone}
                    </a>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-5">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest text-ink-500 mb-2 font-mono">
                      Boutiques
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {shop.locations.map((loc, i) => (
                        <li key={i} className={loc.isPrimary ? 'border-l-2 border-wine-700 pl-3' : 'border-l-2 border-ink-900/10 pl-3'}>
                          <p className="font-medium text-ink-900">{loc.name}</p>
                          <p className="text-ink-500 text-xs">{loc.address}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {shop.delivery && shop.delivery.length > 0 && (
                    <div>
                      <h3 className="text-[11px] uppercase tracking-widest text-ink-500 mb-2 font-mono">
                        Livraison
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {shop.delivery.map((d, i) => (
                          <li key={i}>
                            {d.url ? (
                              <a
                                href={d.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-ink-700 hover:text-wine-700 underline-offset-2 hover:underline"
                              >
                                {d.channel}
                                {d.storeId && <span className="text-ink-400 font-mono ml-1.5 text-xs">#{d.storeId}</span>}
                              </a>
                            ) : (
                              <span className="text-ink-700">{d.channel}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {shop.notes && (
                    <p className="text-xs text-ink-500 italic border-l-2 border-ink-900/10 pl-3">
                      {shop.notes}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-[11px] uppercase tracking-widest text-ink-500 mb-3 font-mono">
                    Vins référencés
                  </h3>
                  <ul className="space-y-2">
                    {carried.map((w) => (
                      <li key={w.id}>
                        <Link
                          href={`/wines/${w.id}`}
                          className="flex items-baseline justify-between gap-3 py-1.5 px-2 -mx-2 rounded-sm hover:bg-cream-100"
                        >
                          <span className="flex items-baseline gap-2 min-w-0">
                            <span className="font-mono text-[10px] uppercase text-ink-400 shrink-0">
                              {w.id}
                            </span>
                            <span className="text-ink-900 truncate">{w.name}</span>
                            <span className="text-ink-500 text-xs italic truncate hidden sm:inline">
                              {w.producer}
                            </span>
                          </span>
                          <span className="score-mono text-wine-700 tabular-nums shrink-0">
                            ${w.shopPrices.find((p) => p.shopId === shop.id)?.price.toFixed(2)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <section className="mt-20 pt-10 border-t border-ink-900/15">
        <h2 className="font-display text-2xl text-ink-700 mb-3">À sourcer</h2>
        <p className="text-ink-500 leading-relaxed max-w-2xl">
          Autres cavistes potentiels à Quito / Cumbayá à intégrer : <em>La Cava</em>,
          <em> Wine House Ecuador</em>, <em>Cellar Ecuador</em>, <em>Quitovino</em>,
          <em> Vinos del Mundo</em>. Une fois leurs catalogues passés en revue, leurs
          fiches s'ajouteront ici, et les vins référencés bénéficieront de prix
          multi-sources sur leur fiche détail.
        </p>
      </section>
    </div>
  )
}

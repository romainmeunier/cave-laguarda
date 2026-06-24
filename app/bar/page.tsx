import { barItems, barCategoryLabels, barCategoryOrder } from '@/lib/data'
import type { BarCategory, BarItem } from '@/lib/types'

const categoryIcons: Record<BarCategory, string> = {
  spiritueux: '🥃',
  liqueurs: '🍊',
  sirops: '🍯',
  bitters: '💧',
  frais: '🍋',
  divers: '🧂',
}

export default function BarPage() {
  const grouped = barCategoryOrder.map((cat) => ({
    cat,
    items: barItems.filter((b) => b.category === cat),
  }))

  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          Maison Meunier · Bar · Cumbayá
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          Le <span className="text-wine-700 italic">bar</span>.
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed">
          Inventaire des bouteilles, sirops maison, bitters et ingrédients frais qui
          composent les cocktails. Chaque référence est liée aux recettes qui l'utilisent.
        </p>
      </section>

      <hr className="editorial-rule mb-10" />

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-12">
        {grouped.map(({ cat, items }) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="group block text-left border-l-2 border-ink-900/15 pl-3 py-1 hover:border-wine-700 transition"
          >
            <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1 flex items-center gap-1.5">
              <span aria-hidden>{categoryIcons[cat]}</span>
              {barCategoryLabels[cat]}
            </div>
            <div className="font-display text-2xl text-ink-900 group-hover:text-wine-700 tabular-nums">
              {items.length}
            </div>
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {grouped.map(({ cat, items }) => (
          <section key={cat} id={cat} className="scroll-mt-24">
            <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-ink-900/15">
              <h2 className="font-display text-2xl text-ink-900 flex items-baseline gap-3">
                <span aria-hidden>{categoryIcons[cat]}</span>
                {barCategoryLabels[cat]}
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">
                {items.length} référence{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-ink-900/8">
              {items.map((item) => (
                <BarItemRow key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

function BarItemRow({ item }: { item: BarItem }) {
  const statusCfg = {
    ok: { label: 'En stock', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300/50' },
    low: { label: 'Bientôt fini', cls: 'bg-gold-400/20 text-gold-600 border-gold-400/40' },
    out: { label: 'Épuisé', cls: 'bg-wine-100 text-wine-700 border-wine-700/30' },
  }[item.defaultStatus]

  return (
    <li className="grid grid-cols-[2.75rem_1fr_auto] sm:grid-cols-[2.75rem_minmax(0,2fr)_minmax(0,3fr)_auto] items-baseline gap-x-4 py-3">
      <span className="font-mono text-[10px] uppercase text-ink-400 tabular-nums">{item.id}</span>

      <div className="min-w-0">
        <h3 className="font-display text-base text-ink-900 leading-tight truncate">{item.name}</h3>
        {item.brand && (
          <p className="text-xs text-ink-500 italic truncate">
            {item.brand}
            {item.origin && <span className="not-italic text-ink-400"> · {item.origin}</span>}
            {item.volume && <span className="not-italic text-ink-400 font-mono"> · {item.volume}</span>}
            {item.abv && <span className="not-italic text-ink-400 font-mono"> · {item.abv}%</span>}
          </p>
        )}
      </div>

      <p className="hidden sm:block text-sm text-ink-700 truncate italic">
        {item.notes ?? <span className="text-ink-400 not-italic">—</span>}
      </p>

      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${statusCfg.cls} justify-self-end`}>
        {statusCfg.label}
      </span>

      {item.notes && (
        <p className="sm:hidden col-span-3 text-xs text-ink-500 italic mt-1 -mb-1">
          {item.notes}
        </p>
      )}
    </li>
  )
}

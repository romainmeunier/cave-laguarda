import { barItems, barCategoryLabels, barCategoryOrder } from '@/lib/data'
import type { BarCategory } from '@/lib/types'
import { BarItemRow } from '@/components/BarItemRow'
import { BarStats } from '@/components/BarStats'

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
          Inventaire des bouteilles, sirops maison, bitters et ingrédients frais.
          Clique sur un statut pour le cycler (En stock → Bientôt fini → Épuisé). Édite
          les notes au clic. Synchronisé entre tes devices si tu es connecté.
        </p>
      </section>

      <hr className="editorial-rule mb-8" />

      <BarStats items={barItems} />

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mt-6 mb-12">
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

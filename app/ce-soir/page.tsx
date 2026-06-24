import { barItems, recipes } from '@/lib/data'
import { TonightList } from '@/components/TonightList'

export default function CeSoirPage() {
  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          Maison Meunier · Faisabilité · ce soir
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          Qu'est-ce que je peux faire <span className="text-wine-700 italic">ce soir</span> ?
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed">
          Calcul de faisabilité en direct depuis l'état actuel du bar. Une recette est
          <span className="text-emerald-700 font-medium"> prête</span> si tous ses
          ingrédients liés sont en stock,
          <span className="text-gold-600 font-medium"> stock bas</span> si certains sont
          à compléter, et <span className="text-wine-700 font-medium">à compléter</span>
          {' '}si une bouteille manque. Les ingrédients externes (œuf, café, eau gazeuse)
          sont comptés comme disponibles par défaut.
        </p>
      </section>

      <hr className="editorial-rule mb-10" />

      <TonightList recipes={recipes} barItems={barItems} />
    </div>
  )
}

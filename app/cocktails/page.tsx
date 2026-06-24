import Link from 'next/link'
import { recipes, spiritLabels, recipeStatusLabels } from '@/lib/data'
import type { Recipe, RecipeStatus, RecipeSpirit } from '@/lib/types'

const statusColors: Record<RecipeStatus, string> = {
  'À tester': 'border-gold-400/60 text-gold-600 bg-gold-400/10',
  'En cours': 'border-blue-400/40 text-blue-700 bg-blue-50',
  'Validé': 'border-emerald-400/50 text-emerald-700 bg-emerald-50',
  'Classique maison': 'border-wine-700 text-wine-700 bg-wine-100',
  'Abandonné': 'border-ink-300 text-ink-400 bg-cream-100',
}

const profileColors: Record<string, string> = {
  Floral: 'text-pink-700 bg-pink-50 border-pink-300/40',
  Acide: 'text-emerald-700 bg-emerald-50 border-emerald-300/40',
  Terreux: 'text-amber-700 bg-amber-50 border-amber-300/40',
  Mousseux: 'text-sky-700 bg-sky-50 border-sky-300/40',
  Fumé: 'text-stone-600 bg-stone-100 border-stone-300/40',
  Tropical: 'text-yellow-700 bg-yellow-50 border-yellow-300/40',
  Épicé: 'text-red-700 bg-red-50 border-red-300/40',
  Vif: 'text-teal-700 bg-teal-50 border-teal-300/40',
  Amer: 'text-purple-700 bg-purple-50 border-purple-300/40',
  Complexe: 'text-gold-600 bg-gold-400/10 border-gold-400/40',
  Crémeux: 'text-rose-700 bg-rose-50 border-rose-300/40',
  Festif: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-300/40',
  Léger: 'text-cyan-700 bg-cyan-50 border-cyan-300/40',
}

export default function CocktailsPage() {
  const grouped = groupBySpirit(recipes)
  const originalCount = recipes.filter((r) => r.isOriginal).length
  const validatedCount = recipes.filter((r) => r.defaultStatus === 'Validé').length

  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          Maison Meunier · Bar Romain · Cumbayá
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          Les <span className="text-wine-700 italic">cocktails</span>.
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed">
          {recipes.length} recettes — {originalCount} créations originales, {validatedCount} validées
          en dégustation. Catalogue curé pour les ingrédients du bar et les particularités
          locales (naranjilla, pisco péruvien, gin équatorien, cordial maison).
        </p>
      </section>

      <hr className="editorial-rule mb-10" />

      <div className="space-y-12">
        {grouped.map(({ spirit, recipes: rs }) => (
          <section key={spirit} id={spirit}>
            <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-ink-900/15">
              <h2 className="font-display text-2xl text-ink-900">
                {spiritLabels[spirit] ?? spirit}
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">
                {rs.length} recette{rs.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rs.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const statusCls = statusColors[recipe.defaultStatus] ?? statusColors['À tester']
  return (
    <Link
      href={`/cocktails/${recipe.id}`}
      className="group block bg-cream-50 border border-ink-900/10 rounded-sm p-5 hover:border-wine-700/40 hover:shadow-[0_8px_28px_-12px_rgba(91,29,29,0.25)] transition"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          {recipe.id}
        </span>
        <div className="flex items-center gap-2">
          {recipe.isOriginal && (
            <span className="text-[9px] uppercase tracking-widest font-medium text-wine-700">
              ★ Original
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${statusCls}`}>
            {recipeStatusLabels[recipe.defaultStatus] ?? recipe.defaultStatus}
          </span>
        </div>
      </div>

      <h3 className="font-display text-xl text-ink-900 group-hover:text-wine-700 leading-tight transition">
        {recipe.name}
      </h3>
      {recipe.tagline && (
        <p className="text-sm text-ink-500 italic mt-1 mb-3">{recipe.tagline}</p>
      )}

      <hr className="editorial-rule-thin my-3" />

      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.profile.map((p) => (
          <span
            key={p}
            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${profileColors[p] ?? 'border-ink-300 text-ink-500 bg-cream-100'}`}
          >
            {p}
          </span>
        ))}
      </div>

      <p className="text-xs text-ink-500 uppercase tracking-widest font-mono">
        {recipe.ingredients.length} ingrédients · {recipe.glass}
      </p>
    </Link>
  )
}

function groupBySpirit(rs: Recipe[]): { spirit: RecipeSpirit; recipes: Recipe[] }[] {
  const order: RecipeSpirit[] = ['pisco', 'mezcal', 'rhum', 'gin', 'liqueur', 'sparkling', 'vodka', 'tequila', 'whisky', 'other']
  const map = new Map<RecipeSpirit, Recipe[]>()
  for (const r of rs) {
    const arr = map.get(r.spirit) ?? []
    arr.push(r)
    map.set(r.spirit, arr)
  }
  return order
    .filter((s) => map.has(s))
    .map((s) => ({ spirit: s, recipes: map.get(s)! }))
}

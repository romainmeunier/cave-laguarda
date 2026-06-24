import { notFound } from 'next/navigation'
import Link from 'next/link'
import { recipes, getRecipe, getBarItem, spiritLabels, recipeStatusLabels } from '@/lib/data'
import type { Recipe } from '@/lib/types'

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }))
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = getRecipe(params.id)
  if (!recipe) notFound()

  return (
    <article>
      <Link href="/cocktails" className="text-xs uppercase tracking-widest text-ink-500 hover:text-wine-700">
        ← Tous les cocktails
      </Link>

      <header className="mt-6 mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
            {recipe.id}
          </span>
          <span className="text-xs uppercase tracking-widest text-gold-600 font-mono">
            {spiritLabels[recipe.spirit] ?? recipe.spirit}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border border-gold-400/60 text-gold-600 bg-gold-400/10">
            {recipeStatusLabels[recipe.defaultStatus] ?? recipe.defaultStatus}
          </span>
          {recipe.isOriginal && (
            <span className="bg-wine-700 text-cream-50 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-medium">
              ★ Création originale
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight mb-3">
          {recipe.name}
        </h1>
        {recipe.tagline && (
          <p className="text-ink-500 text-lg italic">{recipe.tagline}</p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <SectionTitle>Ingrédients</SectionTitle>
            <ul className="divide-y divide-ink-900/8">
              {recipe.ingredients.map((ing, i) => {
                const bottle = ing.bottleRef ? getBarItem(ing.bottleRef) : null
                return (
                  <li key={i} className="grid grid-cols-[5rem_1fr_auto] items-baseline gap-x-4 py-2.5">
                    <span className="score-mono text-wine-700 font-semibold tabular-nums text-sm">
                      {ing.amount}
                    </span>
                    <span className="text-ink-900">{ing.item}</span>
                    {bottle ? (
                      <Link
                        href={`/bar#${bottle.category}`}
                        className="text-[10px] uppercase tracking-widest text-ink-400 hover:text-wine-700 font-mono"
                        title={`Voir ${bottle.name} dans le bar`}
                      >
                        → {bottle.id}
                      </Link>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-ink-300 font-mono">
                        ext
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <SectionTitle>Méthode</SectionTitle>
            <p className="text-ink-900 leading-relaxed">{recipe.method}</p>
          </section>

          <section>
            <SectionTitle>Service</SectionTitle>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <Field label="Verre" value={recipe.glass} />
              <Field label="Profil" value={recipe.profile.join(' · ')} />
            </dl>
            {recipe.garnish && (
              <>
                <p className="text-[11px] uppercase tracking-widest text-ink-500 mt-5 mb-1.5">Garnish</p>
                <p className="text-ink-900">{recipe.garnish}</p>
              </>
            )}
          </section>

          {recipe.notes && (
            <section>
              <SectionTitle>Notes de création</SectionTitle>
              <p className="text-ink-700 italic leading-relaxed border-l-2 border-wine-700 pl-4">
                {recipe.notes}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
            <h3 className="font-display text-lg text-ink-900 mb-3">Stat</h3>
            <dl className="space-y-2 text-sm">
              <DSstat label="Base" value={spiritLabels[recipe.spirit] ?? recipe.spirit} />
              <DSstat label="Verre" value={recipe.glass} />
              <DSstat label="Ingrédients" value={String(recipe.ingredients.length)} />
              <DSstat label="Profil" value={recipe.profile.length + ' tags'} />
              {recipe.createdAt && <DSstat label="Créé" value={recipe.createdAt} />}
            </dl>
          </div>

          <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
            <h3 className="font-display text-lg text-ink-900 mb-1">Mon suivi</h3>
            <p className="text-xs text-ink-500 uppercase tracking-widest mb-3">À venir — phase 3</p>
            <p className="text-sm text-ink-700 leading-relaxed">
              Bientôt : marquer dégustée, ajouter ta version (modifs de ratio), notes
              perso sur cette recette, et tout ça synchronisé entre tes devices.
            </p>
          </div>
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

function DSstat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-[10px] uppercase tracking-widest text-ink-500">{label}</dt>
      <dd className="text-ink-900 font-medium">{value}</dd>
    </div>
  )
}

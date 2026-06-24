'use client'

import type { RecipeStatus } from '@/lib/types'
import { useUserRecipes, effectiveRecipeStatus } from '@/lib/useUserRecipes'

const CLS: Record<RecipeStatus, string> = {
  'À tester': 'border-gold-400/60 text-gold-600 bg-gold-400/10',
  'En cours': 'border-blue-400/50 text-blue-700 bg-blue-50',
  'Validé': 'border-emerald-500/60 text-emerald-700 bg-emerald-50',
  'Classique maison': 'border-wine-700 text-wine-700 bg-wine-100',
  'Abandonné': 'border-ink-300 text-ink-400 bg-cream-100',
}

const LABELS: Record<RecipeStatus, string> = {
  'À tester': 'À tester',
  'En cours': 'En cours',
  'Validé': 'Validé',
  'Classique maison': 'Classique',
  'Abandonné': 'Abandonné',
}

export function RecipeStatusBadge({
  recipeId,
  defaultStatus,
}: {
  recipeId: string
  defaultStatus: RecipeStatus
}) {
  const { entry, hydrated } = useUserRecipes()
  const e = entry(recipeId)
  const current = hydrated ? effectiveRecipeStatus(defaultStatus, e) : defaultStatus
  const overridden = hydrated && e.status != null && e.status !== defaultStatus
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${CLS[current]}`}
    >
      {LABELS[current]}
      {overridden && (
        <span className="w-1 h-1 rounded-full bg-current" aria-label="modifié" />
      )}
    </span>
  )
}

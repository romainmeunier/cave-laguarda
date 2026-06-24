import type { BarItem, Recipe, StockStatus, UserBar } from './types'
import { effectiveStatus } from './useUserBar'

export type Feasibility = {
  recipe: Recipe
  status: 'ready' | 'low' | 'one-missing' | 'missing'
  missing: { item: string; bottleId: string }[]
  low: { item: string; bottleId: string }[]
  externalIngredients: string[]
  inStockCount: number
  totalLinkedCount: number
}

function lookup(bottleId: string, barItems: BarItem[]): BarItem | null {
  return barItems.find((b) => b.id === bottleId) ?? null
}

export function computeFeasibility(
  recipe: Recipe,
  barItems: BarItem[],
  userBar: UserBar
): Feasibility {
  const missing: { item: string; bottleId: string }[] = []
  const low: { item: string; bottleId: string }[] = []
  const externalIngredients: string[] = []
  let inStockCount = 0
  let totalLinkedCount = 0

  for (const ing of recipe.ingredients) {
    if (!ing.bottleRef) {
      externalIngredients.push(ing.item)
      continue
    }
    const bottle = lookup(ing.bottleRef, barItems)
    if (!bottle) {
      // Référence vers un ID inexistant — traité comme manquant
      missing.push({ item: ing.item, bottleId: ing.bottleRef })
      totalLinkedCount++
      continue
    }
    totalLinkedCount++
    const userEntry = userBar[bottle.id] ?? {}
    const status: StockStatus = effectiveStatus(bottle.defaultStatus, userEntry)
    if (status === 'out') {
      missing.push({ item: ing.item, bottleId: bottle.id })
    } else if (status === 'low') {
      low.push({ item: ing.item, bottleId: bottle.id })
      inStockCount++
    } else {
      inStockCount++
    }
  }

  let status: Feasibility['status']
  if (missing.length === 0) {
    status = low.length === 0 ? 'ready' : 'low'
  } else if (missing.length === 1) {
    status = 'one-missing'
  } else {
    status = 'missing'
  }

  return {
    recipe,
    status,
    missing,
    low,
    externalIngredients,
    inStockCount,
    totalLinkedCount,
  }
}

export function sortFeasibility(items: Feasibility[]): Feasibility[] {
  const order: Record<Feasibility['status'], number> = {
    ready: 0,
    low: 1,
    'one-missing': 2,
    missing: 3,
  }
  return [...items].sort((a, b) => {
    const so = order[a.status] - order[b.status]
    if (so !== 0) return so
    // Tie-break : plus d'ingrédients en stock = meilleur
    const cmp = b.inStockCount - a.inStockCount
    if (cmp !== 0) return cmp
    return a.recipe.name.localeCompare(b.recipe.name)
  })
}

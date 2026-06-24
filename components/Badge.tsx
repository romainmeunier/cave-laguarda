import type { DealFlag } from '@/lib/types'

export function DealBadge({ flag }: { flag: DealFlag }) {
  if (flag === 'deal') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium bg-wine-700 text-cream-50">
        Affaire
      </span>
    )
  }
  if (flag === 'expensive') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium border border-ink-300 text-ink-500">
        Cher
      </span>
    )
  }
  return null
}

export function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    everyday: 'bg-cream-200 text-ink-700',
    'everyday+': 'bg-cream-300 text-ink-900',
    mid: 'bg-gold-400/30 text-wine-700',
    'mid-high': 'bg-gold-400/50 text-wine-700',
    high: 'bg-wine-100 text-wine-700',
    keeper: 'bg-wine-700 text-cream-50',
  }
  const labels: Record<string, string> = {
    everyday: 'Quotidien',
    'everyday+': 'Quotidien +',
    mid: 'Milieu',
    'mid-high': 'Milieu/Haut',
    high: 'Pointu',
    keeper: 'Garde',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium ${map[category] ?? 'bg-cream-100'}`}>
      {labels[category] ?? category}
    </span>
  )
}

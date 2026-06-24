'use client'

import type { StockStatus } from '@/lib/types'
import { useUserBar, effectiveStatus } from '@/lib/useUserBar'

const STATUS_CFG: Record<
  StockStatus,
  { label: string; short: string; cls: string }
> = {
  ok: {
    label: 'En stock',
    short: 'Stock',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-300/60',
  },
  low: {
    label: 'Bientôt fini',
    short: 'Bas',
    cls: 'bg-gold-400/20 text-gold-600 border-gold-400/60',
  },
  out: {
    label: 'Épuisé',
    short: 'Out',
    cls: 'bg-wine-100 text-wine-700 border-wine-700/40',
  },
}

const NEXT: Record<StockStatus, StockStatus> = {
  ok: 'low',
  low: 'out',
  out: 'ok',
}

export function StockStatusBadge({
  bottleId,
  defaultStatus,
  compact = false,
}: {
  bottleId: string
  defaultStatus: StockStatus
  compact?: boolean
}) {
  const { entry, update, hydrated, syncEnabled } = useUserBar()
  const e = entry(bottleId)
  // Pendant l'hydratation : afficher defaultStatus sans interactivité
  const current = hydrated ? effectiveStatus(defaultStatus, e) : defaultStatus
  const cfg = STATUS_CFG[current]
  const overridden = hydrated && e.status != null && e.status !== defaultStatus

  return (
    <button
      type="button"
      onClick={() => update(bottleId, { status: NEXT[current] })}
      title={`Statut : ${cfg.label}${syncEnabled ? ' (synchronisé)' : ' (local)'} — clic pour changer`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${cfg.cls} cursor-pointer transition hover:opacity-90`}
    >
      {compact ? cfg.short : cfg.label}
      {overridden && (
        <span className="w-1 h-1 rounded-full bg-current" aria-label="modifié" />
      )}
    </button>
  )
}

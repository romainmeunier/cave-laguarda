'use client'

import { useUserCellar } from '@/lib/useUserCellar'

export function UserStatusDot({ wineId }: { wineId: string }) {
  const { entry, hydrated } = useUserCellar()
  if (!hydrated) return null
  const e = entry(wineId)
  if (e.personalScore != null) {
    return (
      <span
        title={`Dégusté · ${e.personalScore}/20`}
        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-mono text-wine-700"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-wine-700" />
        {e.personalScore}/20
      </span>
    )
  }
  if (e.opened) {
    return <span title="Ouvert" className="w-2 h-2 rounded-full bg-gold-500" />
  }
  if (e.bought) {
    return <span title="En cave" className="w-2 h-2 rounded-full bg-wine-700/60" />
  }
  return null
}

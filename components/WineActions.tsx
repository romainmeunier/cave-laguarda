'use client'

import { useUserCellar } from '@/lib/useUserCellar'
import { useState, useEffect } from 'react'

export function WineActions({ wineId }: { wineId: string }) {
  const { entry, update, reset, hydrated } = useUserCellar()
  const e = entry(wineId)
  const [note, setNote] = useState('')
  const [score, setScore] = useState<string>('')

  useEffect(() => {
    setNote(e.personalNote ?? '')
    setScore(e.personalScore != null ? String(e.personalScore) : '')
  }, [e.personalNote, e.personalScore])

  if (!hydrated) {
    return <div className="text-xs text-ink-400 italic">Chargement…</div>
  }

  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
      <h3 className="font-display text-lg text-ink-900 mb-1">Mon suivi</h3>
      <p className="text-xs text-ink-500 uppercase tracking-widest mb-4">
        Local · jamais transmis
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <ToggleButton
          active={!!e.bought}
          onClick={() => update(wineId, { bought: !e.bought })}
          label="En cave"
        />
        <ToggleButton
          active={!!e.opened}
          onClick={() => update(wineId, { opened: !e.opened })}
          label="Ouverte"
        />
      </div>

      <label className="block mb-4">
        <span className="text-[11px] uppercase tracking-widest text-ink-500 block mb-1.5">
          Note perso /20
        </span>
        <input
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={score}
          onChange={(ev) => setScore(ev.target.value)}
          onBlur={() => {
            const n = score === '' ? null : Number(score)
            update(wineId, {
              personalScore: n,
              tastedDate: n != null ? (e.tastedDate ?? new Date().toISOString()) : null,
            })
          }}
          placeholder="—"
          className="w-24 px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-100 score-mono text-lg text-wine-700 focus:border-wine-700"
        />
      </label>

      <label className="block mb-4">
        <span className="text-[11px] uppercase tracking-widest text-ink-500 block mb-1.5">
          Notes de dégustation
        </span>
        <textarea
          value={note}
          onChange={(ev) => setNote(ev.target.value)}
          onBlur={() => update(wineId, { personalNote: note })}
          placeholder="Servi avec… robe… nez… bouche…"
          rows={4}
          className="w-full px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-100 text-sm text-ink-900 focus:border-wine-700 resize-y"
        />
      </label>

      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          {e.updatedAt
            ? `Maj ${new Date(e.updatedAt).toLocaleDateString('fr-FR')}`
            : 'Pas de suivi pour cette bouteille'}
        </span>
        {(e.bought || e.opened || e.personalScore != null || e.personalNote) && (
          <button
            onClick={() => {
              if (confirm('Effacer mon suivi pour ce vin ?')) reset(wineId)
            }}
            className="text-ink-500 hover:text-wine-700 underline underline-offset-2"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}

function ToggleButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`btn-ghost px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-medium border ${
        active
          ? 'bg-wine-700 text-cream-50 border-wine-700'
          : 'bg-cream-100 text-ink-700 border-ink-900/15 hover:border-wine-700/40'
      }`}
    >
      {active ? '✓ ' : ''}
      {label}
    </button>
  )
}

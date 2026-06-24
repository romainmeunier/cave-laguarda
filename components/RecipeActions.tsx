'use client'

import { useEffect, useState } from 'react'
import type { RecipeStatus } from '@/lib/types'
import { useUserRecipes, effectiveRecipeStatus } from '@/lib/useUserRecipes'

const STATUSES: RecipeStatus[] = ['À tester', 'En cours', 'Validé', 'Classique maison', 'Abandonné']

const STATUS_CLS: Record<RecipeStatus, { active: string; idle: string }> = {
  'À tester': {
    active: 'bg-gold-400/30 text-gold-600 border-gold-400',
    idle: 'text-ink-500 border-ink-900/15 hover:border-gold-400/60',
  },
  'En cours': {
    active: 'bg-blue-50 text-blue-700 border-blue-400',
    idle: 'text-ink-500 border-ink-900/15 hover:border-blue-400/60',
  },
  'Validé': {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-500',
    idle: 'text-ink-500 border-ink-900/15 hover:border-emerald-500/60',
  },
  'Classique maison': {
    active: 'bg-wine-100 text-wine-700 border-wine-700',
    idle: 'text-ink-500 border-ink-900/15 hover:border-wine-700/60',
  },
  'Abandonné': {
    active: 'bg-cream-200 text-ink-400 border-ink-300',
    idle: 'text-ink-500 border-ink-900/15 hover:border-ink-300',
  },
}

export function RecipeActions({
  recipeId,
  defaultStatus,
}: {
  recipeId: string
  defaultStatus: RecipeStatus
}) {
  const { entry, update, addVersion, removeVersion, hydrated, syncEnabled } =
    useUserRecipes()
  const e = entry(recipeId)
  const [draftVersion, setDraftVersion] = useState('')
  const [scoreInput, setScoreInput] = useState('')

  useEffect(() => {
    setScoreInput(e.personalScore != null ? String(e.personalScore) : '')
  }, [e.personalScore])

  if (!hydrated) {
    return (
      <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
        <p className="text-xs text-ink-400 italic">Chargement…</p>
      </div>
    )
  }

  const currentStatus = effectiveRecipeStatus(defaultStatus, e)
  const versions = e.versions ?? []
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-sm p-5">
      <h3 className="font-display text-lg text-ink-900 mb-1">Mon suivi</h3>
      <p className="text-xs text-ink-500 uppercase tracking-widest mb-5">
        {syncEnabled ? 'Synchronisé · multi-device' : 'Local · non synchronisé'}
      </p>

      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-widest text-ink-500 mb-2">Statut</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => {
            const active = currentStatus === s
            const cls = STATUS_CLS[s]
            return (
              <button
                key={s}
                type="button"
                onClick={() => update(recipeId, { status: s })}
                className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-medium border transition ${
                  active ? cls.active : `bg-transparent ${cls.idle}`
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
        {e.status && e.status !== defaultStatus && (
          <p className="text-[10px] text-gold-600 mt-2 uppercase tracking-widest">
            modifié (défaut : {defaultStatus})
          </p>
        )}
      </div>

      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-widest text-ink-500 mb-2">Note perso /20</p>
        <input
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={scoreInput}
          onChange={(ev) => setScoreInput(ev.target.value)}
          onBlur={() => {
            const n = scoreInput === '' ? null : Number(scoreInput)
            update(recipeId, { personalScore: n })
          }}
          placeholder="—"
          className="w-24 px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-100 score-mono text-lg text-wine-700 focus:border-wine-700"
        />
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-500 mb-2">
          Journal · {versions.length} version{versions.length > 1 ? 's' : ''}
        </p>
        {versions.length === 0 && (
          <p className="text-sm text-ink-400 italic mb-3">
            Aucune note de dégustation. Ajoute la prochaine fois que tu le fais.
          </p>
        )}
        <ul className="space-y-3 mb-3">
          {versions.map((v, i) => (
            <li
              key={i}
              className="border-l-2 border-wine-700/40 pl-3 pr-2 py-1 group flex items-start justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gold-600 font-mono mb-0.5">
                  {v.date}
                </div>
                <div className="text-sm text-ink-900">{v.text}</div>
              </div>
              <button
                type="button"
                onClick={() => removeVersion(recipeId, i)}
                className="opacity-0 group-hover:opacity-60 hover:opacity-100 text-xs text-ink-400 hover:text-wine-700 transition"
                title="Supprimer cette version"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-stretch gap-1.5">
          <input
            type="text"
            value={draftVersion}
            onChange={(ev) => setDraftVersion(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' && draftVersion.trim()) {
                addVersion(recipeId, { text: draftVersion.trim(), date: today })
                setDraftVersion('')
              }
            }}
            placeholder="Servi avec… ratio modifié… verdict perso…"
            className="flex-1 px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-100 text-sm focus:border-wine-700"
          />
          <button
            type="button"
            disabled={!draftVersion.trim()}
            onClick={() => {
              addVersion(recipeId, { text: draftVersion.trim(), date: today })
              setDraftVersion('')
            }}
            className="px-3 py-2 bg-wine-700 text-cream-50 rounded-sm text-xs uppercase tracking-widest hover:bg-wine-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

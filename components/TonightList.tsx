'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { BarItem, Recipe, RecipeSpirit } from '@/lib/types'
import { spiritLabels } from '@/lib/data'
import { computeFeasibility, sortFeasibility, type Feasibility } from '@/lib/feasibility'
import { useUserBar } from '@/lib/useUserBar'

type SpiritFilter = 'all' | RecipeSpirit
type ProfileFilter = string
type SortKey = 'feasibility' | 'name'

export function TonightList({
  recipes,
  barItems,
}: {
  recipes: Recipe[]
  barItems: BarItem[]
}) {
  const { bar, hydrated } = useUserBar()
  const [spiritFilter, setSpiritFilter] = useState<SpiritFilter>('all')
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>('all')
  const [sort, setSort] = useState<SortKey>('feasibility')
  const [hideOut, setHideOut] = useState(false)

  const feasibilities = useMemo(() => {
    const all = recipes.map((r) => computeFeasibility(r, barItems, bar))
    let filtered = all
    if (spiritFilter !== 'all') {
      filtered = filtered.filter((f) => f.recipe.spirit === spiritFilter)
    }
    if (profileFilter !== 'all') {
      filtered = filtered.filter((f) => f.recipe.profile.includes(profileFilter))
    }
    if (hideOut) {
      filtered = filtered.filter((f) => f.status !== 'missing')
    }
    return sort === 'feasibility'
      ? sortFeasibility(filtered)
      : [...filtered].sort((a, b) => a.recipe.name.localeCompare(b.recipe.name))
  }, [recipes, barItems, bar, spiritFilter, profileFilter, sort, hideOut])

  const stats = useMemo(() => {
    const all = recipes.map((r) => computeFeasibility(r, barItems, bar))
    return {
      ready: all.filter((f) => f.status === 'ready').length,
      low: all.filter((f) => f.status === 'low').length,
      oneMissing: all.filter((f) => f.status === 'one-missing').length,
      missing: all.filter((f) => f.status === 'missing').length,
    }
  }, [recipes, barItems, bar])

  const allProfiles = useMemo(() => {
    const set = new Set<string>()
    for (const r of recipes) for (const p of r.profile) set.add(p)
    return Array.from(set).sort()
  }, [recipes])

  const allSpirits = useMemo(() => {
    const set = new Set<RecipeSpirit>()
    for (const r of recipes) set.add(r.spirit)
    return Array.from(set)
  }, [recipes])

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="Prêts" value={hydrated ? String(stats.ready) : '—'} tone="ready" />
        <Stat label="Stock bas" value={hydrated ? String(stats.low) : '—'} tone="low" />
        <Stat label="Manque 1" value={hydrated ? String(stats.oneMissing) : '—'} tone="one-missing" />
        <Stat label="Pas faisables" value={hydrated ? String(stats.missing) : '—'} tone="missing" />
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-8">
        <Field label="Base">
          <select
            value={spiritFilter}
            onChange={(e) => setSpiritFilter(e.target.value as SpiritFilter)}
            className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 cursor-pointer min-w-[8rem]"
          >
            <option value="all">Toutes</option>
            {allSpirits.map((s) => (
              <option key={s} value={s}>{spiritLabels[s] ?? s}</option>
            ))}
          </select>
        </Field>
        <Field label="Profil">
          <select
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
            className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 cursor-pointer min-w-[8rem]"
          >
            <option value="all">Tous</option>
            {allProfiles.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Tri">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 cursor-pointer min-w-[10rem]"
          >
            <option value="feasibility">Par faisabilité</option>
            <option value="name">Par nom</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={hideOut}
            onChange={(e) => setHideOut(e.target.checked)}
            className="accent-wine-700"
          />
          <span className="text-xs uppercase tracking-widest text-ink-700">
            Cacher les pas faisables
          </span>
        </label>
        <div className="ml-auto text-xs text-ink-500 uppercase tracking-widest font-mono pb-2">
          {feasibilities.length}/{recipes.length}
        </div>
      </div>

      <div className="space-y-3">
        {feasibilities.map((f) => (
          <FeasibilityRow key={f.recipe.id} feasibility={f} />
        ))}
        {feasibilities.length === 0 && (
          <p className="text-ink-500 italic py-12 text-center">
            Aucun cocktail avec ces filtres.
          </p>
        )}
      </div>
    </div>
  )
}

function FeasibilityRow({ feasibility: f }: { feasibility: Feasibility }) {
  const STATUS_CFG = {
    ready: {
      label: 'Prêt',
      cls: 'border-emerald-500 bg-emerald-50/40 text-emerald-700',
      dotCls: 'bg-emerald-500',
    },
    low: {
      label: 'Stock bas',
      cls: 'border-gold-500 bg-gold-400/10 text-gold-600',
      dotCls: 'bg-gold-500',
    },
    'one-missing': {
      label: 'Manque 1',
      cls: 'border-wine-700/50 bg-wine-100/40 text-wine-700',
      dotCls: 'bg-wine-700/60',
    },
    missing: {
      label: 'Pas faisable',
      cls: 'border-ink-300 bg-cream-100/60 text-ink-400',
      dotCls: 'bg-ink-300',
    },
  }[f.status]

  return (
    <Link
      href={`/cocktails/${f.recipe.id}`}
      className={`group block border-l-4 ${STATUS_CFG.cls.split(' ')[0]} bg-cream-50 border border-ink-900/10 rounded-sm p-4 hover:shadow-[0_8px_28px_-12px_rgba(91,29,29,0.2)] transition`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <span className="font-mono text-[10px] uppercase text-ink-400 tabular-nums shrink-0">
            {f.recipe.id}
          </span>
          <h3 className="font-display text-lg text-ink-900 group-hover:text-wine-700 leading-tight truncate">
            {f.recipe.name}
          </h3>
          <span className="text-xs text-ink-500 italic truncate hidden sm:inline">
            — {spiritLabels[f.recipe.spirit] ?? f.recipe.spirit}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border ${STATUS_CFG.cls} shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG.dotCls}`} />
          {STATUS_CFG.label}
        </span>
      </div>

      <div className="text-xs text-ink-500 mt-1">
        <span className="font-mono">
          {f.inStockCount}/{f.totalLinkedCount} dispos
        </span>
        {f.externalIngredients.length > 0 && (
          <span className="ml-2 text-ink-400">
            + {f.externalIngredients.length} ext.
          </span>
        )}
      </div>

      {(f.missing.length > 0 || f.low.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {f.missing.map((m, i) => (
            <span
              key={`m-${i}`}
              className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border border-wine-700/40 text-wine-700 bg-wine-100/60"
              title={`Manquant : ${m.item}`}
            >
              ✕ {m.item.length > 30 ? m.item.slice(0, 28) + '…' : m.item}
            </span>
          ))}
          {f.low.map((l, i) => (
            <span
              key={`l-${i}`}
              className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium border border-gold-400/60 text-gold-600 bg-gold-400/10"
              title={`Bas : ${l.item}`}
            >
              ⚠ {l.item.length > 30 ? l.item.slice(0, 28) + '…' : l.item}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'ready' | 'low' | 'one-missing' | 'missing'
}) {
  const borderCls = {
    ready: 'border-emerald-500',
    low: 'border-gold-500',
    'one-missing': 'border-wine-700',
    missing: 'border-ink-300',
  }[tone]
  const valueCls = {
    ready: 'text-emerald-700',
    low: 'text-gold-600',
    'one-missing': 'text-wine-700',
    missing: 'text-ink-400',
  }[tone]
  return (
    <div className={`border-l-2 pl-4 py-1 ${borderCls}`}>
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</div>
      <div className={`font-display text-2xl sm:text-3xl leading-tight tabular-nums ${valueCls}`}>
        {value}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-ink-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  )
}

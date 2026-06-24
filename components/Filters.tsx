'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Wine } from '@/lib/types'
import { categoryLabels, categoryOrder, countryFlags, countryLabels, bestShopPrice } from '@/lib/data'
import { WineCard } from './WineCard'
import { WineRow } from './WineRow'

type SortKey = 'category' | 'price-asc' | 'price-desc' | 'score-desc'
type ViewMode = 'grid' | 'list'

const VIEW_STORAGE_KEY = 'cave-laguarda:view-mode/v1'

export function FilteredCellar({ wines }: { wines: Wine[] }) {
  const [country, setCountry] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')
  const [deal, setDeal] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('category')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('list')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_STORAGE_KEY) as ViewMode | null
      if (saved === 'grid' || saved === 'list') setView(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, view)
    } catch {}
  }, [view])

  const filtered = useMemo(() => {
    let list = wines.filter((w) => {
      if (country !== 'all' && w.country !== country) return false
      if (category !== 'all' && w.category !== category) return false
      if (deal === 'deal' && w.dealFlag !== 'deal') return false
      if (query.trim()) {
        const q = query.toLowerCase()
        const haystack = [
          w.name, w.producer, w.region, w.appellation ?? '',
          ...w.varietals,
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => bestShopPrice(a).price - bestShopPrice(b).price)
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => bestShopPrice(b).price - bestShopPrice(a).price)
    } else if (sort === 'score-desc') {
      list = [...list].sort((a, b) => {
        const sa = Math.max(...(a.criticScores.map((s) => s.score).concat([0])))
        const sb = Math.max(...(b.criticScores.map((s) => s.score).concat([0])))
        return sb - sa
      })
    } else {
      list = [...list].sort((a, b) => {
        const co = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99)
        if (co !== 0) return co
        return bestShopPrice(a).price - bestShopPrice(b).price
      })
    }
    return list
  }, [wines, country, category, deal, sort, query])

  const countries = useMemo(
    () => Array.from(new Set(wines.map((w) => w.country))),
    [wines]
  )

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-8">
        <FilterField label="Rechercher">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="cépage, producteur, région…"
            className="w-56 px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700"
          />
        </FilterField>
        <FilterField label="Pays">
          <Select value={country} onChange={setCountry}>
            <option value="all">Tous</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryFlags[c]} {countryLabels[c]}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Catégorie">
          <Select value={category} onChange={setCategory}>
            <option value="all">Toutes</option>
            {Object.entries(categoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Affaires">
          <Select value={deal} onChange={setDeal}>
            <option value="all">Tous</option>
            <option value="deal">Affaires uniquement</option>
          </Select>
        </FilterField>
        <FilterField label="Tri">
          <Select value={sort} onChange={(v) => setSort(v as SortKey)}>
            <option value="category">Par catégorie</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="score-desc">Note pro décroissante</option>
          </Select>
        </FilterField>
        <div className="ml-auto flex items-end gap-4 pb-2">
          <div className="text-xs text-ink-500 uppercase tracking-widest font-mono">
            {filtered.length}/{wines.length}
          </div>
          <div className="inline-flex border border-ink-900/15 rounded-sm overflow-hidden">
            <ViewButton active={view === 'list'} onClick={() => setView('list')} label="Liste">
              <ListIcon />
            </ViewButton>
            <ViewButton active={view === 'grid'} onClick={() => setView('grid')} label="Grille">
              <GridIcon />
            </ViewButton>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-500 italic py-12 text-center">
          Aucun vin ne correspond à ces filtres.
        </p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w) => (
            <WineCard key={w.id} wine={w} />
          ))}
        </div>
      ) : (
        <div>
          <div className="hidden sm:grid grid-cols-[2.5rem_1.25rem_minmax(0,1fr)_minmax(0,11rem)_5.25rem_auto] items-center gap-x-4 px-3 -mx-3 pb-2 border-b border-ink-900/20 text-[10px] uppercase tracking-widest text-ink-400 font-mono">
            <span>ID</span>
            <span aria-hidden></span>
            <span>Cuvée · producteur · région</span>
            <span>Notes critiques</span>
            <span>Catégorie</span>
            <span className="text-right min-w-[5rem]">Prix</span>
          </div>
          <div>
            {filtered.map((w) => (
              <WineRow key={w.id} wine={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`btn-ghost px-2.5 py-2 ${
        active ? 'bg-wine-700 text-cream-50' : 'bg-cream-50 text-ink-500 hover:text-wine-700'
      }`}
    >
      {children}
    </button>
  )
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="2.5" width="12" height="1.5" fill="currentColor" />
      <rect x="1" y="6.25" width="12" height="1.5" fill="currentColor" />
      <rect x="1" y="10" width="12" height="1.5" fill="currentColor" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="1" width="5" height="5" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" fill="currentColor" />
    </svg>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-ink-500 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 cursor-pointer min-w-[10rem]"
    >
      {children}
    </select>
  )
}

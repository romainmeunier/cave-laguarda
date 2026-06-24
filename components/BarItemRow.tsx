'use client'

import { useEffect, useState } from 'react'
import type { BarItem } from '@/lib/types'
import { useUserBar } from '@/lib/useUserBar'
import { StockStatusBadge } from './StockStatusBadge'

export function BarItemRow({ item }: { item: BarItem }) {
  const { entry, update, hydrated } = useUserBar()
  const e = entry(item.id)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setDraft(e.personalNote ?? '')
  }, [e.personalNote])

  const personalNote = hydrated ? e.personalNote : undefined
  const displayedNote = personalNote ?? item.notes

  return (
    <li className="grid grid-cols-[2.75rem_1fr_auto] sm:grid-cols-[2.75rem_minmax(0,2fr)_minmax(0,3fr)_auto] items-start gap-x-4 py-3">
      <span className="font-mono text-[10px] uppercase text-ink-400 tabular-nums pt-1">
        {item.id}
      </span>

      <div className="min-w-0">
        <h3 className="font-display text-base text-ink-900 leading-tight truncate">
          {item.name}
        </h3>
        {item.brand && (
          <p className="text-xs text-ink-500 italic truncate">
            {item.brand}
            {item.origin && <span className="not-italic text-ink-400"> · {item.origin}</span>}
            {item.volume && <span className="not-italic text-ink-400 font-mono"> · {item.volume}</span>}
            {item.abv && <span className="not-italic text-ink-400 font-mono"> · {item.abv}%</span>}
          </p>
        )}
      </div>

      <div className="hidden sm:block text-sm text-ink-700 italic min-w-0">
        {editing ? (
          <NoteEditor
            draft={draft}
            setDraft={setDraft}
            onSave={() => {
              update(item.id, { personalNote: draft.trim() || undefined })
              setEditing(false)
            }}
            onCancel={() => {
              setDraft(personalNote ?? '')
              setEditing(false)
            }}
          />
        ) : (
          <div
            className="cursor-text hover:bg-cream-100/60 px-1.5 -mx-1.5 py-0.5 rounded-sm"
            onClick={() => setEditing(true)}
            title="Cliquer pour éditer la note"
          >
            {displayedNote ?? <span className="text-ink-400 not-italic">— ajouter une note</span>}
            {personalNote && (
              <span className="ml-2 text-[9px] uppercase tracking-widest text-gold-600 not-italic">
                modif
              </span>
            )}
          </div>
        )}
      </div>

      <div className="justify-self-end">
        <StockStatusBadge bottleId={item.id} defaultStatus={item.defaultStatus} />
      </div>

      <div className="sm:hidden col-span-3 mt-1">
        {editing ? (
          <NoteEditor
            draft={draft}
            setDraft={setDraft}
            onSave={() => {
              update(item.id, { personalNote: draft.trim() || undefined })
              setEditing(false)
            }}
            onCancel={() => {
              setDraft(personalNote ?? '')
              setEditing(false)
            }}
          />
        ) : (
          <p
            className="text-xs text-ink-500 italic cursor-text hover:text-ink-700"
            onClick={() => setEditing(true)}
          >
            {displayedNote ?? '— ajouter une note'}
            {personalNote && (
              <span className="ml-2 text-[9px] uppercase tracking-widest text-gold-600 not-italic">
                modif
              </span>
            )}
          </p>
        )}
      </div>
    </li>
  )
}

function NoteEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: string
  setDraft: (v: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={draft}
        onChange={(ev) => setDraft(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') onSave()
          if (ev.key === 'Escape') onCancel()
        }}
        autoFocus
        className="flex-1 px-2 py-1 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 not-italic"
      />
      <button
        onClick={onSave}
        className="px-2 py-1 bg-wine-700 text-cream-50 rounded-sm text-xs uppercase tracking-widest hover:bg-wine-600"
      >
        OK
      </button>
      <button
        onClick={onCancel}
        className="px-2 py-1 border border-ink-900/15 rounded-sm text-xs text-ink-500 hover:border-wine-700 not-italic"
      >
        ✕
      </button>
    </div>
  )
}
